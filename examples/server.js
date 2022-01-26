const { Mechanic } = require('lambda-mechanic');

const mechanic = new Mechanic(
  [
    ['/', async () => ({ statusCode: 200, body: 'Example' })],
    ['/test', async () => ({ statusCode: 200, body: 'Test' })],
  ],
  { port: 3001 },
);

mechanic.listen();
