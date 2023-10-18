const isBrowser = () => {
  return Boolean(typeof window !== "undefined" && window.document);
};
export default isBrowser;
