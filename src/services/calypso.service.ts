import { config } from '@/config';
import { CalypsoApi } from '@/lib/calypso-api';
import { Service } from 'typedi';

@Service()
export class CalypsoService extends CalypsoApi {
  constructor() {
    //super(config.CALYPSO_KEY, config.CALYPSO_SECRET, config.CALYPSO_ACCOUNT);
    super(process.env.CALYPSO_KEY, process.env.CALYPSO_SECRET, process.env.CALYPSO_ACCOUNT);
  }
}
