export interface Verification {
  status: 'VERIFIED' | 'NON_VERIFIED' | 'PENDING';
  progress: number;
  verifiedLimits: {
    kind: 'TRANSFER_MONTH' | 'SWAP_MONTH' | 'AUTOCONVERT_MONTH';
    value: number;
    currencyName: string;
  }[];
  nonVerifiedLimits: {
    kind: 'TRANSFER_MONTH' | 'SWAP_MONTH' | 'AUTOCONVERT_MONTH';
    value: number;
    currencyName: string;
  }[];
  verificationError: string | null;
}
