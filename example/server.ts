import {
  serve,
  Response,
} from "https://deno.land/std/http/server.ts";
import { createError, HttpError } from "../mod.ts";

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
    if (e instanceof HttpError && e.expose) {
      res.body = JSON.stringify(e.toJSON());
      res.status = e.status;
      console.warn(e);
    } else {
      const err = createError(500);
      res.body = JSON.stringify(err.toJSON());
      res.status = err.status;
      console.error(e);
    }
    res.headers?.set("Content-Type", "applicatoin/json");
  } finally {
    req.respond(res).catch(() => {});
  }
}
