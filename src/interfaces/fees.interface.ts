import { FeeType } from '@prisma/client'

export interface FeeRequest {
  type: FeeType;
  amount: number;
}