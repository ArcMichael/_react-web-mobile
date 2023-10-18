module.exports = {
  launch: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-web-security",
    ],
    executablePath: "chromium",
  },
};
