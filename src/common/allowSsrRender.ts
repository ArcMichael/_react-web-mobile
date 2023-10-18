import { matchPath } from "react-router";

const allowSsrRender = (pathname: string) => {
  const allowUrls = ["/", "/homepage", "/homepage/:tab"];
  for (let i = 0; i < allowUrls.length; i++) {
    const url = allowUrls[i];
    const match = matchPath(pathname, {
      path: url,
      exact: true,
    });
    if (match) {
      return true;
    }
  }
  return false;
};

export default allowSsrRender;
