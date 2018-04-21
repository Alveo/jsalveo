import PouchDB from 'pouchdb';

export class Cache {
  constructor() {
    this.database = new PouchDB("jsalveo-cache");
  }

  destroy() {
    return this.database.destroy();
  }

  get(key) {
    return this.database.get(key);
  }

  async put(key, value) {
    value._id = key;
    
    try {
      var result = await this.get(key);
      value._rev = result._rev;
      await this.database.put(value);
    } catch (error) {
      if (error.status === 404) {
        await this.database.put(value);
      } else if (error.status === 409) {
        await this.put(key, value);
      } else {
        return Promise.reject(error);
      }
    }
  }
}
