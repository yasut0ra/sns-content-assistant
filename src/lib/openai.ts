import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

export async function generateTweetSuggestion(categories: string[], tone?: string) {
  try {
    const prompt = `
以下のカテゴリーに関連するツイートを1つ提案してください。
カテゴリー: ${categories.join(', ')}
トーン: ${tone || '一般的'}

以下の形式でJSONを返してください：
{
  "content": "ツイート本文（280文字以内）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2"],
  "explanation": "なぜこの内容を提案したのかの説明"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "あなたはSNSマーケティングの専門家です。効果的なツイート内容を提案してください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    throw error;
  }
} 