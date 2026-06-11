import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, sessionId = 'default', lang, keys } = body;

    if (!message || !lang) {
      return NextResponse.json(
        { error: 'Missing required parameters: message or lang' },
        { status: 400 }
      );
    }

    // 1. Save user's message in the database (non-blocking)
    try {
      const { prisma } = await import('@/lib/db');
      await prisma.chatMessage.create({
        data: {
          sessionId,
          sender: 'user',
          content: message,
        },
      });
    } catch (dbErr) {
      console.warn('[Chat API] DB user message save skipped:', (dbErr as Error).message);
    }

    // 2. Call AI Chat Service
    const aiResult = await AIService.getChatResponse(
      message,
      history || [],
      lang,
      keys || {}
    );

    // 3. Save AI's response in the database (non-blocking)
    let recordMeta: { id?: string; createdAt?: string } = {};
    try {
      const { prisma } = await import('@/lib/db');
      const savedResponse = await prisma.chatMessage.create({
        data: {
          sessionId,
          sender: 'ai',
          content: aiResult.content,
          confidence: aiResult.confidence,
          limitations: aiResult.limitations,
          expertWarning: aiResult.expertWarning,
        },
      });
      recordMeta = { id: savedResponse.id, createdAt: savedResponse.createdAt.toISOString() };
    } catch (dbErr) {
      console.warn('[Chat API] DB AI message save skipped:', (dbErr as Error).message);
    }

    return NextResponse.json({
      id: recordMeta.id || 'temp-' + Date.now(),
      ...aiResult,
      createdAt: recordMeta.createdAt || new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error during chat processing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'default';

    let messages: any[] = [];
    try {
      const { prisma } = await import('@/lib/db');
      messages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      });
    } catch (dbErr) {
      console.warn('[Chat API] DB get history skipped:', (dbErr as Error).message);
    }

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to retrieve chat history' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'default';

    try {
      const { prisma } = await import('@/lib/db');
      await prisma.chatMessage.deleteMany({
        where: { sessionId },
      });
    } catch (dbErr) {
      console.warn('[Chat API] DB clear history skipped:', (dbErr as Error).message);
    }

    return NextResponse.json({ success: true, message: 'Chat history cleared' });
  } catch (error: any) {
    console.error('Error clearing chat history:', error);
    return NextResponse.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}
