import { action, makeObservable, observable } from 'mobx';
import { CreateUploadFileType } from '../screen/ModalScreens/NetdiskResources/UploadFilesStore';
import { Api, ApiResult } from '../common/api';
import AsyncStorage from '@react-native-community/async-storage';
import { OSS_CONFIG } from '../common/constants';
import moment from 'moment';
import AliyunOSS from 'aliyun-oss-react-native';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { getLessonType } from '../common/tools';

export const UPLOAD_URL = '/homework';
export const BaseUrl = '/resource';

export class HomeworkCreateStore {
  @observable lectureData: any = undefined;
  @observable aliOssConfigSetting: any;
  @observable videoList: string[] = [];
  @observable fileList: string[] = [];
  @observable audioList: string[] = [];

  @observable allFileList: string[] = [];

  @observable uploadList: uploadListType[] = [];
  @observable uploadProgress: number[] = [];

  @observable homeworkFileIds: string[] = [];

  @observable homeworkDataFile?: uploadForAliOSSType;

  @observable isUploadCom: boolean = false;
  @observable uploadText: string | boolean = '';
  @observable isDoing: number = 1;

  @observable fileIds: string[] = [];
  @observable fileUploadFalse: boolean = false;

  constructor() {
    makeObservable(this);
  }

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

