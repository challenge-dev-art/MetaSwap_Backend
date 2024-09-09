export interface PostFeedbackRequest {
  userId: number;
  title: string;
  content: string;
}

export interface DeleteFeedbackRequest {
  id: number;
}
