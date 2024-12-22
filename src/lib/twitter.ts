import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_CLIENT_ID!,
  appSecret: process.env.TWITTER_CLIENT_SECRET!,
  accessToken: process.env.TWITTER_BEARER_TOKEN,
});

export const client = twitterClient.readOnly;

export async function verifyTwitterCredentials(accessToken: string, accessSecret: string) {
  try {
    const userClient = new TwitterApi({
      appKey: process.env.TWITTER_CLIENT_ID!,
      appSecret: process.env.TWITTER_CLIENT_SECRET!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const result = await userClient.v2.me();
    return result.data;
  } catch (error) {
    console.error('Twitter認証エラー:', error);
    throw error;
  }
} 