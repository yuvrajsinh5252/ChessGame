import { openDB } from "idb";

export const DB_NAME = "ChessDB";
export const STORE_NAME = "moves";

async function initializeDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
}

export const getDB = async () => {
  const db = await initializeDB();
  return db;
};
