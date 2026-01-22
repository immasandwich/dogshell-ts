import { Text } from 'ink';

export default function Index() {
  return (
    <Text>
      Welcome to dog - a modern CLI for the Datadog API.
      {'\n'}
      Run <Text color="cyan">dog --help</Text> for available commands.
    </Text>
  );
}
