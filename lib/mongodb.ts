// lib/mongodb.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
// Allow an escape hatch for development debugging of TLS issues. DO NOT enable in production.
const tlsAllowInvalid = process.env.MONGODB_TLS_ALLOW_INVALID === "true"
const options: any = {}
if (tlsAllowInvalid) {
  options.tls = true
  options.tlsAllowInvalidCertificates = true
  options.tlsAllowInvalidHostnames = true
}

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local")
}

let client
let clientPromise: Promise<MongoClient>

declare global {
  // Allow global caching for hot reloads in Next.js
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// ✅ Named export for your authOptions import
export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB
    const db = dbName ? client.db(dbName) : client.db() // use configured DB name or fallback to default in URI
    return { client, db }
  } catch (err) {
    // Provide a clearer log message to help diagnose TLS / connection problems (hide full URI credentials)
    try {
      const displayHost = (() => {
        if (!process.env.MONGODB_URI) return "(no MONGODB_URI)"
        // attempt to display hostname:port without credentials
        const uriStr = process.env.MONGODB_URI
        const atIndex = uriStr.indexOf("@")
        if (atIndex !== -1) return uriStr.slice(atIndex + 1)
        return uriStr
      })()
      console.error(`[mongodb] Failed to connect to ${displayHost}:`, err)
    } catch (e) {
      console.error("[mongodb] Failed to connect (and failed to redact URI):", err)
    }
    throw err
  }
}

// ✅ Default export (optional for flexibility)
export default clientPromise
