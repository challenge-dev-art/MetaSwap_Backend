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
import { ConfirmEmailUpdateRequestDto, RequestEmailUpdateRequestDto, UpdateAccountCurrencyDto, UpdateAccountEmailDto, UpdateUserPermissionDto, AddAdminDto } from '@/dtos/account.dto';

export class AccountController {
  public users = Container.get(UsersService);

  public async getUserAccount(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const userId = Number(req.query.userId);
    const accountView = await this.users.getUserAccount(userId);
    res.json(accountView);
  }

  public async getAllUser(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const allUser = await this.users.getAllUser();
    res.json(allUser);
  }

  public async updateUserPermission(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (req.body instanceof UpdateUserPermissionDto === false) {
      throw new Error('UpdateUserPermissionDto required');
    }

    const {userId, permission} = req.body;
    console.log('userId: ', userId);
    console.log('permission: ', permission);
    const updateUserPermissionResult = await this.users.updateUserPermission(userId, permission);
    console.log('updateUserPermissionResult: ', updateUserPermissionResult);
    switch (updateUserPermissionResult.kind) {
      case 'OK': {
        const userResult = {
          ...updateUserPermissionResult.user,
          telegramUserId: updateUserPermissionResult.user.telegramUserId.toString(),
          createdAt: updateUserPermissionResult.user.createdAt.toISOString()
        }
        res.json({
          kind: 'OK',
          message: 'user permission updated',
          user: userResult,
        });
        break;
      }
      case 'USER_NOT_FOUND': {
        res.status(401).json({
          kind: updateUserPermissionResult.kind,
          message: 'user is not found',
        });
        break;
      }
      case 'INVALID_PERMISSION': {
        res.status(401).json({
          kind: updateUserPermissionResult.kind,
          message: 'invalid permission',
        });
        break;
      }
      default: {
        assertNever(updateUserPermissionResult);
      }
    }
  }

  public async updateAdminPermission(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (req.body instanceof UpdateUserPermissionDto === false) {
      throw new Error('UpdateUserPermissionDto required');
    }

    const {userId, permission} = req.body;
    console.log('userId: ', userId);
    console.log('permission: ', permission);
    const updateAdminPermissionResult = await this.users.updateAdminPermission(userId, permission);
    console.log('updateAdminPermissionResult: ', updateAdminPermissionResult);
    switch (updateAdminPermissionResult.kind) {
      case 'OK': {
        const userResult = {
          ...updateAdminPermissionResult.user,
          telegramUserId: updateAdminPermissionResult.user.telegramUserId.toString(),
          createdAt: updateAdminPermissionResult.user.createdAt.toISOString()
        }
        res.json({
          kind: 'OK',
          message: 'admin permission updated',
          user: userResult,
        });
        break;
      }
      case 'ADMIN_NOT_FOUND': {
        res.status(401).json({
          kind: "ADMIN_NOT_FOUND",
          message: 'user is not admin',
        });
        break;
      }
      case 'INVALID_PERMISSION': {
        res.status(401).json({
          kind: updateAdminPermissionResult.kind,
          message: 'invalid permission',
        });
        break;
      }
      default: {
        assertNever(updateAdminPermissionResult);
      }
    }
  }

  public async addAdmin(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (req.body instanceof AddAdminDto === false) {
      throw new Error('AddAdminDto required');
    }

    const {userId} = req.body;
    console.log('userId: ', userId);
    const addAdminResult = await this.users.addAdmin(userId);
    console.log('addAdminResult: ', addAdminResult);
    switch (addAdminResult.kind) {
      case 'OK': {
        const adminResult = {
          ...addAdminResult.user,
          telegramUserId: addAdminResult.user.telegramUserId.toString(),
          createdAt: addAdminResult.user.createdAt.toISOString()
        }
        res.json({
          kind: 'OK',
          message: 'add admin success',
          user: adminResult,
        });
        break;
      }
      case 'USER_NOT_FOUND': {
        res.status(401).json({
          kind: addAdminResult.kind,
          message: 'user not found',
        });
        break;
      }
      default: {
        assertNever(addAdminResult);
      }
    }
  }

  public async removeAdmin(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    if (req.body instanceof AddAdminDto === false) {
      throw new Error('AddAdminDto required');
    }

    const {userId} = req.body;
    console.log('userId: ', userId);
    const removeAdminResult = await this.users.removeAdmin(userId);
    console.log('removeAdminResult: ', removeAdminResult);
    switch (removeAdminResult.kind) {
      case 'OK': {
        const adminResult = {
          ...removeAdminResult.user,
          telegramUserId: removeAdminResult.user.telegramUserId.toString(),
          createdAt: removeAdminResult.user.createdAt.toISOString()
        }
        res.json({
          kind: 'OK',
          message: 'remove admin success',
          user: adminResult,
        });
        break;
      }
      case 'USER_NOT_FOUND': {
        res.status(401).json({
          kind: removeAdminResult.kind,
          message: 'user not found',
        });
        break;
      }
      default: {
        assertNever(removeAdminResult);
      }
    }
  }

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
