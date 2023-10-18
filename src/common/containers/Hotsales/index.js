import React, { Component } from "react";
import { connect } from "react-redux";
import OiaWrap from "@/components/OiaWrap";
import isBrowser from "@/Utils/utils/isBrowser";
import { HotsalesSku, MyAccount } from "@/lib/BLL";
import Utils from "@/lib/utils";
import Dynamic from "@/Utils/Dynamic";
import DeepLink from "@/components/DeepLink";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import { CategoryList } from "./components/CategoryList";
import { ProductList } from "./components/ProductList";
import { CategoryListIcon } from "./components/CategoryListIcon";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../../components/PopupAlert";
import CommonPageTitle from "../../components/CommonPageTitle";
import * as device from "../../lib/device";
import { setupWeChat } from "../../actions/dependency";
import getRunEnv from "../../../isomorphisms/getRunEnv";

const dynamic = new Dynamic();

if (__DEV__ && isBrowser()) {
  require("../../../public/style/Hotsales.scss");
}

let dataTop = {}; // 用来储存每个分类的距离顶部的高度
let scrollY = 0; // 页面滚动条的距离
let before = 0; // 上一次滑动的高度 用来判断上滑还是下滑
let show = false; // 是否加载数据
export class Hotsales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CategoryId: null, // 当前的分类id
      categories: [], // 当前分类的参数 包含是否有下一页 当前的页数和产品
    };
    this.clickFun = this.clickFun.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getData = this.getData.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
    this.getInitData = this.getInitData.bind(this);
    this.getTop = this.getTop.bind(this);
  }

  /**
   * 监听滑动事件
   * @param {event} e
   */
  handleScroll() {
    if (window.pageXOffset) {
      scrollY = window.pageYOffset;
    } else {
      scrollY = bodyScrollTop.get();
    }
    const { categories } = this.state;
    const ifDown = before < scrollY;
    setTimeout(function () {
      before = scrollY;
    }, 0);
    const heightOne =
      document.getElementsByClassName(
        `hotCategory_${categories.categories[0].id}`
      )[0].offsetTop -
      document.getElementsByClassName("categorylist")[0].clientHeight;
    if (scrollY > heightOne) {
      document.getElementsByClassName("topCategory")[0].style.display = "block";
    } else {
      document.getElementsByClassName("topCategory")[0].style.display = "none";
    }

    const elementTop =
      document.getElementsByClassName(`hotCategory_content`)[0].offsetTop +
      document.getElementsByClassName(`hotCategory_content`)[0].offsetHeight;
    if (
      elementTop &&
      elementTop - window.innerHeight - 100 < scrollY &&
      scrollY < elementTop - window.innerHeight + 100
    ) {
      if (ifDown && show) {
        this.getData(this.state.CategoryId);
      }
    }

    const height =
      document.getElementsByClassName("topCategory")[0].clientHeight === 0
        ? 92
        : document.getElementsByClassName("topCategory")[0].clientHeight;
    for (const key in dataTop) {
      const element = dataTop[key];
      if (dataTop.hasOwnProperty(key)) {
        if (scrollY <= element - height) {
          key !== this.state.CategoryId &&
            this.setState({
              CategoryId: key,
            });
          break;
        }
      }
    }
  }

  /**
   * 获取每个分类元素的高度
   */
  getTop() {
    const { category } = this.state;
    for (const id in category) {
      if (Object.hasOwnProperty.call(category, id)) {
        const { records } = category[id];
        if (records && records.length > 0) {
          dataTop[id] =
            document.getElementsByClassName(`hotCategory_${id}`)[0].offsetTop +
            document.getElementsByClassName(`hotCategory_${id}`)[0]
              .offsetHeight;
        } else {
          delete dataTop[id];
        }
      }
    }
    show = true;
  }

  /**
   * 请求数据
   * @param {string} id
   * @param {number} NumNo
   * @param {fun} callback
   */
  getData(id, NumNo, callback) {
    const that = this;
    const { category, categories } = this.state;
    if (id && category && this.state.category[id].hasNextPage && show) {
      show = false;
      const pageNo =
        NumNo ||
        (this.state.category[id].hasNextPage
          ? ++this.state.category[id].pageNo
          : null);
      const obj = this.state.category;
      if (pageNo) {
        HotsalesSku.GetHotsalesSku({ categoryId: id, pageNo }).then((res) => {
          const { hasNextPage, pageNo, records, gid } = res;

          const categoryProductList =
            pageNo === 1 ? records : this.state.category[id].records;

          if (category[id].records) {
            categoryProductList.push(...records);
          }
          obj[id] = { hasNextPage, pageNo, records: categoryProductList };
          this.setState(
            {
              category: obj,
              gid,
            },
            () => {
              show = true;
              this.getTop();
              callback && callback();
            }
          );
        });
      }
    } else if (
      id &&
      category &&
      this.state.category[id].hasNextPage === false &&
      show
    ) {
      show = false;
      let dataIndex = null;
      categories.categories.forEach((element, index) => {
        if (element.id == id) {
          return (dataIndex = ++index);
        }
      });
      const newId =
        (categories.categories[dataIndex] &&
          categories.categories[dataIndex].id) ||
        null;
      dataIndex &&
        newId &&
        this.setState(
          {
            CategoryId: newId,
          },
          () => {
            show = true;
            this.getTop();
            that.getData(newId, 1);
          }
        );
    }
  }

  componentDidMount() {
    let id = null;
    const that = this;
    const { Hotsales, popupAlert, setupWeChat } = this.props;
    if (
      Hotsales.results &&
      Hotsales.results.categories &&
      Hotsales.results.categories[0] &&
      Hotsales.results.categories[0].id
    ) {
      id = Hotsales.results.categories[0].id;
      const obj = {};
      Hotsales.results &&
        Hotsales.results.categories.forEach((element) => {
          obj[element.id] = {
            hasNextPage: true,
            pageNo: 1,
          };
        });
      if (isBrowser()) {
        // 分享
        const env = getRunEnv();
        let host = "https://m.sephora.cn";
        if (env === "stage") {
          host = "https://stagem.sephora.cn";
        } else if (env === "ebf") {
          host = "https://ebfm.sephora.cn";
        }
        if (device.isWeChat()) {
          setupWeChat({
            callback: () => {
              wx &
                wx.miniProgram.postMessage({
                  data: {
                    imageUrl: Hotsales.results.banner + Date.parse(new Date()),
                    path: `sp/web?url=${host}/v2/html/hotsalesstandings`,
                  },
                });
            },
          });
        } else if (device.isApp()) {
          window.getShareInfo = function () {
            dynamic.sepBridge().then((sep) => {
              const miniProgramUsername = Utils.getMiniProgramUsername();
              const data = {
                title: "畅销榜单",
                text: "来自美妆先锋丝芙兰的大数据盘点，了解真正风靡全球的口碑好物，排行在手，美力我有！",
                businessCode: 0,
                thumbImageUrl:
                  "https://ssl1.sephorastatic.cn/wcsfrontend/campaign/mobile_img/2017/06/hotsales/images/150-150.jpg",
                imageUrl: Hotsales.results.banner,
                url: `${host}/v2/html/hotsalesstandings`,
                miniProgramPath: `sp/hotsales/list`,
                miniProgramUsername,
                miniProgramScene: "scene1",
                success(res) {
                  if (res.usePost) {
                    popupAlert(1, "PopupToast", {
                      _text: "图片已保存到本地相册",
                      _autoClose: true,
                    });
                  } else {
                    popupAlert(1, "PopupToast", {
                      _text: "分享成功",
                      _autoClose: true,


                    });
                  }
                },
                failure(err) {
                  popupAlert(1, "PopupToast", {
                    _text: err.message,
                    _autoClose: true,
                  });
                },
              };
              sep.shareApp && sep.shareApp(data);
            });
          };
        }
      }
      Hotsales.results &&
        this.setState(
          {
            categories: Hotsales.results,
            CategoryId: id,
            category: obj,
            backupCategory: obj,
          },
          () => {
            show = true;
            /**
             * 初始化加载第一页的数据 方便做滑动效果
             *
             */
            window.addEventListener(
              "pageshow",
              function () {
                Hotsales.results &&
                  Hotsales.results.categories &&
                  Hotsales.results.categories[0] &&
                  that.getInitData(Hotsales.results.categories[0].id);
                GetSingleCookie2({ key: "Token" }) &&
                  MyAccount.getBaseInfo().then((res) => {
                    const { cardNo, cardLevel } = res;
                    cardNo &&
                      cardLevel &&
                      that.setState({
                        cardNo,
                        cardLevel,
                      });
                  });
              },
              false
            );
          }
        );
    }
    window.addEventListener("scroll", this.handleScroll);
  }

  getInitData(id) {
    const { backupCategory } = this.state;
    const obj = JSON.parse(JSON.stringify(backupCategory));
    dataTop = {};
    HotsalesSku.GetHotsalesSku({ categoryId: id, pageNo: 1 }).then((res) => {
      const { hasNextPage, pageNo, records, gid } = res;
      obj[id] = { hasNextPage, pageNo, records };

      this.setState(
        {
          category: obj,
          gid,
        },
        () => {
          this.getTop();
        }
      );
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * 点击分类事件
   * @param {string} CategoryId
   */
  clickFun(CategoryId, type) {
    setTimeout(() => {
      this.setState({
        CategoryId,
      });
    }, 0);
    this.getInitData(CategoryId);
    if (type) {
      return;
    }
    this.jumpTo();
  }

  /**
   * 跳转到指定位置
   *
   */
  jumpTo() {
    const top =
      document.getElementsByClassName(`hotCategory_content`)[0].offsetTop;
    const height =
      document.getElementsByClassName("topCategory")[0].clientHeight === 0
        ? 92
        : document.getElementsByClassName("topCategory")[0].clientHeight;
    window.scrollTo(0, top - height + 5);
  }

  render() {
    const { CategoryId, categories, category, gid, cardNo, cardLevel } =
      this.state;
    return (
      <div className="Hotsales">
        <CommonPageTitle _isBack _title="畅销榜单" _hasMore />
        <div id="apptitle">畅销榜单</div>
        <div className="title">
          {categories && categories.banner && <img src={categories.banner} />}
        </div>
        <CategoryList
          categories={categories.categories}
          type
          clickFun={this.clickFun}
          CategoryId={CategoryId}
        />

        <div className="topCategory">
          <CategoryListIcon
            categories={categories.categories}
            clickFun={this.clickFun}
            CategoryId={CategoryId}
          />
        </div>
        <div className="hotCategory_content">
          {category &&
            Object.keys(category).map((data) => {
              const { records } = category[data];
              return (
                <div
                  className={`hotCategory_${data}`}
                  onScroll={this.onScroll}
                  key={data}
                >
                  {records ? (
                    <ProductList
                      gid={gid}
                      cardNo={cardNo}
                      cardLevel={cardLevel}
                      key={data}
                      CategoryId={data}
                      productlist={records}
                    />
                  ) : null}
                </div>
              );
            })}
        </div>

        <PopupAlert _zIndex={1001} />
        {isBrowser() && device.isDevice() === "mobile" && <DeepLink />}
      </div>
    );
  }
}
/**
 *
 * @param {RootState} state
 */
const mapStateToProps = (state) => ({
  Hotsales: state.Hotsales,
});

const mapDispatchToProps = {
  // emarsysGo,
  popupAlert,
  setupWeChat,
};
export default OiaWrap(connect(mapStateToProps, mapDispatchToProps)(Hotsales));
