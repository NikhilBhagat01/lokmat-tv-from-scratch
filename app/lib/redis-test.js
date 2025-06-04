import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test function
export async function testRedisConnection() {
  try {
    // First, let's log the URL (but mask the sensitive parts)
    const maskedUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/\/[^@]+@/, '//***@');
    console.log('Using Redis URL:', maskedUrl);

    // Try a read operation first
    try {
      const testRead = await redis.get('test-key');
      console.log('Read test:', testRead !== null ? 'successful' : 'key not found');
    } catch (readError) {
      console.error('Read test failed:', readError.message);
    }

    // Then try a write operation
    try {
      await redis.set('test-key', 'Hello from Lokmat TV!');
      console.log('Write test: successful');
    } catch (writeError) {
      console.error('Write test failed:', writeError.message);
      throw new Error('Write permission denied. Please check if you are using the Read-Write token from Upstash dashboard.');
    }

    // If we got here, both operations worked
    const value = await redis.get('test-key');
    return {
      success: true,
      message: 'Redis connection successful!',
      readTest: 'passed',
      writeTest: 'passed',
      value,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      tip: 'Make sure you are using the Read-Write token from the Upstash dashboard, not the Read-Only token.',
    };
  }
}
