import { isUserHasId } from 'grammy-guard';
import { config } from '../../config';

export const isAdmin = isUserHasId(...config.BOT_ADMINS);
