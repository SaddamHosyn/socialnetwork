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
      
      // If it's a server error, return empty array instead of failing
      if (response.status === 500) {
        console.log('⚠️  Server error fetching notifications, returning empty array');
        return NextResponse.json([], { status: 200 });
      }
      
      throw new Error(`Go backend returned ${response.status}: ${errorText}`);
    }
    
    const notifications = await response.json();
    console.log('✅ Successfully fetched notifications');
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([], { status: 200 });
  }
}
