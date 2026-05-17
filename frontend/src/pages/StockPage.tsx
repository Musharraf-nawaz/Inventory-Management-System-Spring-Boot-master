import { FormEvent, useEffect, useState } from 'react';
import type { Category, Product, Stock, Supplier } from '../types';
import { crudApi } from '../api/client';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function StockPage() {
  const res = useResource<Stock & { refId: number }>('stocks', 'refId');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ quantity: 0, branchId: '', productId: 0, supplierId: 0, categoryId: 0, dateStock: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      crudApi.list<Product>('products'),
      crudApi.list<Supplier>('suppliers'),
      crudApi.list<Category>('categories'),
    ]).then(([p, s, c]) => { setProducts(p); setSuppliers(s); setCategories(c); });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await res.create({
        quantity: Number(form.quantity),
        branchId: form.branchId,
        dateStock: form.dateStock || undefined,
        product: form.productId ? { productId: form.productId } : undefined,
        supplier: form.supplierId ? { supplierId: form.supplierId } : undefined,
        category: form.categoryId ? { categoryId: form.categoryId } : undefined,
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
    <PageShell title="Stock" description="Inventory stock levels" action={<button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>+ Add stock</button>}>
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card card-body table-wrap">
        {res.loading ? <p className="loading">Loading…</p> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Qty</th><th>Branch</th><th>Product</th><th>Supplier</th><th>Date</th><th /></tr></thead>
            <tbody>
              {res.items.map((s) => (
                <tr key={res.getId(s)}>
                  <td>{s.refId}</td><td>{s.quantity}</td><td>{s.branchId}</td>
                  <td>{s.product?.productId}</td><td>{s.supplier?.supplierId}</td><td>{s.dateStock?.slice(0, 10)}</td>
                  <td><button type="button" className="btn btn-danger btn-sm" onClick={() => s.refId && res.remove(s.refId)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal title="New stock entry" open={open} onClose={() => setOpen(false)} footer={<><button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button type="submit" form="stock-form" className="btn btn-primary" disabled={saving}>Save</button></>}>
        <form id="stock-form" onSubmit={handleSubmit} className="form-grid cols-2">
          <div className="field"><label>Quantity</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} required /></div>
          <div className="field"><label>Branch ID</label><input value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} /></div>
          <div className="field"><label>Product</label><select value={form.productId} onChange={(e) => setForm({ ...form, productId: +e.target.value })}><option value={0}>—</option>{products.map((p) => <option key={p.productId} value={p.productId}>{p.productName}</option>)}</select></div>
          <div className="field"><label>Supplier</label><select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: +e.target.value })}><option value={0}>—</option>{suppliers.map((s) => <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>)}</select></div>
          <div className="field"><label>Category</label><select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: +e.target.value })}><option value={0}>—</option>{categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}</select></div>
          <div className="field"><label>Date</label><input type="date" value={form.dateStock} onChange={(e) => setForm({ ...form, dateStock: e.target.value })} /></div>
        </form>
      </Modal>
    </PageShell>
  );
}
