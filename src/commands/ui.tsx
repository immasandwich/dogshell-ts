import { Box, Text, useApp, useInput } from 'ink';
import { useState } from 'react';
import { z } from 'zod';

const MENU_ITEMS = [
  { key: 'metrics', label: 'Metrics', description: 'Submit and query metrics' },
  { key: 'monitors', label: 'Monitors', description: 'Manage monitors' },
  { key: 'dashboards', label: 'Dashboards', description: 'View and export dashboards' },
  { key: 'hosts', label: 'Hosts', description: 'List and manage hosts' },
  { key: 'logs', label: 'Logs', description: 'Search and submit logs' },
] as const;

export default function UI() {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      exit();
    }

    if (key.upArrow) {
      setSelectedIndex((i) => (i > 0 ? i - 1 : MENU_ITEMS.length - 1));
    }

    if (key.downArrow) {
      setSelectedIndex((i) => (i < MENU_ITEMS.length - 1 ? i + 1 : 0));
    }

    if (key.return) {
      // TODO: Navigate to selected section
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {' '}dog - Datadog CLI{' '}
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        {MENU_ITEMS.map((item, index) => (
          <Box key={item.key}>
            <Text color={index === selectedIndex ? 'cyan' : 'white'}>
              {index === selectedIndex ? '❯ ' : '  '}
              {item.label}
            </Text>
            <Text color="gray"> - {item.description}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text color="gray">
          ↑/↓ Navigate • Enter Select • q Quit
        </Text>
      </Box>
    </Box>
  );
}

export const options = z.object({});

export const description = 'Launch interactive TUI mode';
