'use client';

import { useState, useEffect } from 'react';
import type { Post } from '@/types';

export function PerformanceAnalytics() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // TODO: 実際のデータ取得ロジックを実装
        const response = await fetch('/api/posts/analytics');
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('投稿データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">パフォーマンス分析</h2>
      
      {loading ? (
        <p>データを読み込み中...</p>
      ) : (
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">総合エンゲージメント</h3>
            {/* TODO: グラフコンポーネントを追加 */}
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">投稿パフォーマンス</h3>
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.postId} className="text-sm">
                  <p className="font-medium">{post.content}</p>
                  <div className="flex gap-4 text-gray-500">
                    <span>👍 {post.performance.likes}</span>
                    <span>🔄 {post.performance.retweets}</span>
                    <span>💬 {post.performance.replies}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 