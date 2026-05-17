import { FormEvent, useEffect, useState } from 'react';
import type { Category, Product } from '../types';
import { crudApi } from '../api/client';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function ProductsPage() {
  const res = useResource<Product & { productId: number }>('products', 'productId');
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    productName: '',
    productbuyingPrice: 0,
    productsellingPrice: 0,
    productIsService: 0,
    categoryId: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    crudApi.list<Category>('categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      productName: '',
      productbuyingPrice: 0,
      productsellingPrice: 0,
      productIsService: 0,
      categoryId: categories[0]?.categoryId ?? 0,
    });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      productName: p.productName,
      productbuyingPrice: p.productbuyingPrice,
      productsellingPrice: p.productsellingPrice,
      productIsService: p.productIsService,
      categoryId: p.category?.categoryId ?? 0,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        productName: form.productName,
        productbuyingPrice: Number(form.productbuyingPrice),
        productsellingPrice: Number(form.productsellingPrice),
        productIsService: Number(form.productIsService),
        category: form.categoryId ? { categoryId: form.categoryId } : undefined,
        createdUser: 'web-ui',
      };
      if (editing?.productId) {
        await res.update(editing.productId, { ...editing, ...body, lastModifiedUser: 'web-ui' });
      } else {
        await res.create(body);
      }
      setOpen(false);
    } catch (err: unknown) {
      res.setError((err as { message?: string }).message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title="Products"
      description="Manage product catalog and prices"
      action={
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Add product
        </button>
      }
    >
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card">
        <div className="card-body">
          {res.loading ? (
            <p className="loading">Loading…</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Buy</th>
                    <th>Sell</th>
                    <th>Category</th>
                    <th>Service</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {res.items.map((p) => (
                    <tr key={res.getId(p)}>
                      <td>{p.productId}</td>
                      <td>{p.productName}</td>
                      <td>{p.productbuyingPrice}</td>
                      <td>{p.productsellingPrice}</td>
                      <td>{p.category?.categoryId ?? '—'}</td>
                      <td>{p.productIsService ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => p.productId && res.remove(p.productId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        title={editing ? 'Edit product' : 'New product'}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" form="prod-form" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <form id="prod-form" onSubmit={handleSubmit} className="form-grid cols-2">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Name</label>
            <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
          </div>
          <div className="field">
            <label>Buying price</label>
            <input type="number" step="0.01" value={form.productbuyingPrice} onChange={(e) => setForm({ ...form, productbuyingPrice: +e.target.value })} />
          </div>
          <div className="field">
            <label>Selling price</label>
            <input type="number" step="0.01" value={form.productsellingPrice} onChange={(e) => setForm({ ...form, productsellingPrice: +e.target.value })} />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: +e.target.value })}>
              <option value={0}>—</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Is service?</label>
            <select value={form.productIsService} onChange={(e) => setForm({ ...form, productIsService: +e.target.value })}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
