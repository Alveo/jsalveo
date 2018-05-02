/* Author: David L. Irving
 * This example is intended to be ran with node.js
 *
 * Please set your ALVEO_API_KEY environment variable before use.
 *
 * This example demonstrates how to use the transcriber services
 *  class to automatically segment an audiofile hosted on the Alveo
 *  API.
 *
 * Makes use of ES2017 async to simplify syntax.
 *
 * Execution:
 *  - `babel-node autosegmenter_node.js`
 * */

import { TranscriberServices } from '../src/transcriber-services';

var alveots = new TranscriberServices(
  {
    apiUrl: 'https://segmenter.apps.alveo.edu.au',
    apiAuth: 'app.alveo.edu.au',
    apiKey: process.env.ALVEO_API_KEY
  }
);

async function autosegment() {
  try {
    var segments = await alveots.segment('https://app.alveo.edu.au/catalog/austalk/1_1274_2_7_001/document/1_1274_2_7_001-ch6-speaker16.wav');
    console.log(segments);
  } catch(error) {
    console.log(error.message);
  }
}

autosegment();
