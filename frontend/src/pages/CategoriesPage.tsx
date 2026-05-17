import { FormEvent, useState } from 'react';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Category } from '../types';
import { useResource } from '../hooks/useResource';
import { PageShell } from '../components/PageShell';
import Modal from '../components/Modal';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';

export default function CategoriesPage() {
  const { toast } = useToast();
  const { items, loading, error, create, update, remove, getId, setError } = useResource<
    Category & { categoryId: number }
  >('categories', 'categoryId');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.categoryName);
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?.categoryId) {
        await update(editing.categoryId, { ...editing, categoryName: name, lastModifiedUser: 'web-ui' });
        toast('Category updated');
      } else {
        await create({ categoryName: name, createdUser: 'web-ui' });
        toast('Category created');
      }
      setOpen(false);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? 'Save failed';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Category) => {
    if (!c.categoryId || !confirm(`Delete "${c.categoryName}"?`)) return;
    try {
      await remove(c.categoryId);
      toast('Category deleted');
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? 'Delete failed';
      setError(msg);
      toast(msg, 'error');
    }
  };

  return (
    <PageShell
      title="Categories"
      description="Group products into categories for easier browsing and reporting."
      action={
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Add category
        </button>
      }
    >
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            description="Create your first category to organize products."
            action={
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} />
                Add category
              </button>
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={getId(c)}>
                    <td>{c.categoryId}</td>
                    <td>
                      <strong>{c.categoryName}</strong>
                    </td>
                    <td>
                      <div className="actions">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>
                          <Trash2 size={14} />
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

      <Modal
        title={editing ? 'Edit category' : 'New category'}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="cat-form" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </>
        }
      >
        <form id="cat-form" onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Category name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={20} placeholder="e.g. Electronics" />
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
