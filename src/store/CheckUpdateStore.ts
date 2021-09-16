import { Linking, Platform, NativeModules } from 'react-native';

import { Api } from '../common/api';
import { action, makeAutoObservable, observable } from 'mobx';
import { addDownLoadListener } from 'rn-app-upgrade';
const RNUpgrade = NativeModules.upgrade;

export interface VersionType {
  download_url: string; // "http://192.168.0.100:50189/xueyue-v1.10.2.apk"
  version: string; // "1.10.2"
}

export const BaseUrl = '/auth';

const version = 'v' + require('../../package.json').version;

export class CheckUpdateStore {
  public static appId = '1507515965';
  @observable needUpdate: boolean = false;
  @observable updateUrl: string = '';
  @observable progress: number = 0;
  @observable showProgress: boolean = false;
  @observable baseViewUseRef: any;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async checkUpdate(baseView, fullyAutomatic): Promise<any> {
    this.baseViewUseRef = baseView;
    if (Platform.OS === 'ios') {
      const result = await fetch(`https://itunes.apple.com/cn/lookup?id=${CheckUpdateStore.appId}&t=${Date.now()}`);
      const resParams = await result.json();

      if (resParams.resultCount > 0) {
        this.needUpdate = CheckUpdateStore.checkVersion(version, resParams.results[0].version);
        if (!this.needUpdate) {
          return Promise.resolve('当前是最新版本');
        }
        this.updateUrl = resParams.results[0].trackViewUrl;
        return Promise.resolve(false);
      } else {
        return Promise.resolve('断网了');
      }
    } else if (Platform.OS === 'android') {
      const updateRes = await Api.getInstance.get({ url: BaseUrl + '/public/app/query-update-android', withToken: false });

      if (updateRes.success) {
        const result: VersionType = updateRes.result;
        this.needUpdate = CheckUpdateStore.checkVersion(version, result.version);

        if (!this.needUpdate && fullyAutomatic) {
          return Promise.resolve('当前是最新版本');
        }
        this.updateUrl = result.download_url;
        return Promise.resolve(false);
      } else if (!updateRes.success && fullyAutomatic) {
        return Promise.resolve('网络连接失败');
      }
    }
  }
  @action
  async autoMaticDetection(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const result = await fetch(`https://itunes.apple.com/cn/lookup?id=${CheckUpdateStore.appId}&t=${Date.now()}`);
      const resParams = await result.json();

      if (resParams.resultCount > 0) {
        return CheckUpdateStore.checkVersion(version, resParams.results[0].version);
      }
      return false;
    } else {
      const updateRes = await Api.getInstance.get({ url: BaseUrl + '/public/app/query-update-android', withToken: false });
      if (updateRes.success) {
        const result: VersionType = updateRes.result;
        return CheckUpdateStore.checkVersion(version, result.version);
      } else {
        return false;
      }
    }
  }

  @action
  async startDownload() {
    if (Platform.OS === 'ios') {
      Linking.openURL(this.updateUrl).catch((err) => console.error('An error occurred', err));
      this.needUpdate = false;
    } else if (Platform.OS === 'android') {
      this.showProgress = true;
      await RNUpgrade.upgrade(this.updateUrl);
      let timer: any = null;
      addDownLoadListener((p) => {
        this.progress = p / 100;
        if (timer) {
          clearTimeout(timer);
        }
        if (p / 100 < 1) {
          timer = setTimeout(() => {
            this.resetProgress(false);
          }, 7000);
        } else {
          this.resetProgress(true);
        }
      });
    }
  }
  @action
  resetProgress(stopDownload) {
    this.progress = 0;
    this.showProgress = false;
    this.needUpdate = false;
    if (!stopDownload) {
      this.baseViewUseRef.current?.showMessage({ text: '网络中断', delay: 2, aboveTab: true });
    }
  }

  public static checkVersion(versionOfCurrent, versionOfServer): boolean {
    let arr1 = versionOfCurrent.slice(1, versionOfCurrent.length).split('.');
    let arr2 = versionOfServer.split('.');
    for (let i = 0; i < arr1.length; ) {
      if (arr1[i] === arr2[i]) {
        i++;
      } else {
        return arr1[i] < arr2[i];
      }
    }
    return false;
  }
}
