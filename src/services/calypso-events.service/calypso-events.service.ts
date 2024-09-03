import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { Service } from 'typedi';
import * as z from 'zod';
import {
  InvoiceCreateInvoiceEvent,
  InvoiceCreateUnlimitedInvoiceEvent,
  InvoiceFundsReceivedForInvoiceEvent,
  InvoicePendingInterventionEvent,
  InvoiceTranslationToAccountCompletedEvent,
  InvoiceExpiredEvent,
  InvoicePaidEvent,
  InvoiceMempoolFoundEvent,
  PayoutChangeStatusEvent,
  PayoutConfirmedEvent,
  PayoutValidationErrorEvent,
  InvoiceComplianceCheckEvent,
  InvoiceComplianceDeclinedEvent,
  TopUpComplianceCheckEvent,
  TopUpComplianceDeclinedEvent,
  WalletFundsDeliveredAccountEvent,
  Event as CalypsoEvent,
} from './event-types';
import {
  InvoiceComplianceCheckEventSchema,
  InvoiceComplianceDeclinedEventSchema,
  InvoiceCreateInvoiceEventSchema,
  InvoiceCreateUnlimitedInvoiceEventSchema,
  InvoiceExpiredEventSchema,
  InvoiceFundsReceivedForInvoiceEventSchema,
  InvoiceMempoolFoundEventSchema,
  InvoicePaidEventSchema,
  InvoicePendingInterventionEventSchema,
  InvoiceTranslationToAccountCompletedEventSchema,
  PayoutChangeStatusEventSchema,
  PayoutConfirmedEventSchema,
  PayoutValidationErrorEventSchema,
  TopUpComplianceCheckEventSchema,
  TopUpComplianceDeclinedEventSchema,
  WalletFundsDeliveredAccountEventSchema,
} from './event-schemas';
import { logger } from '@/utils/logger';

type CalypsoEvents = {
  INVOICE_CREATE_INVOICE: (ev: InvoiceCreateInvoiceEvent) => void;
  INVOICE_CREATE_UNLIMITED_INVOICE: (ev: InvoiceCreateUnlimitedInvoiceEvent) => void;
  INVOICE_FUNDS_RECEIVED_FOR_INVOICE: (ev: InvoiceFundsReceivedForInvoiceEvent) => void;
  INVOICE_PENDING_INTERVENTION: (ev: InvoicePendingInterventionEvent) => void;
  INVOICE_TRANSLATION_TO_ACCOUNT_COMPLETED: (ev: InvoiceTranslationToAccountCompletedEvent) => void;
  INVOICE_EXPIRED: (ev: InvoiceExpiredEvent) => void;
  INVOICE_PAID: (ev: InvoicePaidEvent) => void;
  INVOICE_MEMPOOL_FOUND: (ev: InvoiceMempoolFoundEvent) => void;
  PAYOUT_CHANGE_STATUS: (ev: PayoutChangeStatusEvent) => void;
  PAYOUT_CONFIRMED: (ev: PayoutConfirmedEvent) => void;
  PAYOUT_VALIDATION_ERROR: (ev: PayoutValidationErrorEvent) => void;
  INVOICE_COMPLIANCE_CHECK: (ev: InvoiceComplianceCheckEvent) => void;
  INVOICE_COMPLIANCE_DECLINED: (ev: InvoiceComplianceDeclinedEvent) => void;
  TOP_UP_COMPLIANCE_CHECK: (ev: TopUpComplianceCheckEvent) => void;
  TOP_UP_COMPLIANCE_DECLINED: (ev: TopUpComplianceDeclinedEvent) => void;
  WALLET_FUNDS_DELIVERED_ACCOUNT: (ev: WalletFundsDeliveredAccountEvent) => void;
};

const schemas = {
  INVOICE_CREATE_INVOICE: InvoiceCreateInvoiceEventSchema,
  INVOICE_CREATE_UNLIMITED_INVOICE: InvoiceCreateUnlimitedInvoiceEventSchema,
  INVOICE_FUNDS_RECEIVED_FOR_INVOICE: InvoiceFundsReceivedForInvoiceEventSchema,
  INVOICE_PENDING_INTERVENTION: InvoicePendingInterventionEventSchema,
  INVOICE_TRANSLATION_TO_ACCOUNT_COMPLETED: InvoiceTranslationToAccountCompletedEventSchema,
  INVOICE_EXPIRED: InvoiceExpiredEventSchema,
  INVOICE_PAID: InvoicePaidEventSchema,
  INVOICE_MEMPOOL_FOUND: InvoiceMempoolFoundEventSchema,
  PAYOUT_CHANGE_STATUS: PayoutChangeStatusEventSchema,
  PAYOUT_CONFIRMED: PayoutConfirmedEventSchema,
  PAYOUT_VALIDATION_ERROR: PayoutValidationErrorEventSchema,
  INVOICE_COMPLIANCE_CHECK: InvoiceComplianceCheckEventSchema,
  INVOICE_COMPLIANCE_DECLINED: InvoiceComplianceDeclinedEventSchema,
  TOP_UP_COMPLIANCE_CHECK: TopUpComplianceCheckEventSchema,
  TOP_UP_COMPLIANCE_DECLINED: TopUpComplianceDeclinedEventSchema,
  WALLET_FUNDS_DELIVERED_ACCOUNT: WalletFundsDeliveredAccountEventSchema,
};

@Service()
export class CalypsoEventsService extends (EventEmitter as new () => TypedEmitter<CalypsoEvents>) {
  private _tagName = 'CalypsoEventsService';

  public emitRaw(type: string, data: object) {
    const schema = schemas[type as keyof typeof schemas];
    if (!schema) {
      logger.error(`[${this._tagName}] unexpected event type ${JSON.stringify(type)}`);
      return;
    }
    const parsingResult = schema.safeParse(data);
    if (!parsingResult.success) {
      logger.error(`[${this._tagName}] failed to parse payload ${parsingResult.error.message}`);
      return;
    }
    const event = parsingResult.data;
    this.emit(event.type, event as any);
  }
}
