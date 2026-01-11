
export interface MarketingInput {
  industry: string;
  brandName: string;
  style: string;
  audience: string;
  marketingGoal: string;
  strategyFocus: string;
  targetBrandName: string;
  targetBrandUrl: string;
  favoriteCreatorName: string;
  favoriteCreatorUrl: string;
  contactInfo: string;
}

export interface SocialPost {
  date: string;
  dayOfWeek: string;
  platform: 'FB' | 'IG';
  content: string;
  imagePrompt: string;
  hashtags: string[];
  isCompleted: boolean;
}

export interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  prepPhase?: {
    persona: string;
    brandPositioning: string;
  };
  posts: SocialPost[];
}

export interface MarketingPlan {
  id: string;
  timestamp: number;
  input: MarketingInput;
  weeks: WeeklyPlan[];
}

export interface UserSession {
  isLoggedIn: boolean;
  username: string;
}
