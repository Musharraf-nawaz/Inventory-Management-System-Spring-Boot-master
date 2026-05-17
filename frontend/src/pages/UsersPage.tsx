import { useEffect, useState } from 'react';
import type { User } from '../types';
import { crudApi } from '../api/client';
import { PageShell } from '../components/PageShell';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    crudApi.list<User>('users')
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Users" description="System users (admin only)">
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card card-body table-wrap">
        {loading ? <p className="loading">Loading…</p> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Email</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td><td>{u.userName}</td><td>{u.userFname} {u.userLname}</td><td>{u.userEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageShell>
  );
}
