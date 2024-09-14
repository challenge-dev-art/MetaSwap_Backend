import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { validateWebAppData } from '@grammyjs/validator';
import { logger } from '@/utils/logger';
import { parseWebUser } from '@/utils/webAppUser';
import Container from 'typedi';
import { UsersService } from '@/services/users.service';
import { config } from '@/config';
import { verify } from 'jsonwebtoken';
import { AuthOtpRequiredErrorResponse } from '@/interfaces/common.interface';

const DEV_TG_ID_PREFIX = 'tg:';

const getAuthToken = (req: Request) => {
  const header = req.header('X-Auth-Token');
  console.log("header: ", header);
  if (header) {
    return header;
  }

  return null;
};

const getOtpAuthToken = (req: Request) => {
  const header = req.header('X-Otp-Auth-Token');
  if (header) {
    return header;
  }

  const coockie = req.cookies['Otp-Authorization'];
  if (coockie) return coockie;

  return null;
};
export const AuthMiddleware = () => {
  const userService = Container.get(UsersService);

  return [
    async (req: RequestWithUser, res: Response, next: NextFunction) => {

      const authToken = getAuthToken(req);

      if (config.NODE_ENV === 'development' && !!authToken && authToken.startsWith(DEV_TG_ID_PREFIX)) {
        const tgIdRaw = authToken.slice(DEV_TG_ID_PREFIX.length);
        const tgId = parseInt(tgIdRaw, 10);
        if (isNaN(tgId)) {
          next(new HttpException(401, 'user not found'));
          return;
        }
        logger.warn(`auth token missing; use dev user ${tgId}`);
        const findUser = await userService.findUserByTgId(tgId);

        if (findUser === null) {
          next(new HttpException(401, 'user not found'));
          return;
        } else {
          req.user = findUser;
          console.log("user: ", req.user);
          next();
          return;
        }
      }

      if (authToken === null) {
        next(new HttpException(401, 'authentication token missing'));
        return;
      }

      const initData = new URLSearchParams(authToken);
      const initDataValid = validateWebAppData(config.BOT_TOKEN, initData);
      console.log("initDataValid: ", initDataValid);
      console.log("initData: ", initData);
      if (!initDataValid) {
        next(new HttpException(401, 'wrong authentication token'));
        return;
      }

      const webAppUserData = initData.get('user');
      if (webAppUserData === null) {
        logger.error('failed to read user from initData');
        next(new HttpException(500, 'internal server error'));
        return;
      }

      const webAppUser = parseWebUser(webAppUserData);
      console.log("webAppUser: ", webAppUser);
      if (webAppUser === null) {
        logger.error('failed to parse WebAppUser');
        next(new HttpException(500, 'internal server error'));
        return;
      }

      let findUser: Awaited<ReturnType<UsersService['upsertUser']>>;
      try {
        findUser = await userService.upsertUser({
          telegramUserId: webAppUser.id,
          firstName: webAppUser.first_name,
          lastName: webAppUser.last_name,
          username: webAppUser.username,
        });
      } catch (error) {
        console.error('failed to upsert user', webAppUserData, error);
        throw error;
      }

      req.user = findUser;
      next();
    },
    (req: RequestWithUser, res: Response, next: NextFunction) => {
      console.log("req: ", req.user);
      if (!req.user.totpSecret) {
        next();
        return;
      }
      console.log("isOtpAuthorized: ", isOtpAuthorized(req));
      if (!isOtpAuthorized(req)) {
        if (req.method === 'POST' && req.path === '/otp/auth') {
          next();
        } else {
          res.status(401).json({ kind: 'AUTH_OTP_REQUIRED_ERR', message: 'otp auth required' } satisfies AuthOtpRequiredErrorResponse);
        }
        return;
      }

      next();
    },
  ];
};

function isOtpAuthorized(req: RequestWithUser) {
  const authToken = getOtpAuthToken(req);
  console.log("authToken: ", authToken);
  if (!authToken) {
    return false;
  }

  let payload: DataStoredInToken;
  try {
    payload = verify(authToken, config.SECRET_KEY) as DataStoredInToken;
    console.log("payload: ", payload);
  } catch (_error) {
    return false;
  }

  if (payload.id !== req.user.id) {
    return false;
  }

  if (!payload.otp) {
    return false;
  }

  return true;
}
