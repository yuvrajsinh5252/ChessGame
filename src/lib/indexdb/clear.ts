import { getDB, STORE_NAME } from "./initial";

export const clearObjectStore = async () => {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  await store.clear();

  console.log(`${STORE_NAME} cleared successfully.`);
};
