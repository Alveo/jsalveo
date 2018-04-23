import { ApiClient } from './api-client';
import { Cache } from './cache';

export class JsAlveo {
  constructor(options) {
    this.database = new Cache();
    this.apiClient = new ApiClient({
      apiUrl: options.apiUrl,
      apiKey: options.apiKey
    });
  }

  async retrieve(storageKey, request= null, useCache= true) {
    if (!useCache && request == null) {
      throw new Error("Both cache and no API request provided, this is undefined behaviour");
    }

    if (useCache) {
      try {
        var data = await this.database.get(storageKey);
        data = data['storage'];
        if (data != null) {
          console.log('jsAlveo: Using cache for: ' + storageKey);

          if (request == null) {
            request.abort();
          }

          return data;
        }
      } catch (error) { } // Ignore because we might have other options
    }

    if (request != null) {
      console.log('jsAlveo: Making', request.method, 'request for', request.uri.href);
      var response = await request;

      if (useCache) {
        console.log('jsAlveo: Caching ' + storageKey);
        await this.database.put(storageKey, {storage: response});
      }

      return response;
    }

    throw new Error("No data");
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
      'document:' + item_id + ":" + document_id,
      (useApi)? this.apiClient.getDocument(item_id, file_id): null,
      useCache
    );
  }

  getUserDetails() {
    return this.apiClient.getUserDetails();
  }

  async oAuthenticate(clientID, clientSecret, authCode, callbackUrl) {
    var tokenResponse = await this.apiClient.getOAuthToken(
        clientID,
        clientSecret,
        authCode,
        callbackUrl,
      );

    var apiResponse = await this.apiClient.getApiKey(tokenResponse['access_token']);
    this.setApiKey(apiResponse['apiKey']);
  }

  async purgeCache() {
    await this.database.destroy();
    this.database = new Cache();
  }

  setApiKey(apiKey) {
    this.apiClient.setApiKey(apiKey);
  }
}
