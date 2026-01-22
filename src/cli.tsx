import Pastel from 'pastel';

const app = new Pastel({
  importMeta: import.meta,
  name: 'dog',
  version: '0.1.0',
  description: 'Modern TypeScript CLI for the Datadog API',
});

await app.run();
