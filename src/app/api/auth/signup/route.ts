import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashed = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        email,
        name: [firstName, lastName].filter(Boolean).join(' ').trim() || null,
        password: hashed
      },
      select: { id: true, email: true, name: true }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Signup error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


