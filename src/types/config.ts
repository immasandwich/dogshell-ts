import { z } from 'zod';

/**
 * Valid Datadog site domains
 */
export const DATADOG_SITES = [
  'datadoghq.com',
  'us3.datadoghq.com',
  'us5.datadoghq.com',
  'datadoghq.eu',
  'ap1.datadoghq.com',
  'ddog-gov.com',
] as const;

export type DatadogSite = (typeof DATADOG_SITES)[number];

/**
 * Schema for the ~/.dogrc config file
 */
export const ConfigSchema = z.object({
  api_key: z.string().min(1, 'API key is required'),
  app_key: z.string().min(1, 'App key is required'),
  site: z.enum(DATADOG_SITES).default('datadoghq.com'),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Partial config for loading (before env var overrides)
 */
export const PartialConfigSchema = ConfigSchema.partial();

export type PartialConfig = z.infer<typeof PartialConfigSchema>;
