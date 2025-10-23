import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import  User  from "../../../models/user";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },   
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists in database" },
        { status: 400 }
      );
    }       

    // Create a new user
    const newUser = await User.create({ username, email, password });
    if (newUser) {
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
    }
  }
   catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}