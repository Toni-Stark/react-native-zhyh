import { action, makeAutoObservable, observable } from 'mobx';
import { Api, ApiResult } from '../common/api';

export const BaseUrl = '/resource';
export const eduBaseUrl = '/education';

export class GetOssFilesStore {
  @observable fileAddress?: string;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async getFileUrl(resourceId: string): Promise<boolean | string> {
    if (resourceId) {
      const res: ApiResult = await Api.getInstance.get({
        url: `${BaseUrl}/oss-file/${resourceId}/url`,
        withToken: true
      });
      if (res.success) {
        this.fileAddress = res.result;
        return Promise.resolve(true);
      } else {
        return Promise.resolve(res.message);
      }
    } else {
      return Promise.resolve('未找到文件id');
    }
  }

  @action
  async getDemandFileUrl({
    password,
    scheduleId,
    resourceId
  }: {
    password?: string;
    scheduleId?: string;
    resourceId?: string | number;
  }): Promise<boolean | string> {
    if (resourceId) {
      const params = {
        password,
        resourceId
      };
      const res: ApiResult = await Api.getInstance.post({
        url: `${eduBaseUrl}/lessons-vod/schedules/${scheduleId}/get-resource-url`,
        params,
        withToken: true
      });
      if (res.success) {
        this.fileAddress = res.result;
        return Promise.resolve(true);
      } else {
        return Promise.resolve(res.message);
      }
    } else {
      return Promise.resolve('未找到文件id');
    }
  }
}
