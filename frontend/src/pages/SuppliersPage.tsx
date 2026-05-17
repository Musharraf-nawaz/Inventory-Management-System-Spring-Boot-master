import { FormEvent, useState } from 'react';
import type { Supplier } from '../types';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function SuppliersPage() {
  const res = useResource<Supplier & { supplierId: number }>('suppliers', 'supplierId');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ supplierName: '', supplierCompany: '', supplierContact: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        supplierName: form.supplierName,
        supplierCompany: form.supplierCompany,
        supplierContact: form.supplierContact ? Number(form.supplierContact) : undefined,
        createdUser: 'web-ui',
      };
      if (editing?.supplierId) await res.update(editing.supplierId, { ...editing, ...body });
      else await res.create(body);
      setOpen(false);
    } catch (err: unknown) {
      res.setError((err as { message?: string }).message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell title="Suppliers" description="Vendor and supplier records" action={<button type="button" className="btn btn-primary" onClick={() => { setEditing(null); setForm({ supplierName: '', supplierCompany: '', supplierContact: '' }); setOpen(true); }}>+ Add supplier</button>}>
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card card-body">
        {res.loading ? <p className="loading">Loading…</p> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Contact</th><th /></tr></thead>
            <tbody>
              {res.items.map((s) => (
                <tr key={res.getId(s)}>
                  <td>{s.supplierId}</td><td>{s.supplierName}</td><td>{s.supplierCompany}</td><td>{s.supplierContact}</td>
                  <td><div className="actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditing(s); setForm({ supplierName: s.supplierName, supplierCompany: s.supplierCompany ?? '', supplierContact: String(s.supplierContact ?? '') }); setOpen(true); }}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => s.supplierId && res.remove(s.supplierId)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal title={editing ? 'Edit supplier' : 'New supplier'} open={open} onClose={() => setOpen(false)} footer={<><button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button type="submit" form="sup-form" className="btn btn-primary" disabled={saving}>Save</button></>}>
        <form id="sup-form" onSubmit={handleSubmit} className="form-grid">
          <div className="field"><label>Name</label><input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} required /></div>
          <div className="field"><label>Company</label><input value={form.supplierCompany} onChange={(e) => setForm({ ...form, supplierCompany: e.target.value })} /></div>
          <div className="field"><label>Contact</label><input value={form.supplierContact} onChange={(e) => setForm({ ...form, supplierContact: e.target.value })} /></div>
        </form>
      </Modal>
    </PageShell>
  );
}
