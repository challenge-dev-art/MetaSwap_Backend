import { Update, UserFromGetMe } from '@grammyjs/types';
import { Context as DefaultContext, SessionFlavor, type Api } from 'grammy';
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action';
import type { HydrateFlavor } from '@grammyjs/hydrate';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';
import type { ConversationFlavor } from '@grammyjs/conversations';
import { Logger } from 'winston';
import { UsersService } from '@/services/users.service';

export type SessionData = {
  // field?: string;
};

type ExtendedContextFlavor = {
  logger: Logger;
  usersService: UsersService;
};

export type Context = ParseModeFlavor<
  HydrateFlavor<DefaultContext & ExtendedContextFlavor & SessionFlavor<SessionData> & ConversationFlavor & AutoChatActionFlavor>
>;

interface Dependencies {
  logger: Logger;
  usersService: UsersService;
}

export function createContextConstructor({ logger, usersService }: Dependencies) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    logger: Logger;
    usersService: UsersService;

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me);

      this.logger = logger.child({
        update_id: this.update.update_id,
      });
      this.usersService = usersService;
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context;
}
