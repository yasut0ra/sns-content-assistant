'use client';

import { useState, useEffect } from 'react';
import type { Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function ScheduleCalendar() {
  const { user } = useAuth();
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch('/api/posts/scheduled');
        const data = await response.json();
        setScheduledPosts(data.posts);
      } catch (error) {
        console.error('予定投稿の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledPosts();
  }, [user]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">投稿スケジュール</h2>
      
      <div className="grid gap-4">
        {scheduledPosts.length === 0 ? (
          <p className="text-gray-500">予定された投稿はありません</p>
        ) : (
          scheduledPosts.map((post) => (
            <div key={post.postId} className="border p-4 rounded">
              <p className="font-medium">{post.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.scheduledAt || '').toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 