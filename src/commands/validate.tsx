import { Text } from 'ink';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { loadConfig, ConfigError } from '../lib/config.js';
import { DatadogClient, ApiError } from '../lib/client.js';

export const options = z.object({});

export const description = 'Validate API credentials';

type Status = 'loading' | 'valid' | 'invalid' | 'error';

export default function Validate() {
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validate() {
      try {
        const config = await loadConfig();
        const client = new DatadogClient(config);
        const valid = await client.validate();
        setStatus(valid ? 'valid' : 'invalid');
      } catch (err) {
        setStatus('error');
        if (err instanceof ConfigError) {
          setError(err.message);
        } else if (err instanceof ApiError) {
          setError(`API error: ${err.message}`);
        } else {
          setError(String(err));
        }
      }
    }

    validate();
  }, []);

  if (status === 'loading') {
    return <Text color="yellow">Validating credentials...</Text>;
  }

  if (status === 'error') {
    return <Text color="red">Error: {error}</Text>;
  }

  if (status === 'invalid') {
    return <Text color="red">Invalid credentials</Text>;
  }

  return <Text color="green">Credentials valid!</Text>;
}
