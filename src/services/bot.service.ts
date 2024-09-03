import { createBot } from '@/bot';
import { config } from '@/config';
import { Bot, GrammyError } from 'grammy';
import { PrismaAdapter } from '@grammyjs/storage-prisma';
import { Service } from 'typedi';
import { logger } from '@/utils/logger';
import { ChatFromGetChat, ChatMember } from '@grammyjs/types';
import { UserProfilePhotos } from 'grammy/types';
import { prisma } from '@/prisma-client';

export type GetUserProfilePhotoIdResult =
  | {
      kind: 'OK';
      fileId: string;
      fileUniqueId: string;
    }
  | {
      kind: 'USER_NOT_FOUND';
    }
  | {
      kind: 'PHOTO_NOT_FOUND';
    };

export type GetChatPhotoIdResult =
  | {
      kind: 'OK';
      fileId: string;
      fileUniqueId: string;
    }
  | {
      kind: 'CHAT_NOT_FOUND';
    }
  | {
      kind: 'PHOTO_NOT_FOUND';
    };

export type GetFileUrlResult =
  | {
      kind: 'OK';
      url: string;
    }
  | {
      kind: 'NOT_FOUND';
    };

@Service()
export class BotService {
  private _bot: Bot;
  private _myId = NaN;

  constructor() {
    const sessionStorage = new PrismaAdapter(prisma.botSession);
    this._bot = createBot(config.BOT_TOKEN, { sessionStorage });
  }

  public async isChatMembersAccessible(chatId: string): Promise<boolean> {
    if (!/^@[a-zA-Z0-9_]+$/.test(chatId)) {
      throw new TypeError('chatId: wrong format');
    }

    const myId = await this._loadMyId();

    let chatMember: ChatMember;
    try {
      chatMember = await this._bot.api.getChatMember(chatId, myId);
    } catch (error) {
      console.error(error);
      if (error instanceof GrammyError && (error.error_code === 403 || error.error_code === 400)) {
        return false;
      }
      throw error;
    }
    if (chatMember.status === 'left' || chatMember.status === 'kicked') {
      return false;
    }
    let chat: ChatFromGetChat;
    try {
      chat = await this._bot.api.getChat(chatId);
    } catch (error) {
      if (error instanceof GrammyError && (error.error_code === 403 || error.error_code === 400)) {
        return false;
      }
      throw error;
    }

    if (chat.type === 'channel') {
      return chatMember.status === 'administrator';
    } else if (chat.type === 'supergroup') {
      return chatMember.status === 'member';
    }

    return true;
  }

  public async isChatMember(chatId: string, userId: number): Promise<boolean> {
    let chatMember: ChatMember;
    try {
      chatMember = await this._bot.api.getChatMember(chatId, userId);
    } catch (error) {
      if (error instanceof GrammyError && (error.error_code === 403 || error.error_code === 400)) {
        console.log('return false; grammy error');
        return false;
      }
      throw error;
    }
    if (chatMember.status === 'left' || chatMember.status === 'kicked') {
      return false;
    }

    return true;
  }

  public async getUserProfilePhotoId(userId: number): Promise<GetUserProfilePhotoIdResult> {
    let profilePhotos: UserProfilePhotos;
    try {
      profilePhotos = await this._bot.api.getUserProfilePhotos(userId);
    } catch (error) {
      if (error instanceof GrammyError) {
        return { kind: 'USER_NOT_FOUND' };
      }
      throw error;
    }

    if (profilePhotos.total_count === 0) {
      return { kind: 'PHOTO_NOT_FOUND' };
    }

    const firstPhotoSet = profilePhotos.photos[0];
    if (!firstPhotoSet) {
      return { kind: 'PHOTO_NOT_FOUND' };
    }
    const firstPhoto = firstPhotoSet[0];
    if (!firstPhoto) {
      return { kind: 'PHOTO_NOT_FOUND' };
    }

    const fileId = firstPhoto.file_id;
    const fileUniqueId = firstPhoto.file_unique_id;

    return { kind: 'OK', fileId: fileId, fileUniqueId };
  }

  public async getChatPhotoId(chatId: string): Promise<GetChatPhotoIdResult> {
    let chat: ChatFromGetChat;
    try {
      chat = await this._bot.api.getChat(chatId);
    } catch (error) {
      if (error instanceof GrammyError) {
        return { kind: 'CHAT_NOT_FOUND' };
      }
      throw error;
    }

    const photo = chat.photo;
    if (!photo) {
      return { kind: 'PHOTO_NOT_FOUND' };
    }

    return {
      kind: 'OK',
      fileId: photo.small_file_id,
      fileUniqueId: photo.small_file_unique_id,
    };
  }

  public async getFileUrl(fileId: string): Promise<GetFileUrlResult> {
    let file: { file_path?: string };
    try {
      file = await this._bot.api.getFile(fileId);
    } catch (error) {
      if (error instanceof GrammyError) {
        return { kind: 'NOT_FOUND' };
      }
      throw error;
    }
    if (!file.file_path) {
      return { kind: 'NOT_FOUND' };
    }

    const fileUrl = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`;

    return { kind: 'OK', url: fileUrl };
  }

  public async start() {
    if (this._isFirstAppInstance()) {
      logger.info('start Telegram bot using long polling');
      await this._bot.start();
    }
  }

  private async _loadMyId(): Promise<number> {
    if (!isNaN(this._myId)) {
      return this._myId;
    }
    const me = await this._bot.api.getMe();
    this._myId = me.id;
    return this._myId;
  }

  // https://pm2.keymetrics.io/docs/usage/environment/
  private _isFirstAppInstance() {
    // dev mode?
    if ('INSTANCE_ID' in process.env === false) {
      return true;
    }
    if (process.env.INSTANCE_ID === '0') {
      return true;
    }
    return false;
  }
}
