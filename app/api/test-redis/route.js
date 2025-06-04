import { testRedisConnection } from '@/app/lib/redis-test';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await testRedisConnection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
