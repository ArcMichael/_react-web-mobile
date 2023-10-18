const bodyScrollTop = {
  get: () => {
    return document.body.scrollTop + document.documentElement.scrollTop;
  },
  set: (scrollTop: number) => {
    document.body.scrollTop = scrollTop;
    document.documentElement.scrollTop = scrollTop;
  },
};

export default bodyScrollTop;
