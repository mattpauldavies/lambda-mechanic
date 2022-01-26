import http, { IncomingMessage, ServerResponse } from 'http';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

type Hander = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

type HandlerTuple = [string, Hander];

type Headers = { [key: string]: string };

interface MechanicOptions {
  port?: number;
  headers?: Headers;
}

const defaultOptions = {
  port: 3000,
  headers: {},
};

export class Mechanic {
  handlers: HandlerTuple[];
  options: MechanicOptions;

  constructor(handlers: HandlerTuple[], options: MechanicOptions = {}) {
    this.handlers = handlers;
    this.options = Object.assign({}, defaultOptions, options);
  }

  readBody = async (req: IncomingMessage): Promise<string> => {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const body = Buffer.concat(buffers).toString();
    return body;
  }

  readHeaders = (req: IncomingMessage): Headers => {
    const originalHeaders: Headers = {};
    for (const key in req.headers) {
      const header = req.headers[key];
      if (Array.isArray(header)) {
        originalHeaders[key] = header.join('');
        continue;
      }
      if (typeof header === 'string') {
        originalHeaders[key] = header;
        continue;
      }
    }
    const headers: Headers = {
      ...originalHeaders,
      ...this.options.headers,
    };
    return headers;
  }

  requestListener = async (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> => {
    const body = await this.readBody(req);
    const headers = this.readHeaders(req)
    const httpMethod: string = req.method || 'GET';

    // mock event compatible with a real AWS Lambda event
    const mockEvent = {
      body,
      headers,
      httpMethod,
      multiValueHeaders: {},
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {
        httpMethod,
        accountId: '',
        apiId: '',
        authorizer: {},
        protocol: 'http',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null,
        },
        path: '',
        stage: '',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: '',
      },
      resource: '',
    };
  
    const url = req.url;
    for(const [path, handler] of this.handlers) {
      if (url === path) {
        const { statusCode, body } = await handler(mockEvent);
        res.writeHead(statusCode);
        res.end(body);
        return;
      }
    }

    res.writeHead(404);
    res.end('No handler registerd to this path');
  }

  listen = (): void => {
    const server = http.createServer(this.requestListener);
    const port = this.options.port || 3000;
    server.listen(port);
    console.log(`Listening on http://localhost:${port}`);
  }
}
