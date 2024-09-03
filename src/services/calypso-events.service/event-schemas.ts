import * as z from 'zod';

export const EventTypeSchema = z.union([
  z.literal('INVOICE_CREATE_INVOICE'),
  z.literal('INVOICE_CREATE_UNLIMITED_INVOICE'),
  z.literal('INVOICE_FUNDS_RECEIVED_FOR_INVOICE'),
  z.literal('INVOICE_PENDING_INTERVENTION'),
  z.literal('INVOICE_TRANSLATION_TO_ACCOUNT_COMPLETED'),
  z.literal('INVOICE_EXPIRED'),
  z.literal('INVOICE_PAID'),
  z.literal('INVOICE_MEMPOOL_FOUND'),
  z.literal('PAYOUT_CHANGE_STATUS'),
  z.literal('PAYOUT_CONFIRMED'),
  z.literal('PAYOUT_VALIDATION_ERROR'),
  z.literal('INVOICE_COMPLIANCE_CHECK'),
  z.literal('INVOICE_COMPLIANCE_DECLINED'),
  z.literal('TOP_UP_COMPLIANCE_CHECK'),
  z.literal('TOP_UP_COMPLIANCE_DECLINED'),
  z.literal('WALLET_FUNDS_DELIVERED_ACCOUNT'),
]);

export const InvoiceCreateInvoiceEventSchema = z.object({
  type: z.literal('INVOICE_CREATE_INVOICE'), // event type: INVOICE_CREATE_INVOICE
  amount: z.number(), // money amount of the created invoice.
  message: z.string(), // text of the invoice.
  currency: z.string(), // currency of the invoice. [BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC]
  parentExternalId: z.number(), // system id of the invoice.
  createdDate: z.string(), // date and time of invoice creation
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  externalId: z.string(), // merchant ID of invoice
});

export const InvoiceCreateUnlimitedInvoiceEventSchema = z.object({
  type: z.literal('INVOICE_CREATE_UNLIMITED_INVOICE'), // event type: INVOICE_CREATE_UNLIMITED_INVOICE
  message: z.string(), // text of the invoice.
  currency: z.string(), // currency of the invoice. [ BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC ]
  parentExternalId: z.number(), // system id of the invoice.
  createdDate: z.string(), // date and time of invoice creation
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  externalId: z.string(), // merchant ID of invoice
});

export const InvoiceFundsReceivedForInvoiceEventSchema = z.object({
  type: z.literal('INVOICE_FUNDS_RECEIVED_FOR_INVOICE'), // event type: INVOICE_FUNDS_RECEIVED_FOR_INVOICE
  amount: z.number(), // amount of received money to invoice wallet.
  transactionId: z.array(z.string()), // System ID of the invoice deposits.
  message: z.string(), // text of the invoice.
  currency: z.string(), // currency of the invoice. [ BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC ]
  parentExternalId: z.number(), // system id of the invoice.
  createdDate: z.string(), // date and time of invoice creation.
  senderAddress: z.string(), // wallet address from where funds were sent.
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  externalId: z.string(), // merchant ID of invoice
  paymentDate: z.string(), // date of deposit transaction creation.
  transactionHash: z.string(), // hash of the deposit transaction.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
});

export const InvoicePendingInterventionEventSchema = z.object({
  type: z.literal('INVOICE_PENDING_INTERVENTION'), // Event type: INVOICE_PENDING_INTERVENTION
  message: z.string(), // text of the invoice.
  parentExternalId: z.number(), // system id of the invoice.
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  externalId: z.string(), // merchant ID of invoice
});

export const InvoiceTranslationToAccountCompletedEventSchema = z.object({
  type: z.literal('INVOICE_TRANSLATION_TO_ACCOUNT_COMPLETED'), // event type: INVOICE_TRANSLATION_TO_ACCOUNT_COMPLETED
  amount: z.number(), // money amount of the invoice.
  message: z.string(), // text of the invoice.
  currency: z.string(), // currency of the invoice. [ BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC ]
  parentExternalId: z.number(), // system id of the invoice.
  createdDate: z.string(), // date and time of invoice creation.
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  serviceFee: z.number(), // service fee for invoice deposit.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
  transactionIds: z.array(z.string()), // system IDs of deposits for invoice. Always one ID in unlimited invoices, usually one ID in single invoices, but may be more IDs if intervention occurred.
});

export const InvoiceExpiredEventSchema = z.object({
  type: z.literal('INVOICE_EXPIRED'), // Event type: INVOICE_EXPIRED
  parentExternalId: z.number(), // system id of the invoice.
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  amount: z.number(), // money amount of the invoice.
  currency: z.string(), // currency of the invoice. [ BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC ]
  message: z.string(), // description of the invoice.
  createdDate: z.string(), // date and time of invoice creation.
  expirationDate: z.string(), // date and time of invoice expiration.
  externalId: z.string(), // merchant ID of invoice
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
});

export const InvoicePaidEventSchema = z.object({
  amount: z.number(), // money amount of the invoice.
  currency: z.string(), // currency of the invoice. [ BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC ]
  description: z.string(), // description of the invoice.
  externalId: z.string(), // merchant ID of invoice
  fiatAmount: z.number(), // amount in fiat currency if it was set in fiat.
  fiatCurrency: z.string(), // fiat currency of the invoice if it was set in fiat. [ USDT, EUR ]
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  parentExternalId: z.number(), // system id of the invoice.
  realAmount: z.number(), // amount of money that client really paid for the invoice.
  type: z.literal('INVOICE_PAID'), // Event type: INVOICE_PAID.
});

