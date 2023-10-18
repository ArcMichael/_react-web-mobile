/*
 * @Author: Leo.Si
 * @Date: 2019-09-16 15:12:29
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-22 16:40:04
 * @fuction 图片上传功能
 */
import React from "react";
import CdnImage from "@/components/CdnImage";
import { uploadCustomHead } from "../../actions/onlineReturn";
const src = "";
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src,
      filesVal: null,
      uploadSrc: this.props._isImageSrc || null,
      upLoadBtn:
        this.props._isImageSrc && this.props._isImageSrc.length > 4
          ? false
          : true,
      showPre:false,
      preUrl:""
    };
    this.handleChange = this.handleChange.bind(this);
    this.uploadExample = this.uploadExample.bind(this);
    this.showBigImg = this.showBigImg.bind(this);
    this.closeImg = this.closeImg.bind(this);
    
  }
  componentDidMount() {
    const { src, filesVal } = this.state; // TODO: 请移除无用state
    console.log(src, filesVal);
    this.toBlobPolify();
  }
  showBigImg(item){
    this.setState({
      showPre:true,
      preUrl:item
    })
  }
  closeImg(){
    this.setState({
      showPre:false
    })
  }
  toBlobPolify() {
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function (callback, type, quality) {
          var binStr = atob(this.toDataURL(type, quality).split(",")[1]),
            len = binStr.length,
            arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || "image/png" }));
        },
      });
    }
  }
  handleChange(e) {
    const { _clickCallback } = this.props;
    let { uploadSrc } = this.state;
    e.preventDefault();
    _clickCallback &&
      _clickCallback("uploadImageLoading", {
        status: false,
        isSuccess: true,
      });
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    let imgSrcArray = uploadSrc || [];
    if (files && files.length == 0) return;
    if (imgSrcArray && imgSrcArray.length > 4)
      return alert("你最多只能选择5张照片");
    let formDataV2 = new FormData();
    formDataV2.append("multipartFile", files[0]);
    formDataV2.append("type", "formData");
    uploadCustomHead(formDataV2, (callback) => {
      if (callback && callback.results) {
        _clickCallback &&
          _clickCallback("uploadImageLoading", {
            status: true,
            isSuccess: true,
          });
        imgSrcArray.push(callback.results);
        this.setState(
          {
            uploadSrc: imgSrcArray,
            upLoadBtn: imgSrcArray.length > 4 ? false : true,
          },
          () => {
            _clickCallback &&
              _clickCallback("getImageOriginalPaths", imgSrcArray);
          }
        );
      } else {
        _clickCallback &&
          _clickCallback("uploadImageLoading", {
            status: true,
            isSuccess: false,
          });
      }
    });
  }
  //删除图片
  delete(index) {
    let { uploadSrc } = this.state;
    const { _clickCallback } = this.props;
    let newArray = uploadSrc;
    if (index < 0) return;
    newArray.splice(index, 1);
    this.setState(
      {
        uploadSrc: newArray,
        upLoadBtn: newArray.length > 4 ? false : true,
      },
      () => {
        _clickCallback && _clickCallback("getImageOriginalPaths", newArray);
      }
    );
  }
  uploadExample() {
    const { _clickCallback, _key } = this.props;
    _clickCallback && _clickCallback(_key);
  }
  render() {
    const { _isSample } = this.props;
    const { uploadSrc, upLoadBtn ,showPre,preUrl} = this.state;
    return (
      <div className="image_upload">
       {showPre&& <div className="preview-img" onClick={this.closeImg}>
          <img src={preUrl} />
        </div>
        }
        <ul className="image_upload_example_ul">
          {upLoadBtn ? (
            <div className="image_upload_defalt">
              <div>
                <CdnImage src="/soa/mobile/images/order/addImage.png" />
                <span>上传凭证(最多5张)</span>
              </div>
              <input
                type="file"
                name="上传凭证 （最多5张）"
                accept="image/png,image/jpg,image/jpeg"
                onChange={this.handleChange}
              />
            </div>
          ) : null}
          {uploadSrc &&
            uploadSrc.length > 0 &&
            uploadSrc.map((item, index) => {
              return (
                <li key={`image_upload_example_${index}`}>
                  <img src={item} onClick={()=>{
                    this.showBigImg(item)
                  }} />
                  <span onClick={this.delete.bind(this, index)}>
                    <em>X</em>
                  </span>
                </li>
              );
            })}
        </ul>

        {_isSample ? (
          <div className="image_upload_example" onClick={this.uploadExample}>
            上传凭证示例图
          </div>
        ) : null}
      </div>
    );
  }
}
