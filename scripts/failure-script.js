const drone = require("drone-node");
const emailConfig = require("./.failure.email.config");
const { SendEmail } = require("@sephora/send-email");

const client = new drone.Client({
  url: "http://10.71.94.118",
  token: process.env.DRONE_TOKEN,
});

const {
  CI_COMMIT_BRANCH,
  DRONE_COMMIT_MESSAGE,
  CI_BUILD_NUMBER,
  GIT_COMMITTER_EMAIL,
} = process.env;

const getFailureStepLog = async () => {
  client.get;
  const res = await client.getBuild(
    "SOAF",
    "react-web-mobile",
    CI_BUILD_NUMBER
  );
  const stage = res.stages[0];
  const steps = stage.steps;
  const failureStep = steps.find((i) => i.status === "failure");
  if (failureStep) {
    const log = await client.getLogs(
      "SOAF",
      "react-web-mobile",
      CI_BUILD_NUMBER,
      1,
      failureStep.number
    );
    let logs = "";
    log.forEach((i) => {
      logs += i.out;
    });
    return {
      logs,
      stepNumber: failureStep.number,
    };
  }
  return null;
};

const sendFailureEmail = async (log) => {
  SendEmail({
    ...emailConfig,
    sendMailOptions: {
      ...emailConfig.sendMailOptions,
      subject: `【React-web-mobile】【CI Faliure】- Branch-${CI_COMMIT_BRANCH}:  ${DRONE_COMMIT_MESSAGE}`,
      to: GIT_COMMITTER_EMAIL || process.env.EMAIL_ACCOUNT,
      cc: "zhao.tian@lianwei.com.cn",
      html: `
    <p>
      Dear Developers:
    </p>
    <p style="text-indent:2em;">
      I’m sorry to tell you that your submission failed the Ci test, please check the latest submission code;
    </p>
    <p>
      <a href="http://10.71.94.118/SOAF/react-web-mobile/${CI_BUILD_NUMBER}">View ALL CI Log</a>
    </p>
    <p>
      <pre style="background: black; color:#fff;">
        ${log}
      </pre>
    </p>
      `,
    },
  });
};

(async () => {
  const { logs } = await getFailureStepLog();
  sendFailureEmail(logs);
})();
