import * as z from 'zod';
import { EventTypeSchema } from './event-schemas';
import { InvoiceCreateInvoiceEventSchema } from './event-schemas';
import { InvoiceCreateUnlimitedInvoiceEventSchema } from './event-schemas';
import { InvoiceFundsReceivedForInvoiceEventSchema } from './event-schemas';
import { InvoicePendingInterventionEventSchema } from './event-schemas';
import { InvoiceTranslationToAccountCompletedEventSchema } from './event-schemas';
import { InvoiceExpiredEventSchema } from './event-schemas';
import { InvoicePaidEventSchema } from './event-schemas';
import { InvoiceMempoolFoundEventSchema } from './event-schemas';
import { PayoutChangeStatusEventSchema } from './event-schemas';
import { PayoutConfirmedEventSchema } from './event-schemas';
import { PayoutValidationErrorEventSchema } from './event-schemas';
import { InvoiceComplianceCheckEventSchema } from './event-schemas';
import { InvoiceComplianceDeclinedEventSchema } from './event-schemas';
import { TopUpComplianceCheckEventSchema } from './event-schemas';
import { TopUpComplianceDeclinedEventSchema } from './event-schemas';
import { WalletFundsDeliveredAccountEventSchema } from './event-schemas';

export type EventType = z.infer<typeof EventTypeSchema>;

export type InvoiceCreateInvoiceEvent = z.infer<typeof InvoiceCreateInvoiceEventSchema>;

export type InvoiceCreateUnlimitedInvoiceEvent = z.infer<typeof InvoiceCreateUnlimitedInvoiceEventSchema>;

export type InvoiceFundsReceivedForInvoiceEvent = z.infer<typeof InvoiceFundsReceivedForInvoiceEventSchema>;

export type InvoicePendingInterventionEvent = z.infer<typeof InvoicePendingInterventionEventSchema>;

export type InvoiceTranslationToAccountCompletedEvent = z.infer<typeof InvoiceTranslationToAccountCompletedEventSchema>;

export type InvoiceExpiredEvent = z.infer<typeof InvoiceExpiredEventSchema>;

export type InvoicePaidEvent = z.infer<typeof InvoicePaidEventSchema>;

export type InvoiceMempoolFoundEvent = z.infer<typeof InvoiceMempoolFoundEventSchema>;

export type PayoutChangeStatusEvent = z.infer<typeof PayoutChangeStatusEventSchema>;

export type PayoutConfirmedEvent = z.infer<typeof PayoutConfirmedEventSchema>;

export type PayoutValidationErrorEvent = z.infer<typeof PayoutValidationErrorEventSchema>;

export type InvoiceComplianceCheckEvent = z.infer<typeof InvoiceComplianceCheckEventSchema>;

export type InvoiceComplianceDeclinedEvent = z.infer<typeof InvoiceComplianceDeclinedEventSchema>;

export type TopUpComplianceCheckEvent = z.infer<typeof TopUpComplianceCheckEventSchema>;

export type TopUpComplianceDeclinedEvent = z.infer<typeof TopUpComplianceDeclinedEventSchema>;

export type WalletFundsDeliveredAccountEvent = z.infer<typeof WalletFundsDeliveredAccountEventSchema>;

export type Event =
  | InvoiceCreateInvoiceEvent
  | InvoiceCreateUnlimitedInvoiceEvent
  | InvoiceFundsReceivedForInvoiceEvent
  | InvoicePendingInterventionEvent
  | InvoiceTranslationToAccountCompletedEvent
  | InvoiceExpiredEvent
  | InvoicePaidEvent
  | InvoiceMempoolFoundEvent
  | PayoutChangeStatusEvent
  | PayoutConfirmedEvent
  | PayoutValidationErrorEvent
  | InvoiceComplianceCheckEvent
  | InvoiceComplianceDeclinedEvent
  | TopUpComplianceCheckEvent
  | TopUpComplianceDeclinedEvent
  | WalletFundsDeliveredAccountEvent;
