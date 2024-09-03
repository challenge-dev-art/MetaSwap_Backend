import { autoChatAction } from '@grammyjs/auto-chat-action';
import { hydrate } from '@grammyjs/hydrate';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { conversations } from '@grammyjs/conversations';
import { BotConfig, StorageAdapter, Bot as TelegramBot, session } from 'grammy';
import { Context, SessionData, createContextConstructor } from './context';
import { adminFeature, unhandledFeature, welcomeFeature } from './features';
import { errorHandler } from './handlers';
import { updateLogger } from './middlewares';
import { config } from '../config';
import { logger } from '@/utils/logger';
import Container from 'typedi';
import { UsersService } from '@/services/users.service';

type Options = {
  sessionStorage?: StorageAdapter<SessionData>;
  config?: Omit<BotConfig<Context>, 'ContextConstructor'>;
};

export function createBot(token: string, options: Options = {}) {
  const { sessionStorage } = options;
  const usersService = Container.get(UsersService);

  const bot = new TelegramBot(token, {
    ...options.config,
    ContextConstructor: createContextConstructor({
      logger,
      usersService,
    }),
  });
  const protectedBot = bot.errorBoundary(errorHandler);

  // Middlewares
  bot.api.config.use(parseMode('HTML'));

  if (config.isDev) {
    protectedBot.use(updateLogger());
  }

  protectedBot.use(autoChatAction(bot.api));
  protectedBot.use(hydrateReply);
  protectedBot.use(hydrate());
  protectedBot.use(
    session({
      initial: () => ({}),
      storage: sessionStorage,
    }),
  );

  // Conversations
  protectedBot.use(conversations());
  protectedBot.command('cancel', async ctx => {
    await ctx.conversation.exit();
    await ctx.reply('Canceled.');
  });

  // Handlers
  protectedBot.use(welcomeFeature);
  protectedBot.use(adminFeature);

  // must be the last handler
  protectedBot.use(unhandledFeature);

  return bot;
}

export type Bot = ReturnType<typeof createBot>;
