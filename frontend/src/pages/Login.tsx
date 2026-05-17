import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Package, Shield, Warehouse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-content">
          <span className="badge badge-primary">Inventory Management</span>
          <h1>Control stock, pricing & sales in one place</h1>
          <p>
            StockFlow connects your categories, products, suppliers, and invoices with a secure,
            role-based API built for real businesses.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Package />
              </div>
              <div>
                <strong>Product catalog</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Organize items, prices, and services by category.
                </p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Warehouse />
              </div>
              <div>
                <strong>Live stock tracking</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Monitor quantities across branches and suppliers.
                </p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <BarChart3 />
              </div>
              <div>
                <strong>Dashboard insights</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  See counts and jump to any module instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="card auth-card">
          <h2>Sign in</h2>
          <p className="subtitle">Use your account to access the dashboard</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'center' }}>
            <Shield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Demo: admin / admin123
          </p>
        </div>
      </section>
    </div>
  );
}
