'use client';

import { useState } from 'react';
import type { ContentSuggestion as ContentSuggestionType } from '@/types';

export function ContentSuggestion() {
  const [categories, setCategories] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<ContentSuggestionType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      });
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('投稿提案の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">投稿ネタ提案</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          興味のあ��カテゴリー
        </label>
        <select
          className="w-full p-2 border rounded"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(option => option.value);
            setCategories(selected);
          }}
        >
          <option value="programming">プログラミング</option>
          <option value="gadget">ガジェット</option>
          <option value="anime">アニメ</option>
          <option value="game">ゲーム</option>
        </select>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
        onClick={handleGetSuggestion}
        disabled={loading || categories.length === 0}
      >
        {loading ? '生成中...' : 'ネタを提案する'}
      </button>

      {suggestion && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-bold">{suggestion.title}</h3>
          <p className="mt-2">{suggestion.content}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestion.hashtags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 