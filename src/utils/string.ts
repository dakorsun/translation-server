export function base64toJson(base64: string): Record<string, any> {
  const decodedString = Buffer.from(base64, 'base64').toString();
  return JSON.parse(decodedString);
}
