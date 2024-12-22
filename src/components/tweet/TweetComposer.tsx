'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function TweetComposer() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/twitter/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('ツイートの投稿に失敗しました');
      }

      setContent('');
    } catch (err) {
      console.error('ツイートエラー:', err);
      setError('ツイートの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestion = async () => {
    setSuggesting(true);
    setError('');

    try {
      if (!user) {
        throw new Error('認証が必要です');
      }

      const response = await fetch('/api/suggestions/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uid: user.uid,
          tone: 'カジュアル' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '提案の取得に失敗しました');
      }

      if (data.suggestion?.content) {
        setContent(data.suggestion.content);
      } else {
        throw new Error('提案内容が不正です');
      }
    } catch (err) {
      console.error('提案エラーの詳細:', err);
      setError(err instanceof Error ? err.message : '提案の取得に失敗しました');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">新規ツイート</h2>
      <div className="mb-4">
        <button
          onClick={handleGetSuggestion}
          disabled={suggesting}
          className="w-full mb-4 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          {suggesting ? '提案を生成中...' : 'ツイート内容を提案'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ツイート内容を入力..."
            maxLength={280}
          />
          <div className="text-right text-sm text-gray-500">
            {content.length}/280
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || content.length === 0}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? '投稿中...' : 'ツイートする'}
        </button>
      </form>
    </div>
  );
} 