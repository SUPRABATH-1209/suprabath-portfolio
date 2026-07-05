const DB_NAME = 'suprabath-portfolio-media-db';
const DB_VERSION = 1;
const STORE = 'files';

export type StoredMedia = {
  key: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};

type StoredRecord = StoredMedia & { blob: Blob };

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
  });
}

export async function saveMediaFile(prefix: string, file: File): Promise<StoredMedia> {
  const db = await openMediaDb();
  const key = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: StoredRecord = {
    key,
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
    blob: file
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
    tx.objectStore(STORE).put(record);
  });
  db.close();

  return { key, name: file.name, type: file.type, size: file.size, createdAt: record.createdAt };
}

export async function getMediaObjectUrl(key: string): Promise<string> {
  const db = await openMediaDb();
  const record = await new Promise<StoredRecord | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as StoredRecord | undefined);
  });
  db.close();
  if (!record?.blob) return '';
  return URL.createObjectURL(record.blob);
}

export async function deleteMediaFile(key?: string) {
  if (!key) return;
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
    tx.objectStore(STORE).delete(key);
  });
  db.close();
}

export function bytesToMb(size: number) {
  return Math.round((size / (1024 * 1024)) * 10) / 10;
}
