
import { getUploadAuthParams } from "@imagekit/next/server"
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    // For example, you can check if the user is logged in or has the necessary permissions
    // If the user is not authenticated, you can return an error response
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    

   try {
     const authenticateparameters = getUploadAuthParams({
         privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
         publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
         // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
         // token: "random-token", // Optional, a unique token for request
     })
 
     return Response.json({ 
         ...authenticateparameters,
         publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
   } catch (error) {
        console.error("Error generating upload auth parameters:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
   }
}