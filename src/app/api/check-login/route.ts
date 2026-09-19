// pages/api/check-login.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = '42a35c2c3db6984e667ebdf6034927ce71ed0e3cce3f8576f5d43b963c90065d';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    jwt.verify(token, SECRET);
    return NextResponse.json({ isLoggedIn: true });
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
