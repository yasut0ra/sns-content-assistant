export interface User {
  userId: string;
  email: string;
  preferences: string[];
  twitterAccessToken: string;
}

export interface Post {
  postId: string;
  userId: string;
  content: string;
  hashtags: string[];
  scheduledAt: Date;
  performance: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

export interface ContentSuggestion {
  title: string;
  content: string;
  hashtags: string[];
  referenceImages?: string[];
} 