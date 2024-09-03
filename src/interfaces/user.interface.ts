export interface User {
  id: string;
  telegramUserId: number;
  telegramUsername?: string;
  telegramPhoto?: string;
  telegramPhotoMime?: string;
  firstName: string;
  lastName?: string;
}
