import { FormEvent, useEffect, useState } from 'react';
import type { Pricing, Product, ProductPricing } from '../types';
import { crudApi } from '../api/client';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function ProductPricingPage() {
  const res = useResource<ProductPricing & { refId: number }>('product-pricings', 'refId');
  const [products, setProducts] = useState<Product[]>([]);
  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: 0, pricingId: 0 });

  useEffect(() => {
    Promise.all([crudApi.list<Product>('products'), crudApi.list<Pricing>('pricings')]).then(([p, pr]) => {
      setProducts(p);
      setPricings(pr);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await res.create({ product: { productId: form.productId }, pricing: { pricingId: form.pricingId } });
    setOpen(false);
  };

  return (
    <PageShell title="Product pricing" description="Link products to pricing rules" action={<button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>+ Link</button>}>
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card card-body table-wrap">
        <table className="data-table">
          <thead><tr><th>Ref</th><th>Product</th><th>Pricing</th><th /></tr></thead>
          <tbody>
            {res.items.map((r) => (
              <tr key={res.getId(r)}>
                <td>{r.refId}</td><td>{r.product?.productId}</td><td>{r.pricing?.pricingId}</td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => r.refId && res.remove(r.refId)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal title="Link product & pricing" open={open} onClose={() => setOpen(false)} footer={<button type="submit" form="pp-form" className="btn btn-primary">Save</button>}>
        <form id="pp-form" onSubmit={handleSubmit} className="form-grid">
          <div className="field"><label>Product</label><select value={form.productId} onChange={(e) => setForm({ ...form, productId: +e.target.value })} required>{products.map((p) => <option key={p.productId} value={p.productId}>{p.productName}</option>)}</select></div>
          <div className="field"><label>Pricing</label><select value={form.pricingId} onChange={(e) => setForm({ ...form, pricingId: +e.target.value })} required>{pricings.map((p) => <option key={p.pricingId} value={p.pricingId}>{p.pricingName}</option>)}</select></div>
        </form>
      </Modal>
    </PageShell>
  );
}
