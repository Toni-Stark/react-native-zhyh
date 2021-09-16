import { Api, ApiResult, ApiResultInterface } from '../common/api';
import { action, makeAutoObservable, observable } from 'mobx';
import * as WeChat from 'react-native-wechat-lib';
import { getEnLen, t } from '../common/tools';
import Alipay from '@uiw/react-native-alipay';
import { Platform } from 'react-native';
import { appConfig } from '../common/app.config';

if (Platform.OS === 'ios') {
  WeChat.registerApp(appConfig.WX_APP_ID, 'https://www.icst-edu.com/');
} else if (Platform.OS === 'android') {
  WeChat.registerApp(appConfig.WX_APP_ID, 'https://www.icst-edu.com/');
}

export const IN_APP_PURCHASE_ITEMS = ['xy001', 'xy002', 'xy003', 'xy004', 'xy005', 'xy006', 'xy007', 'xy008', 'xy009'];

export class PayStore {
  @observable aliPayString: string | undefined;
  @observable moneyOperate: number | undefined;
  @observable wxPayInfo: WeiXinPayType | undefined;
  @observable payOrderRecords: FlowType[] = [];
  @observable showBottomEmptyState: boolean = false;

  @observable orderId: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async checkWXInstalled() {
    return await WeChat.isWXAppInstalled();
  }

  @action
  async aliPayForBalance(userId: string, amount: number): Promise<boolean> {
    const res: ApiResultInterface = await Api.getInstance.post({
      url: `/xueyue/pay/aliAppRecharge?userId=${userId}&amount=${amount}`,
      params: {},
      withToken: true
    });
    if (res.success) {
      this.aliPayString = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async createInAppPurchase(userId: string, amount: number, body: string): Promise<any> {
    const res = await Api.getInstance.post({
      url: '/xueyue/pay/order/create_in_app_purchase',
      params: {
        userId,
        amount,
        body
      },
      withToken: true
    });
    if (res.success) {
      return Promise.resolve(res.result);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async updateInAppPurchaseStatus(payOrderId: string, transactionIdentifier: string, receiptData: string): Promise<any> {
    const res = await Api.getInstance.put({
      url: '/xueyue/pay/order/update_in_app_purchase_status',
      params: {
        payOrderId,
        transactionIdentifier,
        receiptData
      }
    });
    if (res.success) {
      return Promise.resolve(res.result);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async wxPayForBalance(userType: number, userId: string, amount: number): Promise<boolean> {
    const res: ApiResultInterface = await Api.getInstance.post({
      url: `/xueyue/pay/wxAppRecharge?userId=${userId}&amount=${amount}&loginRole=${userType}`,
      params: {},
      withToken: true
    });
    if (res.success) {
      this.wxPayInfo = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  /**
   * url: /xueyue/pay/fund/myList;
   */
  @action
  async foundMyList(actions: boolean): Promise<boolean> {
    if (actions) {
      const res: ApiResultInterface = await Api.getInstance.get({
        url: `/xueyue/pay/fund/myList?pageSize=12&pageNo=1`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.payOrderRecords = res.result.records;
        return Promise.resolve(res.success);
      } else {
        return Promise.reject(res.message);
      }
    } else {
      const res: ApiResultInterface = await Api.getInstance.get({
        url: `/xueyue/pay/fund/myList?pageSize=12&pageNo=${getEnLen(this.payOrderRecords.length, 12)}`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.payOrderRecords = this.payOrderRecords?.concat(res.result.records);
        return Promise.resolve(res.success);
      } else {
        return Promise.reject(res.message);
      }
    }
  }

  @action
  async doOrderPay(paySelect: number, lessonId: string | undefined, userType?: number): Promise<String | boolean | void> {
    const res: ApiResult = await Api.getInstance.get({ url: `/xueyue/business/lesson/query-pay-order-id?lessonId=${lessonId}`, params: {}, withToken: true });
    if (res.success) {
      this.orderId = res.result.payOrderId;
      if (paySelect === 0 && res.result.payOrderId.length > 0) {
        const aliRes: ApiResult = await Api.getInstance.post({ url: `/xueyue/pay/payOrderByAliPayApp?orderId=${this.orderId}`, params: {}, withToken: true });
        if (res.success) {
          try {
            const result = await Alipay.alipay(aliRes.result);
            let { resultStatus } = result;
            switch (resultStatus) {
              case '9000':
                this.moneyOperate = 0;
                return Promise.resolve('操作成功');
              case '8000':
                return Promise.reject('正在处理中');
              case '4000':
                return Promise.reject('操作失败');
              case '5000':
                return Promise.reject('重复请求');
              case '6001':
                return Promise.reject('用户中途取消');
              case '6002':
                return Promise.reject('网络连接出错');
              default:
                return Promise.reject('未知错误');
            }
          } catch (e) {
            return Promise.reject(e);
          }
        } else {
          return Promise.reject('支付失败');
        }
      } else if (paySelect === 1 && res.result.payOrderId.length > 0) {
        const weiRes: ApiResult = await Api.getInstance.post({
          url: `/xueyue/pay/payOrderByWeixinApp?orderId=${this.orderId}&&loginRole=${userType}`,
          params: {},
          withToken: true
        });
        if (weiRes.success) {
          this.wxPayInfo = weiRes.result;
          if (this.wxPayInfo?.appid) {
            const wxRes = await WeChat.pay({
              partnerId: this.wxPayInfo.partnerid,
              prepayId: this.wxPayInfo.prepayid,
              nonceStr: this.wxPayInfo.noncestr,
              timeStamp: this.wxPayInfo.timestamp,
              package: this.wxPayInfo.tpackage,
              sign: this.wxPayInfo.sign
            })
              .then((payRes) => {
                return payRes;
              })
              .catch((err) => {
                console.log(1, err);
                return { errCode: 999999, errStr: t('recharge.paymentError') };
              });
            console.log(2, wxRes);
            const { errCode, errStr } = await wxRes;
            if (errCode === 0) {
              this.moneyOperate = 0;
              return Promise.resolve(true);
            } else {
              return Promise.resolve(errStr);
            }
          } else {
            return Promise.reject(t('recharge.paymentError'));
          }
          // return Promise.resolve('微信支付正在开发中');
        }
      } else if (paySelect === 2 && res.result.payOrderId.length > 0) {
        const blaRes: ApiResult = await Api.getInstance.post({ url: `/xueyue/pay/payOrderByBalance`, params: { orderId: this.orderId }, withToken: true });
        if (blaRes.success) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(blaRes.message);
        }
      }
    }
  }
}

export interface WeiXinPayType {
  appid: string;
  noncestr: string;
  partnerid: string;
  prepayid: string;
  sign: string;
  timestamp: string;
  tpackage: string;
}

export interface FlowType {
  amount: string | number;
  tradeNo: string | number;
  orderId: string | number;
  description: string | number;
  updateTime: string | number;
  userName: string | number;
  type: string | number;
  outAccount: string | number;
  userId: string | number;
  transactionId: string | number;
  payType: string | number;
  createTime: string | number;
  id: string | number;
  status: string | number;
  refundAmount: string | number;
}
