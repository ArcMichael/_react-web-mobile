module.exports = {
  /** https://nodemailer.com/smtp/ 查看 nodemailer.createTransport 的选项 */
  transportOptions: {
    host: "smtp.qiye.aliyun.com", // default
    port: 465, // default
    auth: {
      user: process.env.EMAIL_ACCOUNT, // OR SET EnvironmentEnv EMAIL_ACCOUNT=youremail
      pass: process.env.EMAIL_PASS, // OR SET EnvironmentEnv EMAIL_PASS=youremailpassword
    },
  },
  /**
   * { [K:string]:string } 传入 sendMailOptions.text 和 sendMailOptions.subject 和 sendMailOptions.html,
   * 通过模板语法访问 metas 中的数据只能访问如下自带的变量 CHANGE_LOG CURRENT_BRANCH
   */
  metas: {
    GIT_REPO: "http://10.71.94.97:7990/scm/soaf/sephora-backend-component.git",
    HISTORY: `http://10.71.94.97:7990/projects/SOAF/repos/sephora-backend-component/browse/CHANGELOG.md?at=refs%2Fheads%2F<%CURRENT_BRANCH%>`,
  },
  /** https://nodemailer.com/ 查看 transporter.sendMail 的选项 */
  sendMailOptions: {
    from: process.env.EMAIL_ACCOUNT,
    to: "",
    cc: "",
    subject: `【React-web-mobile】- CI Falure`,
    html: "",
  },
};
