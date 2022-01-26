import { Mechanic } from 'lambda-mechanic';

const mechanic = new Mechanic(
  [
    ['/', async () => ({ statusCode: 200, body: 'Example' })],
    ['/test', async () => ({ statusCode: 200, body: 'Test' })],
  ],
  { port: 3000 },
);

mechanic.listen();
