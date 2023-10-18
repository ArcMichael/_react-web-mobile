import { ORDERPAYCONFIRM, ORDERLIST, ORDERLISTSTATUS, UNITECOOKIE, PROTOTALMOUNT, CANCLEORDERID, CANCLESTATUS } from '../constants/ActionTypes';

const orderList = {
	ORDERLISTRESULTALL: null,
	ORDERLISTRESULTM: null,
	ORDERLISTRESULTS: null,
	ORDERLISTRESULTI: null,
	ORDERLISTRESULTD: null,
	ORDERLISTRESULTDPPB:null,
	ORDERLISTSTATUS: null,
	ORDERLISTRESULTSHOW: null,
	UNITECOOKIE: null,
	PROTOTALMOUNT: null,
	ORDERPAYCONFIRM: null,
	PAYORDERID: null,
	SAVECOUPON: null,
	SAVEUNCOUPON: null,
	DISTINGUISH_TYPE: null,
	CANCLEORDERID: null,
	CANCLESTATUS: null,
	GET_PERSONAL_INFO: null,
	SAVE_PERSONAL_CARD: null,
	SAVE_PERSONAL_PHONE: null,
	DISCRIMINANT_SOURCE: null,
	LOGIN_KEEP_USERID: null,
	LOGIN_KEEP_CARD_MESSAGE: null,
	LOGIN_KEEP_MOBILE: null,
	LOGIN_KEEP_PINK_CARD: null,
	LOGIN_KEEP_CARD_NUM: null,
	FIRST_POPUP: true,
	SAVE_CHANGE_CARD_LIST: null,
	SAVE_CHANGE_CARD_PHONE_OR_EMAIL: null,
	SAVE_CHANGE_CARD_EMAIL: null,
	SAVE_CHANGE_CARD_SINGAL: null,
	LOGIN_KEEP_CARD_SOURCE: null,
	ORDERLIST_PAY_METHOD: null,
	ORDERLIST_PAY_TYPE: null,
	LOGIN_PERSONAL_INFO: null,
	CLICK_IS_POPUP: false,
}