  /**
   * 创建资源文件
   * url: /oss-file
   */
  @action
  async createUploadFile(param: CreateUploadFileType, tempFile): Promise<string | boolean | void> {
    const params = {
      name: param.name,
      ossFileName: param.ossFileName
    };
    const res = await Api.getInstance.post({ url: BaseUrl + `/homework-file`, params, withToken: true });
    if (res.result.id) {
      this.homeworkFileIds.push(res.result.id);
    }
    if (!res.success) {
      this.fileUploadFalse = true;
    }
    console.log(this.homeworkFileIds, this.isUploadCom, this.currentUpload, tempFile.length, '文件上传后的ids');
    return Promise.resolve(res.success);
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
        console.log(data.securityToken, data.accessKeyId, data.accessKeySecret, data.endPoint, 'this is all data item');
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
  async doUploadJob(index, tempFile: TempFileType[], isFirst?: boolean): Promise<string | boolean | void> {
    if (!isFirst) {
      this.currentUpload = this.currentUpload + 1;
      console.log('创建作业文件', '当前文件序列号', this.currentUpload === tempFile.length);
      const uploadRes = await this.createUploadFile(
        {
          ossFileName: this.uploadList[this.currentUpload - 1].name.split('/')[this.uploadList[this.currentUpload - 1].name.split('/').length - 1],
          name: this.uploadList[this.currentUpload - 1].name.slice(-8, this.uploadList[this.currentUpload - 1].name.length)
        },
        tempFile
      );
      if (uploadRes && this.currentUpload === tempFile.length) {
        if (this.isDoing === 1) {
          this.createLiveHomework(this.homeworkDataFile).then((res) => {
            console.log(res, '1创建作业成功');
          });
        } else if (this.isDoing === 2) {
          this.submitHomework(this.homeworkDataFile).then();
        } else if (this.isDoing === 3) {
          this.editHomework(this.homeworkDataFile).then();
        } else if (this.isDoing === 4) {
          this.correctHomework(this.homeworkDataFile).then();
        } else {
          this.createLiveHomework(this.homeworkDataFile).then();
        }
        if (Platform.OS !== 'ios') {
          RNFS.readFileAssets('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file')
            .then((ress) => {
              console.log(ress);
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
        this.isUploadCom = true;
      }
    } else {
      this.currentUpload = 0;
    }
    try {
      if (this.currentUpload < tempFile.length && index < tempFile.length && index === this.currentUpload) {
        AliyunOSS.asyncUpload(this.aliOssConfigSetting?.bucket, tempFile[index].name, tempFile[index].path);
        const downloadProgress = async (p) => {
          if (p.currentSize / p.totalSize === 1) {
            console.log(index, tempFile.length, '是否是最后一个');
            if (index < tempFile.length) {
              console.log('卸载当前监听');
              await AliyunOSS.removeEventListener('uploadProgress');
              setTimeout(async () => {
                const res = await this.doUploadJob(index + 1, tempFile, false);
                console.log(res, 'uploadJob');
                if (res) {
                  this.uploadText = res;
                  this.isUploadCom = true;
                }
              }, 1000);
            } else {
              console.log('这是最后一次上传');
            }
          }
        };
        console.log('添加新的监听');
        await AliyunOSS.addEventListener('uploadProgress', downloadProgress);
      }
    } catch (e) {
      this.aliOssConfigSetting = undefined;
      return Promise.reject('上传失败');
    }
  }

  @action
  async uploadForAliOSS(params: uploadForAliOSSType) {
    console.log(this.allFileList, '这是待上传的文件夹');
    this.homeworkDataFile = {
      lessonType: params.lessonType,
      name: params.name,
      content: params.content,
      lectureId: params.lectureId,
      userId: params.userId,
      businessId: params.businessId
    };

    this.homeworkFileIds = [];
    this.allFileList.map((item) => {
      this.uploadList.push({
        name: params.businessId + UPLOAD_URL + '/' + params.userId + '/' + new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + item.split('.').pop(),
        path: item
      });
    });
    console.log(this.allFileList, '这是所有待上传的资源文件');
    await this.getAsyncOssConfig().then(async (res) => {
      if (res) {
        console.log(res, '[log]');
        console.log(this.aliOssConfigSetting, this.uploadProgress, this.uploadList, 'trues');
        const result = await this.doUploadJob(0, this.uploadList, true);
        console.log(result, '上传结果');
      }
    });
  }

  /**
   * 创建直播课作业
   * url: /homework-lesson/assignment
   */
  @action
  async createLiveHomework(param?: uploadForAliOSSType): Promise<boolean | string> {
    const params = {
      content: param?.content,
      homeworkFileIds: this.homeworkFileIds,
      lessonType: getLessonType(param?.lessonType),
      scheduleId: param?.lectureId,
      title: param?.name
    };
    const res = await Api.getInstance.post({ url: '/education' + '/homework-lesson/assignment', params, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 学生提交作业
   * url: /homework-lesson/submit
   */
  @action
  async submitHomework(param?: uploadForAliOSSType): Promise<boolean | string> {
    console.log(this.fileIds, this.homeworkFileIds, '当前的所有ids');
    const params = {
      content: param?.content,
      homeworkFileIds: this.fileIds.concat(this.homeworkFileIds),
      id: param?.lectureId
    };
    console.log(params, '这就是params');
    const res = await Api.getInstance.post({ url: '/education' + '/homework-lesson/submit', params, withToken: true });
    if (res.success) {
      this.homeworkFileIds = [];
      this.fileIds = [];
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 教师订正作业
   * url: /homework-lesson/submit
   */
  @action
  async editHomework(param?: uploadForAliOSSType): Promise<boolean | string> {
    console.log(this.fileIds, this.homeworkFileIds, '当前的所有ids');
    const params = {
      title: param?.name,
      content: param?.content,
      homeworkFileIds: this.fileIds.concat(this.homeworkFileIds)
    };
    const res = await Api.getInstance.patch({ url: '/education' + `/homework-lesson/teacher/${param?.lectureId}`, params, withToken: true });
    if (res.success) {
      this.fileIds = [];
      this.homeworkFileIds = [];
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 教师批改作业
   * url: /homework-lesson/submit
   */
  @action
  async correctHomework(param?: uploadForAliOSSType): Promise<boolean | string> {
    const params = {
      id: param?.lectureId,
      content: param?.content,
      homeworkFileIds: this.fileIds.concat(this.homeworkFileIds)
    };
    const res = await Api.getInstance.post({ url: '/education' + `/homework-lesson/review`, params, withToken: true });
    if (res.success) {
      this.fileIds = [];
      this.homeworkFileIds = [];
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }
}
export type uploadForAliOSSType = {
  lessonType?: number | string;
  name?: string;
  content?: string;
  lectureId?: string;
  userId?: string;
  businessId?: string;
};
export type uploadListType = {
  name: string;
  path: string;
  totalSize?: string;
  currentSize?: string | number;
  progress?: string;
  type?: number;
  timerOne?: boolean;
};
export type TempFileType = {
  name: string;
  path: string;
  totalSize?: string;
  currentSize?: string | number;
  progress?: string;
  type?: number;
  timerOne?: boolean;
};
