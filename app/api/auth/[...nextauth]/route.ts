import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { validateEnv } from "@/lib/env"

// Validate env early to provide clearer warnings in server logs (Vercel)
validateEnv()

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
