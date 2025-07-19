import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const response= await fetch(`${backendUrl}/api/notifications/read?id=${id}`, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read'},
      { status: 500 }
    );
  }
}
