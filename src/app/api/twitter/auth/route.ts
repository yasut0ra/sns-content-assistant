import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: Request) {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CLIENT_ID!,
      appSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const authLink = await client.generateAuthLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/twitter/callback`
    );

    return NextResponse.json({ url: authLink.url });
  } catch (error) {
    console.error('Twitter認証エラー:', error);
    return NextResponse.json(
      { error: 'Twitter認証の初期化に失敗しました' },
      { status: 500 }
    );
  }
} 