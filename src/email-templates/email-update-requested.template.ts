export interface CreateEmailUpdateRequestedMailOpts {
  userName: string;
}

export function createEmailUpdateRequestedMail(opts: CreateEmailUpdateRequestedMailOpts) {
  const subject = 'Notification of Email Change Request on Metaswap';

  const text = `Hello ${opts.userName},

We have received a request to change the email address associated with your Metaswap account. This notification is to inform you that if you did not initiate this request, please contact our support team immediately to ensure the security of your account.

If you did request this change, please ignore this email. A confirmation email has been sent to your new email address with further instructions.

Thank you for using Metaswap!

Best regards,
The Metaswap Team

---

_This is an automatically generated email, please do not reply to it._`;

  return { subject, text };
}
