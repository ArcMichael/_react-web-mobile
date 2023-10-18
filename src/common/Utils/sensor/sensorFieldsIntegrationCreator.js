import {
  basicTypeConvertion,
} from './utils/typeConvertion'

import {
  typeofString,
} from './utils/typeofUtil'
import warning from './utils/warning'


function getEventKeys(eventFieldsMap) {
  return Object.keys(eventFieldsMap)
}

function filterfields(eventFieldsMapArray, fields) {
  return fields.filter((field) => {
    if (!field.fieldKey) warning(`Sensor Warning: Can not find 'filedKey' in 'fields'`)
    return (eventFieldsMapArray.indexOf(field.fieldKey) > -1)
  })
}

function fieldsConvertion(value, type = 'string') {
  return basicTypeConvertion(type, value)
}
/**
 * Pass the origin value to integrator function to create final value.
 * Automatic complete enhancer will be executed here.
 * @param {Object} originSensorValue
 * @param {Object} filteredfields
 * @param {Function} autoCompleteEnhancer
 * @return {String}
 */
function combineFilteredParams(originSensorValue, filteredfields, autoCompleteEnhancer) {
  const combinedValue = {}
  filteredfields.forEach(({
    fieldKey,
    type,
    autoComplete,
  }) => {
    let value = originSensorValue[fieldKey]
    const enhancer = autoCompleteEnhancer[autoComplete]
    if (autoComplete) {
      try {
        value = enhancer ? enhancer(value) : autoComplete
      } catch (e) {
        warning(
            `Sensor Warning: Can not excute enhancer '${autoComplete}' in 'combineFilteredParams'. ` +
          `Detailed error: ${e}`
        )
      }
    }
    combinedValue[fieldKey] = basicTypeConvertion(type, value)
  })
  return combinedValue
}

/**
 * Create sensorIntegrator
 * * @param {String} originSensorValue
 * @param {String} key
 * @param {Object} filteredfields
 * @param {Function} autoCompleteEnhancer
 * @return {String}
 */
function sensorIntegratorFactory(key, filteredfields, autoCompleteEnhancer) {
  if (!typeofString(key)) {
    warning(`Sensor Warning: Argument 'key' required to function 'sensorEventFactory' must be string`)
    return function() {}
  }
  return function(originSensorValue = {}) {
    return combineFilteredParams(originSensorValue, filteredfields, autoCompleteEnhancer)
  }
}

/**
 * Cycle and filter the eventFieldsMap of specify event and
 * register the integrator function to SensorIntegration object.
 * @param {Object} eventFieldsMap
 * @param {Object} fields
 * @param {Function} autoCompleteEnhancer
 * @return {String}
 */
function sensorIntegrationCreator(
    eventFieldsMap,
    fields,
    autoCompleteEnhancer
) {
  const SensorIntegration = {}
  getEventKeys(eventFieldsMap).forEach((eventKey) => {
    const filteredfields = filterfields(eventFieldsMap[eventKey], fields)
    SensorIntegration[eventKey] = sensorIntegratorFactory(eventKey, filteredfields, autoCompleteEnhancer)
  })
  return SensorIntegration
}

/**
 * Creates a sensor fields store that integrate sensor fields.
 *
 * @param {Object} [eventFieldsMap] All sensor event and fields for specify sensor
 * event should be configured here with a format of key and value.
 *
 * @param {Array} [fields] All sensor fields with its type and automatic complete
 * function key as a default value enhancer need to be configured here
 *
 * @param {Object} [autoCompleteEnhancer] Sensor field aotumatic complete function container
 * Object
 *
 * @return {Object} sensorIntegrator, SensorIntegration
 */
export default function initialize({
  eventFieldsMap = eventFieldsMap,
  fields = fields,
  autoCompleteEnhancer = {},
  options,
}) {
  const {
    debug,
  } = options
  const SensorIntegration = sensorIntegrationCreator(eventFieldsMap, fields, autoCompleteEnhancer);
  return {
    sensorIntegrator: function(sensorEventKey, value) {
      const sensorEvent = SensorIntegration[sensorEventKey]
      if (sensorEvent) {
        const integratedValue = sensorEvent(value)
        try {
          if (debug && typeof console !== 'undefined' && typeof console.table === 'function' && typeof console.group === 'function') {
            console.group(`Sensor event '${sensorEventKey}'`)
            console.table(value)
            console.table(integratedValue)
            console.groupEnd()
          }
        } catch (e) {
          warning(`Sensor Error: Debug log can not convert JSON, detailed error infomation is : ${e}`)
        }
        return integratedValue
      } else {
        warning(
            `Sensor Warning: Can not find event key '${sensorEventKey}' in 'eventFieldsMap'. ` +
          `check if '${sensorEventKey}' is setted in config`
        )
        return {}
      }
    },
    SensorIntegration,
    fieldsConvertion,
  }
}
