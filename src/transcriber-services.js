import { Client } from './client';
import { TranscriberServicesPaths } from './paths';

export class TranscriberServices extends Client {
  constructor(options) {
    super(options);
  }

  buildHeaders(additionalHeaders) {
    headers = super.buildHeaders(additionalHeaders);
    headers['X-Api-Type'] = "alveo"
  }

  segment(path) {
    return this.apiGet(TranscriberServicesPaths.segmenterSuffix + '?remote_url=' + path);
  }
}
