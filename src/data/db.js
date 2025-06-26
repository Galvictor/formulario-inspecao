import {openDB} from 'idb';

const DB_NAME = 'inspecoes-db';
const STORE_NAME = 'inspecoes';
const DB_VERSION = 1;

// Cria ou abre o banco
const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {keyPath: 'id', autoIncrement: true});
        }
    }
});

// Função para salvar uma inspeção
export async function saveDataToIndexedDB(data) {
    const db = await dbPromise;
    await db.add(STORE_NAME, {
        ...data,
        createdAt: new Date().toISOString()
    });
}

// (Opcional) Função para listar todas
export async function getAllInspecoes() {
    const db = await dbPromise;
    return await db.getAll(STORE_NAME);
}

// (Opcional) Deletar tudo
export async function clearInspecoes() {
    const db = await dbPromise;
    return await db.clear(STORE_NAME);
}
