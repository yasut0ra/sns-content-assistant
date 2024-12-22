import { ContentSuggestion } from '@/components/ContentSuggestion';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { PerformanceAnalytics } from '@/components/PerformanceAnalytics';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TweetComposer } from '@/components/tweet/TweetComposer';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <AuthGuard>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Twitter投稿アシスタント</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TweetComposer />
          <ContentSuggestion />
          <ScheduleCalendar />
          <PerformanceAnalytics />
        </div>
      </main>
    </AuthGuard>
  );
}
