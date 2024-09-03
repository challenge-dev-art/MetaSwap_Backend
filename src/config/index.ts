import * as dotenv from 'dotenv';
import z from 'zod';
import { parseEnv, port } from 'znv';
import { API_CONSTANTS } from 'grammy';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const createConfigFromEnvironment = (environment: NodeJS.ProcessEnv) => {
  const config = parseEnv(environment, {
    NODE_ENV: z.enum(['development', 'production']),
    CREDENTIALS: z.boolean(),
    PORT: port(),
    SECRET_KEY: z.string(),
    LOG_FORMAT: z.string(),
    LOG_DIR: z.string(),
    ORIGIN: z.string(),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']).default('info'),
    PUBLIC_API_URL: z.string().url(),
    BOT_TOKEN: z.string(),
    BOT_WEBHOOK: z.string().default(''),
    BOT_SERVER_HOST: z.string().default('0.0.0.0'),
    BOT_SERVER_PORT: port().default(80),
    BOT_ALLOWED_UPDATES: z.array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES)).default([]),
    BOT_ADMINS: z.array(z.number()).default([]),
    BOT_WEBAPP: z.string(),
    BOT_WEBAPP_DEBUG: z.optional(z.string()),
    BOT_USERNAME: z.string(),
    CALYPSO_KEY: z.string(),
    CALYPSO_SECRET: z.string(),
    CALYPSO_ACCOUNT: z.string(),
    COINBASE_API_HOST: z.string().optional(),
    MAIL_SMPT_URL: z.string(),
    MAIL_FROM: z.string(),
  });

  return {
    ...config,
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  };
};

export type Config = ReturnType<typeof createConfigFromEnvironment>;

export const config = createConfigFromEnvironment(process.env);

export const DEFAULT_FIAT_DECIMALS = 2;
