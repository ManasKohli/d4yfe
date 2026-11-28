import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { paths, roleHome } from '@/app/paths';
import { passwordProblem } from '@/features/auth/auth';
import { useAuth } from '@/shared/auth/authContext';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { Button } from '@/shared/ui/Button';
import { Field, Input } from '@/shared/ui/Field';
import PageHeader from '@/shared/ui/PageHeader';

/**
 * Where invite and password-reset links land (see app/authLinks.ts). The link signs the person in;
 * this page asks for the password they'll use from now on.
 */
export default function SetPasswordPage() {
  useDocumentTitle('Set your password');
  const { state, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.status !== 'signed-in') return;
    const data = new FormData(event.currentTarget);
    const problem = passwordProblem(String(data.get('password')), String(data.get('confirm')));
    if (problem) {
      setError(problem);
      return;
    }
    setPending(true);
    setError('');
    try {
      await updatePassword(String(data.get('password')));
      navigate(roleHome[state.me.role], { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the password.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="container-page grid gap-10 pt-16 pb-20 md:pt-20 lg:grid-cols-2 lg:gap-16">
      <PageHeader eyebrow="Your account" title="Set your password" lede="Choose the password you’ll use to sign in. At least 10 characters, with letters and numbers."/>
      <div>
        {state.status === 'loading' && <p role="status" className="text-muted">Checking your link…</p>}
        {(state.status === 'signed-out' || state.status === 'disabled') && (
          <div className="grid gap-3 rounded-card border border-line bg-card p-6">
            <p role="alert">This link has expired or was already used.</p>
            <p className="text-muted">Go to sign in and choose “Forgot password?” to get a new one.</p>
            <div><Link to={paths.login} className="inline-flex min-h-11 items-center font-medium">Go to sign in</Link></div>
          </div>
        )}
        {state.status === 'error' && <p role="alert" className="rounded-field bg-warn-soft p-3 text-sm text-warn">{state.message}</p>}
        {state.status === 'signed-in' && (
          <form className="grid gap-4 rounded-card border border-line bg-card p-6" onSubmit={handleSubmit}>
            <p className="text-sm text-muted">Signed in as {state.me.email}</p>
            <Field label="New password" htmlFor="password"><Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required/></Field>
            <Field label="Confirm password" htmlFor="confirm"><Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required/></Field>
            {error && <p className="rounded-field bg-warn-soft p-3 text-sm text-warn" role="alert">{error}</p>}
            <div><Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save password'}</Button></div>
          </form>
        )}
      </div>
    </div>
  );
}
