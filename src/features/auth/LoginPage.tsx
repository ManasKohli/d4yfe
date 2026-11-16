import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { roles, signIn } from '@/features/auth/auth';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { Button } from '@/shared/ui/Button';
import { Field, Input } from '@/shared/ui/Field';
import Icon from '@/shared/ui/Icon';
import PageHeader from '@/shared/ui/PageHeader';

export default function LoginPage() {
  useDocumentTitle('Sign in');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      await signIn({ email: String(data.get('email')), password: String(data.get('password')) });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="container-page grid gap-10 pt-16 pb-20 md:pt-20 lg:grid-cols-2 lg:gap-16">
      <PageHeader
        eyebrow="Sign in"
        title="Welcome"
        muted="back."
        lede="Students, mentors, and D4Y admins sign in here. Each person sees only what their role needs."
      />
      <div className="grid gap-6">
        <form className="grid gap-4 rounded-card border border-line bg-card p-6" onSubmit={handleSubmit}>
          <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" autoComplete="email" required/></Field>
          <Field label="Password" htmlFor="password"><Input id="password" name="password" type="password" autoComplete="current-password" required/></Field>
          {error && <p className="rounded-field bg-warn-soft p-3 text-sm text-warn" role="alert">{error}</p>}
          <div><Button type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</Button></div>
        </form>
        <section aria-labelledby="preview-title">
          <h2 id="preview-title" className="mb-3 text-sm font-semibold tracking-wider text-accent uppercase">Preview an area</h2>
          <ul className="overflow-hidden rounded-card border border-line bg-card">
            {roles.map(role => (
              <li key={role.id} className="border-b border-line last:border-b-0">
                <Link to={role.home} className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 text-ink no-underline hover:bg-surface">
                  <span>
                    <strong className="block">{role.label}</strong>
                    <span className="text-sm text-muted">{role.description}</span>
                  </span>
                  <Icon name="arrow" size={18}/>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
