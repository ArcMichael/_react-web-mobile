/*
 * @Author: zone Tian
 * @Date: 2021-08-13 14:54:51
 * @LastEditors: zone Tian
 * @LastEditTime: 2021-09-18 16:46:45
 * @Description: file content
 */
import type { Request } from "express";
import getConfigs from "isomorphisms/getConfigs";
import request from "../../../utils/request";

const configs = getConfigs();

export interface SeoResult {
  status: number;
  message: string;
  results: {
    title: string;
    description: string;
    keywords: string;
    seotext: string;
  };
}

class InitState {
  req: Request;
  Token: string;
  UID: string;

  constructor(props: { req: Request }) {
    const { UID, Token } = props.req.cookies || {};
    this.req = props.req;
    this.UID = UID;
    this.Token = Token;
  }

  async init() {
    const seo = await this.getSeo();
    return {
      seo,
    };
  }
  static defaultSeo = {
    results: {
      title: "SEPHORA丝芙兰官网－国际化妆品购物网站！",
      description:
        "SEPHORA丝芙兰化妆品购物网站-法国路威酩轩（LVMH）旗下品牌，为您提供国际知名化妆品、护肤品、彩妆、香水等美容用品，购买正品化妆品，就上丝芙兰化妆品网站，官方授权、无障碍退货！",
      keywords: "化妆品,化妆品购物网站,SEPHORA丝芙兰官网",
      seotext: "",
    },
  } as SeoResult;
  private getSeo = async () => {
    // const developmentDNS = {
    //   "dpsvcmswem.sephora.cn": "10.71.143.49",
    // };

    // const getUrlByDevelopmentDNS = (url?: string) => {
    //   let newUrl = url;
    //   if (url && newUrl && typeof newUrl === "string") {
    //     Object.keys(developmentDNS).forEach((domain) => {
    //       if (url.match(domain)) {
    //         newUrl = newUrl
    //           ? newUrl.replace(
    //               domain,
    //               developmentDNS[domain as keyof typeof developmentDNS]
    //             )
    //           : "";
    //       }
    //     });
    //   }
    //   return newUrl;
    // };
    // console.log();
    const t1 = +new Date();
    return request(
      `http://${
        // process.env.RUN_ENV ? configs.seo : getUrlByDevelopmentDNS(configs.seo)
        configs.seo
      }?url=${encodeURIComponent(this.req.path)}&platform=m`,
      {
        method: "GET",
        headers: {
          Token: this.Token,
          UID: this.UID,
        },
        timeout: 3000,
      }
    )
      .then((res) => {
        const t2 = +new Date();
        console.log(`${t2 - t1} : seo render`);

        return res.json();
      })
      .then((r: SeoResult) => {
        const t2 = +new Date();
        console.log(`${t2 - t1} : seo render false`);
        if (r.status === 0 && r.results) {
          return r;
        }
        throw Error("使用默认Seo");
      })
      .catch(() => {
        const t2 = +new Date();
        console.log(`${t2 - t1} : seo render catch`);

        return InitState.defaultSeo;
      });
  };
  private getHomepage = async () => {};
}

export default InitState;
