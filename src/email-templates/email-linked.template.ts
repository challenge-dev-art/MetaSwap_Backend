export interface CreateEmailLinkedOpts {
  userName: string;
  email: string;
}

export function createEmailLinkedMail(opts: CreateEmailLinkedOpts) {
  const subject = 'Successful Email Link Notification on Metaswap';

  const text = `Hello ${opts.userName},

We are pleased to inform you that the email address ${opts.email} has been successfully linked to your Metaswap account.

If you did not authorize this action or believe it was made in error, please contact our support team immediately.

Thank you for using Metaswap!

Best regards,
The Metaswap Team

---

_This is an automatically generated email, please do not reply to it._`;

  return { subject, text };
}
