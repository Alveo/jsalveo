export { JsAlveo } from './jsalveo';
export { TranscriberServices } from './transcriber-services';

import { JsAlveo } from './jsalveo';

var jsalveo = new JsAlveo(
  {
    apiUrl: "https://app.alveo.edu.au",
    apiKey: process.env.ALVEO_API_KEY
  }
);

async function getListDirectory() {
  try {
    var lists = await jsalveo.getDocument("austalk/1_1274_2_7_001", "1_1274_2_7_001-ch6-speaker16.wav");
    console.log(lists);
  } catch(error) {
    console.log(error.message);
  }
}

getListDirectory();
