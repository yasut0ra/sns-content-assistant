import { UserProfile } from '@/components/profile/UserProfile';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main className="container mx-auto px-4 py-8">
        <UserProfile />
      </main>
    </AuthGuard>
  );
} 