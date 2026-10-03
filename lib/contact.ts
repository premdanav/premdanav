/** Shared limits for the contact form's HTML validation. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 200,
  messageMin: 10,
  message: 5000,
} as const;

/**
 * A form backend that accepts a plain POST and answers JSON to `Accept: application/json`
 * (e.g. a Formspree form URL). Set as the CONTACT_ENDPOINT repository variable; the
 * deploy workflow passes it in. Without it the form opens the visitor's email app.
 */
export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || null;
