import { OrderDepositDto } from "../OrderDetail/interface";

export interface IorderInfoList {
  orderId: string;
  orderOriginStatus: string;
  orderType: number;
  orderDepositDtoList: IorderDepositDto[];
  payMethod: string;
  orderStatus: string;
  productInfoDtoList: IproductInfoDto[];
  totalPayAmount: string;
  productQuantity: number;
  shippingFee: string;
  giftProductsInfoDtoList: [];
  processOrderCancel: boolean;
  estimatedDeliveryTime: string;
  mShouldPay?:string;
  mergeOrders: IMergeOrdersDto[];
  orderInvoiceSwitch: number;
  totalAmount: string;
  calcCancelTime: number;
  isSplitOrder: boolean;
  deliveryTracking: {
    updateTime: string;
    trackingInfo: string;
  };
  shouldTotalPay: string;
  giftProductQuantity: number;
}
export interface orderList {
  ORDERLISTRESULTALL: any;
  ORDERLISTRESULTM: any;
  ORDERLISTRESULTS: any;
  ORDERLISTRESULTI: any;
  ORDERLISTRESULTD: any;
  ORDERLISTRESULTDPPB: any;
  ORDERLISTSTATUS: string;
  ORDERLISTRESULTSHOW: any;
  PAYORDERID: any;
  ORDERPAYCONFIRM: any;
}
export interface IorderDepositDto {
  depositPayStatus: "0" | "1" | "2" | "3" | "4";
  balancePayEndTime: string;
  balancePayStartTime: string;
  depositPayTime: string;
  depositAmountType: string;
  orderDepositAmount: number;
  payCancelRemainingTime: number;
  payStartRemainingTime: number;
  orderDepositId: string;
  depositValue: string;
  depositType: string;
}
export interface IproductInfoDto {
  offerPrice: string;
  brandNameCN: string;
  brandNameEN: string;
  productNameCN: string;
  productNameEN: string;
  defaultImagePath: string;
  productId: string;
  orderId: string;
  skuId: string;
  skuCode: string;
  quantity: number;
  sapPrice: string;
  estimatedDeliveryTime: string;
  isSendComment: number;
  skuSaleAttrDto: IskuSaleAttrDto;
  productSize: string;
  isFullImage: boolean;
  skuType?: string;
  orderDepositList: OrderDepositDto[];
}
export interface IMergeOrdersDto {
  moid: string;
  mproductQuantity: number;
  mTotalAmount: string;
  msurplusShouldPay: string;
  // mImages
}
export interface IskuSaleAttrDto {
  custom?: string;
  spec?: number;
  specType?: string;
}
export type IoperationArr = IoperationDto[];
export interface IoperationDto {
  type: string;
  text: string;
  className: string;
  callback: () => void;
}
export interface IdepositChecked {
  depositPayStatus: string;
  orderId: string;
}
export interface IofflineOrder {
  itemList: IitemDto[];
}
export interface IitemDto {
  price: string;
  productBrandNameEn: string;
  productId: string;
  productImageUrl: string;
  productName: string;
  productSize: string;
  quantity: number;
  skuId: string;
}
export interface addDto {
  type: number;
  channel: string;
  quantity: number;
  checked: number;
  skuId: string;
}
