import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ventureId = searchParams.get('ventureId');
    const type = searchParams.get('type');
    
    const where: any = {};
    if (ventureId) where.ventureId = ventureId;
    if (type) where.type = type;
    
    const artifacts = await prisma.artifact.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(artifacts);
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    return NextResponse.json({ error: 'Failed to fetch artifacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, ventureId, moduleId, isFoundational, status = 'draft' } = body;
    
    // For demo purposes, create a default user if none exists
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Demo User'
        }
      });
    }
    
    // Create or get venture
    let venture = await prisma.venture.findFirst({
      where: { id: ventureId }
    });
    
    if (!venture) {
      venture = await prisma.venture.create({
        data: {
          id: ventureId,
          name: 'Demo Venture',
          userId: user.id
        }
      });
    }
    
    const artifact = await prisma.artifact.create({
      data: {
        type,
        content: JSON.stringify(content),
        status,
        moduleId,
        isFoundational,
        userId: user.id,
        ventureId: venture.id
      }
    });
    
    return NextResponse.json(artifact);
  } catch (error) {
    console.error('Error creating artifact:', error);
    return NextResponse.json({ error: 'Failed to create artifact' }, { status: 500 });
  }
}