/**
 * Fetches a required environment variable.
 * @param key Environment key
 * @returns Environment-key's value
 */
export default function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
