export interface ProductInfoDto {
  activityType?: string;
  brandNameCN: string;
  brandNameEN: string;
  currentReturnStatus: string;
  defaultImagePath: string;
  depositPrice: string;
  estimatedDeliveryTime: string;
  offerPrice: string;
  orderId: string;
  productId: string;
  productNameCN: string;
  productNameEN: string;
  quantity: number;
  returnStatus: string;
  sapPrice: string;
  skuCode: string;
  skuId: string;
  isSendComment: number;
  buyAgain: boolean;
  skuSaleAttrDto: {
    custom?: string;
    spec?: number;
    specType?: string;
  };
  skuType: number | string;
}

export interface addressContent {
  addrCity: string;
  addrDetail: string;
  addrDistrict: string;
  addrId: number;
  addrProvince: string;
  check: string;
  cod: string;
  isDefault: string;
  mobilePhone: string;
  telephone: string;
  userName: string;
  zipcode: string;
}

export interface DeliveryDataDto {
  trackingInfo: string;
  updateTime: Date;
}

interface MergeOrdersDto {
  moid: string;
  mproductQuantity: number;
  msurplusShouldPay: string;
  mTotalAmount: string;
}

interface OrderPayInfoDto {
  payMethodCn: string;
  payAmount: string;
  orderPayType: string;
}

export interface OrderDepositDto {
  orderDepositId: string;
  orderDepositAmount: number;
  depositAmountType: string;
  depositPayStatus: string;
  depositPayTime: string;
  payStartRemainingTime: number;
  payCancelRemainingTime: number;
  depositType: string;
  depositValue: string;
  balancePayStartTime: string;
  balancePayEndTime: string;
}

export interface orderInfo {
  accumulatePoints: string;
  address: string;
  amountPaid: string;
  amountPayable: string;
  area: string;
  calcCancelTime: number;
  cancelReason: string;
  cancelTime: string;
  city: string;
  comments: string;
  couponAdjustment: string;
  createTime: string;
  deliveryInfo: string;
  deliverySummary: string;
  deliveryTime: string;
  discountAdjustment: string;
  giftComments: string;
  giftProducts: ProductInfoDto[];
  giftProductsCount: number;
  isDeliveryTimeOut: number;
  isSplitOrder: string;
  mergeOrders: MergeOrdersDto[];
  mobile: string;
  orderId: string;
  orderOriginStatus: string;
  orderStatus: string;
  orderType: string;
  payInfoDtos: OrderPayInfoDto[];
  payMethod: string;
  paymentTime: string;
  preSale: boolean;
  priorityInDelivery: boolean;
  priorityInDeliveryMsg: string;
  processOrderCancel: boolean;
  province: string;
  realProductsCount: number;
  recipientName: string;
  rejectedTime: string;
  sales: boolean;
  shippedTime: string;
  shipping: string;
  shouldTotalPay: string;
  signedTime: string;
  switchIsOpen: string;
  totalAmount: string;
  totalPayment: string;
  wrapPart: string;
  wrapPrice: string;
  zipcode: string;
  orderDepositList: OrderDepositDto[];
  realProducts: ProductInfoDto[];
  deliveryCompany: string;
  deliveryData: DeliveryDataDto[];
  editAddressTips: string;
  estimatedDeliveryTime: string;
  mShouldPay: string;
  orderInvoiceSwitch: number;
}
