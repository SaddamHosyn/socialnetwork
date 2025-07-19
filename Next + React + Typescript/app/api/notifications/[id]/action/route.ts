import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const response = await fetch(`${backendUrl}/api/notifications/${resolvedParams.id}/action`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification action');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification action:', error);
    return NextResponse.json(
      { error: 'Failed to update notification action' },
      { status: 500 }
    );
  }
}
