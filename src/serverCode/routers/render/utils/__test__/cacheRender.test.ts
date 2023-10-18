import configureStore from "@/store/configureStore";
import type { Request } from "express";
import InitState from "../../initStates";
import CacheRender from "../cacheRender";

const mockReq = {
  url: "/",
  path: "/",
  params: {},
  query: {},
  headers: {},
  _parsedOriginalUrl: {
    pathname: "/",
  },
} as Request;

const cache = new CacheRender();

describe("CacheRender Tests", () => {
  test("getHtml", async () => {
    const { store } = configureStore({
      seo: InitState.defaultSeo,
    });
    const indexStr = cache.getHtml(mockReq, store, []);
    expect(
      indexStr.html.includes("/soa/public/js/jsinvoke/jsinvoke_1.08.js")
    ).toBe(true);
    expect(indexStr.html.includes("window.pageType")).toBe(true);
    expect(indexStr.html.includes("window.mpulse")).toBe(true);
    expect(indexStr.html.includes("window.__BUILD_TIME__")).toBe(true);
    expect(indexStr.html.includes("window.__INITIAL_ENV__")).toBe(true);

    if (process.env.NODE_ENV === "production") {
      expect(indexStr.html.includes("/dist/CDN/dll.production.min.js")).toBe(
        true
      );
    } else {
      expect(indexStr.html.includes("/dist/CDN/dll.development.js")).toBe(true);
    }
  });
});
