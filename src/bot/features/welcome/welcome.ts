import { Composer } from 'grammy';
import type { Context } from '../../context';
import { logHandle } from '../../helpers/logging';
import { createWelcomeKeyboard } from '../../keyboards/welcome';
import { config } from '@/config';

const composer = new Composer<Context>();

const feature = composer.chatType('private');

feature.command('start', logHandle('command-start'), async ctx => {
  try {
    await ctx.usersService.upsertUser({
      telegramUserId: ctx.from.id,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      username: ctx.from.username,
    });
  } catch (error) {
    ctx.logger.error(`failed to upsert user: ${error}`);
    await ctx.reply('Internal server error. Try /start again.');
    return;
  }
  return ctx.reply(`TODO: welcome message\n\nWeb App: ${config.BOT_WEBAPP}`, {
    reply_markup: createWelcomeKeyboard(),
  });
});

export { composer as welcomeFeature };
