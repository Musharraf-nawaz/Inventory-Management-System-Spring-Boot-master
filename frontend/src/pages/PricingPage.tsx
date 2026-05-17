import { FormEvent, useState } from 'react';
import type { Pricing } from '../types';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function PricingPage() {
  const res = useResource<Pricing & { pricingId: number }>('pricings', 'pricingId');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ pricingName: '', pricingDiscountPrecentage: 0, pricingEffectiveDate: '', pricingExpireDate: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await res.create({
        pricingName: form.pricingName,
        pricingDiscountPrecentage: form.pricingDiscountPrecentage,
        pricingEffectiveDate: form.pricingEffectiveDate || undefined,
        pricingExpireDate: form.pricingExpireDate || undefined,
        createdUser: 'web-ui',
      });
      setOpen(false);
    } catch (err: unknown) {
      res.setError((err as { message?: string }).message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell title="Pricing" description="Discount and pricing rules" action={<button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>+ Add pricing</button>}>
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card card-body table-wrap">
        {res.loading ? <p className="loading">Loading…</p> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Discount %</th><th>From</th><th>To</th><th /></tr></thead>
            <tbody>
              {res.items.map((p) => (
                <tr key={res.getId(p)}>
                  <td>{p.pricingId}</td><td>{p.pricingName}</td><td>{p.pricingDiscountPrecentage}</td>
                  <td>{p.pricingEffectiveDate?.slice(0, 10)}</td><td>{p.pricingExpireDate?.slice(0, 10)}</td>
                  <td><button type="button" className="btn btn-danger btn-sm" onClick={() => p.pricingId && res.remove(p.pricingId)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal title="New pricing" open={open} onClose={() => setOpen(false)} footer={<><button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button type="submit" form="price-form" className="btn btn-primary" disabled={saving}>Save</button></>}>
        <form id="price-form" onSubmit={handleSubmit} className="form-grid cols-2">
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Name</label><input value={form.pricingName} onChange={(e) => setForm({ ...form, pricingName: e.target.value })} required /></div>
          <div className="field"><label>Discount %</label><input type="number" value={form.pricingDiscountPrecentage} onChange={(e) => setForm({ ...form, pricingDiscountPrecentage: +e.target.value })} /></div>
          <div className="field"><label>Effective</label><input type="date" value={form.pricingEffectiveDate} onChange={(e) => setForm({ ...form, pricingEffectiveDate: e.target.value })} /></div>
          <div className="field"><label>Expires</label><input type="date" value={form.pricingExpireDate} onChange={(e) => setForm({ ...form, pricingExpireDate: e.target.value })} /></div>
        </form>
      </Modal>
    </PageShell>
  );
}
