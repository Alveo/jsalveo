import Dexie from 'dexie';

export class Cache {
  constructor() {
    this.database = new Dexie("jsalveo-cache");
    this.database.version(1).stores(
      {
        cache: "++id, name"
      }
    )
  }

  destroy() {
    return this.database.delete();
  }

  get(key) {
    return this.database.cache.where("name").equals(key).first();
  }

  put(key, value) {
    return this.database.cache.put({
      name: key,
      value: value,
    })
  }
}
