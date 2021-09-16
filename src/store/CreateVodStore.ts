import { action, computed, makeObservable, observable } from 'mobx';
import { CoursesDetail } from './LessonDetailStore';
import { Api, ApiResult } from '../common/api';
import { gradeType, ImageList, subjectType } from './LessonCreateStore';
import { AttachmentType, ImageType, MAX_UPLOAD_IMAGE } from './HomeworkStore';
import { Image } from 'react-native-image-crop-picker';

export const BaseUrl = '/education';

export class CreateVodStore {
  @observable lessonDetail: CoursesDetail | undefined;
  @observable subject?: subjectType[];
  @observable grade?: gradeType[];

  @observable courseName: string = '';
  @observable classFee: string = '0';
  @observable classSize?: string;
  @observable vodList?: any[] = [];
  @observable vodListIndex: string[] = [];
  @observable vodListName: string[] = [];
  @observable sectionName: string = '';
  @observable selectedImages: Array<Image> = [];
  @observable selectedSeasions: Array<Image> = [];
  @observable sectionVodInfo: VodClassType[] = [];
  @observable originAttachmentImages: Array<AttachmentType> = [];

  @observable backgroundImage: string = '';

  @observable addClassVisible: boolean = false;
  @observable attachments: string[] = [];
  @observable jumpFromDraft: boolean = false;
  @observable lessonDetails: CoursesDetail | undefined;
  @observable draftVodInfo: ResourceFilesType[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  async uploadBackgroundImage(image) {
    const res = await Api.getInstance.uploadAsyncImage(image.path);
    return res.result;
  }

  @action
  async getSubjectList(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/business/lesson/grades/listAll', params: {}, withToken: true });
    if (res.success) {
      this.subject = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
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
  async getVodList(id?: string): Promise<any> {
    const res: ApiResult = await Api.getInstance.get({
      url: `/xueyue/business/file/list_folder_and_media${id ? '?folder=' + id : ''}`,
      params: {},
      withToken: true
    });
    if (res.success) {
      this.vodList = res.result.records;
    } else {
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
      if (this.lessonDetail) {
        this.lessonDetail.imageDetailList?.splice(index, 1);
      }
    } else {
      this.selectedImages.splice(index - this.originAttachmentImages.length, 1);
    }
  }

  @action
  async doUploadImage(index: number, fileName: string, filePath: string): Promise<string> {
    const res = await Api.getInstance.uploadAsyncImage(filePath, fileName);
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
  async updateVodLesson(data: any, type: number, modal: number[], id?: string): Promise<string | boolean> {
    if (
      this.courseName &&
      this.classSize &&
      this.classFee &&
      this.subject &&
      this.grade &&
      type &&
      this.backgroundImage &&
      this.attachments &&
      this.sectionVodInfo &&
      id
    ) {
      const params = {
        courseFees: this.classFee,
        courseName: this.courseName,
        presetStudentCount: this.classSize,
        vodScheduleList: this.sectionVodInfo,
        categoryId: this.grade[modal[2]].id,
        gradeId: this.subject[modal[1]].id,
        courseCover: this.backgroundImage,
        detailPicturesList: this.attachments,
        teachers: [{ isMajor: true, teacherId: id, teacherTitle: '主课老师' }],
        type: type
      };
      const res: ApiResult = await Api.getInstance.post({ url: '/xueyue/business/lesson/create_vod', params: params, withToken: true });
      if (res.success) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(res.message);
      }
    } else {
      return Promise.resolve('完善课程信息');
    }
  }

  @action
  async updateVodLessons(params: UpdateVodType): Promise<string | boolean> {
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/lessons-vod', params: params, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  // @action
  // async getVodList(id?: string): Promise<any> {
  //   const res: ApiResult = await Api.getInstance.get({
  //     url: `/xueyue/business/file/list_folder_and_media${id ? '?folder=' + id : ''}`,
  //     params: {},
  //     withToken: true
  //   });
  //   if (res.success) {
  //     if (!id) {
  //       this.vodList = [];
  //       for (let i = 0; i < res.result.records.length; i++) {
  //         if (res.result.records[i].isVideo) {
  //           this.vodList?.push(res.result.records[i]);
  //         } else if (res.result.records[i].isFolder) {
  //           res.result.records[i].folder = [];
  //           this.vodList?.push(res.result.records[i]);
  //         }
  //       }
  //     } else {
  //       return res.result.records;
  //     }
  //   } else {
  //     return Promise.reject(res.message);
  //   }
  // }
}

export type VodClassType = {
  name?: string;
  resourceFiles?: ResourceFilesType[];
  weight?: number;
};
export type ResourceFilesType = {
  name?: string;
  resourceId?: string | number;
  weight?: number;
  fileSize?: string;
  type?: number;
  resourceType?: number;
};
export type VodList = {
  fileName?: string;
  isVideo?: boolean;
  videoId?: string;
  userId?: string;
  parentId?: string;
  duration?: number;
  playCount?: number;
  isFolder?: boolean;
  createBy?: string;
  fileSize?: Date;
  createTime?: Date;
  sysOrgCode?: string;
  isAudio?: boolean;
  id?: string;
  convertTaskUuid?: string;
  status?: number;
  fileId?: string;
};

export type UpdateVodType = {
  authPassword?: string;
  authType?: number;
  businessId?: string;
  categoryId?: string;
  coverImageId?: string;
  description?: string;
  detailImageIds?: string[];
  name?: string;
  price?: string;
  pricePrevious?: string;
  primaryTeacherId?: string;
  schedules?: VodClassType[];
};
