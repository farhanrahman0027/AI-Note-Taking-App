const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "ai-notes"

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("[v0] Connecting to MongoDB...")
    await client.connect()
    const db = client.db(DB_NAME)

    console.log("[v0] Creating collections...")

    // Create users collection with indexes
    await db.createCollection("users").catch(() => {
      console.log("[v0] Users collection already exists")
    })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })

    // Create notes collection
    await db.createCollection("notes").catch(() => {
      console.log("[v0] Notes collection already exists")
    })
    await db.collection("notes").createIndex({ userId: 1, createdAt: -1 })
    await db.collection("notes").createIndex({ userId: 1, isPinned: -1 })

    // Create tags collection
    await db.createCollection("tags").catch(() => {
      console.log("[v0] Tags collection already exists")
    })
    await db.collection("tags").createIndex({ name: 1, userId: 1 }, { unique: true })

    console.log("[v0] Database initialized successfully!")
  } catch (error) {
    console.error("[v0] Database initialization failed:", error)
  } finally {
    await client.close()
  }
}

initializeDatabase()
