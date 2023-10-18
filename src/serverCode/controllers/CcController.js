"use strict";

import md5 from "md5";
import RequestTPController from "./RequestTPController";

class CcController extends RequestTPController {
  /**
   * @param {{
   * quality:any;
   * req: import('express').Request;
   * res: import('express').Response
   * }} props
   */
  constructor(props) {
    super(props);
    this.userid = "DB5E63A2AD1D502A";
    this.salt = "kYzr71GrNzkakeVMLduH7AeH1VeslYfd";
    this.authtimeout = props.authtimeout || 31536000;
    this.hlsflag = props.hlsflag || 0;
    this.quality = props.quality || 20;
    this.ssl = props.ssl || true;
    this.req = props.req;
    this.res = props.res;
  }

  /**
   * 获取单个视屏 Promise
   * @param { 视屏ID } videoid
   */
  getCCVideoInfoSimplePromise(videoid) {
    return new Promise((resolve, reject) => {
      this.getCCVideoInfo(videoid)
        .then((url) => resolve(url))
        .catch((err) => reject(err));
    });
  }

  /**
   * 获取多个视屏 Promise
   * @param { video[] } list
   */
  getCCVideoInfoPromise(list) {
    const _promiseList = list.map((data) => {
      return new Promise((resolve, reject) => {
        if (data.type == "video") {
          this.getCCVideoInfo(data.id)
            .then((url) => {
              resolve({
                ...data,
                url,
              });
            })
            .catch((err) => reject(err));
        } else {
          resolve(data);
        }
      });
    });
    return new Promise((_resolve, _reject) => {
      Promise.all(_promiseList)
        .then((data) => _resolve(data))
        .catch((err) => _reject(err));
    });
  }

  /**
   * 获取多个视屏ID
   * @param { 排序 } sort
   */
  getCCVideoInfoPromise2(sort) {
    const list = sort.promiseList;
    const prototype = sort.prototype;
    const _promiseList = list.map((data) => {
      return new Promise((resolve, reject) => {
        if (data.type == "video") {
          this.getCCVideoInfo(data.id)
            .then((url) => {
              resolve({
                ...data,
                url,
              });
            })
            .catch((err) => reject(err));
        } else {
          resolve(data);
        }
      });
    });
    return new Promise((_resolve, _reject) => {
      Promise.all(_promiseList)
        .then((data) =>
          _resolve({
            data,
            prototype,
          })
        )
        .catch((err) => _reject(err));
    });
  }

  /**
   * 整合CC视屏集合
   * @param {*} list
   */
  getCCVideoInfoPromiseAll(list) {
    return new Promise((resolve, reject) => {
      this.getCCVideoInfoPromiseSplitting(list)
        .then((sort) => this.getCCVideoInfoPromise2(sort))
        .then((videoList) => this.getCCVideoInfoPromiseMerging(videoList))
        .then((result) => resolve(result))
        .catch((e) => reject(e));
    });
  }

  /**
   * 重组并返回所有类型的资源
   * @param { 数据源 } data
   * @param { 视频源 } videoList
   */
  getCCVideoInfoPromiseMatching(data, videoList) {
    switch (data.type) {
      case "image":
        return data;
      case "mixed":
        let mixed = {
          type: "mixed",
          data: [],
        };
        data.data.map((data) =>
          mixed.data.push(this.getCCVideoInfoPromiseMatching(data, videoList))
        );
        return mixed;
      case "video":
        let video = {};
        videoList.data.map((videoData) => {
          if (videoData.id == data.id) {
            video = videoData;
          }
        });
        return video;
      default:
        return {};
    }
  }

  /**
   * 把数据源和视屏返回集合一起合并返回，递归
   * @param {  } lists
   */
  getCCVideoInfoPromiseMerging(lists) {
    return new Promise((resolve, reject) => {
      try {
        let result = lists.prototype.map((data) => {
          return this.getCCVideoInfoPromiseMatching(data, lists);
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 拆分重组视屏类资源
   * @param { 数据源 } prototype
   */
  getCCVideoInfoPromiseSplitting(prototype) {
    const _promiseList = [];
    return new Promise((resolve, reject) => {
      try {
        prototype.map((data) => {
          if (data.type == "video") {
            _promiseList.push(data);
          } else if (data.type == "mixed") {
            data.data.map((data) => {
              if (data.type == "video") {
                _promiseList.push(data);
              }
            });
          }
        });
        resolve({
          prototype,
          promiseList: _promiseList,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getCCVideoInfo(videoid) {
    const time = new Date().getTime();
    const _md5 = md5(
      `authtimeout=${this.authtimeout}&format=json&hlsflag=${this.hlsflag}&userid=${this.userid}&videoid=${videoid}&time=${time}&salt=${this.salt}`
    ).toLocaleUpperCase();
    const uri = `http://p.bokecc.com/api/mobile?authtimeout=${this.authtimeout}&format=json&hlsflag=${this.hlsflag}&time=${time}&userid=${this.userid}&videoid=${videoid}&hash=${_md5}`;

    const json = true;

    return new Promise((resolve, reject) => {
      this.get({
        uri,
        json,
        headers: {
          Referer: this.req.headers["referer"] || "",
          "User-Agent": this.req.headers["user-agent"] || "",
        },
      })
        .then((res) => {
          // 申城返回对象
          let resQualityVideo = [];

          // 获取匹配值
          try {
            resQualityVideo = res.video.copy.filter((video) => {
              return video.quality === this.quality;
            });
          } catch (e) {
            resQualityVideo = res.video.copy;
          }

          // 没有获取到的容错
          if (resQualityVideo.length === 0) {
            resQualityVideo = res.video.copy[0];
          }

          resQualityVideo = resQualityVideo[0] || resQualityVideo;

          if (resQualityVideo.playurl && this.ssl) {
            try {
              resQualityVideo.playurl = resQualityVideo.playurl.replace(
                /^http/,
                "https"
              );
            } catch (e) {
              console.log(e);
            }
          }

          // 返回
          resolve(resQualityVideo);
        })
        .then((err) => reject(err));
    });
  }
}

export default CcController;
