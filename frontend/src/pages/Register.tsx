import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contactNumber: '10000000000',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        username: form.username,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        address: form.address,
        contactNumber: Number(form.contactNumber),
      });
      navigate('/');
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="auth-page">
      <div className="card auth-card" style={{ maxWidth: 480 }}>
        <h1>Create account</h1>
        <p className="subtitle">Register for inventory access</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid cols-2">
          <div className="field">
            <label>Username</label>
            <input value={form.username} onChange={(e) => set('username', e.target.value)} required />
          </div>
          <div className="field">
            <label>Password (min 8)</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={8} />
          </div>
          <div className="field">
            <label>First name</label>
            <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
          </div>
          <div className="field">
            <label>Last name</label>
            <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <input value={form.address} onChange={(e) => set('address', e.target.value)} required />
          </div>
          <div className="field">
            <label>Contact number</label>
            <input value={form.contactNumber} onChange={(e) => set('contactNumber', e.target.value)} required />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Register'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
