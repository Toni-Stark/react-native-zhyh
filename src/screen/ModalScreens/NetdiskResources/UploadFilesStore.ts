import { action, makeAutoObservable, observable } from 'mobx';
import { Api, ApiResult } from '../../../common/api';
import AsyncStorage from '@react-native-community/async-storage';
import { OSS_CONFIG } from '../../../common/constants';
import moment from 'moment';
import AliyunOSS from 'aliyun-oss-react-native';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export type TempFileType = {
  name: string;
  path: string;
  fileName?: string;
  totalSize?: string;
  currentSize?: string | number;
  progress?: string;
  type?: number;
  timerOne?: boolean;
};
export type DocumentFileType = {
  id: string;
  type: number;
  name: string;
  path: string;
  size: string;
};

export type CreateUploadFileType = {
  isFolder?: boolean;
  name?: string;
  ossFileName: string;
  parentId?: string;
};

export type GetOssConfigType = {
  businessId: string;
};

export const BaseUrl = '/resource';

export class UploadFilesStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable aliOssConfigSetting: any;
  @observable uploadProgress: number[] = [];

  @action
  async getOssConfig(): Promise<any | null> {
    const config = await AsyncStorage.getItem(OSS_CONFIG);
    if (config) {
      return Promise.resolve(JSON.parse(config));
    } else {
      return null;
    }
  }

  @action
  async hasOssConfig(): Promise<boolean> {
    const config: string | any = await AsyncStorage.getItem(OSS_CONFIG);
    if (config === 'null') {
      return Promise.resolve(false);
    } else {
      if (
        config &&
        moment(JSON.parse(config)).format('HH:mm') !== 'Invalid date' &&
        moment(JSON.parse(config)).format('HH:mm') > moment(new Date().getTime()).format('HH:mm')
      ) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }
  }

  @action
  async setOssConfig(data): Promise<void> {
    return AsyncStorage.setItem(OSS_CONFIG, data);
  }

  @action
  async removeOssConfig(): Promise<void> {
    return AsyncStorage.removeItem(OSS_CONFIG);
  }

  @observable uploadError: string | null = null;

  @observable pickerImages: TempFileType[] = [];
  @observable temDocuments: TempFileType[] = [];
  @observable parentId?: string = '0';
  // 0:文件夹,1:图片,2:音频,3:视频,4:pdf文档,5:word文档,6:excel文档,7:ppt文档,99:其他
  @action
  addPublicFile(files: any, businessId: string, id: string, name?: string) {
    // "businessId" + "/resource/" + "userId" + "/" + new Date().getTime() + ".mp3"
    this.temDocuments = [];
    console.log(files, businessId, id, name, Array.isArray(files), files.path, '------');
    if (Array.isArray(files)) {
      files.forEach((item) => {
        this.temDocuments.push({
          name:
            businessId +
            BaseUrl +
            '/' +
            id +
            '/' +
            new Date().getTime() +
            Math.ceil(Math.random() * 100) +
            '.' +
            (item.path?.split('.').length > 1 ? item.path.split('.').pop() : 'mp3'),
          path: item.path,
          fileName:
            item.path.split('/').pop().length > 30
              ? '图片' + new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + item.path.split('.').pop()
              : item.path.split('/').pop(),
          type: 99
        });
      });
    } else if (files.path) {
      this.temDocuments.push({
        name:
          businessId +
          BaseUrl +
          '/' +
          id +
          '/' +
          new Date().getTime() +
          Math.ceil(Math.random() * 100) +
          '.' +
          (files.path?.split('.').length > 1 ? files.path.split('.').pop() : 'mp3'),
        path: files.path,
        fileName:
          files.path.split('/').pop().length > 30
            ? new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + files.path.split('.').pop()
            : files.path.split('/').pop(),
        type: 3
      });
    } else {
      this.temDocuments.push({
        name:
          businessId +
          BaseUrl +
          '/' +
          id +
          '/' +
          new Date().getTime() +
          Math.ceil(Math.random() * 100) +
          '.' +
          (name && name?.split('.').length > 1 ? name?.split('.').pop() : 'mp3'),
        path: files,
        fileName: name && name?.length > 30 ? new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + name.split('.').pop() : name,
        type: 99
      });
    }
  }

  /**
   * 获取资源地址
   * url: /oss-file/${id}/url
   */
  @action
  async getPublicFilePath(id: string): Promise<string> {
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + `/oss-file/${id}/url`, withToken: true });
    if (res.success) {
      return Promise.resolve(res.result);
    } else {
      return Promise.reject(false);
    }
  }

  /**
   * 创建资源文件
   * url: /oss-file
   */
  @action
  async createUploadFile(param: CreateUploadFileType): Promise<boolean | string> {
    const params = {
      isFolder: param.isFolder,
      name: param.name,
      ossFileName: param.ossFileName,
      parentId: param.parentId ? param.parentId : '0'
    };
    const res = await Api.getInstance.post({ url: BaseUrl + `/oss-file`, params, withToken: true });
    if (res.success) {
      this.uploadError = '2';
      return Promise.resolve(true);
    } else {
      this.uploadError = '1';
      return Promise.resolve(res.message);
    }
  }

  /**
   * 获取oss配置
   * url: /oss-config
   */
  @action
  async getAsyncOssConfig(): Promise<boolean> {
    if (await this.hasOssConfig()) {
      this.aliOssConfigSetting = await this.getOssConfig();
    } else {
      const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + `/oss-config/get-upload-sts`, withToken: true });
      console.log(res, 'sure');
      await this.setOssConfig(JSON.stringify(res.result));
      let data = await this.getOssConfig();
      await AliyunOSS.enableDevMode();
      try {
        console.log(data.securityToken, data.accessKeyId, data.accessKeySecret, data.endPoint, 'get data');
        AliyunOSS.initWithSecurityToken(data.securityToken, data.accessKeyId, data.accessKeySecret, data.endPoint);
      } catch (error) {
        console.log(error);
      }
      this.aliOssConfigSetting = await this.getOssConfig();
    }

    if (this.aliOssConfigSetting) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }

  public currentUpload: number = 0;
  @action
  async doUploadJob(index, tempFile: TempFileType[], isSure, isFirst?: boolean): Promise<boolean | { isOver: boolean; message: string }> {
    console.log(index, tempFile, isSure, isFirst, '-----');
    console.log(this.parentId, '这是当前的parentId');
    if (isSure && !isFirst) {
      this.currentUpload = this.currentUpload + 1;
      console.log('上传完成一次');
      if (Platform.OS === 'ios') {
        console.log(tempFile, '这是文件内容', this.temDocuments, '这是文件详情');
        console.log(this.temDocuments, '出错的地方');
        this.createUploadFile({
          parentId: this.parentId,
          ossFileName: this.temDocuments[this.currentUpload - 1].name.split('/')[this.temDocuments[this.currentUpload - 1].name.split('/').length - 1],
          name: this.temDocuments[this.currentUpload - 1].fileName,
          isFolder: false
        }).then((res) => {
          if (typeof res === 'boolean') {
            console.log('上传结束');
          }
        });
      } else {
        console.log(tempFile, this.temDocuments[this.currentUpload - 1].fileName, '查看名字');
        this.createUploadFile({
          parentId: this.parentId,
          ossFileName: this.temDocuments[this.currentUpload - 1].name.split('/')[this.temDocuments[this.currentUpload - 1].name.split('/').length - 1],
          name: this.temDocuments[this.currentUpload - 1].fileName,
          isFolder: false
        }).then((res) => {
          if (typeof res === 'boolean') {
            // RNFS.readFileAssets('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file')
            //   .then((e) => {
            //     console.log(e);
            //   })
            //   .catch(() => {
            //     let delPath = 'file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file';
            //     //执行删除
            //     RNFS.unlink(delPath)
            //       .then(() => {
            //         console.log('FILE DELETED');
            //         //如果文件不存在，会抛出异常
            //       })
            //       .catch((err) => {
            //         console.log(err.message);
            //       });
            //   });
            if (this.currentUpload === tempFile.length) {
              console.log('上传完毕');
              if (Platform.OS !== 'ios') {
                RNFS.readFileAssets('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file')
                  .then((e) => {
                    console.log(e);
                  })
                  .catch(() => {
                    let delPath = 'file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file';
                    //执行删除
                    RNFS.unlink(delPath)
                      .then(() => {
                        console.log('FILE DELETED');
                        //如果文件不存在，会抛出异常
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  });
              }
              return Promise.resolve({ isOver: true, message: '上传完成' });
            }
          }
        });
      }
    } else {
      this.currentUpload = 0;
    }
    try {
      if (this.currentUpload < tempFile.length && index < tempFile.length && index === this.currentUpload) {
        AliyunOSS.asyncUpload(this.aliOssConfigSetting?.bucket, tempFile[index].name, tempFile[index].path);
        const downloadProgress = async (p) => {
          console.log(p.currentSize);
          if (this.currentUpload < tempFile.length && p.totalSize !== this.temDocuments[this.currentUpload]?.totalSize) {
            this.temDocuments[this.currentUpload].totalSize = p.totalSize;
          }
          if (p.currentSize / p.totalSize !== 1) {
            tempFile[this.currentUpload].timerOne = true;
            tempFile[this.currentUpload].timerOne = true;
          } else {
            tempFile[this.currentUpload].timerOne = false;
          }

          if (tempFile[this.currentUpload]?.progress !== p.currentSize) {
            tempFile[this.currentUpload].progress = p.currentSize;
          }
          if (this.uploadProgress.length - 1 >= index) {
            this.uploadProgress[this.currentUpload] = Number(
              parseFloat(String(p.currentSize / p.totalSize))
                .toFixed(3)
                .slice(0, -1)
            );
          }
          // if (Platform.OS !== 'ios') {
          if (p.currentSize / p.totalSize === 1) {
            if (index < tempFile.length) {
              await AliyunOSS.removeEventListener('uploadProgress');
              setTimeout(async () => {
                await this.doUploadJob(index + 1, tempFile, true, false);
              }, 1000);
            }
          }
          // }
        };
        // if (Platform.OS !== 'ios') {
        await AliyunOSS.addEventListener('uploadProgress', downloadProgress);
        // }
      }
      return Promise.resolve(true);
    } catch (e) {
      this.aliOssConfigSetting = undefined;
      return Promise.reject('上传失败');
    }
  }
}
