import { Verification as VerificationView } from '@/interfaces/verification.interface';
import { prisma } from '@/prisma-client';
import { VerificationStatus } from '@prisma/client';
import { Service } from 'typedi';

const VERIFIED_LIMITS: VerificationView['verifiedLimits'] = [
  { kind: 'TRANSFER_MONTH', value: 60000, currencyName: 'USD' },
  { kind: 'SWAP_MONTH', value: 20000, currencyName: 'USD' },
  { kind: 'AUTOCONVERT_MONTH', value: 20000, currencyName: 'USD' },
];

const NON_VERIFIED_LIMITS: VerificationView['verifiedLimits'] = [
  { kind: 'TRANSFER_MONTH', value: 30000, currencyName: 'USD' },
  { kind: 'SWAP_MONTH', value: 10000, currencyName: 'USD' },
  { kind: 'AUTOCONVERT_MONTH', value: 10000, currencyName: 'USD' },
];

export interface RequestVerificationOpts {
  userId: number;
  firstName: string;
  lastName: string;
  docId: string;
}

@Service()
export class VerificationService {
  public async getVerification(userId: number): Promise<VerificationView> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        verification: {
          select: {
            status: true,
            progress: true,
            verificationError: true,
          },
        },
      },
    });

    const status = user.verification ? user.verification.status : VerificationStatus.NON_VERIFIED;
    const progress = user.verification ? user.verification.progress : 0;
    const verificationError = user.verification ? user.verification.verificationError : null;

    return {
      status,
      progress,
      verifiedLimits: VERIFIED_LIMITS,
      nonVerifiedLimits: NON_VERIFIED_LIMITS,
      verificationError,
    } satisfies VerificationView;
  }

  public async requestVerification(opts: RequestVerificationOpts) {
    const request = await prisma.verificationRequest.create({
      data: {
        userId: opts.userId,
        firstName: opts.firstName,
        lastName: opts.lastName,
        docId: opts.docId,
      },
    });

    const verification = await prisma.verification.upsert({
      where: {
        userId: opts.userId,
      },
      create: {
        userId: opts.userId,
        status: VerificationStatus.PENDING,
        progress: 0,
        verificationRequestId: request.id,
      },
      update: {
        status: VerificationStatus.PENDING,
        progress: 0,
        verificationRequestId: request.id,
      },
      select: {
        id: true,
        status: true,
        progress: true,
      },
    });

    return {
      status: verification.status,
      progress: verification.progress,
      verifiedLimits: VERIFIED_LIMITS,
      nonVerifiedLimits: NON_VERIFIED_LIMITS,
      verificationError: null,
    } satisfies VerificationView;
  }

  public async syncVerification() {
    for await (const verification of this._iterateVerifications()) {
      let nextProgress = verification.progress + 10;
      if (nextProgress >= 100) {
        // TODO: удалить; реализовано только для тестирования UI
        if (/error/i.test(verification.verificationRequest.firstName)) {
          await prisma.verification.update({
            where: {
              id: verification.id,
            },
            data: {
              status: 'NON_VERIFIED',
              progress: 0,
              verificationError: 'Failed',
            },
          });
        } else
          await prisma.verification.update({
            where: {
              id: verification.id,
            },
            data: {
              status: 'VERIFIED',
              progress: 0,
            },
          });
      } else {
        await prisma.verification.update({
          where: {
            id: verification.id,
          },
          data: {
            progress: nextProgress,
          },
        });
      }
    }
  }

  private async *_iterateVerifications() {
    let rows = await prisma.verification.findMany({
      take: 4,
      where: {
        status: 'PENDING',
        verificationRequestId: {
          not: null,
        },
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        progress: true,
        verificationRequest: {
          select: {
            firstName: true,
          },
        },
      },
    });
    yield* rows;
    let lastRow = rows[3];
    if (!lastRow) {
      return;
    }
    let cursor = lastRow.id;

    while (true) {
      rows = await prisma.verification.findMany({
        take: 4,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          status: 'PENDING',
          verificationRequestId: {
            not: null,
          },
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
          progress: true,
          verificationRequest: {
            select: {
              firstName: true,
            },
          },
        },
      });
      yield* rows;
      lastRow = rows[3];
      if (!lastRow) {
        break;
      }
      cursor = lastRow.id;
    }
  }
}
