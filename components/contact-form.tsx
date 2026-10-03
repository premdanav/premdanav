'use client';

import { useState, type FormEvent } from 'react';
import { CONTACT_ENDPOINT, CONTACT_LIMITS } from '@/lib/contact';
import { Icon } from './icons';

type State = 'idle' | 'sending' | 'sent' | 'error' | 'mail';

const MESSAGES: Record<Exclude<State, 'idle' | 'sending'>, string> = {
  sent: "Message sent — it's on its way to my inbox. I'll reply to the address you gave.",
  error: "That didn't send. Email me directly instead and it will reach me.",
  mail: 'Your email app should open with the message ready to send.',
};

/**
 * The site is static, so the form posts to a hosted form backend when CONTACT_ENDPOINT
 * is configured, and otherwise hands the message to the visitor's email app.
 */
export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // People never see this field; anything in it is a bot. Pretend success.
    if (String(data.get('_gotcha') ?? '')) {
      setState('sent');
      return;
    }

    if (!CONTACT_ENDPOINT) {
      const name = String(data.get('name') ?? '').trim();
      const from = String(data.get('email') ?? '').trim();
      const message = String(data.get('message') ?? '').trim();
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} <${from}>`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setState('mail');
      return;
    }

    setState('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      form.reset();
    } catch {
      setState('error');
    }
  }

  return (
    <form
      method="post"
      action={CONTACT_ENDPOINT ?? `mailto:${email}`}
      encType={CONTACT_ENDPOINT ? undefined : 'text/plain'}
      onSubmit={submit}
      className="flex flex-col gap-6"
    >
      <div>
        <label htmlFor="name" className="mb-2 block text-mist">
          Your name
        </label>
        <input id="name" name="name" type="text" required maxLength={CONTACT_LIMITS.name} autoComplete="name" placeholder="What should I call you?" className="input" />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-mist">
          Your email
        </label>
        <input id="email" name="email" type="email" required maxLength={CONTACT_LIMITS.email} autoComplete="email" placeholder="Where can I reply?" className="input" />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-mist">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={CONTACT_LIMITS.messageMin}
          maxLength={CONTACT_LIMITS.message}
          rows={5}
          placeholder="A role, a project, or a question"
          className="input resize-y"
        />
      </div>
      <input type="hidden" name="_subject" value="Portfolio message" />
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div hidden>
        <label htmlFor="_gotcha">Leave this empty</label>
        <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={state === 'sending'} className="cta w-full justify-center disabled:opacity-70">
        <span className="cta-fill" />
        <span className="cta-label">{state === 'sending' ? 'Sending…' : 'Send message'}</span>
        <span className="cta-icon">
          <Icon name="arrowRight" className="size-5" />
        </span>
      </button>

      <p role="status" aria-live="polite" className={`min-h-6 text-sm ${state === 'error' ? 'text-rose' : 'text-mint'}`}>
        {state !== 'idle' && state !== 'sending' && MESSAGES[state]}
        {state === 'error' && (
          <>
            {' '}
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
          </>
        )}
      </p>
    </form>
  );
}
