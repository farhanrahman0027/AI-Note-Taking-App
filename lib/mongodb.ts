import { MongoClient } from "mongodb"

let client: MongoClient
let db: any

export async function connectToDatabase() {
  if (db) return db

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required")
  }

  client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  db = client.db("ai-notes")
  return db
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}
