// pages/api/login.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET = '42a35c2c3db6984e667ebdf6034927ce71ed0e3cce3f8576f5d43b963c90065d';

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 });
    }

    const userCount = await prisma.user.count();

    if (userCount === 0) {
      const newUser = await prisma.user.create({
        data: { mobile },
      });

      const token = jwt.sign({ userId: newUser.id }, SECRET, { expiresIn: '1h' });
      return NextResponse.json({ message: 'Login successful', token });
    } else {
      const user = await prisma.user.findUnique({
        where: { mobile },
      });

      if (!user) {
        return NextResponse.json({ message: 'Login failed. Only the first registered mobile number is allowed.' }, { status: 400 });
      }

      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
      return NextResponse.json({ message: 'Login successful', token });
    }
  } catch (error) {
    console.error("Error during Prisma operation:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
