/*
 * @Author: siqiang
 * @Date: 2019-03-21 14:11:48
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-08-04 17:50:35
 * @function 更多推荐相关的组件
 */
import React from "react";
import { connect } from "react-redux";
import Image from "../ImagesLazyLoad/index";
import { getGuessYouLikeData } from "../../actions/commonVenders";
class MoreRecommended extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _guessYouLikeList: [],
    };
  }
  componentDidMount() {
    const { _moreRecommendedKey } = this.props;
    const that = this;
    this.props.getGuessYouLikeData(
      {
        f: `f:${_moreRecommendedKey.category},l:6,o:0`,
        q: `${_moreRecommendedKey.brand}`,
        ex: JSON.stringify([
          { f: "brand", r: "IS", v: `${_moreRecommendedKey.brand}`, n: true },
        ]),
      },
      (callback) => {
        const _response = [];
        for (const i in callback.products) {
          let _items = {};
          _items = callback.products[i];
          _response.push(_items);
        }
        if (_response && _response.length > 0) {
          that.setState({
            _guessYouLikeList: _response,
          });
        }
      }
    );
  }
  render() {
    const { _guessYouLikeList } = this.state;
    if (_guessYouLikeList && _guessYouLikeList.length == 0) {
      return <div />;
    }
    return (
      <div>
        {_guessYouLikeList && _guessYouLikeList.length > 0 && (
          <div className="nf_swiper_detail_more_recommended">更多推荐</div>
        )}
        {_guessYouLikeList && _guessYouLikeList.length > 0 && (
          <ul className="guess-you-like-ul">
            {_guessYouLikeList.map((item, index) => (
              <a
                key={`guess-you-like-${index}`}
                className="guess-you-like-normal removeMargin"
                href={`https://m.sephora.cn/product/${item.item}.html?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`}
              >
                <Image
                  title=""
                  src={item.zoom_image
                    .replace("http://", "https://")
                    .replace(
                      "350x350",
                      (index + 1) % 5 === 1 ? "350x350" : "320x320"
                    )}
                  size={320}
                  offset={0}
                />
                <div className="guess-you-like-product">
                  <p className="guess-you-like-product-en">{item.c_custom_0}</p>
                  <p className="guess-you-like-product-name">{item.title}</p>
                  <p className="guess-you-like-product-price">
                    <label>¥</label>
                    {item.price && item.price.toFixed(2)}
                  </p>
                </div>
              </a>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToProps = () => {};
export default connect(mapStateToProps, {
  getGuessYouLikeData,
})(MoreRecommended);
