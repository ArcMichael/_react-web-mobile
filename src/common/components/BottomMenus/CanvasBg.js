import React from "react";
import Sensor from "@/Utils/sensor";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import MenuItem from "./MenuItem";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import {
  HomeFilled,
  HomeOutlined,
  MineFilled,
  MineOutlined,
  CategoryFilled,
  CategoryOutlined,
  TagOutlined,
  TagFilled,
  ShoppingCartFilled,
  ShoppingCartOutlined,
} from "../Icons";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  x;
  y;
}

/**
 * @typedef {{
 *  cart:RootState['cart'];
 * } & import("react-router").WithRouterProps} CanvasBgProps
 */

/**
 * @extends {React.Component<CanvasBgProps>}
 */
class CanvasBg extends React.Component {
  /** @type {HTMLCanvasElement} - description */
  cvs = null;
  /** @type {CanvasRenderingContext2D} - description */
  ctx = null;

  rem = this.getRem();
  constructor(props) {
    super(props);
    this.sensorEvent = this.sensorEvent.bind(this);
    this.drawRect = this.drawRect.bind(this);
    this.getRem = this.getRem.bind(this);
    this.getShopCartWidth = this.getShopCartWidth.bind(this);
    this.rem = this.getRem();
    this.getMenuItems = this.getMenuItems.bind(this);
    this.handleScoll = this.handleScoll.bind(this);
    this.isShowToTop = this.isShowToTop.bind(this);
    this.isGAToTop = this.isGAToTop.bind(this);
    this.draw = this.draw.bind(this);
    this.initSize = this.initSize.bind(this);
    this.state = {
      isShowToTop: false,
      menus: [
        {
          href: "/",
          title: "首页",
          icon: <HomeOutlined size="1.28rem" color="#666" />,
          activeIcon: <HomeFilled size="1.28rem" />,
          pageType: "home",
        },
        {
          href: "/category/60001/",
          title: "分类",
          icon: (
            <CategoryOutlined size="1.28rem" color="#666" />
          ),
          activeIcon: <CategoryFilled size="1.28rem" />,
          pageType: "List-page",
        },
        {
          href: "/weeklyspecials/",
          title: "优惠专享",
          icon: <TagOutlined size="1.28rem" color="#666" />,
          activeIcon: <TagFilled size="1.28rem" />,
          pageType: "Campaign-page",
        },
        {
          href: "/cart",
          title: "购物车",
          icon: (
            <ShoppingCartOutlined
              size="1.28rem"
              color="#666"
             />
          ),
          activeIcon: <ShoppingCartFilled size="1.28rem" />,
          pageType: "Function-page",
        },
        {
          href: "/myAccount",
          title: "我的",
          icon: <MineOutlined size="1.28rem" color="#666" />,
          activeIcon: <MineFilled size="1.28rem" />,
          pageType: "Function-page",
        },
      ],
    };
  }

  componentDidMount() {
    this.rem = this.getRem();
    if (this.cvs && this.cvs.getContext) {
      this.ctx = this.cvs.getContext("2d");
      this.initSize();
    }
    const {
      location: { pathname },
    } = window;
    if (pathname === "/" || pathname.match(/homepage/)) {
      window.addEventListener("scroll", this.handleScoll);
    }

    if (this.isShowToTop()) {
      this.draw();
    } else {
      this.drawRect();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScoll);
  }

