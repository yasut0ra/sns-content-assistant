import { TwitterApi } from 'twitter-api-v2';

const xClient = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_BEARER_TOKEN,
});

export const client = xClient.readOnly;

export async function verifyCredentials(accessToken: string, accessSecret: string) {
  try {
    const userClient = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const result = await userClient.v2.me();
    return result.data;
  } catch (error) {
    console.error('X認証エラー:', error);
    throw error;
  }
} 