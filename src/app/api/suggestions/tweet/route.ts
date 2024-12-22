import { NextResponse } from 'next/server';
import { generateTweetSuggestion } from '@/lib/openai';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
  try {
    const { uid, tone } = await req.json();
    console.log('リクエストデータ:', { uid, tone });

    if (!uid) {
      console.log('認証エラー: UIDが存在しません');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // ユーザーの興味カテゴリーを取得
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();
    console.log('取得したユーザーデータ:', userData);

    if (!userData?.categories || userData.categories.length === 0) {
      console.log('カテゴリーエラー: カテゴリーが未設定');
      return NextResponse.json(
        { error: '興味カテゴリーを設定してください' },
        { status: 400 }
      );
    }

    const suggestion = await generateTweetSuggestion(userData.categories, tone);
    console.log('生成された提案:', suggestion);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('詳細なエラー情報:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ツイート提案の生成に失敗しました' },
      { status: 500 }
    );
  }
} 