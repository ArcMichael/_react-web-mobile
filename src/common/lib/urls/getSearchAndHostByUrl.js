/**
 *
 * @param {string} url
 * @return {{ search:string; host:string }} - description
 */
const getSearchAndHostByUrl = (url) => {
  if (typeof url === "string") {
    const array = url.match(/^(https*:\/\/.*)(\?.*)/);
    if (array.length === 3) {
      const host = array[1];
      const search = array[2];
      return {
        host,
        search,
      };
    }
  }
  return {
    search: "",
    host: "",
  };
};

export default getSearchAndHostByUrl;
