import { Composer } from 'grammy';
import type { Context } from '../context';
import { logHandle } from '../helpers/logging';

const composer = new Composer<Context>();

const feature = composer.chatType('private');

feature.on('message', logHandle('unhandled-message'), ctx => {
  return ctx.reply('Unrecognized command. Try /start');
});

feature.on('callback_query', logHandle('unhandled-callback-query'), ctx => {
  return ctx.answerCallbackQuery();
});

export { composer as unhandledFeature };
