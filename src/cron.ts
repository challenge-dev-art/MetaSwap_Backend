import { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } from 'toad-scheduler';
import Container from 'typedi';
import { DepositsService } from './services/deposits.service';
import { logger } from './utils/logger';
import { PayoutsService } from './services/payouts.service';
import { VerificationService } from './services/verification.service';

function createSyncDepositsTask() {
  const deposits = Container.get(DepositsService);
  const task = new AsyncTask(
    'sync deposits',
    async () => {
      logger.info('trigger sync deposits');
      await deposits.syncDeposits();
    },
    (error: Error) => {
      logger.error(`failed to sync deposits ${error}`);
    },
  );
  return task;
}

function createSyncPayoutsService() {
  const payouts = Container.get(PayoutsService);
  const task = new AsyncTask(
    'sync deposits',
    async () => {
      logger.info('trigger sync payouts');
      await payouts.syncPayouts();
    },
    (error: Error) => {
      logger.error(`failed to sync payouts ${error}`);
    },
  );
  return task;
}

function createSyncVerificationService() {
  const payouts = Container.get(VerificationService);
  const task = new AsyncTask(
    'sync verification',
    async () => {
      logger.info('trigger sync verification');
      await payouts.syncVerification();
    },
    (error: Error) => {
      logger.error(`failed to sync verification ${error}`);
    },
  );
  return task;
}

export function schedule() {
  const scheduler = new ToadScheduler();

  scheduler.addSimpleIntervalJob(
    new SimpleIntervalJob({ seconds: 20, runImmediately: true }, createSyncDepositsTask(), { id: 'sync_deposits', preventOverrun: true }),
  );

  scheduler.addSimpleIntervalJob(
    new SimpleIntervalJob({ seconds: 20, runImmediately: true }, createSyncPayoutsService(), { id: 'sync_payouts', preventOverrun: true }),
  );

  scheduler.addSimpleIntervalJob(
    new SimpleIntervalJob({ seconds: 5, runImmediately: true }, createSyncVerificationService(), { id: 'sync_verification', preventOverrun: true }),
  );
  return scheduler;
}
