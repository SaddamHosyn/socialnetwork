import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:8080/api/notifications', {
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    });
    
    // Handle authentication gracefully
    if (response.status === 401) {
      console.log('🔓 User not authenticated, returning empty notifications');
      return NextResponse.json([], { status: 200 });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Go backend error response:', errorText);
      throw new Error(`Go backend returned ${response.status}: ${errorText}`);
    }
    
    const notifications = await response.json();
    console.log('✅ Successfully fetched notifications');
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
