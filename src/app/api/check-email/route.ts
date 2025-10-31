import { dbConnect } from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    // Check if user exists
  try {
    await dbConnect();
    if(!email){
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ exists: true }, { status: 200 });
    } else {
        return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
