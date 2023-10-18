import React from "react";
import { soaLoginOff, socialRedirectUrl } from "../../../lib/Tools";
import getConfigs from "../../../../isomorphisms/getConfigs";
import { showChecked } from "../../../actions/login";
import { connect } from "react-redux";

const configs = getConfigs();

const handleClick = () => {
  let hrefLink = "javascript:voild(0);";
  const abtest = configs.abtest;
  if (abtest.match(/stagem/)) {
    hrefLink = socialRedirectUrl(
      `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101398766&redirect_uri=https://stage.sephora.cn`,
      "QQ",
    );
  } else if (abtest.match(/testm/)) {
    hrefLink = socialRedirectUrl(
      `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101398766&redirect_uri=https://test.sephora.cn`,
      "QQ",
    );
  } else {
    hrefLink = socialRedirectUrl(
      `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101398766&redirect_uri=https://www.sephora.cn`,
      "QQ",
    );
  }
  return hrefLink;
};
const LoginSocial = (props) => (
  <div className="joint-landing">
    <a
      
      onClick={() => {
        console.log(props);
        if (!props.isChecked) {
          props.showChecked()
        return

        }
        window.location.href=socialRedirectUrl(
          `https://api.weibo.com/oauth2/authorize?client_id=618687765&response_type=code&redirect_uri=https://www.sephora.cn`,
          "WEIBO",
        )
        soaLoginOff(true);
      }}
    >
      <img src={`${configs.static}/soa/nmobile/img/weibo_icon.png`} />
      <em>新浪微博</em>
    </a>
    <a
      onClick={() => {
        if (!props.isChecked) {
          props.showChecked()
        return

        }
        window.location.href=handleClick.bind(this)()
        soaLoginOff(true);
      }}
    >
      <img src={`${configs.static}/soa/nmobile/img/qq_icon.png`} />
      <em>QQ好友</em>
    </a>
  </div>
);
// export default LoginSocial;
export default connect(s=>s,{showChecked})(LoginSocial)