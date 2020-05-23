# http_errors

[![tag](https://img.shields.io/github/tag/ako-deno/http_errors.svg)](https://github.com/ako-deno/http_errors/tags)
![http_errors-ci](https://github.com/ako-deno/http_errors/workflows/http_errors-ci/badge.svg)

Create HTTP Error for Deno, inspired by [http_errors](https://github.com/jshttp/http_errors).

## API

```js
import { createError, HttpError, Props } from "https://raw.githubusercontent.com/ako-deno/http_errors/master/mod.ts";
```

### createError(status: number, message?: string, props?: Props): HttpError
### createError(status: number, props: Props): HttpError;
              
Create a new error object with the given status code, message and custom properties.
The error object inherits from `HttpError`.

```js
const err = createError(404, 'Not found LoL!')
```

- `name: NotFoundError` - Error name. 
- `status: 404` - the status code as a number.
- `message` - the message of the error, default to [Deno's status code text](https://deno.land/std/http/http_status.ts).
- `expose: true` - can be used to signal if message should be sent to the client, when `status >= 400 && status < 500` it is true, otherwise false. Can be overwritten by Props.
- `properties` - custom properties to attach to the error object.

name: string;
  message: string;
  status: number;
  expose: boolean

### HttpError

```js
createError(500) instanceof HttpError // true
createError(500) instanceof Error // true
```

## Examples

### Simple Http Error handle

This simple example shows how to use `http_errors` to return a different
respond body based on different HTTP Error.

```js
import {
  serve,
  Response,
} from "https://deno.land/std/http/server.ts";
import { createError, HttpError } from "https://raw.githubusercontent.com/ako-deno/http_errors/master/mod.ts";

const server = serve("127.0.0.1:3000");
console.log("Server listening on: 3000");

for await (const req of server) {
  const res: Response = {
    body: "Hello!",
    headers: new Headers(),
  };
  try {
    if (req.url === "/4xx") {
      throw createError(403);
    } else if (req.url === "/5xx") {
      throw Error("DB error!");
    }
  } catch (e) {
    if (e instanceof HttpError) {
      res.body = JSON.stringify(e.toJSON());
      res.status = e.status;
      console.warn(e);
    } else {
      const err = new HttpError(500);
      res.body = JSON.stringify(err.toJSON());
      res.status = err.status;
      console.error(e);
    }
    res.headers?.set("Content-Type", "applicatoin/json");
  } finally {
    req.respond(res).catch(() => {});
  }
}

```

You can test this out with the cURL program:

```sh
curl -I -H'Accept: text/html' http://localhost:3000/4xx
```

```sh
curl -I -H'Accept: text/html' http://localhost:3000/5xx
```

# License

[MIT](./LICENSE)
