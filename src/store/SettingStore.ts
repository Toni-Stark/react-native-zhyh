import { action, makeAutoObservable, observable } from 'mobx';
import { SettingViewItemType } from '../component/SettingView';
import { Api } from '../common/api';

const BaseUrl = '/auth';

export class SettingStore {
  @observable loading = true;
  @observable settings: Array<SettingViewItemType> = [];
  @observable initURL: string | undefined = '';
  @observable canJump: boolean = true;

  @observable userAgreeModal: boolean = false;
  @observable userIsAgree: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  updateSettings(settings: Array<SettingViewItemType>) {
    this.settings = settings;
    this.loading = false;
  }

  @action
  async updateInput(str: string): Promise<boolean> {
    const res = await Api.getInstance.get({
      url: '/xueyue/business/feedback/create',
      params: {
        description: str,
        type: '用户提交'
      }
    });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async loginWithUuidForDesktop(uuid: string): Promise<boolean> {
    const res = await Api.getInstance.post({
      url: BaseUrl + '/users/request-login-by-qr-code',
      params: {
        uuid
      }
    });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }
}
