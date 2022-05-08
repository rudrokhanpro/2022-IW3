import { openDB } from "idb";

export const PRODUCTS_STORE_NAME = "Products";
export const CART_STORE_NAME = "Cart";

let productsStore;
let cartStore;

export function initDB() {
  return openDB("Nozama", 1, {
    upgrade(db) {
      // Create a store of objects
      productsStore = db.createObjectStore(PRODUCTS_STORE_NAME, {
        // The 'id' property of the object will be the key.
        keyPath: "id",
      });
      // Create an index on the 'date' property of the objects.
      productsStore.createIndex("id", "id");
      productsStore.createIndex("category", "category");

      cartStore = db.createObjectStore(CART_STORE_NAME, {
        // The 'id' property of the object will be the key.
        keyPath: "id",
      });
      // Create an index on the 'date' property of the objects.
      cartStore.createIndex("id", "id");
    },
  });
}

export async function setRessources(store, data) {
  const db = await initDB();
  const tx = db.transaction(store, "readwrite");
  data.forEach((item) => {
    tx.store.put(item);
  });
  await tx.done;

  return db.getAllFromIndex(store, "id");
}

export async function setRessource(store, data) {
  const db = await initDB();
  const tx = db.transaction(store, "readwrite");
  await tx.store.put(data);
  await tx.done;
  return db.getFromIndex(store, "id", data.id);
}

export async function getRessources(store) {
  const db = await initDB();
  return db.getAllFromIndex(store, "id");
}

export async function getRessourcesFromIndex(store, indexName) {
  const db = await initDB();
  return db.getAllFromIndex(store, indexName);
}

export async function getRessource(store, id) {
  const db = await initDB();
  return db.getFromIndex(store, "id", id);
}

export async function unsetRessource(store, id) {
  const db = await initDB();
  await db.delete(store, id);
}
