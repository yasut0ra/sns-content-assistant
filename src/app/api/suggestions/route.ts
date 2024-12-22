import { NextResponse } from 'next/server';
import type { ContentSuggestion } from '@/types';

export async function POST(req: Request) {
  try {
    const { categories } = await req.json();
    
    // OpenAI APIを使用してコンテンツ提案を生成
    const suggestion: ContentSuggestion = {
      title: "サンプルタイトル",
      content: "サンプルコンテンツ",
      hashtags: ["#テスト", "#サンプル"]
    };

    return NextResponse.json({ suggestion });
  } catch (error) {
    return NextResponse.json(
      { error: 'コンテンツ提案の生成に失敗しました' },
      { status: 500 }
    );
  }
} 