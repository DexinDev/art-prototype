// src/db.js
import Dexie from 'dexie';

const db = new Dexie('artDatabase');
db.version(1).stores({
  artworks: '++id, name, artist, unique, image, price, year',
  prints: '++id, artworkId, edition, material, scale, price, media',
});

export const saveArtwork = async (artwork) => {
  if (artwork.id) {
    await db.artworks.put(artwork);
  } else {
    await db.artworks.add(artwork);
  }
};

export const getAllArtworks = async () => {
  return await db.artworks.toArray();
};

export const getArtworkById = async (id) => {
  return await db.artworks.get(id);
};

export const deleteArtworkById = async (id) => {
  await db.artworks.delete(id);
};

export const savePrints = async (prints) => {
  await db.prints.bulkPut(prints);
};

export const getPrintsByArtworkId = async (artworkId) => {
  if (artworkId == null || isNaN(Number(artworkId))) {
    throw new Error(`Invalid artworkId provided for fetching prints: ${artworkId}`);
  }
  return await db.prints.where('artworkId').equals(Number(artworkId)).toArray();
};

export const getPrintById = async (id) => {
  return await db.prints.get(id);
};

export const savePrint = async (print) => {
  await db.prints.put(print);
};

export const deletePrintById = async (id) => {
  await db.prints.delete(id);
};

export const saveMediaForPrints = async (printIds, media) => {
  await db.transaction('rw', db.prints, async () => {
    for (const printId of printIds) {
      const print = await db.prints.get(printId);
      print.media = [...(print.media || []), ...media];
      await db.prints.put(print);
    }
  });
};

export default db;
