import * as Crypto from "expo-crypto";

// Generates a RFC 4122 UUID v4.
// Used as the primary key for Session records — must be a real UUID
// because the Supabase sessions table column is typed `uuid`.
//
// expo-crypto is used instead of a manual Math.random() implementation
// because it uses the platform's cryptographically secure RNG.
export function generateId(): string {
  return Crypto.randomUUID();
}
