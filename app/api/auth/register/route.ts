import { connectToDatabase } from "@/lib/mongodb";
import { validateEnv } from "@/lib/env";
import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // validate environment vars and provide clear server logs if something is missing
    validateEnv()

    // ✅ Get database connection (use configured DB via MONGODB_DB or the DB in the connection string)
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    // insertedId is a MongoDB ObjectId; convert to string for JSON serialization
    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: result.insertedId?.toString?.() ?? null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
