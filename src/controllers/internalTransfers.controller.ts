import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { UsersService } from '@/services/users.service';
import { TransactionsService } from '@/services/transactions.service';
import { CreateInternalTransferDto } from '@/dtos/internalTransfer.dto';
import { assertNever } from '@/utils/assertNever';
import { CreateInternalTransferErrorResponse, CreateInternalTransferSuccessResponse } from '@/interfaces/internalTransfers.interface';
import { parseUnits } from '@ethersproject/units';
import { currencies } from '@/config/currencies';

export class InternalTransfersController {
  public users = Container.get(UsersService);
  public transactions = Container.get(TransactionsService);

  public createInternalTransfer = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: 'authentification required',
      });
      return;
    }

    if (req.body instanceof CreateInternalTransferDto === false) {
      throw new Error('validation required');
    }
    const createInternalTransferDto = req.body;

    const recipientId = await this.users.resolveUserId(createInternalTransferDto.userTo);
    if (recipientId === null) {
      res.status(400).json({
        kind: 'INTERNAL_USER_NOT_FOUND_ERR',
        message: 'recipient not found',
      } satisfies CreateInternalTransferErrorResponse);
      return;
    }

    const currency = currencies.find(currency => currency.id === createInternalTransferDto.currencyId);
    if (!currency) {
      res.status(400).json({
        kind: 'UNSUPPORTED_CURRENCY_ERR',
        message: 'wrong currency id',
      } satisfies CreateInternalTransferErrorResponse);
      return;
    }

    const amount = parseUnits(createInternalTransferDto.value.toString(), currency.decimals);

    const result = await this.transactions.transferInternally({
      userFrom: req.user.id,
      userTo: recipientId,
      amount: amount.toString(),
      currencyId: createInternalTransferDto.currencyId,
    });

    switch (result.kind) {
      case 'CURRENCY_NOT_FOUND': {
        res.status(400).json({
          kind: 'UNSUPPORTED_CURRENCY_ERR',
          message: 'wrong currency id',
        } satisfies CreateInternalTransferErrorResponse);
        break;
      }
      case 'INSUFFICIENT_FUNDS': {
        res.status(400).json({
          kind: 'INSUFFICIENT_FUNDS_ERR',
          message: 'insufficient funds',
        } satisfies CreateInternalTransferErrorResponse);
        break;
      }
      case 'OK': {
        res.status(201).json({ kind: 'OK', transactionId: result.transactionId } satisfies CreateInternalTransferSuccessResponse);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  };
}
