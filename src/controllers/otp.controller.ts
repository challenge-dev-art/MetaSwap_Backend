import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { OtpService } from '@/services/otp.service';
import { DisableOtpRequestDto, EnableOtpRequestDto, OtpAuthRequestDto } from '@/dtos/otp.dto';
import { assertNever } from '@/utils/assertNever';
import { ResponseSuccess } from '@/interfaces/common.interface';
import { EnableOtpErrorResponse, EnableOtpSuccessResponse, OtpAuthSuccessResponse } from '@/interfaces/otp.interface';

export class OtpController {
  public otp = Container.get(OtpService);

  public async getOtp(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const otp = await this.otp.getOtp(req.user.id);
    res.json(otp);
  }

  public async createSecret(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const secret = await this.otp.createSecret(req.user.id);
    res.json(secret);
  }

  public async enable(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    console.log("body: ", body);
    if (body instanceof EnableOtpRequestDto === false) {
      throw new Error('body: EnableOtpRequestDto required');
    }

    const result = await this.otp.enable({
      userId: req.user.id,
      secret: body.secret,
      passcode: body.passcode,
    });

    switch (result.kind) {
      case 'WRONG_OTP_PASSCODE_ERR': {
        res.status(400).json({
          kind: 'WRONG_OTP_PASSCODE_ERR',
          message: 'wront otp password',
        } satisfies EnableOtpErrorResponse);
        break;
      }
      case 'DISABLED_OTP_REQUIRED_ERR': {
        res.status(400).json({
          kind: 'DISABLED_OTP_REQUIRED_ERR',
          message: 'disabled otp required',
        } satisfies EnableOtpErrorResponse);
        break;
      }
      case 'OK': {
        res.setHeader('Set-Cookie', [result.cookie]);
        res.json({ kind: 'OK', session: result.session } satisfies EnableOtpSuccessResponse);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  }

  public async disable(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    if (body instanceof DisableOtpRequestDto === false) {
      throw new Error('body: DisableOtpRequestDto required');
    }

    const result = await this.otp.disable({
      userId: req.user.id,
      passcode: body.passcode,
    });

    switch (result.kind) {
      case 'WRONG_OTP_PASSCODE_ERR': {
        res.status(400).json({
          kind: 'WRONG_OTP_PASSCODE_ERR',
          message: 'wront otp password',
        } satisfies EnableOtpErrorResponse);
        break;
      }
      case 'ENABLED_OTP_REQUIRED_ERR': {
        res.status(400).json({
          kind: 'DISABLED_OTP_REQUIRED_ERR',
          message: 'disabled otp required',
        } satisfies EnableOtpErrorResponse);
        break;
      }
      case 'OK': {
        res.setHeader('Set-Cookie', [result.cookie]);
        res.json({ kind: 'OK' } satisfies ResponseSuccess);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  }

  public async auth(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    if (body instanceof OtpAuthRequestDto === false) {
      throw new Error('body: OtpAuthRequestDto required');
    }

    const result = await this.otp.auth({
      userId: req.user.id,
      passcode: body.passcode,
    });

    switch (result.kind) {
      case 'WRONG_OTP_PASSCODE_ERR': {
        res.status(400).json({
          kind: 'WRONG_OTP_PASSCODE_ERR',
          message: 'wront otp password',
        } satisfies EnableOtpErrorResponse);
        break;
      }
      case 'ENABLED_OTP_REQUIRED_ERR': {
        res.status(400).json({
          kind: 'DISABLED_OTP_REQUIRED_ERR',
          message: 'disabled otp required',
        } satisfies EnableOtpErrorResponse);
        break;
      }
      case 'OK': {
        res.setHeader('Set-Cookie', [result.cookie]);
        res.json({ kind: 'OK', session: result.session } satisfies OtpAuthSuccessResponse);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  }

  public async logout(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const cookie = this.otp.logout();
    res.setHeader('Set-Cookie', [cookie]);
    res.json({ kind: 'OK' } satisfies ResponseSuccess);
  }
}
