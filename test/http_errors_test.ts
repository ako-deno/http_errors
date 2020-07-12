import {
  assert,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.60.0/testing/asserts.ts";
import { Status, STATUS_TEXT } from "../deps.ts";
import { createError, HttpError } from "../mod.ts";

const { test } = Deno;

function randomStr(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

const STATUS_TEXT_KEYS = Object.keys(Status).filter((k) =>
  typeof Status[k as any] === "number"
);
const STATUS_CODES = STATUS_TEXT_KEYS.map((k) => Status[k as any]);
const ClientServerErrorCodes = STATUS_CODES.filter((code) => {
  const _code = Number(code);
  return _code >= 400 && _code < 600;
});

function isError(err: any): boolean {
  return Object.prototype.toString.call(err) === "[object Error]" ||
    err instanceof Error;
}

for (const code of ClientServerErrorCodes) {
  let _code = Number(code);
  const err = createError(_code);
  const message = STATUS_TEXT.get(_code);
  let name = Status[_code];
  if (!name.endsWith("Error")) {
    name += "Error";
  }

  test(`createError(${_code}) should create error object`, function () {
    assert(isError(err));
  });

  test(`createError(${_code}) should have "message" property of "${message}"`, function () {
    assertStrictEquals(err.message, message);
  });

  test(`createError(${_code}) should have "name" property of "${name}"`, function () {
    assertStrictEquals(err.name, name);
  });

  test(`createError(${_code}) should have "statusCode" property of ${_code}`, function () {
    assertStrictEquals(err.status, _code);
  });

  test(`createError(${_code}) should have "expose" property set properly`, function () {
    if (_code >= 400 && _code < 500) {
      assert(err.expose);
    } else {
      assert(!err.expose);
    }
  });
}

test(`createError(status) when status unknown`, function () {
  assertThrows(
    () => {
      createError(3000);
    },
    TypeError,
    "Unknown HTTP Status Code `3000`",
  );
});

test(`createError(status) when out of HTTP Error`, function () {
  const code = 200;
  assertThrows(
    () => {
      createError(code);
    },
    TypeError,
    `Only 4xx or 5xx status codes allowed, but got \`${code}\``,
  );
});

for (const code of ClientServerErrorCodes) {
  let _code = Number(code);
  const message = randomStr();
  const err = createError(_code, message);
  let name = Status[_code];
  if (!name.endsWith("Error")) {
    name += "Error";
  }

  test(`createError(${_code}, "${message}") should create error object`, function () {
    assert(isError(err));
  });

  test(`createError(${_code}, "${message}") should have "message" property of "${message}"`, function () {
    assertStrictEquals(err.message, message);
  });

  test(`createError(${_code}, "${message}") should have "name" property of "${name}"`, function () {
    assertStrictEquals(err.name, name);
  });

  test(`createError(${_code}, "${message}") should have "statusCode" property of ${_code}`, function () {
    assertStrictEquals(err.status, _code);
  });

  test(`createError(${_code}, "${message}") should have "expose" property set properly`, function () {
    if (_code >= 400 && _code < 500) {
      assert(err.expose);
    } else {
      assert(!err.expose);
    }
  });
}

for (const code of ClientServerErrorCodes) {
  let _code = Number(code);
  const message = randomStr();
  const props = {
    year: 2020,
    state: "quarantine at home",
  };
  const propsStr = JSON.stringify(props);
  const err = createError(_code, message, props);
  let name = Status[_code];
  if (!name.endsWith("Error")) {
    name += "Error";
  }

  test(`createError(${_code}, "${message}", ${propsStr}) should create error object`, function () {
    assert(isError(err));
  });

  test(`createError(${_code}, "${message}", ${propsStr}) should have "message" property of "${message}"`, function () {
    assertStrictEquals(err.message, message);
  });

  test(`createError(${_code}, "${message}", ${propsStr}) should have "name" property of "${name}"`, function () {
    assertStrictEquals(err.name, name);
  });

  test(`createError(${_code}, "${message}", ${propsStr}) should have "statusCode" property of ${_code}`, function () {
    assertStrictEquals(err.status, _code);
  });

  test(`createError(${_code}, "${message}", ${propsStr}) should have "props" property of ${propsStr}`, function () {
    assertStrictEquals(err.year, props.year);
    assertStrictEquals(err.state, props.state);
  });

  test(`createError(${_code}, "${message}", ${propsStr}) should have "expose" property set properly`, function () {
    if (_code >= 400 && _code < 500) {
      assert(err.expose);
    } else {
      assert(!err.expose);
    }
  });
}

for (const code of ClientServerErrorCodes) {
  let _code = Number(code);
  const props = {
    year: 2020,
    state: "quarantine at home",
  };
  const message = STATUS_TEXT.get(_code);
  const propsStr = JSON.stringify(props);
  const err = createError(_code, props);
  let name = Status[_code];
  if (!name.endsWith("Error")) {
    name += "Error";
  }

  test(`createError(${_code}, ${propsStr}) should create error object`, function () {
    assert(isError(err));
  });

  test(`createError(${_code}, ${propsStr}) should have "message" property of "${message}"`, function () {
    assertStrictEquals(err.message, message);
  });

  test(`createError(${_code}, ${propsStr}) should have "name" property of "${name}"`, function () {
    assertStrictEquals(err.name, name);
  });

  test(`createError(${_code}, ${propsStr}) should have "statusCode" property of ${_code}`, function () {
    assertStrictEquals(err.status, _code);
  });

  test(`createError(${_code}, ${propsStr}) should have "props" property of ${propsStr}`, function () {
    assertStrictEquals(err.year, props.year);
    assertStrictEquals(err.state, props.state);
  });

  test(`createError(${_code}, ${propsStr}) should have "expose" property set properly`, function () {
    if (_code >= 400 && _code < 500) {
      assert(err.expose);
    } else {
      assert(!err.expose);
    }
  });
}

test("instanceof HttpError", () => {
  assert(createError(500) instanceof HttpError);
});

test("instanceof Error", () => {
  assert(createError(500) instanceof Error);
});
