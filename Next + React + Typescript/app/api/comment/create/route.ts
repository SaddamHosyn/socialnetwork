import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Comment create endpoint - not implemented yet' }, { status: 501 });
}
