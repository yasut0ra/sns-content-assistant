import { TwitterApi } from 'twitter-api-v2';

const xClient = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
});

export const client = xClient.readOnly;

export async function verifyCredentials(accessToken: string) {
  try {
    const userClient = new TwitterApi(accessToken);
    const result = await userClient.v2.me();
    return result.data;
  } catch (error) {
    console.error('X認証エラー:', error);
    throw error;
  }
}

export async function postTweet(accessToken: string, content: string) {
  try {
    const userClient = new TwitterApi(accessToken);
    const tweet = await userClient.v2.tweet(content);
    return tweet;
  } catch (error) {
    console.error('ツイート投稿エラー:', error);
    throw error;
  }
} 