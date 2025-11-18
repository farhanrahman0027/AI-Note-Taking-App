import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import type { Note } from "./models"

export async function createNote(
  userId: string,
  noteData: Omit<Note, "_id" | "userId" | "createdAt" | "updatedAt">
) {
  const { db } = await connectToDatabase()

  const result = await db.collection("notes").insertOne({
    userId: new ObjectId(userId),
    ...noteData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return result.insertedId
}

export async function getNotesByUser(userId: string, limit = 50, skip = 0) {
  const { db } = await connectToDatabase()

  return db
    .collection("notes")
    .find({ userId: new ObjectId(userId) })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray()
}

export async function getNoteById(noteId: string, userId: string) {
  const { db } = await connectToDatabase()

  return db.collection("notes").findOne({
    _id: new ObjectId(noteId),
    userId: new ObjectId(userId),
  })
}

export async function updateNote(noteId: string, userId: string, updates: Partial<Note>) {
  const { db } = await connectToDatabase()

  const result = await db.collection("notes").findOneAndUpdate(
    {
      _id: new ObjectId(noteId),
      userId: new ObjectId(userId),
    },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  )

  return result?.value ?? null
}

export async function deleteNote(noteId: string, userId: string) {
  const { db } = await connectToDatabase()

  const result = await db.collection("notes").deleteOne({
    _id: new ObjectId(noteId),
    userId: new ObjectId(userId),
  })

  return result.deletedCount
}

export async function getUserTags(userId: string) {
  const { db } = await connectToDatabase()

  return db
    .collection("tags")
    .find({ userId: new ObjectId(userId) })
    .sort({ count: -1 })
    .toArray()
}
