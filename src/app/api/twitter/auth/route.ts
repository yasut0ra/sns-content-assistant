import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST() {
  try {
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
    });

    // OAuth 2.0用のURLを生成
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      { scope: ['tweet.read', 'tweet.write', 'users.read'] }
    );

    // TODO: codeVerifierとstateを一時的に保存する必要があります
    // セッションやクッキーなどに保存することを推奨

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Twitter認証エラー:', error);
    return NextResponse.json(
      { error: 'Twitter認証の初期化に失敗しました' },
      { status: 500 }
    );
  }
} 