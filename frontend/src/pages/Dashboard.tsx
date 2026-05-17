import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Package,
  Warehouse,
  Truck,
  Tags,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { crudApi } from '../api/client';
import { PageShell } from '../components/PageShell';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';

const resources: {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}[] = [
  { key: 'categories', label: 'Categories', path: '/categories', icon: FolderTree, color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
  { key: 'products', label: 'Products', path: '/products', icon: Package, color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' },
  { key: 'stocks', label: 'Stock', path: '/stock', icon: Warehouse, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { key: 'suppliers', label: 'Suppliers', path: '/suppliers', icon: Truck, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { key: 'pricings', label: 'Pricing', path: '/pricing', icon: Tags, color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  { key: 'invoices', label: 'Invoices', path: '/invoices', icon: FileText, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
];

export default function Dashboard() {
  const { username } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const next: Record<string, number> = {};
      await Promise.all(
        resources.map(async (r) => {
          try {
            const data = await crudApi.list<unknown>(r.key);
            next[r.key] = Array.isArray(data) ? data.length : 0;
          } catch {
            next[r.key] = 0;
          }
        })
      );
      setCounts(next);
      setLoading(false);
    })();
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <PageShell
      title={`Hello, ${username ?? 'there'}`}
      description="Here's what's happening across your inventory today."
    >
      {loading ? (
        <Spinner label="Loading dashboard…" />
      ) : (
        <>
          <section className="stats-grid">
            {resources.map((r) => {
              const Icon = r.icon;
              return (
                <Link key={r.key} to={r.path} className="card stat-card">
                  <div className="stat-card-top">
                    <div className="stat-icon" style={{ background: r.bg }}>
                      <Icon style={{ color: r.color }} />
                    </div>
                    <ArrowUpRight size={18} style={{ color: 'var(--text-faint)' }} />
                  </div>
                  <p className="label">{r.label}</p>
                  <p className="value">{counts[r.key] ?? 0}</p>
                  <p className="stat-trend">View & manage →</p>
                </Link>
              );
            })}
          </section>
          <section className="card card-body" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>System overview</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '48ch' }}>
                You have <strong style={{ color: 'var(--text)' }}>{total}</strong> total records across
                modules. Start by adding categories, then products and stock entries.
              </p>
            </div>
            <Link to="/products" className="btn btn-primary">
              <Package size={16} />
              Add product
            </Link>
          </section>
        </>
      )}
    </PageShell>
  );
}
