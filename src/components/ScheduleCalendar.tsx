'use client';

import { useState } from 'react';
import type { Post } from '@/types';

export function ScheduleCalendar() {
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);

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
                {new Date(post.scheduledAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 