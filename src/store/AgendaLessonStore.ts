import { Api } from '../common/api';

import { action, makeAutoObservable, observable } from 'mobx';

const BaseUrl = '/education';

export class AgendaLessonStore {
  @observable courseName: string = '';
  @observable categoryName: string = '';
  @observable planningEndTime: string = '';
  @observable planningStartTime: string = '';
  @observable id: string = '';
  @observable loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  //获取当前人员本月课程
  @action
  async getMyScheduleThisMonth(): Promise<any> {
    const currentDates = new Date(new Date().getFullYear(), new Date().getMonth() + 1 === 13 ? 0 : new Date().getMonth() + 1, 0).getDate();
    const lastDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    const nextDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + currentDates;
    const params = {
      endTime: nextDate,
      startTime: lastDate
    };
    const res = await Api.getInstance.get({ url: BaseUrl + '/schedule-live/list-by-date', params, withToken: true });
    if (res.success) {
      console.log(res.result);
      return Promise.resolve(res.result);
    } else {
      return Promise.reject(res.message);
    }
  }
}
