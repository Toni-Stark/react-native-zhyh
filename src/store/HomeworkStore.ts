import { action, computed, makeAutoObservable, observable } from 'mobx';
import { Api, ApiResult } from '../common/api';
import { getEnLen, t } from '../common/tools';
import { HOMEWORK_STATUS_CREATED, HOMEWORK_STATUS_REVIEW, HOMEWORK_STATUS_SUBMIT, USER_MODE_TEACHER } from '../common/status-module';
import { Image } from 'react-native-image-crop-picker';
import AliyunOSS from 'aliyun-oss-react-native';

export const MAX_UPLOAD_IMAGE = 60;

export const getStatusStr = (status: number | string): string => {
  if (status < HOMEWORK_STATUS_SUBMIT) {
    return `${HOMEWORK_STATUS_CREATED}`;
  } else if (status === HOMEWORK_STATUS_SUBMIT) {
    return `${HOMEWORK_STATUS_CREATED},${HOMEWORK_STATUS_SUBMIT}`;
  } else return `${HOMEWORK_STATUS_REVIEW}`;
};

export class HomeworkStore {
  @observable loading: boolean = true;
  @observable homeworkAllData: LessonHomeworkDetail | undefined;
  @observable unfinishedHomeworkStudent: Array<HomeworkListType> = [];
  @observable completedHomeworkStudent: Array<HomeworkListType> = [];

  @observable unfinishedHomeworkTeacher: Array<HomeworkListType> = [];
  @observable completedHomeworkTeacher: Array<HomeworkListType> = [];

  @observable homeworkDetail: LessonHomeworkDetail | undefined;
  @observable homeworkTeacher: LessonHomeworkDetail | undefined;
  @observable list: Array<Array<LessonHomeworkDetail>> = [[], []];

  @observable contentModify: string = '';
  @observable titleModify: string = '';
  @observable homeworkModify: HomeworkListType | undefined;

  @observable content: string | undefined;
  @observable homeworkStudentDetail: LessonHomeworkDetail | undefined;

  @observable selectedImages: Array<Image> = [];
  @observable selectedImagesRevision: Array<Image> = [];
  @observable originAttachmentImages: Array<AttachmentType> = [];
  @observable originAttachmentImagesRevision: Array<AttachmentType> = [];
  @observable uploadProgress = {};
  @observable attachments: Array<string | undefined> = [];
  @observable attachmentsRevision: Array<string | undefined> = [];
  @observable ossConfig: OssConfig | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get getSelectedImage(): Array<Image> {
    return this.selectedImages.slice();
  }

  @action
  newForm() {
    this.selectedImages = [];
    this.uploadProgress = {};
    this.attachments = [];
  }

  @computed get getImages() {
    const images: ImageType[] = [];
    this.originAttachmentImages.map((image) => {
      images.push({ uri: image.url });
    });
    this.selectedImages.map((image) => {
      images.push({ uri: `file://${image.path}` });
    });
    return images;
  }

  @computed get getImagesRevision() {
    console.log(this.originAttachmentImagesRevision, this.selectedImagesRevision);
    const images: ImageType[] = [];
    this.originAttachmentImagesRevision.map((image) => {
      images.push({ uri: image.url });
    });
    this.selectedImagesRevision.map((image) => {
      images.push({ uri: `file://${image.path}` });
    });
    return images;
  }

  @computed get getHomeworkListStatistics(): Array<number> {
    const statistics: Array<number> = [];
    if (this.homeworkTeacher) {
      statistics.push(this.homeworkTeacher.homeworkList.filter((h) => h.status === HOMEWORK_STATUS_SUBMIT).length);
      statistics.push(this.homeworkTeacher.homeworkList.filter((h) => h.status === HOMEWORK_STATUS_CREATED).length);
      statistics.push(this.homeworkTeacher.homeworkList.filter((h) => h.status === HOMEWORK_STATUS_REVIEW).length);
    }
    return statistics;
  }

  @computed get getImagesAsync() {
    const images: ImageType[] = [];
    this.homeworkDetail?.attachments.map((image) => {
      images.push({ uri: image.url });
    });
    return images;
  }

  @action
  getStatusStr(status: number | string): string {
    switch (status) {
      case HOMEWORK_STATUS_CREATED:
        return t('homework.notFinished');
      case HOMEWORK_STATUS_SUBMIT:
        return t('homework.beReviewed');
      case HOMEWORK_STATUS_REVIEW:
        return t('homework.completed');
      default:
        return t('homework.notFinished');
    }
  }

