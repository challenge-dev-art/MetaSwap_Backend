export interface CreateConfirmEmailLinkingMailOpts {
  userName: string;
  confirmationCode: string;
}

export function createConfirmEmailLinkingMail(opts: CreateConfirmEmailLinkingMailOpts) {
  const subject = 'Email Verification Code for Metaswap Account';

  const text = `Hello ${opts.userName},

You have requested to link this email address to your Metaswap account. To complete this process, please use the following verification code:

**Verification Code**: ${opts.confirmationCode}

If you did not request to link this email address to your Metaswap account, please disregard this email and contact our support team if you have any concerns.

Thank you for using Metaswap!

Best regards,
The Metaswap Team

---

_This is an automatically generated email, please do not reply to it._`;

  return { subject, text };
}
