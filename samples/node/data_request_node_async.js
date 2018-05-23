/* Author: David L. Irving
 * This example is intended to be ran with node.js
 *
 * Please set your ALVEO_API_KEY environment variable before use.
 *
 * This example demonstrates how to use JsAlveo to retrieve associated
 *  user data and an item from the austalk collection with a valid Alveo
 *  API key.
 *
 * Makes use of ES2017 async to simplify syntax.
 *
 * Execution:
 *  - `babel-node data_request_node_async.js`
 * */

import { JsAlveo } from '../src/jsalveo';

var jsalveo = new JsAlveo(
  {
    apiUrl: "https://app.alveo.edu.au",
    apiKey: process.env.ALVEO_API_KEY
  }
);

async function sayHello() {
  try {
    var response = await jsalveo.getUserDetails();
    console.log("Hello", response.first_name, response.last_name + "!");
  } catch (error) {
    console.log("An error has occurred:", error);
  }
}

async function displayItem() {
  try {
    var data = await jsalveo.getItem("austalk/2_642_2_7_001");
    console.log(
      data['alveo:metadata']['dcterms:title'],
      data['alveo:metadata']['dcterms:type'],
      "contains", data['alveo:documents'].length, "documents."
    );

    for (var doc of data['alveo:documents']) {
      console.log("-", doc['dcterms:identifier']);
    }
  } catch (error) {
    console.log("An error has occurred:", error);
  }
}

async function asyncAwaitExample() {
  try {
    await jsalveo.purgeCache();
    console.log("Cache purged", 'query #1 (API request made)');
    await displayItem();
    console.log("Query #2 (cache)");
    await displayItem();
    console.log("Query #3 (cache)");
    await displayItem();
    await jsalveo.purgeCache();
    console.log("Cache purged", 'query #3 (API request made)');
    await displayItem();
    console.log("Query #5 (cache)");
    await displayItem();
  } catch(error) {
    console.log(error);
  }
}

async function doInOrder() {
  await asyncAwaitExample();
  await sayHello();
  console.log("All done!");
}

doInOrder();
