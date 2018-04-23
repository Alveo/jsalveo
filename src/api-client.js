import { Client } from './client';
import { AlveoPaths } from './paths';

/* Client for building requests for the Alveo backend
 */
export class ApiClient extends Client {
  constructor(options) {
    super(options);
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
    return this.apiGet(AlveoPaths.itemSuffix + '/' + this.stripDomain(itemId) + '/document/' + documentId, null, null);
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
