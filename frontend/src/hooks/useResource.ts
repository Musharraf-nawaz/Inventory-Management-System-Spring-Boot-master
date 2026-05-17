import { useCallback, useEffect, useState } from 'react';
import { crudApi } from '../api/client';
import type { ApiError } from '../types';

export function useResource<T>(
  resource: string,
  idField: keyof T
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crudApi.list<T>(resource);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (body: unknown) => {
    await crudApi.create<T>(resource, body);
    await load();
  };

  const update = async (id: number, body: unknown) => {
    await crudApi.update<T>(resource, id, body);
    await load();
  };

  const remove = async (id: number) => {
    await crudApi.remove(resource, id);
    await load();
  };

  const getId = (item: T) => Number(item[idField]);

  return { items, loading, error, load, create, update, remove, getId, setError };
}
