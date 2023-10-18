import qs from "qs";

const getLocationQuery = () => {
  if (typeof window !== "undefined") {
    return window.location.search
      ? (qs.parse(window.location.search, {
          ignoreQueryPrefix: true,
        }) as {
          [K: string]: string;
        })
      : {};
  }
  return {};
};

export default getLocationQuery;
