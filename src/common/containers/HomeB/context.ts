import React from "react";

export const HomepageContextInitvalue = {
  isLogin: false,
  shopcartNumber: 0,
  /** @type {import('@/lib/services/MyAccount').UserCardDTO | null} - description */
  usrCardInfo: null,
  afterGetIsLogin: false,
  scrollTop: 0,
};

/**
 * @typedef {typeof HomepageContextInitvalue} HomepageContextValueType
 */

const HomepageContext = React.createContext(HomepageContextInitvalue);

export const Provider = HomepageContext.Provider;
export const Consumer = HomepageContext.Consumer;
