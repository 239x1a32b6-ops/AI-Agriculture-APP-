import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, type, lang, keys, cropHint } = body;

    if (!image || !type || !lang) {
      return NextResponse.json(
        { error: 'Missing required fields: image, type, or lang' },
        { status: 400 }
      );
    }

    // Call AI Service (core logic — always runs)
    const aiResult = await AIService.analyzeImage(image, type, lang, keys || {}, cropHint);

    // Try to save record to SQLite — non-critical, won't block result
    let recordMeta: { id?: string; createdAt?: string } = {};
    try {
      const { prisma } = await import('@/lib/db');
      const saved = await prisma.analysisRecord.create({
        data: {
          type,
          image,
          itemName: aiResult.itemName,
          confidence: aiResult.confidence,
          severity: aiResult.severity,
          explanation: aiResult.explanation,
          reasoning: aiResult.reasoning,
          recommendations: JSON.stringify(aiResult.recommendations),
          organicSolutions: aiResult.organicSolutions ? JSON.stringify(aiResult.organicSolutions) : null,
          chemicalSolutions: aiResult.chemicalSolutions ? JSON.stringify(aiResult.chemicalSolutions) : null,
          preventionTips: JSON.stringify(aiResult.preventionTips),
          limitations: aiResult.limitations,
          expertWarning: aiResult.expertWarning,
          boundingBoxes: aiResult.boundingBoxes ? JSON.stringify(aiResult.boundingBoxes) : null,
        },
      });
      recordMeta = { id: saved.id, createdAt: saved.createdAt?.toISOString() };
    } catch (dbErr) {
      console.warn('[Analyze API] DB save skipped:', (dbErr as Error).message);
    }

    return NextResponse.json({ ...recordMeta, ...aiResult });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error during image analysis' },
      { status: 500 }
    );
  }
}
