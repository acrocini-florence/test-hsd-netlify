export function anyOf<T extends object>(payload: T, fields: (keyof T)[]) {
  return fields.reduce((acc, field) => acc || !!payload[field], false);
}
