'use client';

import { signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

export function SocialLogin() {
  const handleTwitterLogin = async () => {
    try {
      const provider = new TwitterAuthProvider();
      provider.addScope('tweet.read');
      provider.addScope('tweet.write');
      provider.addScope('users.read');

      const result = await signInWithPopup(auth, provider);
      console.log('Twitter login success:', result);
      
      const credential = TwitterAuthProvider.credentialFromResult(result);
      console.log('Twitter credential:', {
        accessToken: credential?.accessToken,
        secret: credential?.secret
      });

      await setDoc(doc(db, 'users', result.user.uid), {
        twitterConnected: true,
        twitterId: result.user.providerData[0].uid,
        twitterAccessToken: credential?.accessToken,
        twitterAccessSecret: credential?.secret,
      }, { merge: true });

    } catch (error) {
      if (error instanceof Error) {
        console.error('Twitterログインに失敗しました:', error.message);
      } else {
        console.error('予期せぬエラーが発生しました');
      }
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleTwitterLogin}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />
        Xでログイン
      </button>
    </div>
  );
} 