import { action, computed, makeAutoObservable, observable } from 'mobx';
import { Api } from '../../../../common/api';
import { AttachmentType, HomeworkFilesType, UserInfoType } from '../../../../common/type';
import { AUDIO, HOMEWORK_STATUS_CORRECTION, HOMEWORK_STATUS_CREATED, HOMEWORK_STATUS_REVIEW, HOMEWORK_STATUS_SUBMIT } from '../../../../common/status-module';
import { Player } from '@react-native-community/audio-toolkit';
import { ImageType } from '../../../../store/HomeworkStore';
import { studentType } from '../../../../store/LessonDetailStore';

const BaseEduUrl = '/education';
const BaseResUrl = '/resource';

export class HomeworkInterStore {
  @observable loading: boolean = false;
  @observable homeworkInfo: Partial<HomeworkInfoType> = {};
  @observable homeworkInfoDetail: Partial<HomeworkInfoDetailType> = {};

  @observable currentFilesList: Partial<AttachmentType>[] = [];
  @observable audioList: Partial<AttachmentType>[] = [];
  @observable asyncImageForm: Partial<AttachmentType>[] = [];
  @observable audioOnlyOne?: Player;

  @observable selectList: SelectListType[] = [
    { name: '未完成', status: HOMEWORK_STATUS_CREATED },
    { name: '待批改', status: HOMEWORK_STATUS_SUBMIT },
    { name: '已完成', status: HOMEWORK_STATUS_REVIEW }
  ];
  @observable studentList: Partial<HomeworkLessonListType>[] = [];
  @observable selectStatus: number = 1;
  constructor() {
    makeAutoObservable(this);
  }

