import React from "react";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Sensor from "@/Utils/sensor";
import { judgeTypeOfPlp } from "@/lib/Tools";
import * as utilCookieUtil from "@/Utils/cookieUtil";
import Image from "../ImagesLazyLoad/index";
import getConfigs from "../../../isomorphisms/getConfigs";

const configs = getConfigs();

class ProductContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      productHref: "",
      imgUrl: "",
      displaypricecon: [],
      discountpricecon: [],
      ProductMessageTags: null,
    };
    this.pdpHt = this.pdpHt.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    if (data.activityTags && data.activityTags.length) {
      require.ensure([], () => {
        this.setState({
          ProductMessageTags: require("./ProductMessageTags").default,
        });
      });
    }
    let productHref = "";
    // 跳转链接
    if (configs.abtest) {
      productHref = configs.abtest;
    }
    productHref += `/product/${data.productId}.html`;
    if (data.skuId) {
      productHref += `?sku=${data.skuId}`;
    }
    // 产品图片地址
    let imgUrl = data.imagePath;
    if (imgUrl) {
      imgUrl = `${data.imagePath}350x350.jpg`;
    } else {
      imgUrl = "";
    }
    // 实际价格
    let discountpricecon = [];
    const discountprice = [];
    if (data.minDiscountPrice != null) {
      discountprice.push(data.minDiscountPrice);
    }
    if (data.maxDiscountPrice != null) {
      discountprice.push(data.maxDiscountPrice);
    }
    if (discountprice.length > 0) {
      discountpricecon = discountprice.map((el, index) => {
        return <span key={`discountpricecon-${index}`}>￥{parseFloat(el).toFixed(2)}</span>;
      });
    }
    // 划线价
    const displayprice = [];
    let displaypricecon = [];
    if (data.minDisplayPrice != null) {
      displayprice.push("￥" + parseFloat(data.minDisplayPrice).toFixed(2));
    }
    if (data.maxDisplayPrice != null) {
      displayprice.push("￥" + parseFloat(data.maxDisplayPrice).toFixed(2));
    }
    if (displayprice.length > 0) {
      displaypricecon = <span>{displayprice.join(" ~ ")}</span>;
    }
    this.setState({
      productHref,
      imgUrl,
      discountpricecon,
      displaypricecon,
    });
  }

  pdpHt() {
    if (typeof window === "undefined") {
      return;
    }
    const { data, index, name, rootCategoryName } = this.props;
    let buttonPosition;
    const type = judgeTypeOfPlp();
    // A/B testing
    if (type === "search" && typeof adhoc !== "undefined") {
      window.adhoc("track", "clicks_product", 1);
    }
    if (type === "category" || type === "giftSet" || type === "couponSet" || type === "exclusive") {
      buttonPosition = "Navigation List";
    } else if (type === "search" || type === "hot") {
      buttonPosition = "Search Results";
    } else if (type === "brand") {
      buttonPosition = "Brand List";
    }
    let channel = "MOBILE";
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      // console.log("用微信打开的");
      channel = "WECHAT";
    }
    utilCookieUtil.SetSingleCookie2({ key: "channel", value: channel });
    Sensor.go("ListProductClick", {
      $lib_detail: "M_Search##pdpHt##Categoryproductcon.js##192",
      op_code: data.productId,
      page_id: "MB_1000202",
      action_id: "1000202_931",
      commodity_sku: data.productId,
      banner_ranking: index + 1,
    });
    GoogleAnalytics.push({
      event: "productClick",
      ecommerce: {
        click: {
          actionField: { list: buttonPosition },
          products: [
            {
              name: data.productCN,
              id: data.productId,
              brand: data.brandEN,
              position: name,
            },
          ],
        },
      },
      eventCallback() {
        // document.location = `/product/${data.productId}.html`;
      },
    });
    let listName = "";
    if (type === "search") {
      listName = "search result plp";
      GoogleAnalytics.pushV2({
        event: "searchResultPlp",
        listName: `search > ${data.productCN}`,
        productId: data.skuId,
        productName: data.productCN,
        productOpCode: data.productId,
      });
    } else if (type === "category") {
      const categoryListName = ["category"];
      if (rootCategoryName) {
        categoryListName.push(rootCategoryName);
      }
      if (data.brandEN) {
        categoryListName.push(data.brandEN);
      }
      listName = "category search plp";
      GoogleAnalytics.pushV2({
        event: "categorySearchPlp",
        listName: categoryListName.join(" > "),
        productId: data.skuId,
        productName: data.productCN,
        productOpCode: data.productId,
      });
    } else if (type === "brand") {
      listName = "brand plp";
      let brand = window.location.pathname.match(/\/brand\/(\S*)-/)[1];
      if (brand) {
        brand = brand.toLowerCase();
      }
      GoogleAnalytics.pushV2({
        event: "brandPlp",
        listName: `brand > ${brand}`,
        productId: data.skuId,
        productName: data.productCN,
        productOpCode: data.productId,
      });
    }
    if (listName) {
      GoogleAnalytics.pushV2({
        event: "eeListClick",
        list: listName,
        products: [
          {
            brand: data.brandEN,
            id: data.skuId,
            name: data.productCN,
            position: index + 1,
            productOpCode: data.productId,
          },
        ],
      });
    }
  }

  render() {
    const { productHref, imgUrl, displaypricecon, discountpricecon, ProductMessageTags } =
      this.state;
    const { data } = this.props;
    return (
      <div className="category_productmess">
        <a href={productHref} onClick={this.pdpHt}>
          {data && data.activityLabelImageUrl && (
            <Image src={`${data.activityLabelImageUrl}350x88.png`} className="product_img_label" />
          )}
          <div className="product_img">
            <Image src={imgUrl} rel="nofollow" title={data.productCN} alt={data.productCN} />
            {data.hasInventory === 0 ? <div className="noinventory_label">已售罄</div> : null}
          </div>
          <div className="product_mess">
            <div className="head">
              {ProductMessageTags && <ProductMessageTags tags={data.activityTags} />}
              {data.brandEN}
              {data.productCN}
            </div>
            <div className="price">{discountpricecon}</div>
            <del className="delete">{displaypricecon}</del>
          </div>
        </a>
      </div>
    );
  }
}

export default ProductContent;
