import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const analysisRecords = await prisma.analysisRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const soilRecords = await prisma.soilRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Formats records into a unified structure for easier client parsing
    const unifiedHistory = [
      ...analysisRecords.map((r) => ({
        id: r.id,
        recordType: 'analysis',
        type: r.type, // 'disease', 'pest', 'waste'
        itemName: r.itemName,
        confidence: r.confidence,
        severity: r.severity,
        explanation: r.explanation,
        reasoning: r.reasoning,
        recommendations: JSON.parse(r.recommendations),
        organicSolutions: r.organicSolutions ? JSON.parse(r.organicSolutions) : null,
        chemicalSolutions: r.chemicalSolutions ? JSON.parse(r.chemicalSolutions) : null,
        preventionTips: JSON.parse(r.preventionTips),
        limitations: r.limitations,
        expertWarning: r.expertWarning,
        boundingBoxes: r.boundingBoxes ? JSON.parse(r.boundingBoxes) : null,
        image: r.image,
        createdAt: r.createdAt,
      })),
      ...soilRecords.map((s) => ({
        id: s.id,
        recordType: 'soil',
        soilType: s.soilType,
        soilColor: s.soilColor,
        pH: s.pH,
        moisture: s.moisture,
        cropType: s.cropType,
        healthScore: s.healthScore,
        nutrients: JSON.parse(s.nutrients),
        fertilizers: JSON.parse(s.fertilizers),
        suitability: JSON.parse(s.suitability),
        improvements: JSON.parse(s.improvements),
        createdAt: s.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(unifiedHistory);
  } catch (error: any) {
    console.error('Error fetching history records:', error);
    return NextResponse.json({ error: 'Failed to retrieve history records' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Delete all records to allow clearing logs
    await prisma.analysisRecord.deleteMany({});
    await prisma.soilRecord.deleteMany({});
    return NextResponse.json({ success: true, message: 'All history cleared' });
  } catch (error: any) {
    console.error('Error clearing history records:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
