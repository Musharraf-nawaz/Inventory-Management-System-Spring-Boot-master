import { FormEvent, useEffect, useState } from 'react';
import type { Invoice, Product, ProductInvoice } from '../types';
import { crudApi } from '../api/client';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';

export default function ProductInvoicePage() {
  const res = useResource<ProductInvoice & { refId: number }>('product-invoices', 'refId');
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: 0, invoiceId: 0 });

  useEffect(() => {
    Promise.all([crudApi.list<Product>('products'), crudApi.list<Invoice>('invoices')]).then(([p, i]) => {
      setProducts(p);
      setInvoices(i);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await res.create({ product: { productId: form.productId }, invoice: { invoiceId: form.invoiceId } });
    setOpen(false);
  };

  return (
    <PageShell title="Product invoices" description="Link products to invoices" action={<button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>+ Link</button>}>
      {res.error && <div className="alert alert-error">{res.error}</div>}
      <div className="card card-body table-wrap">
        <table className="data-table">
          <thead><tr><th>Ref</th><th>Product</th><th>Invoice</th><th /></tr></thead>
          <tbody>
            {res.items.map((r) => (
              <tr key={res.getId(r)}>
                <td>{r.refId}</td><td>{r.product?.productId}</td><td>{r.invoice?.invoiceId}</td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => r.refId && res.remove(r.refId)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal title="Link product & invoice" open={open} onClose={() => setOpen(false)} footer={<button type="submit" form="pi-form" className="btn btn-primary">Save</button>}>
        <form id="pi-form" onSubmit={handleSubmit} className="form-grid">
          <div className="field"><label>Product</label><select value={form.productId} onChange={(e) => setForm({ ...form, productId: +e.target.value })} required>{products.map((p) => <option key={p.productId} value={p.productId}>{p.productName}</option>)}</select></div>
          <div className="field"><label>Invoice</label><select value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: +e.target.value })} required>{invoices.map((i) => <option key={i.invoiceId} value={i.invoiceId}>#{i.invoiceId}</option>)}</select></div>
        </form>
      </Modal>
    </PageShell>
  );
}
