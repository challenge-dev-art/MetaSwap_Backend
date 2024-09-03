import { Otp, OtpSecret } from '@/interfaces/otp.interface';
import { prisma } from '@/prisma-client';
import { Service } from 'typedi';
import { Totp } from 'time2fa';
import * as qrcode from 'qrcode';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { config } from '@/config';
import { sign } from 'jsonwebtoken';

const TOTP_ISSUER = 'MetaSwap';

const OTP_SESSION_TTL = 60 * 60 * 24; // 24h

export interface EnableOpts {
  userId: number;
  secret: string;
  passcode: string;
}

export type EnableResult =
  | {
      kind: 'OK';
      cookie: string;
      session: string;
    }
  | {
      kind: 'WRONG_OTP_PASSCODE_ERR';
    }
  | {
      kind: 'DISABLED_OTP_REQUIRED_ERR';
    };

export interface DisableOpts {
  userId: number;
  passcode: string;
}

export type DisableResult =
  | {
      kind: 'OK';
      cookie: string;
    }
  | {
      kind: 'WRONG_OTP_PASSCODE_ERR';
    }
  | {
      kind: 'ENABLED_OTP_REQUIRED_ERR';
    };

export interface AuthOpts {
  userId: number;
  passcode: string;
}

export type AuthResult =
  | {
      kind: 'OK';
      cookie: string;
      session: string;
    }
  | {
      kind: 'WRONG_OTP_PASSCODE_ERR';
    }
  | {
      kind: 'ENABLED_OTP_REQUIRED_ERR';
    };

@Service()
export class OtpService {
  public async getOtp(userId: number): Promise<Otp> {
    const userCount = await prisma.user.count({
      where: {
        id: userId,
        totpSecret: { not: null },
      },
    });

    const otpEnabled = userCount > 0;

    return { enabled: otpEnabled } satisfies Otp;
  }

  public async createSecret(userId: number): Promise<OtpSecret> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        publicId: true,
      },
    });

    const key = Totp.generateKey({ issuer: TOTP_ISSUER, user: user.publicId });

    const qr = await qrcode.toDataURL(key.url, {
      margin: 0,
      color: {
        light: '#00000000',
      },
    });

    return { secret: key.secret, url: key.url, qrUrl: qr } satisfies OtpSecret;
  }

  public async enable(opts: EnableOpts): Promise<EnableResult> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: opts.userId,
      },
      select: {
        totpSecret: true,
      },
    });
    if (user.totpSecret !== null) {
      return { kind: 'DISABLED_OTP_REQUIRED_ERR' };
    }

    if (!validatePasscode(opts.passcode)) {
      return { kind: 'WRONG_OTP_PASSCODE_ERR' };
    }
    const valid = Totp.validate({ passcode: opts.passcode, secret: opts.secret });
    if (!valid) {
      return { kind: 'WRONG_OTP_PASSCODE_ERR' };
    }

    await prisma.user.update({
      where: {
        id: opts.userId,
      },
      data: {
        totpSecret: opts.secret,
      },
    });

    const token = createOtpToken(opts.userId);
    const cookie = createOtpCookie(token);

    return { kind: 'OK', cookie, session: token.token };
  }

  public async disable(opts: DisableOpts): Promise<DisableResult> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: opts.userId,
      },
      select: {
        totpSecret: true,
      },
    });
    if (user.totpSecret === null) {
      return { kind: 'ENABLED_OTP_REQUIRED_ERR' };
    }

    if (!validatePasscode(opts.passcode)) {
      return { kind: 'WRONG_OTP_PASSCODE_ERR' };
    }
    const valid = Totp.validate({ passcode: opts.passcode, secret: user.totpSecret });
    if (!valid) {
      return { kind: 'WRONG_OTP_PASSCODE_ERR' };
    }

    await prisma.user.update({
      where: {
        id: opts.userId,
      },
      data: {
        totpSecret: null,
      },
    });

    const cookie = 'Otp-Authorization=; Max-age=0; Path=/';

    return { kind: 'OK', cookie };
  }

  public async auth(opts: AuthOpts): Promise<AuthResult> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: opts.userId,
      },
      select: {
        totpSecret: true,
      },
    });
    if (user.totpSecret === null) {
      return { kind: 'ENABLED_OTP_REQUIRED_ERR' };
    }

    if (!validatePasscode(opts.passcode)) {
      return { kind: 'WRONG_OTP_PASSCODE_ERR' };
    }
    const valid = Totp.validate({ passcode: opts.passcode, secret: user.totpSecret });
    if (!valid) {
      return { kind: 'WRONG_OTP_PASSCODE_ERR' };
    }

    const token = createOtpToken(opts.userId);
    const cookie = createOtpCookie(token);

    return { kind: 'OK', cookie, session: token.token };
  }

  public logout(): string {
    const cookie = 'Otp-Authorization=; Max-age=0; Path=/';
    return cookie;
  }
}

function validatePasscode(passcode: string): boolean {
  const valid = /^\d{6}$/.test(passcode);
  return valid;
}

function createOtpToken(userId: number): TokenData {
  const dataStoredInToken: DataStoredInToken = { id: userId, otp: true };
  const secretKey: string = config.SECRET_KEY;
  const expiresIn: number = OTP_SESSION_TTL;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
}

function createOtpCookie(tokenData: TokenData): string {
  return `Otp-Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; Secure; SameSite=${config.isDev ? 'None' : 'Lax'}`;
}
