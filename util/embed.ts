export function safeStringArray<T>(array: T[]): T[] | string[] {
  if (array.length === 0) {
    return ["**-- None --**"];
  }

  return array;
}
