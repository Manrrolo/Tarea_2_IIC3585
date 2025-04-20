import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'image-processor-db';
const STORE_NAME = 'images';

type ImagePair = {
  original: Blob;
  filtered: Blob;
};

type ImageDB = {
  images: ImagePair;
};

let dbPromise: Promise<IDBPDatabase<ImageDB>> | null = null;

export const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<ImageDB>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
};

export const saveImagePair = async (key: string, pair: ImagePair): Promise<void> => {
  const db = await getDB();
  await db.put(STORE_NAME, pair, key);
  console.log(`[DB] Imagen guardada con clave: ${key}`);
};

export const getImagePair = async (key: string): Promise<ImagePair | undefined> => {
  const db = await getDB();
  return await db.get(STORE_NAME, key);
};

export const getAllKeys = async (): Promise<string[]> => {
  const db = await getDB();
  const keys = await db.getAllKeys(STORE_NAME);
  return keys.map(key => String(key));
};
