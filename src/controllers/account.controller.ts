import { NextFunction, Response } from 'express';
import {
  ConfirmEmailUpdateErrorResponse,
  RequestEmailUpdateErrorResponse,
  RequestEmailUpdateSuccessResponse,
  UpdateAccountCurrencyErrorResponse,
  UpdateAccountEmailErrorResponse,
} from '@interfaces/account.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { UsersService } from '@/services/users.service';
import { assertNever } from '@/utils/assertNever';
import { ResponseSuccess } from '@/interfaces/common.interface';
import { ConfirmEmailUpdateRequestDto, RequestEmailUpdateRequestDto, UpdateAccountCurrencyDto, UpdateAccountEmailDto } from '@/dtos/account.dto';

export class AccountController {
  public users = Container.get(UsersService);

  public async getUser(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const accountView = await this.users.getAccountView(req.user.id);

    res.json(accountView);
  }

  public async updatePriceCurrency(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: 'authentification required',
      });
      return;
    }

    if (req.body instanceof UpdateAccountCurrencyDto === false) {
      throw new Error('UpdateAccountCurrencyDto required');
    }

    const updatePriceCurrencyResult = await this.users.updatePriceCurrency(req.user.id, req.body.currencyId);
    switch (updatePriceCurrencyResult.kind) {
      case 'OK': {
        res.json({ kind: 'OK' } satisfies ResponseSuccess);
        break;
      }
      case 'UNSUPPORTED_CURRENCY': {
        res.status(400).json({ kind: 'UNSUPPORTED_CURRENCY_ERR', message: 'currency is not supported' } satisfies UpdateAccountCurrencyErrorResponse);
        break;
      }
      case 'USER_NOT_FOUND': {
        throw new Error('user not found');
      }
      default: {
        assertNever(updatePriceCurrencyResult);
      }
    }
  }

  public async updateLanguage(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: 'authentification required',
      });
      return;
    }

    const updateLanguageResult = await this.users.updateLanguage(req.user.id, req.body.language);
    switch (updateLanguageResult.kind) {
      case 'OK': {
        res.json({ kind: 'OK' } satisfies ResponseSuccess);
        break;
      }
      case 'UNSUPPORTED_LANGUAGE': {
        res.status(400).json({ kind: 'UNSUPPORTED_CURRENCY_ERR', message: 'unsupported currency' } satisfies UpdateAccountCurrencyErrorResponse);
        break;
      }
      case 'USER_NOT_FOUND': {
        throw new Error('user not found');
      }
      default: {
        assertNever(updateLanguageResult);
      }
    }
  }

  public async updateEmail(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: 'authentification required',
      });
      return;
    }

    let updateEmailRequest: UpdateAccountEmailDto;
    if (req.body instanceof UpdateAccountEmailDto) {
      updateEmailRequest = req.body;
    } else {
      throw new Error('UpdateAccountEmailDto required');
    }

    const updateEmailResult = await this.users.updateEmail(req.user.id, updateEmailRequest.email);
    switch (updateEmailResult.kind) {
      case 'WRONG_EMAIL_FORMAT': {
        res.status(400).json({ kind: 'WRONG_EMAIL_FORMAT_ERR', message: 'failed to validate email' } satisfies UpdateAccountEmailErrorResponse);
        break;
      }
      case 'USER_NOT_FOUND': {
        throw new Error('user not found');
      }
      case 'OK': {
        res.status(200).json({ kind: 'OK' } satisfies ResponseSuccess);
        break;
      }
      default: {
        assertNever(updateEmailResult);
      }
    }
  }

  public async requestEmailUpdate(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: 'authentification required',
      });
      return;
    }

    let requestEmailUpdateRequest: RequestEmailUpdateRequestDto;
    if (req.body instanceof RequestEmailUpdateRequestDto) {
      requestEmailUpdateRequest = req.body;
    } else {
      throw new Error('RequestEmailUpdateRequestDto required');
    }

    const result = await this.users.requestEmailUpdate(req.user.id, requestEmailUpdateRequest.email);
    switch (result.kind) {
      case 'WRONG_EMAIL_FORMAT_ERR': {
        res.status(400).json({
          kind: 'WRONG_EMAIL_FORMAT_ERR',
          message: 'wrong email format',
        } satisfies RequestEmailUpdateErrorResponse);
        break;
      }
      case 'SAME_EMAIL_UPDATE_ERR': {
        res.status(400).json({
          kind: 'SAME_EMAIL_UPDATE_ERR',
          message: 'same email is specified for update',
        } satisfies RequestEmailUpdateErrorResponse);
        break;
      }
      case 'OK': {
        res.json({ kind: 'OK', expires: result.expires.toISOString() } satisfies RequestEmailUpdateSuccessResponse);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  }

  public async confirmEmailUpdate(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: 'authentification required',
      });
      return;
    }

    let confirmEmailUpdateRequest: ConfirmEmailUpdateRequestDto;
    if (req.body instanceof ConfirmEmailUpdateRequestDto) {
      confirmEmailUpdateRequest = req.body;
    } else {
      throw new Error('ConfirmEmailUpdateRequestDto required');
    }

    const result = await this.users.confirmEmailUpdate(req.user.id, confirmEmailUpdateRequest.code);
    switch (result.kind) {
      case 'WRONG_EMAIL_CONF_CODE_ERR': {
        res.status(400).json({
          kind: 'WRONG_EMAIL_CONF_CODE_ERR',
          message: 'wrong email confirmation code',
        } satisfies ConfirmEmailUpdateErrorResponse);
        break;
      }
      case 'OK': {
        res.json({ kind: 'OK' } satisfies ResponseSuccess);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  }
}
