import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    // Build the backend URL, including user_id if provided
    const baseBackendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    let backendUrl = `${baseBackendUrl}/api/follow/following`;
    if (userId) {
      backendUrl += `?user_id=${userId}`;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch following' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
