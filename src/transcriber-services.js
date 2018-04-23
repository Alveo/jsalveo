import { Client } from './client';
import { TranscriberServicesPaths } from './paths';

export class TranscriberServices extends Client {
  constructor(options) {
    super(options);
  }

  segment(path) {
    return this.apiGet(TranscriberServicesPaths.segmenterSuffix + '?url=' + path);
  }
}
