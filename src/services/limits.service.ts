import { Service } from 'typedi';
import { prisma } from '@/prisma-client';
import { Limit } from '@prisma/client';
import { assertNever } from '@/utils/assertNever';
import { LimitRequest, UpdateLimitRequest } from '@/interfaces/limits.interface';

export type CreateLimitResult = { kind: 'OK'; limit: Limit } | { kind: 'LIMIT_ALREADY_EXISTS' };
export type GetLimitsResult = { kind: 'OK'; limits: Limit[] } | { kind: 'LIMITS_NOT_FOUND' };
export type UpdateLimitResult = { kind: 'OK'; limit: Limit } | { kind: 'LIMIT_NOT_FOUND' };

@Service()
export class LimitsService {
  public limits = prisma.limit;

  public async createLimit(newLimit: LimitRequest): Promise<CreateLimitResult> {
    const limit = await this.limits.findFirst({
      where: {
        checkVerification: newLimit.checkVerification,
        limitType: newLimit.limitType,
        currencyId: newLimit.currencyId,
      }
    });

    if (limit) {
      return { kind: 'LIMIT_ALREADY_EXISTS' };
    }

    const createdLimit = await this.limits.create({
      data: {
        checkVerification: newLimit.checkVerification,
        limitType: newLimit.limitType,
        currencyId: newLimit.currencyId,
        amount: newLimit.amount,
      }
    });

    return { kind: 'OK', limit: createdLimit };
  }

  public async getLimits(): Promise<GetLimitsResult> {
    const limits = await this.limits.findMany();
    if (limits.length === 0) {
      return { kind: 'LIMITS_NOT_FOUND' };
    }
    return { kind: 'OK', limits };
  }

  public async updateLimit(updateLimit: UpdateLimitRequest): Promise<UpdateLimitResult> {
    const limit = await this.limits.findUnique({
      where: {
        id: updateLimit.id,
      }
    });

    if (!limit) {
      return { kind: 'LIMIT_NOT_FOUND' };
    }

    const updatedLimit = await this.limits.update({
      where: {
        id: updateLimit.id,
      },
      data: {
        checkVerification: updateLimit.checkVerification,
        limitType: updateLimit.limitType,
        currencyId: updateLimit.currencyId,
        amount: updateLimit.amount,
      }
    });

    return { kind: 'OK', limit: updatedLimit };
  }
}