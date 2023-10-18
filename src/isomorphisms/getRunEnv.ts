const getRunEnv = () => {
  let runEnv = "stage";
  if (typeof window !== "undefined" && window.__INITIAL_ENV__) {
    runEnv = window.__INITIAL_ENV__["Env"]["restfulEnv"];
  } else {
    runEnv = process.env.RUN_ENV || process.env.LOCAL_RUN_ENV || "stage";
  }
  return runEnv;
};

export default getRunEnv;
