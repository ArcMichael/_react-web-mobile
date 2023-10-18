import * as React from "react";
import { useDispatch } from "react-redux";
import {startCustomerService} from "@/actions/plpPage"
interface INewTabBottom {
  _callbackMore: Function;
  _productData: any;
}

const NewTabBottom: React.FunctionComponent<INewTabBottom> = (props) => {
  const { _callbackMore, _productData } = props;
  const dispatch = useDispatch();
  const TabList = [
    {
      img: "https://sslstage1.sephorastatic.cn/soa/nmobile/img/pdp-new-home.png",
      desc: "首页",
      func: () => {
        window.location.href = "/";
      },
    },
    {
      img: "https://sslstage1.sephorastatic.cn/soa/nmobile/img/pdp-new-search.png",
      desc: "搜索",
      func: () => {
        window.location.href = "/search";
      },
    },
    {
      img: "https://sslstage1.sephorastatic.cn/soa/nmobile/img/pdp-new-msg.png",
      desc: "客服",
      func: () => {
        console.log(dispatch(startCustomerService()));
      },
    },
    {
      img: "https://sslstage1.sephorastatic.cn/soa/nmobile/img/pdp-new-myAt.png",
      desc: "我的",
      func: () => {
        window.location.href = "/myAccount";
      },
    },
  ];
  //   const [dataSource, setDataSource] = React.useState<IInventoryTable[]>([]);
  return (
    <div>
      <div className="product-attr-choice" style={{ zIndex: 1000 }} />
      <div className="new-tab-bottom">
        <div className="new-tab-top">
          <span>功能直达</span>
          <span
            onClick={_callbackMore.bind(
              this,
              "tabMoreClickfun",
              !_productData.tabMore
            )}
          >
            <img
              className="pdp-tab-close"
              src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_black.png"
              alt=""
            />
          </span>
        </div>
        <ul className="new-tab-content">
          {TabList.map((item) => {
            return (
              <li
                onClick={() => {
                  item.func();
                }}
              >
                <img src={item.img} alt="" />
                <span className="new-tab-desc">{item.desc}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default NewTabBottom;
