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

var tsalveo = new JsAlveo(
  {
    apiUrl: "https://app.alveo.edu.au",
    apiKey: process.env.ALVEO_API_KEY
  }
);

async function sayHello() {
  try {
    var response = await tsalveo.getUserDetails();
    console.log("Hello", response.first_name, response.last_name + "!");
  } catch (response) {
    console.log("An error has occurred:");
    console.log(" ", response.statusCode, response.error.error);
  }
}

async function displayItem() {
  try {
    var data = await tsalveo.getItem("austalk/2_642_2_7_001");
    console.log(
      data['alveo:metadata']['dcterms:title'],
      data['alveo:metadata']['dcterms:type'],
      "contains", data['alveo:documents'].length, "documents."
    );

    for (var doc of data['alveo:documents']) {
      console.log("-", doc['dcterms:identifier']);
    }
  } catch (response) {
    console.log("An error has occurred:");
    console.log(" ", response.statusCode, response.error.error);
  }
}

sayHello();
displayItem();
