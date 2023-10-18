import { urlGetParams } from "@/lib/url";
import * as React from "react";
import "./style/email.scss";
interface IEmailSuccess {}
const EmailSuccess: React.FunctionComponent<IEmailSuccess> = () => {
  //   const [dataSource, setDataSource] = React.useState<IInventoryTable[]>([]);
  const toLogin=()=>{
    let url=urlGetParams(window.location,"historyLocation")
    if (url) {
      window.location.replace(`/login?historyLocation=${url}`)
    }else{
      window.location.replace(`/login`)
    }
  }
  return (
    <div>
      <div className="login-title">
        <img
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
          onClick={toLogin}
        />
      </div>
      <div className="email-title">验证邮件已发送至您的邮箱</div>
      <div className="email-desc">请在24小时内通过邮件内的链接设置新密码</div>
      <div className="email-icon">
        <img
          src="https://ssl1.sephorastatic.cn/soa/mobile/images/newReset.png"
          alt=""
        />
      </div>
      <div
        className="email-btn"
        onClick={toLogin}
      >
        完成
      </div>
      <a href="tel:400-670-0055" className="email-tel">联系客服</a>
    </div>
  );
};

export default EmailSuccess;
