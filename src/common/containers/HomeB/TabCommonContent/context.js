import React from 'react';

/**
 * @typedef {import('@/lib/services/Mpcms').TabSessionFirstResponse['results']} Session1;
 */
/**
 * @typedef {import('@/lib/services/Mpcms').TabSessionSecondResponse['results']} Session2;
 */

export const TabContextInitvalue = {
  /** @type {Session1['brand']} - description */
  brand: {
    allBrand: {},
    brandWall: [],
  },
  /** @type {Session1['hero']} - description */
  hero: [],
  /** @type {Session1['icon']} - description */
  icon: [],
  banner1: [],
  ranking: {
    title: {},
    products: [],
  },
};

/**
 * @typedef {typeof TabContextInitvalue} TabContextInitvalueType
 */

export const TabContext = React.createContext(TabContextInitvalue);

export const Provider = TabContext.Provider;
export const Consumer = TabContext.Consumer;
