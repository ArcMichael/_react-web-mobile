import React from "react";
import LazyloadImage from "@/components/LazyloadImage";
import Sensor from '../../../../../../Utils/sensor'
/**
 * @typedef {import('./ProductItem').GuessYouLikeProductItem} ProductItemInfo
 * @typedef {import('@/lib/services/Community').PostInfo} PostItemInfo
 * @typedef {import('@/lib/services/Mpcms').ImageCommonDetail} ImageItemInfo
 * @typedef {import('@/lib/services/Mpcms').ProductCommonDetail[]} ForInOneAdItemInfo;
 * @typedef {ProductItemInfo | PostItemInfo | ImageItemInfo | ForInOneAdItemInfo} DataSourceType;
 */

/**
 * @typedef {{
 *   info: PostItemInfo;
 *   index: number;
 *   onClick?:eact.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>['onClick'];
 * }} PostItemProps
 */

/**
 * @extends {React.Component<PostItemProps>}
 */
export default class PostItem extends React.Component {
  render() {
    const { info, index, pageType } = this.props;
    // const share = info && info.timelineProductPostBaseDto && info.timelineProductPostBaseDto.shareDto ? info.timelineProductPostBaseDto.shareDto : {};
    const share = info && info.timelineProductPostBaseDto && info.timelineProductPostBaseDto.shareDto;
    const auther = info && info.timelineProductPostBaseDto && info.timelineProductPostBaseDto.timelineAuthorDto;

    const postBase = info && info.timelineProductPostBaseDto;
    const tag = info && postBase.tagList && postBase.tagList[0];
    let desc = <div className="post-item-desc">{postBase && postBase.content}</div>;
    let content = postBase && postBase.content
    if (postBase && postBase.content && tag && tag.content) {
      // 话题加粗
      let description = postBase.content.split(tag.content)[1];
      let topic = tag.content;
      content = topic + description
      desc = (
        <div className="post-item-desc">
          <span>{topic}</span>
          {description}
        </div>
      );
    }
    return (
      <a className="post-item" href={share.url} onClick={() => {
        Sensor.go('clickBanner_App_Mob', {
          banner_type: "campaign",
          banner_content: auther.nickname + "_" + content,
          banner_belong_area: pageType ? pageType + "_Selection" : "Selection",
          banner_to_url: share.url,
          banner_to_page_type: 'Function-page',
          banner_ranking: index + 1,
          campaign_code: share.url,
        })
      }
      }>
        <div className="post-item-imagewrap">
          <LazyloadImage
            imgProps={{
              src: share.imageBaseDto.imagePath.replace("750x750", "360x360"),
            }}
            shape="vertical-rect"
            loadingType="smalltype"
           />
        </div>
        <div className="post-item-bottom">
          <div className="post-item-user">
            <div className="post-item-avatar">
              <LazyloadImage
                imgProps={{
                  src: auther.avatarUrl,
                }}
                loadingType="smalltype"
                shape="circle"
               />
            </div>
            <div className="post-item-name">{auther.nickname}</div>
            <div className="post-item-xin">
              <span className={info && info.collected ? "sephora-icon-collect-fill" : "sephora-icon-collect"} />
            </div>
          </div>
          {desc}
        </div>
      </a>
    );
  }
}
