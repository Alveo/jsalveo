import request from 'request-promise-native';

export class Client {
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

    if (additionalHeaders != null) {
      headers = additionalHeaders;
    }

    if (this.apiKey != null ) {
      headers['X-Api-Key'] = this.apiKey;
    }

    return headers;
  }

  /* Send a get request to Alveo
   */
  apiGet(url, headers, encoding= 'utf-8') {
    return request({
      method: 'GET',
      uri: this.apiUrl + url,
      headers: this.buildHeaders(headers),
      json: (encoding!=null)? true: false,
      encoding: encoding
    });
  }

  /* Send a post request to Alveo
   */
  apiPost(url, data, headers) {
    return request({
      method: 'POST',
      uri: this.apiUrl + url,
      headers: this.buildHeaders(headers),
      json: data
    });
  }

  /* Strip the path from a full URL
   */
  stripDomain(url) {
    return url.replace(/^.*\/\/[^\/]+/, '');
  }
}
