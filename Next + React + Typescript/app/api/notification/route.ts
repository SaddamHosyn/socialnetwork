import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:8080/api/notifications', {
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    
    const notifications = await response.json();
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
