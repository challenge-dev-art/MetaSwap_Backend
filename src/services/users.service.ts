import { Service } from 'typedi';
import { User, Permission, Role } from '@prisma/client';
import { prisma } from '@/prisma-client';
import { DEFAULT_LANGUAGE, languages } from '@/config/languages';
import { breezeid } from 'breezeid';
import * as z from 'zod';
import { DEFAULT_PRICE_CURRENCY, priceCurrencies } from '@/config/price-currencies';
import { AllUserAccount, UserAccount, Account as AccountView } from '@/interfaces/account.interface';
import { FiatCurrency } from '@/interfaces/currencies.interface';
import { currencies } from '@/config/currencies';
import { Container } from 'typedi';
import { CoinbaseService, GetCurrencyPriceResult } from './coinbase.service';
import { logger } from '@/utils/logger';
import { assertNever } from '@/utils/assertNever';
import { config } from '@/config';
import { MailerService } from './mailer.service';
import { createEmailUpdateRequestedMail } from '@/email-templates/email-update-requested.template';
import { createConfirmEmailUpdateMail } from '@/email-templates/confirm-email-update.template';
import { createConfirmEmailLinkingMail } from '@/email-templates/confirm-email-linking.template';
import { createEmailLinkedMail } from '@/email-templates/email-linked.template';
import { createEmailUpdatedMail } from '@/email-templates/email-updated.template';
import { randomInt } from 'crypto';

const EMAIL_UPDATE_REQUEST_TTL = 1000 * 60 * 60 * 24; // 24h

export interface UpsertUserOpts {
  telegramUserId: number;
  firstName: string;
  lastName?: string;
  username?: string;
}

export type UpdatePriceCurrencyResult = { kind: 'OK' } | { kind: 'USER_NOT_FOUND' } | { kind: 'UNSUPPORTED_CURRENCY' };

export type UpdateUserPermissionResult = { kind: 'OK', user: User } | { kind: 'USER_NOT_FOUND' } | { kind: 'INVALID_PERMISSION' };

export type UpdateAdminPermissionResult = { kind: 'OK', user: User } | { kind: 'ADMIN_NOT_FOUND' } | { kind: 'INVALID_PERMISSION' };

export type AddAdminResult = { kind: 'OK', user: User } | { kind: 'USER_NOT_FOUND' };

export type RemoveAdminResult = { kind: 'OK', user: User } | { kind: 'USER_NOT_FOUND' };

export type UpdateLanguageResult = { kind: 'OK' } | { kind: 'USER_NOT_FOUND' } | { kind: 'UNSUPPORTED_LANGUAGE' };

export type UpdateEmailResult = { kind: 'OK' } | { kind: 'USER_NOT_FOUND' } | { kind: 'WRONG_EMAIL_FORMAT' };

export type RequestEmailUpdateResult = { kind: 'OK'; expires: Date } | { kind: 'SAME_EMAIL_UPDATE_ERR' } | { kind: 'WRONG_EMAIL_FORMAT_ERR' };

export type ConfirmEmailUpdateResult = { kind: 'OK' } | { kind: 'WRONG_EMAIL_CONF_CODE_ERR' };

const AccountEmailSchema = z.string().email();

@Service()
export class UsersService {
  public user = prisma.user;

  private _currencyIdToPriceCurrency: Map<string, FiatCurrency>;
  private _coinbase = Container.get(CoinbaseService);
  private mailer = Container.get(MailerService);
  private _tagName = 'UsersService';

  constructor() {
    this._currencyIdToPriceCurrency = new Map(priceCurrencies.map(currency => [currency.id, currency]));
  }

  // TODO: get user list

  public async findUserById(userId: number): Promise<User | null> {
    const findUser = await this.user.findUnique({
      where: {
        id: userId,
      },
    });
    return findUser;
  }

  public async findUserByTgId(telegramUserId: number): Promise<User | null> {
    const findUser = await this.user.findUnique({
      where: {
        telegramUserId: telegramUserId,
      },
    });
    return findUser;
  }

  public async resolveUserId(publicId: string): Promise<number | null> {
    const user = await this.user.findUnique({
      where: {
        publicId,
      },
      select: {
        id: true,
      },
    });
    if (user === null) {
      return null;
    }
    return user.id;
  }

