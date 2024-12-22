'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserPreferences {
  categories: string[];
  twitterConnected: boolean;
  twitterId?: string;
  twitterAccessToken?: string;
  twitterAccessSecret?: string;
}

export function UserProfile() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    categories: [],
    twitterConnected: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { id: 'programming', label: 'プログラミング' },
    { id: 'gadget', label: 'ガジェット' },
    { id: 'anime', label: 'アニメ' },
    { id: 'game', label: 'ゲーム' },
  ];

  const loadUserPreferences = useCallback(async () => {
    try {
      const docRef = doc(db, 'users', user!.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPreferences(docSnap.data() as UserPreferences);
      }
    } catch (err) {
      console.error('設定の読み込みに失敗しました:', err);
      setError('設定の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user, loadUserPreferences]);

  const handleCategoryChange = async (categoryId: string) => {
    const newCategories = preferences.categories.includes(categoryId)
      ? preferences.categories.filter(id => id !== categoryId)
      : [...preferences.categories, categoryId];

    try {
      const docRef = doc(db, 'users', user!.uid);
      await setDoc(docRef, {
        ...preferences,
        categories: newCategories,
      }, { merge: true });

      setPreferences(prev => ({
        ...prev,
        categories: newCategories,
      }));
    } catch (err) {
      console.error('設定の保存に失敗しました:', err);
      setError('設定の保存に失敗しました');
    }
  };

  const handleTwitterConnect = async () => {
    try {
      const response = await fetch('/api/twitter/auth', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Twitter連携エラー:', error);
      setError('Twitter連携の開始に失敗しました');
    }
  };

  const handleTwitterDisconnect = async () => {
    try {
      const docRef = doc(db, 'users', user!.uid);
      await setDoc(
        docRef,
        {
          twitterConnected: false,
          twitterId: null,
          twitterAccessToken: null,
          twitterAccessSecret: null,
        },
        { merge: true }
      );

      setPreferences(prev => ({
        ...prev,
        twitterConnected: false,
      }));
    } catch (error) {
      console.error('Twitter連携解除エラー:', error);
      setError('Twitter連携の解除に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">プロフィール設定</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">興味のあるカテゴリー</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-3">Twitter連携</h3>
        {preferences.twitterConnected ? (
          <div className="flex items-center justify-between">
            <span className="text-green-600">連携済み</span>
            <button
              className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              onClick={handleTwitterDisconnect}
            >
              連携を解除
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleTwitterConnect}
          >
            Twitterと連携する
          </button>
        )}
      </div>
    </div>
  );
} 