export interface DocumentsRequest {
  userId: number;
  title: string;
  content: string;
}

export interface UpdateDocumentsRequest {
  id: number;
  userId: number;
  title: string;
  content: string;
}

export interface DeleteDocumentsRequest {
  id: number;
}