import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { soilType, soilColor, pH, moisture, cropType, lang, keys } = body;

    if (!soilType || !soilColor || pH === undefined || moisture === undefined || !cropType || !lang) {
      return NextResponse.json(
        { error: 'Missing required soil parameters' },
        { status: 400 }
      );
    }

    // Call Soil AI Service (always runs)
    const soilResult = await AIService.analyzeSoil(
      soilType,
      soilColor,
      parseFloat(pH),
      parseFloat(moisture),
      cropType,
      lang,
      keys || {}
    );

    // Try to save record to SQLite — non-critical
    let recordMeta: { id?: string; createdAt?: string } = {};
    try {
      const { prisma } = await import('@/lib/db');
      const saved = await prisma.soilRecord.create({
        data: {
          soilType,
          soilColor,
          pH: parseFloat(pH),
          moisture: parseFloat(moisture),
          cropType,
          healthScore: soilResult.healthScore,
          nutrients: JSON.stringify(soilResult.nutrients),
          fertilizers: JSON.stringify(soilResult.fertilizers),
          suitability: JSON.stringify(soilResult.suitability),
          improvements: JSON.stringify(soilResult.improvements),
        },
      });
      recordMeta = { id: saved.id, createdAt: saved.createdAt?.toISOString() };
    } catch (dbErr) {
      console.warn('[Soil API] DB save skipped:', (dbErr as Error).message);
    }

    return NextResponse.json({ ...recordMeta, ...soilResult });
  } catch (error: any) {
    console.error('Error in /api/soil:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error during soil analysis' },
      { status: 500 }
    );
  }
}
