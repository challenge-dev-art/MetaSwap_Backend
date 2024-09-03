import { InlineKeyboard } from 'grammy';
import { config } from '../../config';
import { InlineKeyboardButton } from 'grammy/types';

export const createWelcomeKeyboard = () => {
  return InlineKeyboard.from([
    config.BOT_WEBAPP_DEBUG && config.isDev
      ? [
          {
            text: 'Start WebApp',
            web_app: {
              url: config.BOT_WEBAPP,
            },
          },
          {
            text: 'Debug WebApp',
            web_app: {
              url: config.BOT_WEBAPP_DEBUG,
            },
          },
        ]
      : [
          {
            text: 'Start WebApp',
            web_app: {
              url: config.BOT_WEBAPP,
            },
          },
        ],
  ]);
};