  @computed get getFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfo.homeworkFiles?.map((file) => {
        files.push(file);
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }

  @computed get getStudentFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfoDetail.homeworkFilesSubmit?.map((file) => {
        files.push(file);
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }
  @computed get getTeacherReviewFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfoDetail.homeworkFilesReview?.map((file) => {
        files.push(file);
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }

  @computed get getTeacherFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfoDetail.homeworkFilesReview?.map((file) => {
        files.push(file);
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }

  @computed get getAudioFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    console.log(this.homeworkInfo.homeworkFiles?.length, '这是教师登录音频文件数量');
    if (this.currentFilesList.length < 1) {
      this.homeworkInfo.homeworkFiles?.map((file) => {
        if (file.type === AUDIO) {
          files.push(file);
        }
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }

  @computed get getAudioStudentFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfoDetail.homeworkFilesSubmit?.map((file) => {
        if (file.type === AUDIO) {
          files.push(file);
        }
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }
  @computed get getAudioTeacherReviewFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfoDetail.homeworkFilesReview?.map((file) => {
        if (file.type === AUDIO) {
          files.push(file);
        }
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }

  @computed get getAudioTeacherFiles(): Array<Partial<AttachmentType>> {
    const files: Partial<AttachmentType>[] = [];
    if (this.currentFilesList.length < 1) {
      this.homeworkInfoDetail.homeworkFilesReview?.map((file) => {
        if (file.type === AUDIO) {
          files.push(file);
        }
      });
    } else {
      this.currentFilesList.map((file) => {
        files.push(file);
      });
    }
    return files;
  }

  @computed get getImages() {
    const images: ImageType[] = [];
    this.asyncImageForm.map((image) => {
      images.push({ uri: image.url });
    });
    return images;
  }

  @computed get getStudentList(): Array<Partial<HomeworkLessonListType>> {
    const students: Array<Partial<HomeworkLessonListType>> = [];
    this.homeworkInfo.homeworkLessonStudentList?.map((item) => {
      if (item.status === this.selectStatus) {
        students.push(item);
      }
      if (this.selectStatus === 3 && item.status === HOMEWORK_STATUS_CORRECTION) {
        students.push(item);
      }
    });
    return students;
  }

  /**
   * 获取作业文件地址
   * get:/resource/homework-file/3423/url
   */
  @action
  async getHomeworkFileUrl(id: string): Promise<string> {
    const res = await Api.getInstance.get({ url: `${BaseResUrl}/homework-file/${id}/url`, withToken: true });
    if (res.success) {
      console.log(res.result, '文件地址');
      return Promise.resolve(res.result);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 删除自己的作业
   * get:/education/homework-lesson
   */
  @action
  async delSelfHomework(id?: string): Promise<string | boolean> {
    const res = await Api.getInstance.delete({ url: `${BaseEduUrl}/homework-lesson/${id}`, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 获取老师布置作业详情
   * get:/resource/homework-lesson/student/
   */
  @action
  async getHomeworkInfo(params: getHomeworkInter): Promise<string | boolean> {
    const res = await Api.getInstance.get({ url: `${BaseEduUrl}/homework-lesson/teacher/${params.infoId}`, withToken: true });
    if (res.success) {
      this.homeworkInfo = res.result;
      setTimeout(() => {
        this.loading = true;
      }, 400);
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 获取学生作业详情
   * get:/resource/homework-lesson/student/
   */
  @action
  async getHomeworkInfoDetail(params: getHomeworkInter): Promise<string | boolean> {
    const res = await Api.getInstance.get({ url: `${BaseEduUrl}/homework-lesson/student/${params.infoId}`, withToken: true });
    if (res.success) {
      this.loading = true;
      console.log('-------------------------');
      console.log(res.result);
      console.log('-------------------------');
      this.homeworkInfoDetail = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 教师退回作业
   * get:/resource/homework-lesson/student/
   */
  @action
  async retreatHomework(params: Partial<retreatHomeworkType>): Promise<string | boolean> {
    const param: Partial<retreatHomeworkType> = {
      id: params.id,
      retreatDescription: params.retreatDescription
    };
    console.log('resefradf');
    const res = await Api.getInstance.post({ url: `${BaseEduUrl}/homework-lesson/retreat`, params: param, withToken: true });
    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }
}

export interface getHomeworkInter {
  infoId?: string;
}

export interface retreatHomeworkType {
  id: string;
  retreatDescription: string;
}

export type HomeworkInfoType = {
  id: string;
  createdTime: Date;
  updatedTime: Date;
  createdBy: string;
  updatedBy: string;
  content: string;
  status: number;
  scheduleId: string;
  lessonType: number;
  title: string;
  notSubmitCount: number;
  submitCount: number;
  retreatCount: number;
  reviewCount: number;
  teacher: Partial<UserInfoType>;
  homeworkFiles: Partial<HomeworkFilesType>[];
  homeworkLessonStudentList: Partial<HomeworkLessonListType>[];
  businessId: string;
  reviewContent: string;
  score: string;
  student: studentType[];
  homeworkFilesSubmit: any[];
  homeworkFilesReview: any[];
};

export type HomeworkInfoDetailType = {
  id: string;
  createdTime: Date;
  updatedTime: Date;
  createdBy: string;
  updatedBy: string;
  content: string;
  status: number;
  scheduleId: string;
  lessonType: number;
  title: string;
  notSubmitCount: number;
  submitCount: number;
  retreatCount: number;
  reviewCount: number;
  teacher: Partial<UserInfoType>;
  homeworkFiles: Partial<HomeworkFilesType>[];
  homeworkLessonStudentList: Partial<HomeworkLessonListType>[];
  businessId: string;
  reviewContent: string;
  retreatDiscription: string;
  score: string;
  student: studentType;
  homeworkFilesSubmit: HomeworkFilesType[];
  homeworkFilesReview: HomeworkFilesType[];
};

export type HomeworkLessonListType = {
  id: string;
  createdTime: Date;
  updatedTime: Date;
  createdBy: string;
  updatedBy: string;
  content: string;
  status: number;
  reviewContent: string;
  score: number;
  student: Partial<UserInfoType>;
};

export type SelectListType = {
  name: string;
  status: number;
};