  /**
   * @param {Event} e
   */
  handleScoll() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    }
    if (this.isShowToTop()) {
      this.draw();
    } else {
      this.drawRect();
    }
  }

  isShowToTop() {
    const { disableToTop } = this.props;
    const innerHeight = window.innerHeight;
    let isShowToTop = false;
    if (!disableToTop && bodyScrollTop.get() >= innerHeight * 2) {
      isShowToTop = true;
    }
    this.setState({
      isShowToTop: isShowToTop,
    });
    return isShowToTop;
  }

  /**
   * @param {number} shopcartNumber
   */
  getMenuItems(shopcartNumber) {
    const { isShowToTop } = this.state;
    let activePath = this.props.location.pathname;
    if (activePath === "/" || activePath.match(/\/homepage/)) {
      activePath = "/";
    }
    let categoryArr = [
      "/v2/html/categorybrand",
      "/v2/html/categoryrecommend",
      "/v2/html/categoryintelligent",
    ];
    if (
      activePath.match(/category\/\d+/) ||
      categoryArr.indexOf(activePath) > -1
    ) {
      activePath = "/category/60001/";
    }
    return this.state.menus.map((item, index) => {
      const active = activePath === item.href;

      if (item.href === "/cart") {
        return (
          <MenuItem
            key={item.title}
            href={item.href}
            active={active}
            onClick={() =>
              this.sensorEvent(item.title, item.href, item.pageType, index)
            }
            icon={active ? item.activeIcon : item.icon}
            title={item.title}
            upper={
              shopcartNumber ? (
                <span
                  className="shopcart-upper"
                  style={{ ...this.getShopCartWidth(shopcartNumber) }}
                >
                  {shopcartNumber > 100 ? "99+" : shopcartNumber}
                </span>
              ) : (
                ""
              )
            }
           />
        );
      }
      if (isShowToTop && item.title === "首页") {
        return (
          <MenuItem
            key={item.title}
            active={active}
            onClick={this.isGAToTop}
            icon={<HomeOutlined size="1.28rem" color="#fff" />}
            title="返回顶部"
           />
        );
      }

      return (
        <MenuItem
          key={item.title}
          href={item.href}
          active={active}
          onClick={() => this.sensorEvent(item.title, item.href, item.pageType, index)}
          icon={activePath === item.href ? item.activeIcon : item.icon}
          title={item.title}
         />
      );
    });
  }

  /**
   * @param {number} count
   */
  getShopCartWidth(count) {
    let num = Number(count);
    let style = {};
    if (num < 10) {
      style.width = `${this.mulriple * 0.28}rem`;
      style.height = `${this.mulriple * 0.28}rem`;
      style.right = "0";
      return style;
    }
    if (num > 10 && num < 100) {
      style.width = `${this.mulriple * 0.4}rem`;
      style.height = `${this.mulriple * 0.28}rem`;
      style.right = `-${this.mulriple * 0.12}rem`;
      return style;
    }
    if (num >= 100) {
      style.width = `${this.mulriple * 0.54}rem`;
      style.height = `${this.mulriple * 0.28}rem`;
      style.right = `-${this.mulriple * 0.27}rem`;
      return style;
    }
    return style;
  }

  getRem() {
    if (typeof window !== "undefined") {
      const fontSize = document.body.parentElement.style.fontSize;
      if (fontSize) {
        const rem = Number(fontSize.replace("px", ""));
        return rem.toString() !== '"NaN"' ? rem : 0;
      }
    }
    return 0;
  }

  mulriple = 2;

  /**
   * 黑圆半径
   */
  circleR = 0.4 * this.mulriple * this.rem;

  screenWidth = 7.5 * this.mulriple;

  wrap = {
    height_coefficient: 2.5 * this.mulriple,
    width_coefficient: this.screenWidth,
  };

  bottomBg = {
    height_coefficient: 1.6 * this.mulriple,
    width_coefficient: this.screenWidth,
  };
  divBottomPaddingLeft = 0.24 * this.mulriple;
  /**
   * 黑圆中心点
   * X值计算
   *  0.24是div.bottom的padding-left
   *  0.702 是 总宽度 (7.5rem - 0.24rem - 0.24rem) / 5 / 2
   * Y值计算
   *   中心点距离下边距的距离 0.4rem（a标签padding-bottom） + 0.4rem (span文字标签高度) + 0.14rem(circle的margin-bottom) + circleR
   *   canvas高度 - 中心点到下边距的值
   */
  circleCenterPoint = new Point(
    (this.divBottomPaddingLeft +
      (this.screenWidth - this.divBottomPaddingLeft * 2) / 5 / 2) *
      this.rem,
    this.wrap.height_coefficient * this.rem -
      ((0.4 + 0.4 + 0.14) * this.mulriple * this.rem + this.circleR)
  );

  /**
   * 起点 左上角
   */
  start = new Point(
    0,
    (this.wrap.height_coefficient - this.bottomBg.height_coefficient) * this.rem
  );

  bezierStart = new Point(this.circleCenterPoint.x * 0.15, this.start.y);

  keyPoints = {
    firstCurveStart: this.bezierStart,
    firstCurveEnd: new Point(
      this.circleCenterPoint.x - this.circleR,
      this.circleCenterPoint.y - this.circleR - 4
    ),
    secondCurveEnd: new Point(
      this.circleCenterPoint.x + this.circleR,
      this.circleCenterPoint.y - this.circleR - 4
    ),
    threeCurveEnd: new Point(
      this.circleCenterPoint.x +
        (this.circleCenterPoint.x - this.bezierStart.x),
      this.bezierStart.y
    ),
  };

  newKeyPoints = {};

  initSize() {
    if (this.cvs) {
      this.cvs.width = `${this.rem * this.wrap.width_coefficient}`;
      this.cvs.height = this.props.disableToTop
        ? 0
        : `${this.rem * this.wrap.height_coefficient}`;
    }
  }

  draw() {
    if (this.ctx) {
      this.ctx.fillStyle = "#fff";
      this.ctx.shadowBlur = 10 * this.mulriple;
      this.ctx.shadowColor = "rgba(0,0,0,.2)";
      this.ctx.beginPath();
      this.ctx.moveTo(this.start.x, this.start.y);
      this.ctx.lineTo(this.bezierStart.x, this.bezierStart.y);
      this.getStartBazier(this.bezierStart);
      this.ctx.lineTo(this.screenWidth * this.rem, this.start.y);
      this.ctx.lineTo(
        this.screenWidth * this.rem,
        this.start.y + this.bottomBg.height_coefficient * this.rem
      );
      this.ctx.lineTo(
        0,
        this.start.y + this.bottomBg.height_coefficient * this.rem
      );
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  drawRect() {
    if (this.ctx) {
      this.ctx.fillStyle = "#fff";
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "rgba(0,0,0,.2)";
      this.ctx.beginPath();
      this.ctx.moveTo(this.start.x, this.start.y); // 左上角
      this.ctx.lineTo(this.start.x + this.screenWidth * this.rem, this.start.y); // 右上角
      this.ctx.lineTo(
        this.screenWidth * this.rem,
        this.start.y + this.bottomBg.height_coefficient * this.rem
      ); // 右下角
      this.ctx.lineTo(
        0,
        this.start.y + this.bottomBg.height_coefficient * this.rem
      );
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  /**
   * 三次贝塞尔曲线
   * @param {Point} start
   */
  getStartBazier(start) {
    this.controll1 = new Point(
      start.x + 0.13 * this.mulriple * this.rem,
      start.y
    );
    this.controll2 = new Point(
      start.x + (0.1 + 0.24) * this.mulriple * this.rem,
      start.y - 0.1 * this.mulriple * this.rem
    );
    this.ctx.bezierCurveTo(
      this.controll1.x,
      this.controll1.y,
      this.controll2.x,
      this.controll2.y,
      this.keyPoints.firstCurveEnd.x,
      this.keyPoints.firstCurveEnd.y
    );
    this.getMiddileBazier();
  }
  /**
   * 顶部二次贝塞尔曲线
   * @param {Point} start
   */
  getMiddileBazier() {
    this.ctx.quadraticCurveTo(
      this.circleCenterPoint.x,
      this.circleCenterPoint.y - this.circleR - this.circleR,
      this.keyPoints.secondCurveEnd.x,
      this.keyPoints.secondCurveEnd.y
    );
    this.getEndBazier();
  }

  /**
   * 结束三次贝塞尔曲线
   * @param {Point} start
   */
  getEndBazier() {
    const ctr1 = new Point(
      this.circleCenterPoint.x + (this.circleCenterPoint.x - this.controll2.x),
      this.controll2.y
    );
    const ctr2 = new Point(
      this.circleCenterPoint.x + (this.circleCenterPoint.x - this.controll1.x),
      this.controll1.y
    );
    this.ctx.bezierCurveTo(
      ctr1.x,
      ctr1.y,
      ctr2.x,
      ctr2.y,
      this.keyPoints.threeCurveEnd.x,
      this.keyPoints.threeCurveEnd.y
    );
  }

  sensorEvent(name, url, pageType, index) {
 
    GoogleAnalytics.pushV2({
      event: "menuClick",
      menuName: name,
    });
    Sensor.go("clickBanner_App_Mob", {
      platform_type: "mobile",
      system_type: "",
      environment_type: "",
      vip_card: "",
      vip_card_type: "",
      action_id: "1000001_998",
      page_id: "MB_1000001",
      $title: "首页",
      page_type_detail: "",
      page_type: "",
      $url_path: "",
      $url_query: "",
      $url: "",
      current_url: "",
      banner_current_url: "home",
      banner_current_page_type: "home",
      banner_type:"tag",
      banner_content: name,
      banner_belong_area: "Bottom Navigation",
      banner_to_url: url,
      banner_to_page_type: pageType,
      banner_ranking: index +1
    });
  }
  isGAToTop() {
    GoogleAnalytics.pushV2({
      event: "menuClick",
      menuName: "返回顶部",
    });
    window.scrollTo(0, 0);
  }
  render() {
    const { cart, disableToTop } = this.props;
    const { isShowToTop } = this.state;

    const shopcartNumber = typeof cart.QCPTQ === "number" ? cart.QCPTQ : 0;

    return (
      <div
        className={`bg ${isShowToTop ? "isShowToTop" : ""}`}
        style={{
          height: `${disableToTop ? 1.6 : this.wrap.height_coefficient}rem`,
          width: `${this.wrap.width_coefficient}rem`,
        }}
      >
        <canvas
          ref={(ref) => {
            this.cvs = ref;
          }}
          style={{
            aspectRatio: "auto",
          }}
         />

        <div className="bottom">{this.getMenuItems(shopcartNumber)}</div>
      </div>
    );
  }
}

/**
 *
 * @param {RootState} state
 */
const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, {})(withRouter(CanvasBg));
