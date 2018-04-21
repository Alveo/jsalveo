import request from 'request-promise-native';

import { AlveoPaths } from './paths';

/* Client for building requests for the Alveo backend
 */
export class ApiClient {
  constructor(options) {
    this.apiUrl = options.apiUrl;
    this.apiKey = options.apiKey;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /* Build appropriate API headers
   *  Injects apiKey if one is available
   *
   *  Should be used before making an API request
   */
  buildHeaders(additionalHeaders) {
    var headers = {
    }

    if (additionalHeaders != undefined) {
      headers = additionalHeaders;
    }

    if (this.apiKey != null ) {
      headers['X-Api-Key'] = this.apiKey;
    }

    return headers;
  }

  /* Send a get request to Alveo
   */
  apiGet(url, headers) {
    return request.get({
      url: this.apiUrl + url,
      headers: this.buildHeaders(headers),
      json: true,
    });
  }

  /* Send a post request to Alveo
   */
  apiPost(url, data, headers) {
    return request.post({
      url: this.apiUrl + url,
      headers: this.buildHeaders(headers),
      json: true
    }, data);
  }

  /* Strip the path from a full URL
   */
  stripDomain(url) {
    return url.replace(/^.*\/\/[^\/]+/, '');
  }

  /* Fetch directory of lists from Alveo API
   *  Expects JSON response
   */
  getListIndex() {
    return this.apiGet(AlveoPaths.listSuffix);
  }

  /* Fetch list from Alveo API
   *  Expects JSON response
   */
  getList(id) {
    return this.apiGet(AlveoPaths.listSuffix + '/' + this.stripDomain(id));
  }

  /* Fetch list item from Alveo API
   *  Expects JSON response
   */
  getItem(itemId) {
    return this.apiGet(AlveoPaths.itemSuffix + '/' + this.stripDomain(itemId));
  }

  /* Use an Alveo URL directly
   *  Expects JSON response
   *
   * Used when you have a URL but it doesn't make sense to simplify it to a list/item/document
   */
  getResource(url) {
    return this.apiGet(this.stripDomain(url));
  }

  /* Fetch document via Alveo API
   *  Expects ArrayBuffer back from subscribe
   */
  getDocument(itemId, documentId) {
    return this.apiGet(AlveoPaths.itemSuffix + '/' + this.stripDomain(itemId) + '/document/' + documentId,
      {'responseType': 'arraybuffer'});
  }

  /* Create a request to get an OAuth token
   *  These variables are obtained by the Auth service
   */
  getOAuthToken(clientID, clientSecret, authCode, callbackUrl)  {
    return this.apiPost(AlveoPaths.oAuthTokenSuffix,
      {
        'grant_type': 'authorization_code',
        'client_id': clientID,
        'client_secret': clientSecret,
        'code': authCode,
        'redirect_uri': callbackUrl
      }
    );
  }

  /* Create a request to get an API key
   *  Uses token retrievable by getOAuthToken()
   */
  getApiKey(token) {
    const requestHeaders = { 'Authorization': 'Bearer ' + token };

    return this.apiGet(AlveoPaths.apiKeySuffix, requestHeaders);
  }

  getUserDetails() {
    return this.apiGet(AlveoPaths.userDetails);
  }
}
