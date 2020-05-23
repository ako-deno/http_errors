/*!
 * Copyright (c) 2020 Henry Zhuang
 * MIT Licensed
 */

import { Status, STATUS_TEXT } from "./deps.ts";

export class HttpError extends Error {
  name: string;
  message: string;
  status: number;
  expose: boolean = false;
  [key: string]: any
  constructor(code: number, message?: string) {
    super(message);
    if (!Status[code]) {
      throw TypeError(`Unknown HTTP Status Code \`${code}\``);
    }
    if (code < 400 || code >= 600) {
      throw TypeError(
        `Only 4xx or 5xx status codes allowed, but got \`${code}\``,
      );
    }
    if (code >= 400 && code < 500) {
      this.expose = true;
    }

    let className = Status[code];
    if (!className.endsWith("Error")) {
      className += "Error";
    }
    const msg = message != null ? message : STATUS_TEXT.get(code)!;
    this.message = msg;
    this.status = code;
    this.name = className;
    (Error as any).captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toString() {
    return `${this.name} [${this.status}]: ${this.message}`;
  }
  toJSON() {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
    };
  }
}

export interface Props {
  [key: string]: any;
}

/**
 * Create a new HttpError.
 *
 * @returns {HttpError}
 * @public
 */

export function createError(
  status: number,
  message?: string,
  props?: Props,
): HttpError;
export function createError(status: number, props: Props): HttpError;
export function createError(
  status: number,
  message?: any,
  props?: Props,
): HttpError {
  let err;
  if (typeof message === "string") {
    err = new HttpError(status, message);
  } else {
    props = message;
    err = new HttpError(status);
  }

  if (props) {
    for (let key in props) {
      if (key !== "status") {
        err[key] = props[key];
      }
    }
  }
  (Error as any).captureStackTrace(err, createError);
  return err;
}
