import {
  ApiResponse,
  create,
  CANCEL_ERROR,
  CLIENT_ERROR,
  CONNECTION_ERROR,
  NETWORK_ERROR,
  NONE,
  SERVER_ERROR,
  TIMEOUT_ERROR,
  ApisauceInstance
} from 'apisauce';
import moment from 'moment';
import { SERVER_URL } from './app.config';
import { UserStore } from '../store/UserStore';
import { t } from './tools';
import { StackNavigationProp } from '@react-navigation/stack/src/types';

export interface ApiResultInterface {
  code?: number;
  message: string;
  result: any;
  success: boolean;
  timestamp: string;
}

export type ApiResult = ApiResultInterface;

export type RestfulOperateType = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ApiParam = {
  url: string;
  params?: object;
  withToken?: boolean;
  multipart?: boolean;
};

export class Api {
  static get getInstance() {
    return this.instance || (this.instance = new this());
  }
  static instance: Api;
  readonly _api: ApisauceInstance;
  readonly timeout: number = 10000;
  navigation: StackNavigationProp<any> | undefined;

  constructor() {
    this._api = create({
      baseURL: SERVER_URL,
      timeout: this.timeout,
      headers: {
        Accept: 'application/json'
      }
    });
    if (__DEV__) {
      const apiMonitor = (response: any) => console.log('[API] -> ', response);
      this._api.addMonitor(apiMonitor);
    }
  }

  setUpNavigation(navigation: StackNavigationProp<any>) {
    this.navigation = navigation;
  }

  public timer: any;

  private async redirectToLoginScreen() {
    // console.log('2-token无效');
    if (this.navigation !== undefined) {
      while (this.navigation.canGoBack()) {
        this.navigation.goBack();
      }
      // this.timer = setTimeout(() => {
      //   if (this.timer) {
      this.navigation.navigate('LoginByPhone');
      // }
      // clearTimeout(this.timer);
      // }, 200);
    }
  }

  rawGet(url: string, params: any = {}) {
    return this._api.get(url, params);
  }

  rawPost(url: string, params: any = {}) {
    return this._api.post(url, params);
  }

  rawPut(url: string, params: any = {}) {
    return this._api.put(url, params);
  }

  rawPatch(url: string, params: any = {}) {
    return this._api.patch(url, params);
  }

  rawDelete(url: string, params: any = {}) {
    return this._api.delete(url, params);
  }

  async get(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('get', url, params, withToken, false);
  }

  async post(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true, multipart = false } = param;
    return this.RestfulOperate('post', url, params, withToken, multipart);
  }

  async put(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('put', url, params, withToken, false);
  }

  async patch(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('patch', url, params, withToken, false);
  }

  async delete(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('delete', url, params, withToken, false);
  }

  async upload(filePath: string, fileName: string = 'avatar'): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${fileName}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: '/auth/users/upload-avatar', params: form, withToken: true, multipart: true });
  }

  async uploadAsyncImage(filePath: string, fileName: string = 'avatar'): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${fileName}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: '/xueyue/sys/common/upload-to-temp', params: form, withToken: true, multipart: true });
  }

  async uploadAuthImage(filePath: string): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${new Date().getTime()}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: `/auth/upload-images`, params: form, withToken: true, multipart: true });
  }

  async uploadEducationImage(filePath: string): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${new Date().getTime()}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: `/education/upload-images`, params: form, withToken: true, multipart: true });
  }

  private static getTimeStamp(): string {
    return moment().format('x');
  }

  private async RestfulOperate(operate: RestfulOperateType, url: string, params: any, withToken: boolean, multipart: boolean): Promise<ApiResult> {
    const isAuthFailed = (message: string) => {
      return message.includes('toke') || message.includes('令牌校验失败');
    };
    const token = await UserStore.getToken();
    let response: ApiResponse<any>;
    const rawHeaders = { 'X-Access-Token': '', 'Content-Type': 'application/json' };
    // console.log('0-登录失败-准备跳转页面', token);
    if (withToken) {
      // console.log('1-登录失败-准备跳转页面', withToken);
      if (token === null) {
        // console.log('2-登录失败-准备跳转页面', this.navigation);
        await this.redirectToLoginScreen();
        return { code: 401, message: t('message.loginFailed'), result: null, success: false, timestamp: Api.getTimeStamp() };
      } else {
        rawHeaders['X-Access-Token'] = token;
      }
    }
    if (multipart) {
      rawHeaders['Content-Type'] = 'multipart/form-data';
    }
    const headers = { headers: rawHeaders };

    switch (operate) {
      case 'get':
        response = await this._api.get(url, params, headers);
        break;
      case 'post':
        response = await this._api.post(url, params, headers);
        break;
      case 'put':
        response = await this._api.put(url, params, headers);
        break;
      case 'patch':
        response = await this._api.patch(url, params, headers);
        break;
      case 'delete':
        response = await this._api.delete(url, params, headers);
        break;
      default:
        return { code: 500, message: '消息格式错误', result: null, success: false, timestamp: Api.getTimeStamp() };
    }
    if (response.data?.message !== undefined && isAuthFailed(response.data.message)) {
      const messageToUser = t('message.loginFailed');
      console.log(messageToUser, '1-登录状态有问题');
      if (withToken) {
        await UserStore.removeToken();
        await this.redirectToLoginScreen();
      } else {
        return { code: response.data.status, message: messageToUser, result: response.data.result, success: false, timestamp: Api.getTimeStamp() };
      }
    }
    switch (response.problem) {
      case NONE:
        return response.data;
      case CLIENT_ERROR:
      case SERVER_ERROR:
        if (response.data?.message !== undefined) {
          return { code: response.data.status, message: response.data.message, result: response.data.result, success: false, timestamp: Api.getTimeStamp() };
        } else if (response.status === 404) {
          return { code: response.status, message: '服务器地址错误', result: null, success: false, timestamp: Api.getTimeStamp() };
        } else {
          return { code: response.status, message: '访问服务器资源发生错误', result: null, success: false, timestamp: Api.getTimeStamp() };
        }
      case TIMEOUT_ERROR:
        return { code: response.status, message: '访问服务器超时', result: null, success: false, timestamp: Api.getTimeStamp() };
      case CONNECTION_ERROR:
        return { code: response.status, message: '无法访问服务器', result: null, success: false, timestamp: Api.getTimeStamp() };
      case NETWORK_ERROR:
        return { code: response.status, message: '无法访问服务器', result: null, success: false, timestamp: Api.getTimeStamp() };
      case CANCEL_ERROR:
      default:
        return { code: response.status, message: '发生未知错误', result: null, success: false, timestamp: Api.getTimeStamp() };
    }
  }
}
