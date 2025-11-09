const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "ai-notes"

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("Connecting to MongoDB...")
    await client.connect()
    const db = client.db(DB_NAME)

    console.log("Creating collections...")

    // Create users collection with indexes
    await db.createCollection("users").catch(() => {
      console.log("Users collection already exists")
    })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })

    // Create notes collection
    await db.createCollection("notes").catch(() => {
      console.log("Notes collection already exists")
    })
    await db.collection("notes").createIndex({ userId: 1, createdAt: -1 })
    await db.collection("notes").createIndex({ userId: 1, isPinned: -1 })

    // Create tags collection
    await db.createCollection("tags").catch(() => {
      console.log("Tags collection already exists")
    })
    await db.collection("tags").createIndex({ name: 1, userId: 1 }, { unique: true })

    console.log("Database initialized successfully!")
  } catch (error) {
    console.error("Database initialization failed:", error)
  } finally {
    await client.close()
  }
}

initializeDatabase()
