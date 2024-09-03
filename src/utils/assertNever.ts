export function assertNever(value: never, noThrow?: boolean): never {
  if (noThrow) {
    return value;
  }

  throw new Error(`unhandled discriminated union member: ${JSON.stringify(value)}`);
}
