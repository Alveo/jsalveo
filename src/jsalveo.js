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

  async retrieve(
    request,
    storageClass,
    useCache= true,
    useApi= true,
  ) {
    if (!useCache && !useApi) {
      throw new Error("Both cache and API disabled, this is undefined behaviour");
    }

    if (useCache) {
      try {
        var data = await this.database.get(storageClass);
        data = data['storage'];
        if (data != null) {
          console.log('Using cache for: ' + storageClass);
          return data;
        }
      } catch (error) { } // Ignore because we might have other options
    }

    if (useApi) {
      var response = await request;

      if (useCache) {
        console.log('Caching ' + storageClass);
        await this.database.put(storageClass, {storage: response});
      }

      return response;
    }
    throw new Error("No data");
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
