import { BotCommand } from '@grammyjs/types';
import { CommandContext } from 'grammy';
import { config } from '../../../config';
import type { Context } from '../../context';

function getPrivateChatCommands(): BotCommand[] {
  return [
    {
      command: 'start',
      description: 'Start the bot',
    },
    {
      command: 'cancel',
      description: 'Cancel the conversation',
    },
  ];
}

function getPrivateChatAdminCommands(): BotCommand[] {
  return [
    {
      command: 'setcommands',
      description: 'Set bot commands',
    },
  ];
}

export async function setCommandsHandler(ctx: CommandContext<Context>) {
  // set private chat commands
  await ctx.api.setMyCommands([...getPrivateChatCommands()], {
    scope: {
      type: 'all_private_chats',
    },
  });

  // set private chat commands for owner
  await ctx.api.setMyCommands([...getPrivateChatCommands(), ...getPrivateChatAdminCommands()], {
    scope: {
      type: 'chat',
      chat_id: Number(config.BOT_ADMINS),
    },
  });

  return ctx.reply('Commands updated.');
}
