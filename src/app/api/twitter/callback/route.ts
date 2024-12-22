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
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
      console.error('Twitter OAuth Error:', { error, error_description });
      return NextResponse.redirect(new URL('/auth/error', req.url));
    }

    if (!oauth_token || !oauth_verifier) {
      throw new Error('必要なパラメータが不足しています');
    }

    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
    });

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await client.loginWithOAuth2({
      code: oauth_verifier,
      codeVerifier: oauth_token,
      redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
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
          twitterRefreshToken: refreshToken,
        },
        { merge: true }
      );
    }

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('Twitter認証コールバックエラー:', error);
    return NextResponse.redirect(new URL('/auth/error', req.url));
  }
} 