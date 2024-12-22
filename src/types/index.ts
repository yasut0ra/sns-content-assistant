export interface User {
  userId: string;
  email: string;
  preferences: string[];
  twitterAccessToken: string;
}

export interface Post {
  postId: string;
  content: string;
  scheduledAt?: string;
  performance?: {
    likes: number;
    retweets: number;
    replies: number;
  };
  userId: string;
  createdAt: string;
}

export interface ContentSuggestion {
  title: string;
  content: string;
  hashtags: string[];
} 