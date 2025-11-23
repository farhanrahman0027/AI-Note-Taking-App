// lib/env.ts
export function validateEnv() {
  const required = ["MONGODB_URI", "NEXTAUTH_SECRET"]
  const missing: string[] = []

  for (const v of required) {
    if (!process.env[v]) missing.push(v)
  }

  if (missing.length > 0) {
    // Log a clear actionable warning (do not throw so dev can still run locally if they're aware)
    console.warn(
      `[env] Missing environment variables: ${missing.join(", ")}. ` +
        `Set them in Vercel dashboard (or .env.local for local dev). NEXTAUTH_URL should also be set in production.`
    )
  }

  return { missing }
}
