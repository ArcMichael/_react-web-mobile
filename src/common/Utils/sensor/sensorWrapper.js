/*
 *
 * Producer -- Alvin
 * Function -- Entry for creating wrappered sensor
 * update
 */
import sensorFieldsIntegrationCreator from './sensorFieldsIntegrationCreator'
import { sensorGoCreator } from './globalSensorHandler'
import { typeofArray, typeofObject } from './utils/typeofUtil'
import warning from './utils/warning'
import * as device from "../../lib/device";

function paramsCheck(param, paramName, type) {
  const typeCheck = {
    object: typeofObject,
    array: typeofArray,
  }
  if (!typeCheck[type](param)) {
    warning(
      `Sensor Warning: Argument '${paramName}' required to function 'WrappedSensor' must be '${type}' ` +
      `but got a ${typeof param}`
    )
    return false
  }
  return true
}
function get_device(devices) {
  if (devices) return devices;
  // if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) return 'wechat'
  if (device.device_inMiniProgramsEnvironment()) return "MP_";
  if (navigator.userAgent.match(/sephora\/app/)) return "APP_";
  return "MB_";
}
export default function initialize(
  eventFieldsMap,
  fields,
  autoCompleteEnhancer = {},
  options = {}
) {
  if (
    !(paramsCheck(eventFieldsMap, 'eventFieldsMap', 'object') &&
      paramsCheck(fields, 'fields', 'array') &&
      paramsCheck(autoCompleteEnhancer, 'autoCompleteEnhancer', 'object')
    )
  ) return {}
  const { sensorIntegrator, SensorIntegration, fieldsConvertion } = sensorFieldsIntegrationCreator({ eventFieldsMap, fields, autoCompleteEnhancer, options })
  let _sensorStatus = 'notInitialized'
  return {
    Integration: SensorIntegration,
    integrator: sensorIntegrator,
    go: function (eventKey, value, sensorKey) {
      const combinedValue = window && sensorIntegrator(eventKey, value)
      console.log(combinedValue, '333');
      if (!combinedValue) return
      const sensorGo = sensorGoCreator(sensorKey)
      if (typeof sensorGo === 'function') {
        sensorGo(eventKey, combinedValue)
      }
    },
    goArray: function (eventKey, value, sensorKey) {
      const sensorGo = sensorGoCreator(sensorKey)
      if (typeof sensorGo === 'function') {
        sensorGo(eventKey, value)
      }
    },
    test: function () {
      Object.keys(eventFieldsMap).forEach((event) => {
        sensorIntegrator(event, {})
      })
    },
    push: function (sensorKey, value, type) {
      const sensorGo = sensorGoCreator(sensorKey)
      const combinedValue = value && fieldsConvertion(value, type)
      if (typeof sensorGo === 'function') {
        sensorGo(combinedValue)
      }
    },
    other: function (sensorKey, value) {
      let sensorGo = sensorGoCreator(sensorKey);
      if (typeof sensorGo === 'function') {
        sensorGo(value);
      }
    },
    registerPage: function (value) {
      let sensorGo = sensorGoCreator("registerPage");
      if (typeof sensorGo === 'function') {
        value["page_id"] = get_device() + value["page_id"]
        sensorGo(value);
      }
    },
    initial: function (value = {}) {
      if (_sensorStatus === 'notInitialized') {
        const sensorGo = sensorGoCreator('registerPage')
        if (typeof sensorGo !== 'function') return
        const combinedValue = sensorIntegrator('registerPage', value)
        if (!combinedValue) return
        sensorGo(combinedValue)
        _sensorStatus = 'initialized'
      }
    },
  }
}
