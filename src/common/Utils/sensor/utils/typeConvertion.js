/*
 *
 * Producer -- Alvin
 * Time -- 2018/7/5
 * Function -- Transform type
 *
 */
import warning from './warning';

export const checkValueExsit = v => !(v === null || v === undefined); 

export const basicTypeConvertion = (basicType, v) => {
    let typeContainer = {
        string: String,
        number: Number,
        boolean: Boolean
    };
    let convertion = typeContainer[basicType];
    if(!convertion){
        warning(`Argument 'basicType' required to function 'basicTypeConvertion' must be 'string', 'number' or 'boolean'`);
        return v;
    }
    return convertion(v || '');
};