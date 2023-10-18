export function sensorCheck() {
  return (
    typeof window !== "undefined" &&
    typeof window.sensorsDataAnalytic201505 === "object" &&
    typeof window.sensorsDataAnalytic201505.track === "function"
  );
}

export function sensorGoCreator(key = "track") {
  if (sensorCheck()) return window.sa[key];
  return null;
}
