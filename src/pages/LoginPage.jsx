import { useState } from 'react';
import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { roles, signIn } from '../lib/auth.js';

export default function LoginPage() {
  useDocumentTitle('Log in');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      await signIn({ email: data.get('email'), password: data.get('password') });
    } catch (caught) {
      setError(caught.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="support-page-intro section-wrap login">
      <div>
        <Eyebrow>DENTAL PATHWAY PROGRAM <span className="eyebrow-rule"/> LOG IN</Eyebrow>
        <h1>Welcome<br/><em>back.</em></h1>
        <p>Students, mentors, and D4Y admins sign in here. Each person sees only what their role needs.</p>
      </div>
      <div className="login-panel">
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required/></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required/></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div><button className="button button-dark" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Log in'} <Icon name="arrow" size={17}/></button></div>
        </form>
        <div className="login-preview">
          <span className="panel-label">Preview an area</span>
          <ul className="item-list">
            {roles.map(role => (
              <li key={role.id}><Link to={role.home}><span>{role.label}<small className="block">{role.description}</small></span><Icon name="arrow" size={16}/></Link></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
