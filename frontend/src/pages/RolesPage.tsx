import { useEffect, useState } from 'react';
import type { Role } from '../types';
import { crudApi } from '../api/client';
import { PageShell } from '../components/PageShell';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crudApi.list<Role>('roles').then(setRoles).finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Roles" description="Access roles">
      <div className="card card-body table-wrap">
        {loading ? <p className="loading">Loading…</p> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Role</th></tr></thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.roleId}><td>{r.roleId}</td><td>{r.roleName}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageShell>
  );
}
