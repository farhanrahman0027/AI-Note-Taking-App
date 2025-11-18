// lib/mongodb.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const options = {}

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
  const client = await clientPromise
  const db = client.db() // default DB from connection string
  return { client, db }
}

// ✅ Default export (optional for flexibility)
export default clientPromise
