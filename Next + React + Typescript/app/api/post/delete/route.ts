import { NextResponse } from 'next/server';

export async function DELETE() {
  return NextResponse.json({ message: 'Post delete endpoint - not implemented yet' }, { status: 501 });
}
