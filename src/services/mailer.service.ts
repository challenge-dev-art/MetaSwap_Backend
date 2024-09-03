import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import { config } from '@/config';

export interface SendMailOpts {
  from: string;
  to: string;
  subject: string;
  text: string;
}

@Service()
export class MailerService {
  private _transporter = nodemailer.createTransport(config.MAIL_SMPT_URL);

  async sendMail(opts: SendMailOpts) {
    await this._transporter.sendMail({
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
  }
}