  @action
  getSelect(status: number, userType?: number): number {
    if (userType === USER_MODE_TEACHER) {
      switch (status) {
        case HOMEWORK_STATUS_CREATED:
        case HOMEWORK_STATUS_SUBMIT:
          return this.unfinishedHomeworkStudent.length;
        case HOMEWORK_STATUS_REVIEW:
          return this.completedHomeworkStudent.length;
        default:
          return this.unfinishedHomeworkStudent.length;
      }
    } else {
      switch (status) {
        case HOMEWORK_STATUS_CREATED:
        case HOMEWORK_STATUS_SUBMIT:
          return this.unfinishedHomeworkTeacher.length;
        case HOMEWORK_STATUS_REVIEW:
          return this.completedHomeworkTeacher.length;
        default:
          return this.unfinishedHomeworkTeacher.length;
      }
    }
  }

  /**
   *  getLessonHomework {homeworkAllData,unfinishedHomeworkStudent,completedHomework}
   */
  @action
  async getLessonHomework(status: number, actions: boolean, userType?: number): Promise<boolean> {
    if (actions) {
      console.log('[LOG-getStatusStr]', getStatusStr(status));
      const res: ApiResult = await Api.getInstance.get({
        url: `/xueyue/business/homework/my_list?status=${getStatusStr(status)}&pageSize=8&pageNo=1`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.homeworkAllData = res.result;
        if (status <= HOMEWORK_STATUS_SUBMIT) {
          if (userType === USER_MODE_TEACHER) {
            this.unfinishedHomeworkTeacher = res.result.records;
          } else {
            console.log(res.result.records);
            this.unfinishedHomeworkStudent = res.result.records;
          }
        } else if (status === HOMEWORK_STATUS_REVIEW) {
          if (userType === USER_MODE_TEACHER) {
            this.completedHomeworkTeacher = res.result.records;
          } else {
            this.completedHomeworkStudent = res.result.records;
          }
        }
        this.loading = false;

        return Promise.resolve(res.success);
      } else {
        return Promise.reject(res.message);
      }
    } else {
      const res: ApiResult = await Api.getInstance.get({
        url: `/xueyue/business/homework/my_list?status=${getStatusStr(status)}&pageSize=8&pageNo=${getEnLen(this.getSelect(status), 8)}`,
        params: {},
        withToken: true
      });
      console.log('[LOG-status]', this.getSelect(status));
      if (res.success) {
        if (status <= HOMEWORK_STATUS_SUBMIT) {
          if (userType === USER_MODE_TEACHER) {
            this.unfinishedHomeworkTeacher = this.unfinishedHomeworkTeacher.concat(res.result.records);
          } else {
            this.unfinishedHomeworkStudent = this.unfinishedHomeworkStudent.concat(res.result.records);
          }
        } else if (status === HOMEWORK_STATUS_REVIEW) {
          if (userType === USER_MODE_TEACHER) {
            this.unfinishedHomeworkTeacher = this.unfinishedHomeworkTeacher.concat(res.result.records);
          } else {
            this.completedHomeworkStudent = this.completedHomeworkStudent.concat(res.result.records);
          }
        }
        this.loading = false;
        return Promise.resolve(res.success);
      } else {
        return Promise.reject(res.message);
      }
    }
  }

  /**
   * name: getLessonHomeworkDetail {homeworkDetail}
   * url: /xueyue/business/lesson/categories/queryById
   */
  @action
  async getLessonHomeworkDetail(teacherDetail: boolean, id?: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({
      url: `/xueyue/business/homework/${id}`,
      params: {},
      withToken: true
    });
    if (res.success) {
      if (teacherDetail) {
        this.homeworkTeacher = res.result;
      } else {
        this.homeworkDetail = res.result;
      }
      this.loading = false;
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }

  //学生，家长订正作业
  @action
  async modifyHomework(teacherId: string): Promise<boolean> {
    const originAttachmentIds = this.originAttachmentImages.map((image) => image.fileId);
    console.log(teacherId, this.homeworkModify?.id, this.contentModify, this.attachments.concat(originAttachmentIds), this.titleModify);
    const res: ApiResult = await Api.getInstance.post({
      url: `/xueyue/business/homework/modify`,
      params: {
        teacherId,
        id: this.homeworkModify?.id,
        content: this.contentModify,
        attachments: this.attachments.concat(originAttachmentIds),
        title: this.titleModify
      }
    });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async getHomeworkForModify(id: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: `/xueyue/business/homework/${id}`, params: {}, withToken: true });
    if (res.success) {
      this.homeworkModify = res.result;
      this.titleModify = res.result.title;
      this.contentModify = res.result.content;
      this.originAttachmentImages = [...res.result.attachments];
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  //教师批改作业
  @action
  async review(teacherId: string, id: string): Promise<boolean> {
    if (this.content) {
      const res: ApiResult = await Api.getInstance.post({
        url: `/xueyue/business/homework/review`,
        params: {
          teacherId,
          id,
          content: this.content,
          attachments: this.attachments
        }
      });
      if (res.success) {
        return Promise.resolve(true);
      } else {
        return Promise.reject(res.message);
      }
    } else {
      return Promise.reject('内容不能为空');
    }
  }

  // http://xueyue-homework.oss-cn-chengdu.aliyuncs.com/1333229609524682754/1610607115816263.jpg

  //教师订正自己的作业
  @action
  async reviewTeacher(teacherId: string, id: string): Promise<boolean> {
    let oldImage: any[] = [];
    console.log(this.originAttachmentImages);
    for (let i = 0; i < this.originAttachmentImages.length; i++) {
      let strArr: string[] | undefined = this.originAttachmentImages[i].url?.split('/');
      if (strArr) {
        oldImage.push(strArr[strArr.length - 1]);
      }
    }
    oldImage = oldImage.concat(this.attachments);
    if (this.contentModify) {
      const res: ApiResult = await Api.getInstance.post({
        url: `/xueyue/business/homework/modify`,
        params: {
          teacherId,
          id,
          content: this.contentModify,
          attachments: oldImage
        }
      });
      if (res.success) {
        return Promise.resolve(true);
      } else {
        return Promise.reject(res.message);
      }
    } else {
      return Promise.reject('内容不能为空');
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
  addImage(images: Image[], isEdit: boolean) {
    const sizeLeft = MAX_UPLOAD_IMAGE - this.selectedImages.length - (isEdit ? this.originAttachmentImages.length : 0);
    if (images.length > sizeLeft) {
      images.splice(sizeLeft, images.length);
      console.log(`设定超过上传最大上限${MAX_UPLOAD_IMAGE}`);
    }
    console.log(123456, images.length, this.selectedImages);
    this.selectedImages = [...this.selectedImages.concat(images)];
    console.log(this.selectedImages);
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
  stuRemoveImage(index: number, isEdit: boolean) {
    if (isEdit && index < this.originAttachmentImages.length) {
      this.originAttachmentImages.splice(index, 1);
    } else {
      console.log(index, this.originAttachmentImages.length);
      this.selectedImages.splice(index - this.originAttachmentImages.length, 1);
    }
  }
  //学生提交作业
  @action
  async submit(id: string): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.post({
      url: `/xueyue/business/homework/submit`,
      params: {
        id,
        content: this.content,
        attachments: this.attachments
      },
      withToken: true
    });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  //教师批改作业
  @action
  async deleteHomeWork(id: string): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.delete({ url: `/xueyue/business/homework/${id}`, params: {}, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  //学生修改作业
  // @action
  // async modify(id: string, content: string): Promise<boolean | string> {
  //   const res: ApiResult = await Api.getInstance.post({
  //     url: `/xueyue/business/homework/modify`,
  //     params: {
  //       id,
  //       content: content,
  //       attachments: this.attachmentsRevision
  //     },
  //     withToken: true
  //   });
  //   if (res.success) {
  //     return Promise.resolve(true);
  //   } else {
  //     return Promise.resolve(res.message);
  //   }
  // }

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

export interface AttachmentType {
  fileSize?: string; // 1671499,
  id?: string; // "1302925996039839746",
  type?: number; // 1,
  fileId?: string;
  url?: string; // "http://xueyue-homework.oss-cn-chengdu.aliyuncs.com/1265911558981931009/1599476736109214.jpg"
}

export type HomeworkListType = {
  attachments: [any];
  content: string;
  createTime: Date;
  creator: string;
  homeworkList: [any];
  group: any;
  id: string;
  orgCode: string;
  rate: number;
  rateTime: Date;
  rootId: string;
  status: number;
  student: StudentType[];
  tags: string;
  teacher: string;
  title: string;
  type: number;
  updateTime: Date;
  updater: string;
};

export interface OssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

export type LessonHomeworkDetail = {
  attachments: any[];
  content: string;
  createTime: Date;
  creator: string;
  group: GroupType;
  homeworkList: HomeworkListType[];
  id: string;
  orgCode: string;
  rate: number;
  rateTime: Date;
  rootId: string;
  status: number;
  student: StudentType[];
  tags: string;
  teacher: TeacherDetailType;
  title: string;
  type: number;
  updateTime: Date;
  updater: string;
};

export type TeacherDetailType = {
  avatar?: string;
  birthday?: Date;
  createTime?: Date;
  email?: string;
  id?: string;
  orgCode?: string;
  phone?: string;
  post?: string;
  realname?: string;
  sex?: number;
  status?: number;
  telephone?: string;
  userType?: number;
  username?: string;
  workNo?: string;
};

export type GroupType = {
  createBy: string;
  createTime: Date;
  description: string;
  id: string;
  lessonId: string;
  name: string;
  orgCode: string;
  status: number;
  studentCount: number;
  teacherCount: number;
};

export type StudentType = {
  avatar: string;
  birthday: Date;
  createTime: Date;
  email: string;
  id: string;
  orgCode: string;
  phone: string;
  post: string;
  realname: string;
  sex: number;
  status: number;
  telephone: string;
  userType: number;
  username: string;
  workNo: string;
};

export type ImageType = {
  uri: string | undefined;
};
