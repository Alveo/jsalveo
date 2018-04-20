import { ApiClient } from './api-client';
import { Cache } from './cache';

export class JsAlveo {
  constructor(baseUrl, apiKey, verbose= true) {
    this.database = new Cache();
    this.apiClient = new ApiClient({
      alveoApiUrl: baseUrl,
      apiKey: apiKey
    });

    this.verbose = verbose;
  }

  checkCache(storageName) {
    return new Promise(
      (resolve, reject) => {
        this.database.get(storageName).then(
          data => {
            if (data['storage'] == null) {
              reject(404)
            }
            resolve(data['storage']);
          }
        ).catch(
          error => {
            reject(error)
          }
        );
      }
    );
  }

  retrieve(
    request,
    storageClass,
    useCache= true,
    useApi= true,
  ) {
    return new Promise(
      (resolve, reject) => {
        new Promise(
          (cacheResolve, cacheReject) => {
            if (useCache) {
              this.checkCache(storageClass).then(
                cachedData => {
                  console.log('Using DB source for: ' + storageClass);
                  cacheResolve(cachedData);
                }
              ).catch(
                cacheError => {
                  cacheReject(cacheError);
                }
              );
            } else {
              reject('Cache requests not allowed, method flag disabled');
            }
          }).then(
            cachedData => {
              resolve(cachedData);
            }
          ).catch(
            cacheError => {
              if (useApi) {
                request.then(
                  responseData => {
                    if (useCache) {
                      console.log('Caching ' + storageClass);
                      // TODO promise return for put
                      this.database.put(storageClass, {storage: responseData});
                      resolve(responseData);
                    } else {
                      resolve(responseData);
                    }
                  }
                ).catch(
                  apiError => {
                    reject(apiError);
                  }
                );
              } else {
                reject('API requests not allowed, method flag disabled');
              }
            }
          );
      }
    );
  }

  getListDirectory(useCache= true, useApi= true) {
    return this.retrieve(this.apiClient.getListIndex(), 'lists', useCache, useApi);
  }

  getList(list_id, useCache= true, useApi= true) {
    return this.retrieve(this.apiClient.getList(list_id), 'list:' + list_id, useCache, useApi);
  }

  getItem(item_id, useCache= true, useApi= true) {
    return this.retrieve(this.apiClient.getItem(item_id), 'item:' + item_id, useCache, useApi);
  }

  getAudioFile(item_id, file_id, useCache= true, useApi = true) {
    return this.retrieve(this.apiClient.getDocument(item_id, file_id), 'docfile:' + file_id, useCache, useApi);
  }

  getUserDetails() {
    return this.apiClient.getUserDetails();
  }

  oAuthenticate(clientID, clientSecret, authCode, callbackUrl) {
    return new Promise(
      (resolve, reject) => {
        this.apiClient.getOAuthToken(
          clientID,
          clientSecret,
          authCode,
          callbackUrl,
        ).then(
          tokenResponse => {
            this.apiClient.getApiKey(tokenResponse['access_token']).then(
              apiResponse => {
                this.setApiKey(apiResponse['apiKey']);
                resolve();
              }
            ).catch(
              apiError => {
                reject(apiError);
              }
            );
          }
        ).catch(
          tokenError => {
            reject(tokenError);
          }
        );
      }
    );
  }

  purgeCache() {
    return new Promise(
      (resolve, reject) => {
        this.database.destroy().then(
          () => {
            this.database = new Cache();
            resolve();
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  setApiKey(apiKey) {
    this.apiClient.setApiKey(apiKey);
  }
}
