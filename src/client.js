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
    let headers = {}

    if (additionalHeaders != null) {
      headers = additionalHeaders;
    }

    if (headers['Content-Type'] == undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (headers['Accept'] == undefined) {
      headers['Accept'] = 'application/json';
    }

    if (this.apiKey != null ) {
      headers['X-Api-Key'] = this.apiKey;
    }

    return headers;
  }

  /* Send a get request to Alveo
   */
  apiGet(url, headers) {
    return new Request(this.apiUrl + url, {
      method: 'GET',
      headers: this.buildHeaders(headers),
    });
  }

  /* Send a post request to Alveo
   */
  apiPost(url, data, headers) {
    return new Request(this.apiUrl + url, {
      method: 'POST',
      headers: this.buildHeaders(headers),
      body: data
    });
  }

  /* Strip the path from a full URL
   */
  stripDomain(url) {
    return url.replace(/^.*\/\/[^\/]+/, '');
  }
}
