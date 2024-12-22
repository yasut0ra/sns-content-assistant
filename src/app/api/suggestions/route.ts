import { NextResponse } from 'next/server';
import { generateTweetSuggestion } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { categories, tone } = await req.json();
    const suggestion = await generateTweetSuggestion(categories, tone);
    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'ツイート提案の生成に失敗しました' },
      { status: 500 }
    );
  }
} 