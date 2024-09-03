import { CreateDepositDto } from '@/dtos/deposits.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateDepositErrorResponse, Deposit } from '@/interfaces/deposits.interface';
import { DepositsService } from '@/services/deposits.service';
import { assertNever } from '@/utils/assertNever';
import { Response, NextFunction } from 'express';
import Container from 'typedi';

export class DepositsController {
  public deposits = Container.get(DepositsService);

  public async getDeposits(req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> {
    const listing = await this.deposits.getDepositListingView(req.user.id);

    res.json(listing);
  }

  public async getDeposit(req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> {
    const depositIdRaw = req.params.id;
    if (!depositIdRaw) {
      res.status(404).json({ message: 'deposit not found' });
      return;
    }
    const depositId = parseInt(depositIdRaw, 10);
    if (isNaN(depositId) || depositId < 0) {
      res.status(404).json({ message: 'deposit not found' });
      return;
    }

    const getDepositResult = await this.deposits.getDeposit(req.user.id, depositId);
    switch (getDepositResult.kind) {
      case 'NOT_FOUND_ERR': {
        res.status(404).json({ message: 'not found' });
        break;
      }
      case 'OK': {
        res.json(getDepositResult.deposit);
        break;
      }
      default: {
        assertNever(getDepositResult);
      }
    }
  }

  public async createDeposit(req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> {
    if (req.body instanceof CreateDepositDto === false) {
      res.status(400).json({ message: 'body required' });
      return;
    }

    const createDepositResult = await this.deposits.createDeposit({
      userId: req.user.id,
      currencyId: req.body.currencyId,
    });

    switch (createDepositResult.kind) {
      case 'OK': {
        res.status(201).json(createDepositResult.deposit satisfies Deposit);
        break;
      }
      case 'CURRENCY_NOT_FOUND': {
        res.status(400).json({
          kind: 'UNSUPPORTED_CURRENCY_ERR',
          message: 'unsupported currency',
        } satisfies CreateDepositErrorResponse);
        break;
      }
      default: {
        assertNever(createDepositResult);
      }
    }
  }
}
