import { Client } from './client';
import { TranscriberServicesPaths } from './paths';

export class TranscriberServices extends Client {
  constructor(options) {
    super(options);
    this.apiAuth = options['apiAuth'];
  }

  buildHeaders(additionalHeaders) {
    var headers = super.buildHeaders(additionalHeaders);
    headers['X-Api-Domain'] = this.apiAuth
    headers['X-Api-Key'] = this.apiKey

    return headers;
  }

  async segment(path) {
    let response = await fetch(this.apiGet(TranscriberServicesPaths.segmenterSuffix + '?remote_url=' + path));
    return response.json()
  }
}
