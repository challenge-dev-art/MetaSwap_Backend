export interface NewsRequest {
  userId: number;
  title: string;
  content: string;
}

export interface UpdateNewsRequest {
  id: number;
  userId: number;
  title: string;
  content: string;
}

export interface DeleteNewsRequest {
  id: number;
}