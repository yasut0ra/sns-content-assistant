import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');

    if (!oauth_token || !oauth_verifier) {
      throw new Error('必要なパラメータが不足しています');
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_CLIENT_ID!,
      appSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const {
      client: loggedClient,
      accessToken,
      accessSecret,
    } = await client.loginWithOAuth1({
      accessToken: oauth_token,
      accessSecret: oauth_verifier,
    });

    // ユーザー情報を取得
    const user = await loggedClient.v2.me();

    // Firestoreにトークンを保存
    if (auth.currentUser) {
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          twitterConnected: true,
          twitterId: user.data.id,
          twitterAccessToken: accessToken,
          twitterAccessSecret: accessSecret,
        },
        { merge: true }
      );
    }

    return NextResponse.redirect('/profile?twitter=success');
  } catch (error) {
    console.error('Twitter認証コールバックエラー:', error);
    return NextResponse.redirect('/profile?twitter=error');
  }
} 