import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
  try {
    if (!auth.currentUser) {
      console.log('認証エラー: ユーザーが未認証');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { content } = await req.json();
    console.log('投稿内容:', content);

    // ユーザーのTwitter認証情報を取得
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const userData = userDoc.data();
    console.log('ユーザーデータ:', { 
      hasToken: !!userData?.twitterAccessToken,
      hasSecret: !!userData?.twitterAccessSecret 
    });

    if (!userData?.twitterAccessToken || !userData?.twitterAccessSecret) {
      return NextResponse.json(
        { error: 'X（Twitter）との連携が必要です' },
        { status: 401 }
      );
    }

    // Twitter APIクライアントを初期化
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: userData.twitterAccessToken,
      accessSecret: userData.twitterAccessSecret,
    });

    // ツイートを投稿
    const tweet = await client.v2.tweet(content);
    console.log('投稿結果:', tweet);

    return NextResponse.json({ tweet });
  } catch (error) {
    console.error('ツイート投稿エラーの詳細:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ツイートの投稿に失敗しました' },
      { status: 500 }
    );
  }
} 