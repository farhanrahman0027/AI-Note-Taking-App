import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
  accent?: string
}

export interface Note {
  _id?: ObjectId
  userId: ObjectId | string
  title: string
  content: string
  tags: string[]
  summary?: string
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  color?: string
}

export interface NoteTag {
  _id?: ObjectId
  name: string
  count: number
  createdAt: Date
}
