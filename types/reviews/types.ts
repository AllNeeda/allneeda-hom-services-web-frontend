export type ReviewStatus = "Approved" | "Pending" | "Declined";

export type ReplyItem = {
  id: string;
  name: string;
  comment: string;
  timeAgo: string;
  isBusiness: boolean;
};

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  timeAgo: string;
  comment: string;
  status: ReviewStatus;
  helpful: number;
  replies?: ReplyItem[];
};
