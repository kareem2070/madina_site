import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = '42a35c2c3db6984e667ebdf6034927ce71ed0e3cce3f8576f5d43b963c90065d';

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    jwt.verify(token, SECRET);
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all routes under /dashboard
};
