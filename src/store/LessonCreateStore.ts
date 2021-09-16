import { action, computed, makeObservable, observable } from 'mobx';
import { Api, ApiResult } from '../common/api';
import { AttachmentType, ImageType, LessonHomeworkDetail, MAX_UPLOAD_IMAGE } from './HomeworkStore';
import { Image } from 'react-native-image-crop-picker';
import { homeworkGroupType } from './HomeworkFormStore';
import { CoursesDetail } from './LessonDetailStore';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE } from '../common/status-module';

const BaseUrl = '/education';

export class LessonCreateStore {
  @observable loading: boolean = true;
  @observable className: string | undefined;
  @observable classFee: string | undefined;
  @observable classSize: string | undefined;
  @observable subject?: subjectType[];
  @observable grade?: gradeType[];
  @observable backgroundImage?: ImageList;
  @observable attachments: Array<ImageList> = [];
  @observable imageUrl: string = '';
  @observable selectedImages: Array<Image> = [];
  @observable homeworkGroup: homeworkGroupType[] = [];
  @observable originAttachmentImages: Array<AttachmentType> = [];
  @observable uploadProgress = {};
  @observable homeworkDetail: LessonHomeworkDetail | undefined;
  @observable uploadAttachments: Array<string | undefined> = [];

  @observable lessonDetail: CoursesDetail | undefined;

  @observable addClassVisible: boolean = false;
  @observable sectionName: string = '';
  @observable createLessonType: number = LESSON_TYPE_LIVE;

  @observable visible: boolean = false;
  @observable selectArray: number[] = [0, 0, 0];
  @observable classNames: string = '';
  @observable classPrice: string = '0';
  @observable previousPrice: string = '';
  @observable classSizes: number = 0;
  @observable scheduleList: Array<ScheduleType> = [];
  @observable description?: string = '';
  @observable categories?: CategoriesType[];
  @observable password: string = '';
  @observable isAutoRecord: boolean = false;

  constructor() {
    makeObservable(this);
  }

