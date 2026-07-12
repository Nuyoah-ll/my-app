export function safeParseJson<T>(str: string): T | undefined {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    return undefined;
  }
}