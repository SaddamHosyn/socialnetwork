import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let userId: string | null = null;
    
    // Handle both FormData and URLSearchParams
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.text();
      const params = new URLSearchParams(formData);
      userId = params.get('user_id');
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      userId = formData.get('user_id')?.toString() || null;
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append('user_id', userId);

    const response = await fetch('http://localhost:8080/api/unfollow', {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      body: backendFormData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to unfollow user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}