  /**
   * name: getLessonDetail
   */
  @action
  async getLessonDetail(lessonId: string, typeNum: number | null): Promise<boolean> {
    console.log(lessonId);
    const path =
      typeNum === LESSON_TYPE_LIVE - 1
        ? `${BaseUrl}/lessons-live/${lessonId}`
        : typeNum === LESSON_TYPE_DEMAND - 1
        ? `${BaseUrl}/lessons-vod/${lessonId}`
        : `${BaseUrl}/lessons-live/${lessonId}`;
    console.log(typeNum, path, '当前访问地址');
    const res: ApiResult = await Api.getInstance.get({ url: path, params: {}, withToken: true });
    console.log(res.result, '342342342342');
    if (res.success) {
      this.loading = false;
      this.lessonDetail = res.result;
      this.description = res.result.description;
      console.log(this.lessonDetail, '这是第一次给lessonetail赋值');
      for (let i = 0; i < res.result.imageDetailList.length; i++) {
        this.originAttachmentImages.push({ url: res.result.imageDetailList[i].url });
      }
      return Promise.resolve(res.success);
    } else {
      if (res.code === 500) {
        console.log('[LOG]  服务器地址错误');
      }
      return Promise.reject(res.message);
    }
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

  @action
  async getCategories(businessId: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/categories/all' + '?businessId=' + businessId, withToken: true });
    if (res.success) {
      this.categories = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  isLiveOrVod(type: number | null) {
    switch (type) {
      case 0:
        return '/lessons-live';
      case 1:
        return '/lessons-vod';
      default:
        return '/lessons-live';
    }
  }

  @action
  async delLesson(type: number | null, id?: string): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.delete({ url: `/education${this.isLiveOrVod(type)}/${id}`, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
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
  async doUploadImage(index: number, fileName: string, filePath: string): Promise<ImageList> {
    const res = await Api.getInstance.uploadEducationImage(filePath);
    console.log('5555', res);
    return res.result;
  }

  @action
  async startUploadAllImages(): Promise<boolean> {
    for (let i = 0; i < this.selectedImages.length; i++) {
      const indexOfDot = this.selectedImages[i].path.lastIndexOf('.');
      const extName = this.selectedImages[i].path.slice(indexOfDot);
      const fileName = `${Date.now()}${Math.round(Math.random() * 1000)}${extName}`;
      const res = await this.doUploadImage(i, fileName, this.selectedImages[i].path);
      this.attachments.push(res);
      if (!res) {
        this.attachments = [];
        return Promise.reject('上传失败');
      }
    }
    return Promise.resolve(true);
  }

  @action
  async createLesson(businessId, showModal, data, scheduleList, classType, userId): Promise<boolean | string> {
    if (
      this.subject &&
      this.grade &&
      scheduleList.length > 0 &&
      data.titleText.length > 0 &&
      data.priceInput.length > 0 &&
      this.attachments &&
      data.classSize > 0
    ) {
      const params = {
        courseName: data.titleText,
        courseFees: data.priceInput,
        scheduleList: scheduleList,
        businessId: businessId,
        categoryId: this.grade[showModal[2]].id,
        detailPicturesList: this.attachments,
        gradeId: this.subject[showModal[1]].id,
        courseCover: this.backgroundImage,
        presetStudentCount: data.classSize,
        type: classType[showModal[0]].type,
        teachers: [
          {
            isMajor: true,
            teacherId: userId,
            teacherTitle: '主课老师'
          }
        ]
      };
      const res: ApiResult = await Api.getInstance.post({ url: '/xueyue/business/lesson/create', params: params, withToken: true });
      if (res.success) {
        this.backgroundImage = undefined;
        return Promise.resolve(true);
      } else {
        return Promise.resolve(res.message);
      }
    } else {
      return Promise.resolve(false);
    }
  }

  @action
  async createLessons(imageList, resPass, classType, userId, select): Promise<boolean | string> {
    const params = {
      authPassword: resPass,
      authType: classType[this.selectArray[0]].type,
      categoryId: this.categories?.slice()[this.selectArray[2]].id,
      coverImageId: this.backgroundImage?.id,
      description: this.description,
      detailImageIds: imageList,
      name: this.classNames,
      presetStudentCount: this.classSizes,
      price: this.classPrice,
      pricePrevious: this.previousPrice,
      primaryTeacherId: userId,
      schedules: this.scheduleList,
      secondaryTeacherIds: select,
      autoRecord: this.isAutoRecord
    };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/lessons-live', params: params, withToken: true });
    if (res.success) {
      this.backgroundImage = undefined;
      this.attachments = [];
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.result);
    }
  }

  @action
  async updateLesson({
    id,
    lessonId,
    imageList,
    teacherIds,
    editPass
  }: {
    id?: string;
    lessonId?: string;
    imageList?: string[];
    teacherIds?: string[];
    editPass?: string;
  }): Promise<boolean | string> {
    const param = {
      authPassword: editPass,
      authType: this.lessonDetail?.authType,
      categoryId: this.lessonDetail?.category?.id,
      coverImageId: this.lessonDetail?.imageCover?.id,
      description: this.description,
      detailImageIds: imageList,
      name: this.lessonDetail?.name,
      presetStudentCount: this.lessonDetail?.presetStudentCount,
      price: this.lessonDetail?.price,
      pricePrevious: this.lessonDetail?.pricePrevious,
      primaryTeacherId: id,
      schedules: this.lessonDetail?.schedules,
      secondaryTeacherIds: teacherIds,
      autoRecord: this.lessonDetail?.autoRecord
    };
    const res: ApiResult = await Api.getInstance.patch({ url: `${BaseUrl}/lessons-live/${lessonId}`, params: param, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.result);
    }
  }

  @action
  async updateVodLesson(params: any): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + '/lessons-vod/' + params.lessonId, params: params, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  @action
  async releaseAudit(id: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.patch({ url: `${BaseUrl}/lessons-vod/${id}/submit`, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async releaseLive(type: number | null, id?: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.patch({ url: `${BaseUrl}${this.isLiveOrVod(type)}/${id}/submit`, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async uploadBackgroundImage(image) {
    console.log(image, '封面图片');
    const res = await Api.getInstance.uploadEducationImage(image.path);
    console.log(res.result, '封面图片1');
    return res.result;
  }

  @action
  async getGradeList(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/business/lesson/categories/listAll', params: {}, withToken: true });
    if (res.success) {
      this.grade = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }
  @action
  removeImage(index: number, isEdit: boolean) {
    if (isEdit && index < this.originAttachmentImages.length) {
      this.originAttachmentImages.splice(index, 1);
      if (this.lessonDetail) {
        this.lessonDetail.imageDetailList?.splice(index, 1);
      }
    } else {
      this.selectedImages.splice(index - this.originAttachmentImages.length, 1);
    }
  }
}

export type subjectType = {
  createTime: Date;
  weight?: number;
  description: string;
  id: string;
  name: string;
  sort: number;
};

export type gradeType = {
  createTime: Date;
  description: string;
  id: string;
  name: string;
  sort: number;
};
export type CategoriesType = {
  id: string;
  name: string;
  weight?: number;
  description?: string;
};

export type ImageList = {
  url: string;
  id: string;
};

export type ScheduleType = {
  id?: string;
  name?: string;
  planningStartTime?: string;
  planningEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  weight?: 1;
};
export type ClassTypes = {
  type: number;
  name: string;
};
