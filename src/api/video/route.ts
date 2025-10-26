import { dbConnect } from "@/lib/db";
import video from "@/models/video";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/user";
import Video from "@/models/video";


export async function GET() {
    // Your logic to retrieve video data goes here
    await dbConnect();
    const videos = await video.find({
    // Add your query conditions here 
     }).sort({ createdAt: -1 }).lean();

     if(!videos || videos.length === 0  ) {
        return NextResponse.json({ message: "No videos found" }, { status: 404 });
     }

    return NextResponse.json(videos, {
        status: 200,
    });
}

export async function POST(request: Request) {
   try {
     const session = await getServerSession(authOptions);
 
     if (!session) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
     const user = await User.findById(session.user.id);
     if (!user) {
         return NextResponse.json({ message: "User not found" }, { status: 404 });
     }
     const body = await request.json();
     await dbConnect();
     const videodata = {
         ...body,
         uploader: user._id,
         transformations: {
             height: 1920,
             width: 1080,
             quality: body.transformations?.quality ?? 90,
         }
     };
     const newVideo = await Video.create(videodata);

        return NextResponse.json(newVideo, { status: 201 });
   } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    
   }

}