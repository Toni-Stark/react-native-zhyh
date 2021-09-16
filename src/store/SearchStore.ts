import { action, makeAutoObservable, observable } from 'mobx';
import { getEnLen, getOnlyWord } from '../common/tools';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_SEARCH_HISTORY, APP_SEARCH_HISTORY_SPLITTER } from '../common/constants';
import { Api, ApiResult } from '../common/api';
import { CoursesDetail } from './LessonDetailStore';

const MAX_HISTORY_COUNT = 20;

const BaseUrl = '/education';

export class SearchStore {
  @observable refreshLoading: boolean = true;
  @observable error: boolean = false;

  @observable history: string[] = [];
  @observable searchList: CoursesDetail[] = [];
  @observable isLiveOrDemand: number = 0;
  @observable dataList = [
    { name: '直播课', url: '/lessons-live', index: 0 },
    { name: '点播课', url: '/lessons-vod', index: 1 }
  ];
  public constructor() {
    makeAutoObservable(this);
    AsyncStorage.getItem(APP_SEARCH_HISTORY)
      .then((res) => {
        if (res !== null) {
          this.history = res.split(APP_SEARCH_HISTORY_SPLITTER);
        }
      })
      .catch((e) => console.log(e));
  }

  @action
  async searchConditionInfo(search?: string, isAdd?: boolean): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({
      url: `${BaseUrl}${this.dataList[this.isLiveOrDemand].url}/list-for-public?name=${search}&pageSize=10&current=${
        isAdd ? getEnLen(this.searchList.length, 10) : 1
      }`,
      params: {},
      withToken: true
    });
    if (res.success) {
      if (!isAdd) {
        this.searchList = res.result.content;
      } else {
        this.searchList = this.searchList.concat(res.result.content);
      }
      return Promise.resolve(true);
    } else {
      console.log(res.message, 12345667889);
      return Promise.reject(res.message);
    }
  }

  @action async addSearchHistory(history: string) {
    const historyIndeed = getOnlyWord(history);
    if (this.history.length > MAX_HISTORY_COUNT) {
      this.history.shift();
    }
    if (!this.history.includes(historyIndeed)) {
      this.history.push(historyIndeed);
    }
    await AsyncStorage.setItem(APP_SEARCH_HISTORY, this.history.join(APP_SEARCH_HISTORY_SPLITTER));
  }

  @action async clearHistory() {
    await AsyncStorage.setItem(APP_SEARCH_HISTORY, '');
    this.history = [];
  }
}
