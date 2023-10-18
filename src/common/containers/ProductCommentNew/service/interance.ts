export interface Params {
  pageNo: number;
  productId: number | string;
  labelId: string;
  skuId: number | null;
  pageType: number;
}

export interface AttrConsumer {
  value: string;
  id: number;
  score: string;
}

export interface commentImageDto {
  commentId: string;
  imagePath: string;
}

export interface skuInfoCodeData {
  timeStamp: string;
  status: string;
  results: {
    bannerDesc1: string;
    bannerImage1: string;
    noInvToastReq: boolean;
    preSaleActivity: any;
    roleActivity: any;
    seckillActivityDto: any;
    shareInfo: any;
    sku: skuInfo;
    vipActivity: any;
    wholePreSaleActivity: any;
  };
  errorCode?: number;
  errorMessage?: string;
}

export interface skuInfo {
  brandCN: string;
  brandEN: string;
  brandId: number;
  brandImage: string;
  brandSaleDesc: string;
  productNameCN: string;
  productNameEN: string;
  defaultImage: string;
}

export interface skuCodeData {
  timeStamp: string;
  status: string;
  results: {
    colorSeriesNum: number;
    embedId: number;
    title: string;
    saleAttrs: skuList[];
  };
  errorCode?: number;
  errorMessage?: string;
}

export interface likeCodeData {
  timeStamp: string;
  status: string;
  results: boolean;
  errorCode?: number;
  errorMessage?: string;
  jQueryStatus?: {
    status: number;
  };
}

export interface skuList {
  color?: string;
  image?: string;
  skuCode?: string;
  skuId: number;
  status?: string;
  value?: string;
}

export interface ListCodeData {
  timeStamp: string;
  status: string;
  results: ListDto;
  errorCode?: number;
  errorMessage?: string;
}

export interface labelListCodeData {
  timeStamp: string;
  status: string;
  results: labelDto[];
  errorCode?: number;
  errorMessage?: string;
}
export interface labelDto {
  id: string;
  name: string;
  count: number;
  labelType?: number;
}

export interface CommentDto {
  uuid: string;
  content: string;
  score: number;
  userId: number;
  photo: string;
  nickName: string;
  cardType: string;
  userArchives: string[];
  createTime: string;
  isEssenceComment: number;
  productId: number;
  skuCode: number;
  skuSpec: string;
  attrConsumerList: AttrConsumer[];
  replyDto?: {
    nickName: string;
    content: string;
    createTime: string;
    avatarUrl: string;
  };
  skuName: string;
  skuImage: string;
  brandNameEn: string;
  labelConsumers: string[];
  thumbsUpCount: number;
  isThumbsUp: number;
  commentImageDtoList: commentImageDto[];
}

export interface ListDto {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecord: number;
  numberOfContent: number;
  hasNext: Boolean;
  productScore: number;
  commentDtos: CommentDto[];
}
