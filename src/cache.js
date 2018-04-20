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

  // TODO: return promise
  put(key, value) {
    value._id = key;

    this.get(key).then(result => {
      value._rev = result._rev;
      this.database.put(value);
    }).catch(error => {
      if (error.status === 404) {
        this.database.put(value);
      } else if (error.status === 409) {
        this.put(key, value);
      } else {
        console.log(error);
      }
    });
  }
}
