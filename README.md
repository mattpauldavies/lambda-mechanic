![Lambda Mechanic](https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/mechanic_1f9d1-200d-1f527.png)

# Lambda Mechanic

Tiny NodeJS server that mocks AWS Lambda requests for local development.

## Usage

Install the library and dependencies

```
% npm install -d lambda-mechanic node-dev
```

If you're using Typescript you can opt for `ts-node-dev`

```
% npm install -d lambda-mechanic ts-node-dev
```

Create a simple script called `server.js` with the following content:

```
const { Mechanic } = require('lambda-mechanic');

// adjust to import your Lambda handler function
import { handler } from './src';

const mechanic = new Mechanic(
  [
    ['/', handler],
    ['/test', async () => ({ statusCode: 200, body: 'Test' })],
  ],
  { port: 3001 },
);

mechanic.listen();
```

Or for Typescript, create a script called `server.ts` with the following content:

```
import { Mechanic } from 'lambda-mechanic';

// adjust to import your Lambda handler function
import { handler } from './src';

const mechanic = new Mechanic(
  [
    ['/', handler],
    ['/test', async () => ({ statusCode: 200, body: 'Test' })],
  ],
  { port: 3001 },
);

mechanic.listen();
```

In a new terminal window run:

```
% npx node-dev server.js
```

Or for Typescript:

```
% npx ts-node-dev server.ts
```

You can now experiment with your Lambda handler by sending requests to [https://localhost:3000](https://localhost:3000).

## API

**Mechanic** `constructor`

The Mechanic constructor expects two paramters on instantiation, an array of handler "tuples" and an options object:

```
new Mechanic(
  handler: HandlerTuple[],
  options: MechanicOptions,
)
```

**HandlerTuple** `array`

The handler "tuple" describes a route and handler function pairing.

Technically it is a Javascript array with a route string (or regular expression) at the first index and a handler function at the second index.

String example:

```
const handler = async () => ({ statusCode: 200, body: 'Hello World!' });

const route = ['/path', handler];
```

RegEx example:

```
const handler = async () => ({ statusCode: 200, body: 'Handles everything...' });

const route = [/.*/, handler];
```

**Handler** `function`

The handler function expects an event that conforms to the Lambda `APIGatewayProxyEvent` interface and returns a promise that resolves an object that confirms to the `APIGatewayProxyResult` interface.

If you're using Typescript the types can be imported from the `aws-lambda` package.

```
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => ({
  statusCode: 200,
  body: 'Hello World!',
});
```

**MechanicOptions** `object`

There are currently only two options `port` and `headers`. The defaults are:

```
const defaultOptions = {
  port: 3000,
  headers: {},
};
```

The options interface is:

```
interface MechanicOptions {
  port?: number;
  headers?: {
    [key: string]: string;
  };
}
```

## Bugs & Issues

If you spot bugs please [open an issue](https://github.com/mattpauldavies/lambda-mechanic/issues/new).
