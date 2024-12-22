import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    if (!auth.currentUser) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('userId', '==', auth.currentUser.uid),
      where('scheduledAt', '>=', new Date().toISOString())
    );

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      postId: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('予定投稿の取得エラー:', error);
    return NextResponse.json(
      { error: '予定投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
} 