import { FormEvent, useState } from 'react';
import type { Invoice } from '../types';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function InvoicesPage() {
  const res = useResource<Invoice & { invoiceId: number }>('invoices', 'invoiceId');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: 0, productName: '', quantity: 1, lineTotal: 0, total: 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await res.create({
        productId: form.productId || undefined,
        productName: form.productName,
        quantity: Number(form.quantity),
        lineTotal: Number(form.lineTotal),
        total: Number(form.total),
      });
      setOpen(false);
    } catch (err: unknown) {
      res.setError((err as { message?: string }).message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell title="Invoices" description="Sales invoices" action={<button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>+ Add invoice</button>}>
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card card-body table-wrap">
        {res.loading ? <p className="loading">Loading…</p> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Product</th><th>Qty</th><th>Line</th><th>Total</th><th /></tr></thead>
            <tbody>
              {res.items.map((i) => (
                <tr key={res.getId(i)}>
                  <td>{i.invoiceId}</td><td>{i.productName}</td><td>{i.quantity}</td><td>{i.lineTotal}</td><td>{i.total}</td>
                  <td><button type="button" className="btn btn-danger btn-sm" onClick={() => i.invoiceId && res.remove(i.invoiceId)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal title="New invoice" open={open} onClose={() => setOpen(false)} footer={<><button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button type="submit" form="inv-form" className="btn btn-primary" disabled={saving}>Save</button></>}>
        <form id="inv-form" onSubmit={handleSubmit} className="form-grid cols-2">
          <div className="field"><label>Product ID</label><input type="number" value={form.productId} onChange={(e) => setForm({ ...form, productId: +e.target.value })} /></div>
          <div className="field"><label>Product name</label><input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} /></div>
          <div className="field"><label>Quantity</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} /></div>
          <div className="field"><label>Line total</label><input type="number" step="0.01" value={form.lineTotal} onChange={(e) => setForm({ ...form, lineTotal: +e.target.value })} /></div>
          <div className="field"><label>Total</label><input type="number" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: +e.target.value })} /></div>
        </form>
      </Modal>
    </PageShell>
  );
}
