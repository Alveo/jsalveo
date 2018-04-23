/* Author: David L. Irving
 * This example is intended to be ran with node.js
 *
 * Please set your ALVEO_API_KEY environment variable before use.
 *
 * This example demonstrates how to use JsAlveo to retrieve associated
 *  the list directory.
 *
 * Makes use of ES2017 async to simplify syntax.
 *
 * Execution:
 *  - `babel-node lists_node_async.js`
 * */

import { JsAlveo } from '../src/jsalveo';

var jsalveo = new JsAlveo(
  {
    apiUrl: "https://app.alveo.edu.au",
    apiKey: process.env.ALVEO_API_KEY
  }
);

async function getListDirectory() {
  try {
    var lists = await jsalveo.getListDirectory(true, false);
    console.log(lists);
  } catch(error) {
    console.log(error.message);
  }
}

getListDirectory();
