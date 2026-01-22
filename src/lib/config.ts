import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { parse, stringify } from 'yaml';
import {
  Config,
  ConfigSchema,
  PartialConfig,
  PartialConfigSchema,
  DatadogSite,
  DATADOG_SITES,
} from '../types/config.js';

const CONFIG_PATH = join(homedir(), '.dogrc');

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * Load config from ~/.dogrc file
 */
async function loadConfigFile(): Promise<PartialConfig> {
  if (!existsSync(CONFIG_PATH)) {
    return {};
  }

  try {
    const content = await readFile(CONFIG_PATH, 'utf-8');
    const parsed = parse(content);
    return PartialConfigSchema.parse(parsed ?? {});
  } catch (error) {
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return {};
    }
    // If the file is in an old/incompatible format, return empty config
    // and let env vars take over
    return {};
  }
}

/**
 * Get config values from environment variables
 */
function getEnvConfig(): PartialConfig {
  const config: PartialConfig = {};

  if (process.env.DD_API_KEY) {
    config.api_key = process.env.DD_API_KEY;
  }

  if (process.env.DD_APP_KEY) {
    config.app_key = process.env.DD_APP_KEY;
  }

  if (process.env.DD_SITE) {
    const site = process.env.DD_SITE as DatadogSite;
    if (DATADOG_SITES.includes(site)) {
      config.site = site;
    } else {
      throw new ConfigError(
        `Invalid DD_SITE: ${process.env.DD_SITE}. Valid values: ${DATADOG_SITES.join(', ')}`
      );
    }
  }

  return config;
}

/**
 * Load and validate config from file + env vars
 * Env vars take precedence over file config
 */
export async function loadConfig(): Promise<Config> {
  const fileConfig = await loadConfigFile();
  const envConfig = getEnvConfig();

  // Merge configs: env vars override file config
  const merged = {
    ...fileConfig,
    ...envConfig,
  };

  // Validate the merged config
  const result = ConfigSchema.safeParse(merged);

  if (!result.success) {
    const missing: string[] = [];
    if (!merged.api_key) missing.push('api_key (or DD_API_KEY)');
    if (!merged.app_key) missing.push('app_key (or DD_APP_KEY)');

    if (missing.length > 0) {
      throw new ConfigError(
        `Missing required config: ${missing.join(', ')}.\n` +
          `Set them in ~/.dogrc or as environment variables.`
      );
    }

    throw new ConfigError(`Invalid config: ${result.error.message}`);
  }

  return result.data;
}

/**
 * Save config to ~/.dogrc file
 */
export async function saveConfig(config: PartialConfig): Promise<void> {
  // Load existing config and merge
  const existing = await loadConfigFile();
  const merged = { ...existing, ...config };

  // Ensure directory exists
  const dir = dirname(CONFIG_PATH);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Write as YAML
  const content = stringify(merged);
  await writeFile(CONFIG_PATH, content, { mode: 0o600 }); // Read/write for owner only
}

/**
 * Get the config file path
 */
export function getConfigPath(): string {
  return CONFIG_PATH;
}

/**
 * Check if config file exists
 */
export function configExists(): boolean {
  return existsSync(CONFIG_PATH);
}
