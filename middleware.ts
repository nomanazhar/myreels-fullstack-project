import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl
        // Allow access to the admin dashboard only for users with the "admin" role
        if(pathname.startsWith('/api/auth') || 
        pathname === '/login' || 
        pathname === '/register' || 
        pathname === '/' || 
        pathname === '/videos') {
          return true
        } 
        return !!token 
      }
    },
  },
)

export const config = { matcher: ["/admin"] }