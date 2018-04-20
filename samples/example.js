import { JsAlveo } from '../src/jsalveo';

var tsalveo = new JsAlveo("https://app.alveo.edu.au", "");

tsalveo.getUserDetails().then(
  (data) => {
    console.log(data.user_id);
  }
).catch(
  (error) => {
    console.log(error);
  }
);

tsalveo.getItem("austalk/2_642_2_7_001?il=1302").then(
  (data) => {
    console.log(data['alveo:metadata']);
  }
).catch(
  (error) => {
    console.log(error);
  }
);
