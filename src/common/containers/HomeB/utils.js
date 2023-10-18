/**
 * @typedef {import('@/lib/services/Mpcms').ContentCommonDetail} ContentCommonDetail
 */

/**
 * @param  {ContentCommonDetail[]} args
 */
export const getLinkFromItems = (...args) => {
  if (Array.isArray(args) && args.length > 0) {
    const linkItem = args.find(item => Boolean(item.link));
    if (linkItem) {
      return { link: linkItem.link, trackingCode: linkItem.trackingCode };
    }
  }
  return { link: '', trackingCode: '' };
};
