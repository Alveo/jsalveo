import { ApiClient } from './api-client';
import { Cache } from './cache';

export class JsAlveo {
  constructor(options) {
    if (options.apiKey == '') {
      console.log('jsAlveo: [Warn] You should set apiKey to null to instead of \'\'.',
                    'jsAlveo will send empty X-Api-Key header otherwise.');
    }
    this.database = new Cache();
    this.apiClient = new ApiClient({
      apiUrl: options.apiUrl,
      apiKey: options.apiKey
    });
  }

  async retrieve(storageKey, request= null, useCache= true) {
    if (!useCache && request == null) {
      throw new Error('Both cache and no API request provided, this is undefined behaviour');
    }

    if (useCache) {
      try {
        var data = await this.database.get(storageKey);
        if (data != null) {
          console.log('jsAlveo: Using cache for: ' + storageKey);

          return data;
        }
      } catch (error) {} // Ignore because we might have other options
    }

    if (request != null) {
      let response = await fetch(request);
      console.log('jsAlveo: Making', request.method, 'request for', request.url);

      if (request.headers.get('Accept') == 'application/json') {
        response = await response.json();
      } else {
        response = await response.arrayBuffer();
      }

      if (useCache) {
        console.log('jsAlveo: Caching ' + storageKey);
        let a = await this.database.put(storageKey, {storage: response});
      }

      return response;
    }

    throw new Error('No data');
  }

  getListDirectory(useCache= true, useApi= true) {
    return this.retrieve(
      'lists', 
      (useApi)? this.apiClient.getListIndex(): null, 
      useCache
    );
  }

  getList(list_id, useCache= true, useApi= true) {
    return this.retrieve(
      'list:' + list_id,
      (useApi)? this.apiClient.getList(list_id): null,
      useCache
    );
  }

  getItem(item_id, useCache= true, useApi= true) {
    return this.retrieve(
      'item:' + item_id,
      (useApi)? this.apiClient.getItem(item_id): null,
      useCache
    );
  }

  getDocument(item_id, document_id, useCache= true, useApi= true) {
    return this.retrieve(
      'document:' + item_id + ':' + document_id,
      (useApi)? this.apiClient.getDocument(item_id, document_id): null,
      useCache
    );
  }

  async getUserDetails() {
    let response = await fetch(this.apiClient.getUserDetails());
    return response.json()
  }

  async oAuthenticate(clientID, clientSecret, authCode, callbackUrl) {
    var tokenResponse = await this.apiClient.getOAuthToken(
        clientID,
        clientSecret,
        authCode,
        callbackUrl,
      );
    tokenResponse = await tokenResponse.json()

    var apiResponse = await fetch(this.apiClient.getApiKey(tokenResponse['access_token']));
    apiResponse = await apiResponse.json()

    this.setApiKey(apiResponse['apiKey']);
  }

  async purgeCache() {
    await this.database.destroy();
    this.database = new Cache();
  }

  async purgeCacheByKey(storageKey) {
    await this.database.put(storageKey, null);
  }

  setApiKey(apiKey) {
    this.apiClient.setApiKey(apiKey);
  }

  unregister() {
    this.apiClient.setApiKey(null);
  }
}
