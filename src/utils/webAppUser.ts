import z, { ZodError } from 'zod';

const WebAppUserSchema = z.object({
  /** Unique identifier for this user or bot. */
  id: z.number(),
  /** True, if this user is a bot */
  is_bot: z.optional(z.boolean()),
  /** User's or bot's first name */
  first_name: z.string(),
  /** User's or bot's last name */
  last_name: z.optional(z.string()),
  /** User's or bot's username */
  username: z.optional(z.string()),
  /** IETF language tag of the user's language */
  language_code: z.optional(z.string()),
  /** True, if this user is a Telegram Premium user */
  is_premium: z.optional(z.boolean()),
  /** True, if this user added the bot to the attachment menu */
  added_to_attachment_menu: z.optional(z.boolean()),
});

export type WebAppUser = z.infer<typeof WebAppUserSchema>;

export function parseWebUser(webAppUserData: string): WebAppUser | null {
  let webAppUserRaw: unknown;
  try {
    webAppUserRaw = JSON.parse(webAppUserData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }

  let webAppUser: WebAppUser;
  try {
    webAppUser = WebAppUserSchema.parse(webAppUserRaw);
  } catch (error) {
    if (error instanceof ZodError) {
      return null;
    }
    throw error;
  }

  return webAppUser;
}
