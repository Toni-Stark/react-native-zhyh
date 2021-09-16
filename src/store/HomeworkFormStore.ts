import { action, computed, makeObservable, observable } from 'mobx';
import { Api, ApiResult } from '../common/api';
import { Image } from 'react-native-image-crop-picker';
import { AttachmentType, ImageType, LessonHomeworkDetail, MAX_UPLOAD_IMAGE, OssConfig } from './HomeworkStore';
import AliyunOSS from 'aliyun-oss-react-native';
import { getEnLen, getLessonType } from '../common/tools';

export const BaseUrl = '/education';
export class HomeworkFormStore {
  @observable selectedImages: Array<Image> = [];
  @observable homeworkGroup: homeworkGroupType[] = [];
  @observable originAttachmentImages: Array<AttachmentType> = [];
  @observable uploadProgress = {};
  @observable homeworkDetail: LessonHomeworkDetail | undefined;
  @observable attachments: Array<string | undefined> = [];
  @observable ossConfig: OssConfig | undefined;
  @observable homeworkList: homeworkListType[] = [];

  // 创建作业name
  @observable homeworkName: string = '';
  @observable context: string = '';

  constructor() {
    makeObservable(this);
  }

  /**
   * name: getLectureList
   * url: /homework-lesson/list-by-schedule
   */
  @action
  async getLectureList(lectureId: string, lessonType: string, isAdd: boolean): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({
      url: `${BaseUrl}/homework-lesson/list-by-schedule?lessonType=${getLessonType(lessonType)}&scheduleId=${lectureId}&pageSize=10&current=${
        isAdd ? getEnLen(this.homeworkList.length, 10) : 1
      }`,
      withToken: true
    });
    console.log(res.result, '这是此时作业列表');
    if (res.success) {
      console.log(res.result.content, '作业列表');
      if (!isAdd) {
        this.homeworkList = res.result.content;
        console.log('覆盖', this.homeworkList.length);
      } else {
        if (this.homeworkList.length % 10 === 0) {
          this.homeworkList = this.homeworkList.concat(res.result.content);
          console.log('添加', this.homeworkList.length);
        }
      }
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @computed get getImages() {
    const images: ImageType[] = [];
    if (this.originAttachmentImages.length < 1) {
      this.homeworkDetail?.attachments.map((image) => {
        images.push({ uri: image.url });
      });
    } else {
      this.originAttachmentImages.map((image) => {
        images.push({ uri: image.url });
      });
    }

    this.selectedImages.map((image) => {
      images.push({ uri: `file://${image.path}` });
    });
    return images;
  }

  @computed get getImagesAsync() {
    const images: ImageType[] = [];
    this.homeworkDetail?.attachments.map((image) => {
      images.push({ uri: image.url });
    });
    return images;
  }

  @action
  async createHomework(param: paramsType) {
    const params: paramsType = {
      attachments: this.attachments,
      content: param.content,
      groupId: param.groupId,
      teacherId: param.teacherId,
      title: param.title
    };
    const res: ApiResult = await Api.getInstance.post({ url: '/xueyue/business/homework/create', params: params, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.result);
    }
  }

  @action
  createImage(images: Image[], isEdit: boolean) {
    const sizeLeft = MAX_UPLOAD_IMAGE - this.selectedImages.length - (isEdit ? this.originAttachmentImages.length : 0);
    if (images.length > sizeLeft) {
      images.splice(sizeLeft, images.length);
      console.log(`设定超过上传最大上限${MAX_UPLOAD_IMAGE}`);
    }
    images.forEach((image) => this.selectedImages.push(image));
  }

  @action
  async getHomeworkGroup(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/business/group/list' });
    if (res.success) {
      this.homeworkGroup = res.result.records;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.result);
    }
  }

  @action
  addImage(images: Image[], isEdit: boolean) {
    const sizeLeft = MAX_UPLOAD_IMAGE - this.selectedImages.length - (isEdit ? this.originAttachmentImages.length : 0);
    if (images.length > sizeLeft) {
      images.splice(sizeLeft, images.length);
      console.log(`设定超过上传最大上限${MAX_UPLOAD_IMAGE}`);
    }
    images.forEach((image) => this.selectedImages.push(image));
  }

  @action
  removeImage(index: number, isEdit: boolean) {
    if (isEdit && index < this.originAttachmentImages.length) {
      this.originAttachmentImages.splice(index, 1);
    } else {
      this.selectedImages.splice(index - this.originAttachmentImages.length, 1);
    }
  }

  @action
  async startUploadAllImages(): Promise<boolean> {
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.uploadProgress[i + this.originAttachmentImages.length] = 0;
    }
    for (let i = 0; i < this.selectedImages.length; i++) {
      const indexOfDot = this.selectedImages[i].path.lastIndexOf('.');
      const extName = this.selectedImages[i].path.slice(indexOfDot);
      const fileName = `${Date.now()}${Math.round(Math.random() * 1000)}${extName}`;
      this.attachments.push(fileName);
      const res = await this.doUploadJob(i, fileName, this.selectedImages[i].path);
      if (!res) {
        this.attachments = [];
        return Promise.reject('上传失败');
      }
    }
    return Promise.resolve(true);
  }

  @action
  async getUploadConfig(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/business/file/get_oss_auth_config_for_homework', params: {}, withToken: true });
    if (res.success) {
      this.ossConfig = res.result;
      if (__DEV__) {
        // AliyunOSS.enableDevMode();
      }
      AliyunOSS.initWithPlainTextAccessKey(this.ossConfig?.accessKeyId, this.ossConfig?.accessKeySecret, `http://${this.ossConfig?.region}.aliyuncs.com`);
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async doUploadJob(index: number, fileName: string, filePath: string): Promise<boolean> {
    // 此处阿里云组件有bug，添加更新上传进度的事件后，会变得很慢，暂时取消监听上传进度
    // const downloadProgress = (p) => {
    //   this.uploadProgress[index + this.originAttachmentImages.length] = p.currentSize / p.totalSize;
    // };
    try {
      if (this.ossConfig === undefined) {
        const resGetConfig = await this.getUploadConfig();
        if (!resGetConfig) {
          return Promise.reject(resGetConfig);
        }
      }

      // AliyunOSS.addEventListener('uploadProgress', downloadProgress);
      await AliyunOSS.asyncUpload(this.ossConfig?.bucket, 'temp/' + fileName, 'file://' + filePath);
      // AliyunOSS.removeEventListener('uploadProgress', downloadProgress);
      this.uploadProgress[index + this.originAttachmentImages.length] = 100;
      setTimeout(() => delete this.uploadProgress[index + this.originAttachmentImages.length], 200);
      return Promise.resolve(true);
    } catch (e) {
      this.ossConfig = undefined;
      return Promise.reject('更新失败');
    }
  }
}

export type homeworkGroupType = {
  studentCount: number;
  createTime: Date;
  teachers: any;
  name: string;
  description: string;
  students: any;
  id: string;
  teacherCount: number;
  status: number;
};

export type paramsType = { attachments?: any[]; teacherId: string; title: string; content: string; groupId: string };
export type homeworkListType = {
  content?: string;
  createdBy?: string;
  createdTime?: Date;
  id?: string;
  lessonType?: number;
  notSubmitCount?: number;
  retreatCount?: number;
  reviewCount?: number;
  scheduleId?: string;
  status?: number;
  submitCount?: number;
  title?: string;
  updatedBy?: string;
  updatedTime?: Date;
};
