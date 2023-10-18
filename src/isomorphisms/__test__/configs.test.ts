import configs from "../configs";

describe("ServerCode configEnv.json", () => {
  test("Test configEnv.json", () => {
    Object.keys(configs).forEach((item) => {
      const itemConfig = configs[item];
      expect(typeof itemConfig["abtest"]).toBe("string");
      expect(typeof itemConfig["api"]).toBe("string");
      expect(typeof itemConfig["localhost"]).toBe("string");
      expect(typeof itemConfig["newtest"]).toBe("string");
      expect(typeof itemConfig["gatewayShortDomain"]).toBe("string");
      expect(typeof itemConfig["restfulEnv"]).toBe("string");
      expect(typeof itemConfig["seo"]).toBe("string");
      expect(typeof itemConfig["nodeServer"]).toBe("string");
      expect(typeof itemConfig["static"]).toBe("string");
      expect(typeof itemConfig["staticUnSsl"]).toBe("string");
    });
  });
});
