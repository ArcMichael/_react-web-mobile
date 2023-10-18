import sensorInitialize from "./sensorWrapper";
import autoCompleteEnhancer from "./autoCompleteEnhancer";

const fields = require("./config/fields.json");
const eventFieldsMap = require("./config/eventFieldsMap.json");

export default sensorInitialize(eventFieldsMap, fields, autoCompleteEnhancer, {
  debug: true,
}) as any;