export const InvoiceMempoolFoundEventSchema = z.object({
  amount: z.number(), // money amount of the invoice.
  currency: z.string(), // currency of the invoice. [ BNB, BTC, DAI, ETH, FRAX, MATIC, TRX, USDC, USDT, USDT_MATIC, USDT_TRX, USDC_TRX, XDG, USDT_BSC ]
  description: z.string(), // description of the invoice.
  externalId: z.string(), // merchant ID of invoice
  fiatAmount: z.number(), // amount in fiat currency if it was set in fiat.
  fiatCurrency: z.string(), // fiat currency of the invoice if it was set in fiat. [ USDT, EUR ]
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  parentExternalId: z.number(), // system id of the invoice.
  realAmount: z.number(), // amount of money that client really paid for the invoice.
  type: z.literal('INVOICE_MEMPOOL_FOUND'), // Event type: INVOICE_MEMPOOL_FOUND.
  createdDate: z.string(), // date and time of invoice creation.
  transactionHash: z.string(), // hash of the incoming transaction to the invoice wallet.
});

export const PayoutChangeStatusEventSchema = z.object({
  hash: z.string(), // transaction hash.
  type: z.literal('PAYOUT_CHANGE_STATUS'), // event type: PAYOUT_CHANGE_STATUS.
  parentExternalId: z.number(), // system id of the payout.
  createdDate: z.string(), // date and time of payout creation.
  payoutStatus: z.string(), // current state of the payout.
  idempotencyKey: z.string(), // the external id that was generated while payout creating through api.
  currency: z.string(), // currency of the payout.
});

export const PayoutConfirmedEventSchema = z.object({
  type: z.literal('PAYOUT_CONFIRMED'), // event type: PAYOUT_CONFIRMED.
  parentExternalId: z.number(), // system id of the payout.
  createdDate: z.string(), // date and time of payout creation.
  approved: z.array(z.string()), // list of users who approved the payout.
  idempotencyKey: z.string(), // the external id that was generated while payout creating through api.
  currency: z.string(), // currency of the payout
});

export const PayoutValidationErrorEventSchema = z.object({
  type: z.literal('PAYOUT_VALIDATION_ERROR'), // event type: PAYOUT_VALIDATION_ERROR.
  parentExternalId: z.number(), // system id of the payout.
  message: z.string(), // validation error message.
  createdDate: z.string(), // date and time of payout creation.
  dealWithdrawalId: z.number(), // system id of withdrawal where validation error occured.
  validationStatus: z.string(), // the reason of validation error.
  idempotencyKey: z.string(), // the external id that was generated while payout creating through api.
  currency: z.string(), // currency of the payout.
});

export const InvoiceComplianceCheckEventSchema = z.object({
  type: z.literal('INVOICE_COMPLIANCE_CHECK'), // event type: INVOICE_COMPLIANCE_CHECK
  amount: z.number(), // amount of received money to invoice wallet.
  transactionId: z.array(z.string()), // System ID of the invoice deposits.
  message: z.string(), // text of the invoice.
  currency: z.string(), // currency of the invoice.
  parentExternalId: z.number(), // system id of the invoice.
  createdDate: z.string(), // date and time of invoice creation.
  senderAddress: z.string(), // wallet address from where funds were sent.
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  externalId: z.string(), // merchant ID of invoice
  paymentDate: z.string(), // date of deposit transaction creation.
  transactionHash: z.string(), // hash of the deposit transaction.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
});

export const InvoiceComplianceDeclinedEventSchema = z.object({
  type: z.literal('INVOICE_COMPLIANCE_DECLINED'), // event type: INVOICE_COMPLIANCE_DECLINED
  amount: z.number(), // amount of received money to invoice wallet.
  transactionId: z.array(z.string()), // System ID of the invoice deposits.
  message: z.string(), // text of the invoice.
  currency: z.string(), // currency of the invoice.
  parentExternalId: z.number(), // system id of the invoice.
  createdDate: z.string(), // date and time of invoice creation.
  senderAddress: z.string(), // wallet address from where funds were sent.
  idempotencyKey: z.string(), // the external id that was generated while invoice creating through api.
  externalId: z.string(), // merchant ID of invoice
  paymentDate: z.string(), // date of deposit transaction creation.
  transactionHash: z.string(), // hash of the deposit transaction.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
});

export const TopUpComplianceCheckEventSchema = z.object({
  type: z.literal('TOP_UP_COMPLIANCE_CHECK'), // event type: TOP_UP_COMPLIANCE_CHECK
  amount: z.number(), // amount of received money to invoice wallet.
  currency: z.string(), // currency of the invoice.
  senderAddress: z.string(), // wallet address from where funds were sent.
  paymentDate: z.string(), // date of deposit transaction creation.
  transactionHash: z.string(), // hash of the deposit transaction.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
});

export const TopUpComplianceDeclinedEventSchema = z.object({
  type: z.literal('TOP_UP_COMPLIANCE_DECLINED'), // event type: TOP_UP_COMPLIANCE_DECLINED
  amount: z.number(), // amount of received money to invoice wallet.
  currency: z.string(), // currency of the invoice.
  senderAddress: z.string(), // wallet address from where funds were sent.
  paymentDate: z.string(), // date of deposit transaction creation.
  transactionHash: z.string(), // hash of the deposit transaction.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency
});

export const WalletFundsDeliveredAccountEventSchema = z.object({
  type: z.literal('WALLET_FUNDS_DELIVERED_ACCOUNT'), // event type: WALLET_FUNDS_DELIVERED_ACCOUNT
  amount: z.number(), // amount of received money
  currency: z.string(), // currency of the invoice.
  senderAddress: z.string(), // wallet address from where funds were sent.
  paymentDate: z.string(), // date of deposit transaction creation.
  transactionHash: z.string(), // hash of the deposit transaction.
  fiatAmount: z.object({}).passthrough(), // invoice amount in fiat currency.
});