  public async getUserAccount(userId: number): Promise<UserAccount> {
    try {
      const result = await this.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          Asset: true,
          Transaction: true,
          internalTransferUserOutputs: true,
          internalTransferUserInputs: true,
          Autoconvert: true,
          verification: true,
          verificationRequests: true,
          emailUpdateRequests: true,
          deposits: true,
          payouts: true,
          frozenAmounts: true,
          freezeTransactions: true,
          unfreezeTransactions: true,
          Swaps: true
        }
      });
      
      const user = {
        ...result,
        telegramUserId: result.telegramUserId.toString(),
        createdAt: result.createdAt.toISOString(),
        Transaction: result.Transaction.map(transaction => ({
          ...transaction,
          createdAt: transaction.createdAt.toISOString(),
        })),
        internalTransferUserOutputs: result.internalTransferUserOutputs.map(output => ({
          ...output,
          createdAt: output.createdAt.toISOString(),
        })),
        internalTransferUserInputs: result.internalTransferUserInputs.map(output => ({
          ...output,
          createdAt: output.createdAt.toISOString(),
        })),
        Swaps: result.Swaps.map(swap => ({
          ...swap,
          hashId: swap.hashId.toString(),
          createdAt: swap.createdAt.toISOString(),
        })),

      };
      
      return user;
    } catch (error) {
      logger.error(`${this._tagName} failed to get user account: ${error}`);
      throw error;
    }
  }

  public async getAllUser(): Promise<AllUserAccount> {
    try {
      const result = await this.user.findMany({
        include: {
          Asset: true,
          Transaction: true,
          internalTransferUserOutputs: true,
          internalTransferUserInputs: true,
          Autoconvert: true,
          verification: true,
          verificationRequests: true,
          emailUpdateRequests: true,
          deposits: true,
          payouts: true,
          frozenAmounts: true,
          freezeTransactions: true,
          unfreezeTransactions: true,
          Swaps: true
        }
      });
      
      const allUser = result.map(user => ({
        ...user,
        telegramUserId: user.telegramUserId.toString(),
        createdAt: user.createdAt.toISOString(),
        Transaction: user.Transaction.map(transaction => ({
          ...transaction,
          createdAt: transaction.createdAt.toISOString(),
        })),
        internalTransferUserOutputs: user.internalTransferUserOutputs.map(output => ({
          ...output,
          createdAt: output.createdAt.toISOString(),
        })),
        internalTransferUserInputs: user.internalTransferUserInputs.map(output => ({
          ...output,
          createdAt: output.createdAt.toISOString(),
        })),
        Swaps: user.Swaps.map(swap => ({
          ...swap,
          hashId: swap.hashId.toString(),
          createdAt: swap.createdAt.toISOString(),
        })),
      }));

      return {users: allUser};
    
    } catch (error) {
      logger.error(`${this._tagName} failed to get user account: ${error}`);
      throw error;
    }
  }

  public async getAccountView(userId: number): Promise<AccountView> {
    const user = await this.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        publicId: true,
        telegramUsername: true,
        firstName: true,
        lastName: true,
        language: true,
        email: true,
        priceCurrency: true,
        totpSecret: true,
        createdAt: true,
      },
    });

    const priceCurrency = user.priceCurrency
      ? this._currencyIdToPriceCurrency.get(user.priceCurrency) ?? DEFAULT_PRICE_CURRENCY
      : DEFAULT_PRICE_CURRENCY;

    const balance = await this._sumAssets(userId, priceCurrency.id);

    const auth2fa = user.totpSecret !== null;

    const accountView: AccountView = {
      id: user.publicId,
      telegramUsername: user.telegramUsername,
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language ?? DEFAULT_LANGUAGE,
      email: user.email,
      balance: parseFloat(balance.toFixed(2)),
      balanceCurrencyId: priceCurrency.id,
      priceCurrency: priceCurrency,
      auth2fa,
      phoneVerifid: false,
      nameVerified: false,
      addressVerified: false,
      createdAt: user.createdAt.toISOString(),
    };

    return accountView;
  }

  public async upsertUser(opts: UpsertUserOpts): Promise<User> {
    const user = await this.user.findUnique({
      where: {
        telegramUserId: opts.telegramUserId,
      },
    });
    if (user) {
      return user;
    }

    return await this.user.upsert({
      where: { telegramUserId: opts.telegramUserId },
      update: {},
      create: {
        publicId: breezeid(8),
        telegramUserId: opts.telegramUserId,
        firstName: opts.firstName,
        lastName: opts.lastName ?? '',
        telegramUsername: opts.username,
        userRole: 'USER',
        userPermission: 'UNBLOCK',
        adminPermission: 'UNBLOCK',
      },
    });
  }

  public async updateUserPermission(userId: number, permission: Permission): Promise<UpdateUserPermissionResult> {
    try {
      console.log('permission: ', permission);

      if (!Object.values(Permission).includes(permission)) {
        return { kind: 'INVALID_PERMISSION' };
      }

      const findUser =  await this.user.findFirst({
        where: {
          id: userId,
          userRole: 'USER'
        },
      });

      if (!findUser) {
        return { kind: 'USER_NOT_FOUND' };
      }

      const user = await this.user.update({
        where: {
          id: userId,
          userRole: 'USER'
        },
        data: {
          userPermission: permission
        }
      });
  
      return { kind: 'OK', user: user };
    } catch (error) {
      logger.error(`${this._tagName} failed to update user permission: ${error}`);
      throw error;
    } 
  }

  public async updateAdminPermission(userId: number, permission: Permission): Promise<UpdateAdminPermissionResult> {
    
      console.log('permission: ', permission);

      if (!Object.values(Permission).includes(permission)) {
        return { kind: 'INVALID_PERMISSION' };
      }

    try {
      const findAdmin = await this.user.findFirst({
        where: {
          id: userId,
          userRole: 'ADMIN'
        }
      });

      if (!findAdmin) {
        return { kind: 'ADMIN_NOT_FOUND' };
      }

      const admin = await this.user.update({
        where: {
          id: userId,
          userRole: 'ADMIN'
        },
        data: {
          adminPermission: permission
        }
      });
  
      return { kind: 'OK', user: admin };
    } catch (error) {
      logger.error(`${this._tagName} failed to update user permission: ${error}`);
      throw error;
    } 
  }

  public async addAdmin(userId: number): Promise<AddAdminResult> {
      const findUser = await this.user.findFirst({
        where: {
          id: userId,
        }
      });

      if (!findUser) {
        return { kind: 'USER_NOT_FOUND' };
      }

      const adminResult = await this.user.update({
        where: {
          id: userId,
        },
        data: {
          userRole: Role.ADMIN,
          adminPermission: Permission.UNBLOCK,
        }
      });

      return { kind: 'OK', user: adminResult };
  }

  public async removeAdmin(userId: number): Promise<RemoveAdminResult> {
    const findUser = await this.user.findFirst({
      where: {
        id: userId,
      }
    });

    if (!findUser) {
      return { kind: 'USER_NOT_FOUND' };
    }

    const adminResult = await this.user.update({
      where: {
        id: userId,
      },
      data: {
        userRole: Role.USER,
        adminPermission: Permission.BLOCK,
      }
    });

    return { kind: 'OK', user: adminResult };
}

  public async updatePriceCurrency(userId: number, currency: string): Promise<UpdatePriceCurrencyResult> {
    const currencyIndex = priceCurrencies.findIndex(({ id }) => id === currency);
    if (currencyIndex === -1) {
      return { kind: 'UNSUPPORTED_CURRENCY' };
    }
    const updateResult = await this.user.updateMany({
      where: { id: userId },
      data: {
        priceCurrency: currency,
      },
    });

    if (updateResult.count === 0) {
      return { kind: 'USER_NOT_FOUND' };
    }

    return { kind: 'OK' };
  }

  public async updateLanguage(userId: number, language: string): Promise<UpdateLanguageResult> {
    const languageIndex = languages.findIndex(({ code }) => code === language);
    if (languageIndex === -1) {
      return { kind: 'UNSUPPORTED_LANGUAGE' };
    }

    const updateResult = await this.user.updateMany({
      where: { id: userId },
      data: {
        language: language,
      },
    });

    if (updateResult.count === 0) {
      return { kind: 'USER_NOT_FOUND' };
    }

    return { kind: 'OK' };
  }

  public async updateEmail(userId: number, email: string): Promise<UpdateEmailResult> {
    const emailParsingResult = AccountEmailSchema.safeParse(email);

    if (!emailParsingResult.success) {
      return { kind: 'WRONG_EMAIL_FORMAT' };
    }

    const updateResult = await this.user.updateMany({
      where: { id: userId },
      data: {
        email: email,
      },
    });

    if (updateResult.count === 0) {
      return { kind: 'USER_NOT_FOUND' };
    }

    return { kind: 'OK' };
  }

  public async requestEmailUpdate(userId: number, nextEmail: string): Promise<RequestEmailUpdateResult> {
    const nextEmailParsingResult = AccountEmailSchema.safeParse(nextEmail);
    if (!nextEmailParsingResult.success) {
      return { kind: 'WRONG_EMAIL_FORMAT_ERR' };
    }

    const user = await this.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        firstName: true,
        email: true,
      },
    });

    if (user.email === nextEmail) {
      return { kind: 'SAME_EMAIL_UPDATE_ERR' };
    }

    const secretCode = await createEmailUpdateSecret();
    const expires = new Date(Date.now() + EMAIL_UPDATE_REQUEST_TTL);

    await prisma.emailUpdateRequest.create({
      data: {
        userId,
        email: nextEmail,
        secretCode,
        expires,
      },
    });

    if (user.email) {
      const emailUpdateRequestedMail = createEmailUpdateRequestedMail({
        userName: user.firstName,
      });
      const confirmEmailUpdateMail = createConfirmEmailUpdateMail({
        userName: user.firstName,
        confirmationCode: secretCode,
      });
      await Promise.all([
        this.mailer.sendMail({
          from: config.MAIL_FROM,
          to: user.email,
          subject: emailUpdateRequestedMail.subject,
          text: emailUpdateRequestedMail.text,
        }),
        this.mailer.sendMail({
          from: config.MAIL_FROM,
          to: nextEmail,
          subject: confirmEmailUpdateMail.subject,
          text: confirmEmailUpdateMail.text,
        }),
      ]);
    } else {
      const confirmEmailLinkingMail = createConfirmEmailLinkingMail({
        userName: user.firstName,
        confirmationCode: secretCode,
      });
      await this.mailer.sendMail({
        from: config.MAIL_FROM,
        to: nextEmail,
        subject: confirmEmailLinkingMail.subject,
        text: confirmEmailLinkingMail.text,
      });
    }

    return { kind: 'OK', expires };
  }

  public async confirmEmailUpdate(userId: number, code: string): Promise<ConfirmEmailUpdateResult> {
    const request = await prisma.emailUpdateRequest.findFirst({
      where: {
        userId,
        secretCode: code,
        expires: { gt: new Date() },
        finalized: false,
      },
      select: {
        id: true,
        email: true,
        user: {
          select: {
            firstName: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      return { kind: 'WRONG_EMAIL_CONF_CODE_ERR' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email: request.email,
        },
        select: { id: true },
      }),
      prisma.emailUpdateRequest.update({
        where: {
          id: request.id,
        },
        data: {
          finalized: true,
        },
        select: { id: true },
      }),
    ]);

    if (request.user.email) {
      const emailUpdated = createEmailUpdatedMail({
        userName: request.user.firstName,
      });
      await this.mailer.sendMail({
        from: config.MAIL_FROM,
        to: request.email,
        subject: emailUpdated.subject,
        text: emailUpdated.text,
      });
    } else {
      const emailLinkedMail = createEmailLinkedMail({
        userName: request.user.firstName,
        email: request.email,
      });
      await this.mailer.sendMail({
        from: config.MAIL_FROM,
        to: request.email,
        subject: emailLinkedMail.subject,
        text: emailLinkedMail.text,
      });
    }

    return { kind: 'OK' };
  }

  private async _sumAssets(userId: number, priceCurrency: string): Promise<number> {
    const assets = await prisma.asset.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        currencyId: true,
        amount: true,
      },
    });

    if (assets.length === 0) {
      return 0;
    }

    let total = -1;
    for (const asset of assets) {
      const assetCurrency = currencies.find(currency => currency.id === asset.currencyId);
      if (!assetCurrency) {
        continue;
      }

      let currencyPrice = -1;
      let currencyPriceResult: GetCurrencyPriceResult;
      try {
        currencyPriceResult =
          assetCurrency.type === 'CRYPTO'
            ? await this._coinbase.getCurrencyPriceByTypeCached(assetCurrency.id, priceCurrency)
            : await this._coinbase.getCurrencyPriceCached(assetCurrency.code, priceCurrency);
      } catch (error) {
        logger.error(`[${this._tagName}] failed to fetch currency rate ${assetCurrency.id}-${priceCurrency}`);
        total = -1;
        break;
      }

      switch (currencyPriceResult.kind) {
        case 'NOT_FOUND_ERR': {
          currencyPrice = -1;
          break;
        }
        case 'OK': {
          currencyPrice = currencyPriceResult.price;
          break;
        }
        default: {
          assertNever(currencyPriceResult);
        }
      }

      if (currencyPrice === -1) {
        total = -1;
        break;
      } else {
        total += asset.amount * currencyPrice;
      }
    }

    return total;
  }
}

function createEmailUpdateSecret(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    randomInt(1000000, (error, n) => {
      if (error) {
        reject(error);
        return;
      }
      const secret = n.toString().padStart(6, '0');
      resolve(secret);
    });
  });
}