export default function (state = orderList, action = {}) {
	let ORDERLISTALL = action.ORDERLIST_ALL_RESULT;
	let ORDERLISTM = action.ORDERLIST_M_RESULT;
	let ORDERLISTI = action.ORDERLIST_I_RESULT;
	let ORDERLISTS = action.ORDERLIST_S_RESULT;
	let ORDERLISTD = action.ORDERLIST_D_RESULT;
	let ORDERLISTDPPB = action.ORDERLIST_DPPB_RESULT;
	let ORDERLISTSTATUSNOW = action.ORDERLIST_STATUS;
	let ORDERLISTSHOW = action.ORDERLIST_SHOW_RESULT;
	let UNITECOOKIE_NOW = action.UNITECOOKIE_RESULT;
	let PROTOTALMOUNTNUM = action.totalMount;
	let ORDERPAYCONFIRM_RESULT = action.state;
	let PAYORDERIDRESULT = action.ORDERIDNUM;
	let SAVEUNCOUPONRESULT = action.SAVEUNCOUPON_RESULT;
	let SAVECOUPONRESULT = action.SAVECOUPON_RESULT;
	let DISTINGUISH_TYPE_DATA = action.DISTINGUISH_TYPE_RESULT;
	let CANCLEORDERID_DATA = action.orderId;
	let CANCLESTATUS_DATA = action.data;
	let GET_PERSONAL_INFO_DATA = action.GET_PERSONAL_INFO_RESULT;
	let SAVE_PERSONAL_CARD_DATA = action.SAVE_PERSONAL_CARD_RESULT;
	let SAVE_PERSONAL_PHONE_DATA = action.SAVE_PERSONAL_PHONE_RESULT;
	let DISCRIMINANT_SOURCE_DATA = action.DISCRIMINANT_SOURCE_RESULT;
	let LOGIN_KEEP_USERID_DATA = action.LOGIN_KEEP_USERID_RESULT;
	let LOGIN_KEEP_CARD_MESSAGE_DATA = action.LOGIN_KEEP_CARD_MESSAGE_RESULT;
	let LOGIN_KEEP_MOBILE_DATA = action.LOGIN_KEEP_MOBILE_RESULT;
	let LOGIN_KEEP_PINK_CARD_DATA = action.LOGIN_KEEP_PINK_CARD_RESULT;
	let LOGIN_KEEP_CARD_NUM_DATA = action.LOGIN_KEEP_CARD_NUM_RESULT;
	let FIRST_POPUP_DATA = action.FIRST_POPUP_RESULT;
	let SAVE_CHANGE_CARD_LIST_DATA = action.SAVE_CHANGE_CARD_LIST_RESULT;
	let SAVE_CHANGE_CARD_PHONE_OR_EMAIL_DATA = action.SAVE_CHANGE_CARD_PHONE_OR_EMAIL_RESULT;
	let SAVE_CHANGE_CARD_EMAIL_DATA = action.SAVE_CHANGE_CARD_EMAIL_RESULT;
	let SAVE_CHANGE_CARD_SINGAL_DATA = action.SAVE_CHANGE_CARD_SINGAL_RESULT;
	let LOGIN_KEEP_CARD_SOURCE_DATA = action.LOGIN_KEEP_CARD_SOURCE_RESULT;
	switch (action.type) {
		case PROTOTALMOUNT:
			return Object.assign({}, state, {
				PROTOTALMOUNT: PROTOTALMOUNTNUM
			})
			break;
		case ORDERLIST.ORDERLIST_ALL:
			return Object.assign({}, state, {
				ORDERLISTRESULTALL: ORDERLISTALL
			})
			break;
		case ORDERLIST.ORDERLIST_M:
			return Object.assign({}, state, {
				ORDERLISTRESULTM: ORDERLISTM
			})
			break;
		case ORDERLIST.ORDERLIST_I:
			return Object.assign({}, state, {
				ORDERLISTRESULTI: ORDERLISTI
			})
			break;
		case ORDERLIST.ORDERLIST_S:
			return Object.assign({}, state, {
				ORDERLISTRESULTS: ORDERLISTS
			})
			break;
		case ORDERLIST.ORDERLIST_D:
			return Object.assign({}, state, {
				ORDERLISTRESULTD: ORDERLISTD
			})
			break;
		case ORDERLIST.ORDERLIST_DPPB:
			return Object.assign({}, state, {
				ORDERLISTRESULTDPPB: ORDERLISTDPPB
			})
			break;
		case ORDERLIST.ORDERLIST_SHOW:
			return Object.assign({}, state, {
				ORDERLISTRESULTSHOW: ORDERLISTSHOW
			})
			break;
		case ORDERLISTSTATUS:
			return Object.assign({}, state, {
				ORDERLISTSTATUS: ORDERLISTSTATUSNOW
			})
			break;
		case UNITECOOKIE:
			return Object.assign({}, state, {
				UNITECOOKIE: UNITECOOKIE_NOW
			})
			break;
		case ORDERPAYCONFIRM:
			return Object.assign({}, state, {
				ORDERPAYCONFIRM: ORDERPAYCONFIRM_RESULT
			})
			break;
		case ORDERLIST.ORDERLIST_PAY_ORDERID:
			return Object.assign({}, state, {
				PAYORDERID: PAYORDERIDRESULT
			})
			break;
		case ORDERLIST.SAVECOUPON:
			return Object.assign({}, state, {
				SAVECOUPON: SAVECOUPONRESULT
			})
			break;
		case ORDERLIST.SAVEUNCOUPON:
			return Object.assign({}, state, {
				SAVEUNCOUPON: SAVEUNCOUPONRESULT
			})
			break;
		case ORDERLIST.DISTINGUISH_TYPE:
			return Object.assign({}, state, {
				DISTINGUISH_TYPE: DISTINGUISH_TYPE_DATA
			})
			break;
		case CANCLEORDERID:
			return Object.assign({}, state, {
				CANCLEORDERID: CANCLEORDERID_DATA
			})
			break;
		case CANCLESTATUS:
			return Object.assign({}, state, {
				CANCLESTATUS: CANCLESTATUS_DATA
			})
			break;
		case ORDERLIST.GET_PERSONAL_INFO:
			return Object.assign({}, state, {
				GET_PERSONAL_INFO: GET_PERSONAL_INFO_DATA
			})
			break;
		case ORDERLIST.SAVE_PERSONAL_CARD:
			return Object.assign({}, state, {
				SAVE_PERSONAL_CARD: SAVE_PERSONAL_CARD_DATA
			})
			break;
		case ORDERLIST.SAVE_PERSONAL_PHONE:
			return Object.assign({}, state, {
				SAVE_PERSONAL_PHONE: SAVE_PERSONAL_PHONE_DATA
			})
			break;
		case ORDERLIST.DISCRIMINANT_SOURCE:
			return Object.assign({}, state, {
				DISCRIMINANT_SOURCE: DISCRIMINANT_SOURCE_DATA
			})
			break;
		case ORDERLIST.LOGIN_KEEP_USERID:
			return Object.assign({}, state, {
				LOGIN_KEEP_USERID: LOGIN_KEEP_USERID_DATA
			})
			break;
		case ORDERLIST.LOGIN_KEEP_CARD_MESSAGE:
			return Object.assign({}, state, {
				LOGIN_KEEP_CARD_MESSAGE: LOGIN_KEEP_CARD_MESSAGE_DATA
			})
			break;
		case ORDERLIST.LOGIN_KEEP_MOBILE:
			return Object.assign({}, state, {
				LOGIN_KEEP_MOBILE: LOGIN_KEEP_MOBILE_DATA
			})
			break;
		case ORDERLIST.LOGIN_KEEP_PINK_CARD:
			return Object.assign({}, state, {
				LOGIN_KEEP_PINK_CARD: LOGIN_KEEP_PINK_CARD_DATA
			})
			break;
		case ORDERLIST.LOGIN_KEEP_CARD_NUM:
			return Object.assign({}, state, {
				LOGIN_KEEP_CARD_NUM: LOGIN_KEEP_CARD_NUM_DATA
			})
			break;
		case ORDERLIST.FIRST_POPUP:
			return Object.assign({}, state, {
				FIRST_POPUP: FIRST_POPUP_DATA
			})
			break;
		case ORDERLIST.SAVE_CHANGE_CARD_LIST:
			return Object.assign({}, state, {
				SAVE_CHANGE_CARD_LIST: SAVE_CHANGE_CARD_LIST_DATA
			})
			break;
		case ORDERLIST.SAVE_CHANGE_CARD_PHONE_OR_EMAIL:
			return Object.assign({}, state, {
				SAVE_CHANGE_CARD_PHONE_OR_EMAIL: SAVE_CHANGE_CARD_PHONE_OR_EMAIL_DATA
			})
			break;
		case ORDERLIST.SAVE_CHANGE_CARD_EMAIL:
			return Object.assign({}, state, {
				SAVE_CHANGE_CARD_EMAIL: SAVE_CHANGE_CARD_EMAIL_DATA
			})
			break;
		case ORDERLIST.SAVE_CHANGE_CARD_SINGAL:
			return Object.assign({}, state, {
				SAVE_CHANGE_CARD_SINGAL: SAVE_CHANGE_CARD_SINGAL_DATA
			})
			break;
		case ORDERLIST.LOGIN_KEEP_CARD_SOURCE:
			return Object.assign({}, state, {
				LOGIN_KEEP_CARD_SOURCE: LOGIN_KEEP_CARD_SOURCE_DATA
			})
			break;
		case ORDERLIST.CLICK_IS_POPUP:
			return Object.assign({}, state, {
				CLICK_IS_POPUP: action.CLICK_IS_POPUP_RESULT
			})
			break;
		// case ORDERLIST.FIRST_POPUP:
		// 	return Object.assign({}, state, {
		// 		FIRST_POPUP: action.GFIRST_POPUP_RESULT
		// 	})
		// 	break;
		case ORDERLIST.ORDERLIST_PAY_METHOD:
			return Object.assign({}, state, { ORDERLIST_PAY_METHOD: action.data });
		case ORDERLIST.ORDERLIST_PAY_TYPE:
			return Object.assign({}, state, { ORDERLIST_PAY_TYPE: action.data });
		case ORDERLIST.LOGIN_PERSONAL_INFO:
			return Object.assign({}, state, { LOGIN_PERSONAL_INFO: action.data });
		default:
			return state;
	}
}