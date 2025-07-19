import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    
    if (!post_id) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(
      `${backendUrl}/api/comment/fetch?post_id=${post_id}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
