export interface CreateEmailUpdatedMail {
  userName: string;
}

export function createEmailUpdatedMail(opts: CreateEmailUpdatedMail) {
  const subject = 'Successful Email Change Notification on Metaswap';

  const text = `Hello ${opts.userName},

We are pleased to inform you that the email address associated with your Metaswap account has been successfully changed.

If you did not authorize this change or believe it was made in error, please contact our support team immediately.

Thank you for using Metaswap!

Best regards,
The Metaswap Team

---

_This is an automatically generated email, please do not reply to it._`;

  return { subject, text };
}
