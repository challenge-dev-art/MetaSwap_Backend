import { Service } from 'typedi';
import { prisma } from '@/prisma-client';
import { Fee, FeeType } from '@prisma/client';
import { assertNever } from '@/utils/assertNever';
import { FeeRequest } from '@/interfaces/fees.interface';

export type AllFeeResult = { kind: 'OK'; fees: Fee[] } | { kind: 'FEES_NOT_FOUND' };

export type FeeResult = { kind: 'OK'; fee: Fee } | { kind: 'FEETYPE_NOT_FOUND' } | { kind: 'FEE_NOT_FOUND' };

export type DeleteFeeResult = { kind: 'OK'; fee: Fee } | { kind: 'FEE_NOT_FOUND' };

export type CreateFeeResult = { kind: 'OK'; fee: Fee } | { kind: 'FEE_ALREADY_EXISTS' };

@Service()
export class FeesService {

  public fees = prisma.fee;

  public async getAllFees(): Promise<AllFeeResult> {
    const fees = await this.fees.findMany();
    
    if (fees.length === 0) {
      return { kind: 'FEES_NOT_FOUND' };
    }

    return { kind: 'OK', fees };
  }

  public async getFee(feeType: FeeType): Promise<FeeResult> {
    
    console.log("feeType: ", feeType);

    // if (!Object.values(FeeType).includes(feeType)) {
    //   return { kind: 'FEETYPE_NOT_FOUND' };
    // }

    const fee = await this.fees.findFirst({
      where: {
        type: feeType
      }
    });

    if (!fee) {
      return { kind: 'FEE_NOT_FOUND' };
    }

    return { kind: 'OK', fee };
  }

  public async createFee(fee: FeeRequest): Promise<CreateFeeResult> {

    const existingFee = await this.fees.findFirst({
      where: {
        type: fee.type
      }
    });

    if (existingFee) {
      return { kind: 'FEE_ALREADY_EXISTS' };
    } else {
      const createdFee = await this.fees.create({
        data: fee,
      });
  
      return { kind: 'OK', fee: createdFee };
    }   
  }

  public async updateFee(fee: FeeRequest): Promise<FeeResult> {
    if (!Object.values(FeeType).includes(fee.type)) {
      return { kind: 'FEETYPE_NOT_FOUND' };
    }

    const existingFee = await this.fees.findFirst({
      where: {
        type: fee.type
      }
    });

    if (!existingFee) {
      return { kind: 'FEE_NOT_FOUND' };
    } else {
      const updatedFee = await this.fees.update({
        where: {
          id: existingFee.id
        },
        data: {
          amount: fee.amount
        }
      });

      return { kind: 'OK', fee: updatedFee };
    }
  }

  public async deleteFee(feeType: FeeType): Promise<DeleteFeeResult> {
    const existingFee = await this.fees.findFirst({
      where: {
        type: feeType
      }
    });
    if (!existingFee) {
      return { kind: 'FEE_NOT_FOUND' };
    } else {
      const deletedFee = await this.fees.delete({
        where: {
          id: existingFee.id
        }
      });

      if (deletedFee) {
        return { kind: 'OK', fee: deletedFee };
      }
    }
  }
}