import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { parse } from 'dotenv';
import {
  Config,
  ConfigSchema,
  PartialConfig,
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
 * Load config from ~/.dogrc file (dotenv format)
 */
async function loadConfigFile(): Promise<PartialConfig> {
  if (!existsSync(CONFIG_PATH)) {
    return {};
  }

  try {
    const content = await readFile(CONFIG_PATH, 'utf-8');
    const parsed = parse(content);

    const config: PartialConfig = {};

    if (parsed.DD_API_KEY) {
      config.api_key = parsed.DD_API_KEY;
    }
    if (parsed.DD_APP_KEY) {
      config.app_key = parsed.DD_APP_KEY;
    }
    if (parsed.DD_SITE && DATADOG_SITES.includes(parsed.DD_SITE as DatadogSite)) {
      config.site = parsed.DD_SITE as DatadogSite;
    }

    return config;
  } catch {
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

  const merged = { ...fileConfig, ...envConfig };
  const result = ConfigSchema.safeParse(merged);

  if (!result.success) {
    const missing: string[] = [];
    if (!merged.api_key) missing.push('DD_API_KEY');
    if (!merged.app_key) missing.push('DD_APP_KEY');

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
 * Save config to ~/.dogrc file (dotenv format)
 */
export async function saveConfig(config: PartialConfig): Promise<void> {
  const existing = await loadConfigFile();
  const merged = { ...existing, ...config };

  const dir = dirname(CONFIG_PATH);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Convert to dotenv format
  const lines: string[] = [];
  if (merged.api_key) lines.push(`DD_API_KEY=${merged.api_key}`);
  if (merged.app_key) lines.push(`DD_APP_KEY=${merged.app_key}`);
  if (merged.site) lines.push(`DD_SITE=${merged.site}`);

  await writeFile(CONFIG_PATH, lines.join('\n') + '\n', { mode: 0o600 });
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
