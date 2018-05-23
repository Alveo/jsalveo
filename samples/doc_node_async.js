/* Author: David L. Irving
 * This example is intended to be ran with node.js
 *
 * Please set your ALVEO_API_KEY environment variable before use.
 *
 * This example demonstrates how to use JsAlveo to retrieve
 *  a document.
 *
 * Makes use of ES2017 async to simplify syntax.
 *
 * Execution:
 *  - `babel-node doc_node_async.js`
 * */

import { JsAlveo } from '../src/jsalveo';

var jsalveo = new JsAlveo(
  {
    apiUrl: "https://app.alveo.edu.au",
    apiKey: process.env.ALVEO_API_KEY
  }
);

async function getDocument() {
  try {
    var lists = await jsalveo.getDocument("austalk/1_1274_2_7_001", "1_1274_2_7_001-ch6-speaker16.wav");
    console.log(lists);
  } catch(error) {
    console.log(error);
  }
}

getDocument();
