import getConfigs from "../getConfigs";

describe("ServerCode getConfigs", () => {
  test("Test getConfigs", () => {
    const defaultConfigs = getConfigs();
    expect(typeof defaultConfigs["abtest"]).toBe("string");
    expect(typeof defaultConfigs["api"]).toBe("string");
    expect(typeof defaultConfigs["localhost"]).toBe("string");
    expect(typeof defaultConfigs["newtest"]).toBe("string");
    expect(typeof defaultConfigs["gatewayShortDomain"]).toBe("string");
    expect(typeof defaultConfigs["restfulEnv"]).toBe("string");
    expect(typeof defaultConfigs["seo"]).toBe("string");
    expect(typeof defaultConfigs["nodeServer"]).toBe("string");
    expect(typeof defaultConfigs["static"]).toBe("string");
    expect(typeof defaultConfigs["staticUnSsl"]).toBe("string");
  });
});
