import { dbConnect } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
    // Add your providers here
    CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "email", type: "email", placeholder: "jsmith@example.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      if(!credentials?.email || !credentials?.password) {
        return null;
      }
       try {
         await dbConnect();
         const foundUser = await User.findOne({ email: credentials?.email });
         if (!foundUser) {
           throw new Error("No user found with the given email");
         }
         const isPasswordCorrect = await bcrypt.compare(
           credentials?.password,
           foundUser.password
         );
         if (!isPasswordCorrect) {
              throw new Error("Incorrect password");
         } 
         return {
              id: foundUser._id.toString(),
            email: foundUser.email,
                name: foundUser.name
         }

       } catch (error) {
         console.error("Error during authentication:", error);
         return null;
       }

    }
  })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        } 
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,

     
}