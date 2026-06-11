import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, lang, keys } = body;

    if (!location || !lang) {
      return NextResponse.json(
        { error: 'Missing required parameters: location or lang' },
        { status: 400 }
      );
    }

    // Call Weather Service (always works — uses smart mock data)
    const weatherResult = await WeatherService.getInsights(
      location,
      lang,
      keys?.weather
    );

    // Try to save record to DB — but don't fail if DB isn't available
    try {
      const { prisma } = await import('@/lib/db');
      await prisma.weatherRecord.create({
        data: {
          location,
          temp: weatherResult.temp,
          humidity: weatherResult.humidity,
          windSpeed: weatherResult.windSpeed,
          rainfallChance: weatherResult.rainfallChance,
          aqi: weatherResult.aqi,
          advisory: JSON.stringify(weatherResult.advisories),
        },
      });
    } catch (dbErr) {
      // DB save failure is non-critical — weather data still returned
      console.warn('[Weather API] DB save skipped:', (dbErr as Error).message);
    }

    return NextResponse.json(weatherResult);
  } catch (error: any) {
    console.error('Error in /api/weather:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error during weather analysis' },
      { status: 500 }
    );
  }
}
