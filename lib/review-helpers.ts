// utils/review-helpers.ts
export interface ReviewUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export interface MediaItem {
  media_url: string;
  type: "image" | "video";
  _id: string;
}

export interface Review {
  _id: string;
  user_id: string | ReviewUser | null;
  professional_id: string;
  rating: number;
  message: string;
  review_type: "pending" | "approved" | "rejected";
  tags: string[];
  media: MediaItem[];
  helpful_by: string[];
  createdAt: string;
  updatedAt: string;
  username?: string;
  email?: string;
  user?: ReviewUser;
}

export const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  } catch {
    return "";
  }
}

export function getUserFromReview(review: Review) {
  if (review.user_id && typeof review.user_id === 'object' && review.user_id !== null) {
    const userObj = review.user_id as ReviewUser;
    if (userObj.username) {
      return {
        username: userObj.username,
        email: userObj.email,
        profilePicture: userObj.profilePicture
      };
    }
  }

  if (review.username || review.email) {
    return {
      username: review.username || "Happy Customer",
      email: review.email
    };
  }

  if (review.user && review.user.username) {
    return {
      username: review.user.username,
      email: review.user.email,
      profilePicture: review.user.profilePicture
    };
  }

  return { username: "Happy Customer" };
}

export const extractTopKeywords = (reviews: Review[]): [string, number][] => {
  const stopWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'was', 'were', 'have', 'has', 'had']);
  const wordCount: Record<string, number> = {};
  
  reviews.forEach(review => {
    const words = review.message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    review.tags?.forEach(tag => {
      const cleanTag = tag.toLowerCase();
      if (!stopWords.has(cleanTag)) {
        wordCount[cleanTag] = (wordCount[cleanTag] || 0) + 1;
      }
    });
  });
  
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);
};

export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
};

export const findMostDetailedReview = (reviews: Review[]): Review | null => {
  if (reviews.length === 0) return null;
  return reviews.reduce((best, current) => 
    current.message.length > best.message.length ? current : best
  );
};

export const getMarketingBestReviews = (reviews: Review[]): Review[] => {
  return reviews.filter(review => {
    const hasResults = /\b(solved|fixed|helped|improved|increased|saved|reduced|transformed|delivered|exceeded)\b/i.test(review.message);
    const hasMedia = review.media && review.media.length > 0;
    const isDetailed = review.message.length > 100;
    const isHighRating = review.rating >= 4.5;
    
    let score = 0;
    if (hasResults) score += 3;
    if (hasMedia) score += 2;
    if (isDetailed) score += 2;
    if (isHighRating) score += 1;
    
    return score >= 5;
  }).sort((a, b) => {
    const aScore = getMarketingScore(a);
    const bScore = getMarketingScore(b);
    return bScore - aScore;
  });
};

export function getMarketingScore(review: Review): number {
  let score = 0;
  const hasResults = /\b(solved|fixed|helped|improved|increased|saved|reduced|transformed)\b/i.test(review.message);
  const hasMedia = review.media && review.media.length > 0;
  const isDetailed = review.message.length > 100;
  const isHighRating = review.rating >= 4.5;
  
  if (hasResults) score += 3;
  if (hasMedia) score += 2;
  if (isDetailed) score += 2;
  if (isHighRating) score += 1;
  
  return score;
}