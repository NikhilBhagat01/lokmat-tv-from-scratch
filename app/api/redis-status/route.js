import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  try {
    // Generate a unique test key
    const testKey = `test-${Date.now()}`;
    const testValue = `Lokmat TV Test ${new Date().toISOString()}`;

    // Test write
    await redis.set(testKey, testValue, { ex: 60 }); // Expires in 60 seconds

    // Test read
    const readValue = await redis.get(testKey);

    // Get some stats
    const stats = {
      keyMatch: readValue === testValue,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development',
      region: process.env.VERCEL_REGION || 'local',
    };

    return NextResponse.json({
      success: true,
      message: 'Redis connection successful in production',
      stats,
    });
  } catch (error) {
    console.error('Redis production test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        environment: process.env.VERCEL_ENV || 'development',
        region: process.env.VERCEL_REGION || 'local',
      },
      { status: 500 }
    );
  }
}



// from staging