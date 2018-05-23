import Dexie from 'dexie';

export class Cache {
  constructor() {
    this.database = new Dexie("jsalveo-cache");
    this.database.version(1).stores({cache: ""})
  }

  destroy() {
    return this.database.delete();
  }

  get(key) {
    return this.database.cache.get(key);
  }

  put(key, value) {
    return this.database.cache.put(value, key)
  }
}
