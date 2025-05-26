import type { StorageValues } from "../@types/StorageValues";

function emitStorageChangeEvent(key: string) {
  window.dispatchEvent(
    new CustomEvent("local-storage-change", { detail: { key } })
  );
}

class StorageService {
  /**
   * Recupera um registro do localStorage
   * @param key Chave de armazenamento
   */
  static getItem<T extends keyof StorageValues>(
    key: T
  ): StorageValues[T] | null {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as StorageValues[T]) : null;
  }

  /**
   * Salvar um registro no localStorage
   * @param key Chave de armazenamento
   * @param value Valor a ser salvo
   */
  static setItem<T extends keyof StorageValues>(
    key: T,
    value: StorageValues[T]
  ) {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    emitStorageChangeEvent(key);
  }

  /**
   * Remove um registro do localStorage
   * @param key Chave de armazenamento
   */
  static removeItem<T extends keyof StorageValues>(key: T) {
    localStorage.removeItem(key);
    emitStorageChangeEvent(key);
  }
}

export default StorageService;
