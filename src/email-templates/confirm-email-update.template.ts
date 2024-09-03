export interface CreateConfirmEmailUpdateMailOpts {
  userName: string;
  confirmationCode: string;
}

export function createConfirmEmailUpdateMail(opts: CreateConfirmEmailUpdateMailOpts) {
  const subject = 'Email Change Confirmation on Metaswap';

  const text = `Hello ${opts.userName},

You have requested to change the email address associated with your Metaswap account. Please use the following code to confirm this action:

**Confirmation Code**: ${opts.confirmationCode}

If you did not request an email change, please contact our support team immediately.

Thank you for using Metaswap!

Best regards,
The Metaswap Team

---

_This is an automatically generated email, please do not reply to it._`;

  return { subject, text };
}
