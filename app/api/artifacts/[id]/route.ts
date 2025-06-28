import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artifact = await prisma.artifact.findUnique({
      where: { id: params.id },
      include: {
        venture: true,
        user: true
      }
    });
    
    if (!artifact) {
      return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...artifact,
      content: JSON.parse(artifact.content)
    });
  } catch (error) {
    console.error('Error fetching artifact:', error);
    return NextResponse.json({ error: 'Failed to fetch artifact' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, status } = body;
    
    const artifact = await prisma.artifact.update({
      where: { id: params.id },
      data: {
        content: JSON.stringify(content),
        status: status || undefined
      }
    });
    
    return NextResponse.json(artifact);
  } catch (error) {
    console.error('Error updating artifact:', error);
    return NextResponse.json({ error: 'Failed to update artifact' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.artifact.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artifact:', error);
    return NextResponse.json({ error: 'Failed to delete artifact' }, { status: 500 });
  }
}