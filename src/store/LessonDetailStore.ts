import { action, makeAutoObservable, observable } from 'mobx';
import { Api, ApiResult } from '../common/api';
import { getEnLen, NumberLike } from '../common/tools';

import {
  LESSON_STATUS_CANCELED,
  LESSON_STATUS_CREATED,
  LESSON_STATUS_FINISHED,
  LESSON_STATUS_PUBLISHED,
  LESSON_STATUS_SUBMIT,
  LESSON_TYPE_DEMAND,
  LESSON_TYPE_FILE,
  LESSON_TYPE_LIVE,
  USER_MODE_CLASS_STUDENT
} from '../common/status-module';
import { ImageList } from './LessonCreateStore';
import { TeacherDetailType } from './HomeworkStore';
import { ResourceFilesType } from './CreateVodStore';

export type CategoriesTypes = {
  id: string;
  name: string;
  weight: number;
  description?: string;
};

export const MAX_UPLOAD_IMAGE = 60;
export const CERTIFICATION_IMAGE_SIZE = 60;

export const BaseUrl = '/education';

export class LessonDetailStore {
  @observable loading: boolean = true;
  @observable error: boolean = false;
  @observable lessonName: string = '';
  @observable lessonCover: string = '';
  @observable lessonDescription: string = '';
  @observable lessonPrice: number = 0;
  @observable lessonPriceOrigin: number = 0;
  @observable lessonEnrollmentLeft: number = 0;
  @observable lessonScheduleCount: number = 0;
  @observable lessonDetail: CoursesDetail | undefined;
  @observable lessonDetailPlaceholder: boolean = true;
  @observable studentOfTeacher: Array<studentType> = [];

  @observable summaryContent: summaryType = { content: '' };
  @observable categories: CategoriesTypes[] = [];
  @observable lessonClassOfTeacher: Array<LessonClassLiveType> = [];

  @observable statusNum: null | number = null;
  @observable typeNum: null | number = 0;
  @observable selectTeacher: Array<SecondaryTeachersType> = [];
  @observable selectObj: SecondaryTeachersType[] = [];
  @observable selects: string[] = [];
  @observable lectureDetail?: lectureDetailType = undefined;
  @observable selectLecture?: ScheduleList = undefined;

  @observable lessonDetailSchedules: SchedulesType | undefined;
  @observable scheduleReplays: string[] = [];

  @observable selectChangeLesson: ScheduleType | undefined;

  constructor() {
    makeAutoObservable(this);
  }
  @action
  getStatus(num: number | null): string {
    switch (num) {
      case 0:
        return `${LESSON_STATUS_CREATED}`;
      case 1:
        return `${LESSON_STATUS_SUBMIT}`;
      case 2:
        return `${LESSON_STATUS_PUBLISHED}`;
      case 3:
        return `${LESSON_STATUS_FINISHED},${LESSON_STATUS_CANCELED}`;
      default:
        return ``;
    }
  }
  @action
  getStudentStatus(num: number | null): string {
    switch (num) {
      case 0:
        return `${LESSON_STATUS_PUBLISHED}`;
      case 1:
        return `${LESSON_STATUS_FINISHED},${LESSON_STATUS_CANCELED}`;
      default:
        return ``;
    }
  }

  /**
   * name: getValidate
   * url: /xueyue/business/lesson/query_app_user_lessons
   */
  @action
  async getSchedulesReplay(scheduleLiveId: string): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.get({ url: `${BaseUrl}/schedule-live/${scheduleLiveId}/replay`, withToken: true });
    if (res.success) {
      this.scheduleReplays = res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * name: getTeacherLessonList
   * url: /lessons-file
   */
  @action
  async getLessonList({ isAdd, businessId, userType }: { isAdd: boolean; businessId?: string; userType?: number }): Promise<boolean> {
    if (isAdd) {
      const res: ApiResult = await Api.getInstance.get({
        url:
          BaseUrl +
          `/lessons-live/list-for-current?businessId=${businessId}${
            (userType === USER_MODE_CLASS_STUDENT ? this.getStudentStatus(this.statusNum) : this.getStatus(this.statusNum))
              ? '&status=' + (userType === USER_MODE_CLASS_STUDENT ? this.getStudentStatus(this.statusNum) : this.getStatus(this.statusNum))
              : ''
          }${this.statusNum !== null ? '&' : ''}&pageSize=10&current=1`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.lessonClassOfTeacher = res.result.content;
        this.error = false;
        return Promise.resolve(res.success);
      } else {
        if (res.code === 500) {
          this.error = true;
        }
        return Promise.reject(res.message);
      }
    } else {
      const res: ApiResult = await Api.getInstance.get({
        url:
          BaseUrl +
          `/lessons-live/list-for-current?businessId=${businessId}${this.getStatus(this.statusNum) ? '&status=' + this.getStatus(this.statusNum) : ''}${
            this.statusNum !== null ? '&' : ''
          }&pageSize=10&current=${getEnLen(this.lessonClassOfTeacher.length, 10)}`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.lessonClassOfTeacher = this.lessonClassOfTeacher.concat(res.result.content);
        this.error = false;
        return Promise.resolve(res.success);
      } else {
        if (res.code === 500) {
          this.error = true;
        }
        return Promise.reject(res.message);
      }
    }
  }

  /**
   * name: getVodLessonList
   * url: /lessons-vod
   */
  @action
  async getVodLessonList({ isAdd, businessId }: { isAdd: boolean; businessId?: string; userType?: number }): Promise<boolean> {
    if (isAdd) {
      const res: ApiResult = await Api.getInstance.get({
        url:
          BaseUrl +
          `/lessons-vod/list-for-current?businessId=${businessId}${this.getStatus(this.statusNum) ? '&status=' + this.getStatus(this.statusNum) : ''}${
            this.statusNum !== null ? '&' : ''
          }&pageSize=10&current=1`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.lessonClassOfTeacher = res.result.content;
        this.error = false;
        return Promise.resolve(res.success);
      } else {
        if (res.code === 500) {
          this.error = true;
        }
        return Promise.reject(res.message);
      }
    } else {
      const res: ApiResult = await Api.getInstance.get({
        url:
          BaseUrl +
          `/lessons-vod/list-for-current?businessId=${businessId}${this.getStatus(this.statusNum) ? '&status=' + this.getStatus(this.statusNum) : ''}${
            this.statusNum !== null ? '&' : ''
          }&pageSize=10&current=${getEnLen(this.lessonClassOfTeacher.length, 10)}`,
        params: {},
        withToken: true
      });
      if (res.success) {
        this.lessonClassOfTeacher = this.lessonClassOfTeacher.concat(res.result.content);
        this.error = false;
        return Promise.resolve(res.success);
      } else {
        if (res.code === 500) {
          this.error = true;
        }
        return Promise.reject(res.message);
      }
    }
  }

  @action
  async getLessonDispatch({ isAdd, businessId, userType }: { isAdd: boolean; businessId?: string; userType?: number }) {
    switch (this.typeNum) {
      case LESSON_TYPE_LIVE - 1:
        return await this.getLessonList({ isAdd: isAdd, businessId, userType });
      case LESSON_TYPE_DEMAND - 1:
      case LESSON_TYPE_FILE - 1:
        return await this.getVodLessonList({ isAdd: isAdd, businessId, userType });
      default:
        return await this.getLessonList({ isAdd: isAdd, businessId, userType });
    }
  }

  /**
   * name: getValidate
   * url: /xueyue/business/lesson/query_app_user_lessons
   */
  @action
  async getValidate({ password, scheduleLiveId }: { password: string; scheduleLiveId: string }): Promise<boolean | string> {
    const params = {
      password,
      scheduleLiveId
    };
    const res: ApiResult = await Api.getInstance.post({ url: `${BaseUrl}/schedule-live/validate-auth`, params, withToken: true });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * name: getCategoriesTypes
   * url: /xueyue/business/lesson/query_app_user_lessons
   */
  @action
  async getCategoriesTypes(businessId?: string): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.get({ url: `${BaseUrl}/categories/all?businessId=${businessId}`, withToken: true });
    if (res.success) {
      console.log(res.result, '获取当前课程所有状态');
      this.categories = res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  @action
  async getInput(scheduleId: string): Promise<boolean | string> {
    const params = {
      scheduleId: scheduleId
    };
    const res: ApiResult = await Api.getInstance.get({ url: `/xueyue/business/summary/queryByScheduleId`, params: params, withToken: true });
    if (res.success) {
      console.log(res.result);
      this.summaryContent = res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  @action
  async updateInput(text: string, id: string, lessonId: string, scheduleId: string): Promise<boolean | string> {
    const params = {
      content: text,
      teacherId: id,
      lessonId: lessonId,
      scheduleId: scheduleId
    };
    const res: ApiResult = await Api.getInstance.post({ url: `/xueyue/business/summary/create`, params: params, withToken: true });
    if (res.success) {
      this.studentOfTeacher = res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * name: getStudentOfTeacher
   * url: /xueyue/sys/user/queryStudentsForTeacher
   */
  @action
  async getStudentOfTeacher(teacherId: string | undefined): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: `/xueyue/sys/user/queryStudentsForTeacher?teacherId=${teacherId}`, params: {}, withToken: true });
    if (res.success) {
      this.studentOfTeacher = res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }

  /**
   * name: getLessonDetail
   * url: /education/lessons-live/23223232323
   */
  @action
  async getLessonLiveDetail(lessonId: string): Promise<boolean> {
    this.loading = true;
    this.lessonDetail = undefined;
    const res: ApiResult = await Api.getInstance.get({ url: `${BaseUrl}/lessons-live/${lessonId}`, params: {}, withToken: true });
    if (res.success) {
      this.lessonDetail = await res.result;
      this.loading = false;
      return Promise.resolve(res.success);
    } else {
      this.loading = true;
      return Promise.reject(res.message);
    }
  }

  /**
   * name: getLessonVodDetail
   * url: /education/lessons-vod/23223232323
   */
  @action
  async getLessonVodDetail(lessonId: string): Promise<boolean> {
    this.loading = true;
    this.lessonDetail = undefined;
    const res: ApiResult = await Api.getInstance.get({ url: `${BaseUrl}/lessons-vod/${lessonId}`, params: {}, withToken: true });
    this.loading = false;
    if (res.success) {
      this.lessonDetail = await res.result;
      return Promise.resolve(res.success);
    } else {
      this.error = true;
      return Promise.reject(res.message);
    }
  }

  /**
   * name: getLectureDetail
   * url: /education/lessons-vod/schedules/23223232323
   */
  @action
  async getLectureDetail(lectureId: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: `${BaseUrl}/lessons-vod/schedules/${lectureId}`, params: {}, withToken: true });
    if (res.success) {
      this.error = false;
      this.lectureDetail = res.result;
      return Promise.resolve(res.success);
    } else {
      if (res.code === 500) {
        this.error = true;
      }
      return Promise.reject(res.message);
    }
  }

  /**
   * name: getTeacherList
   * url: /xueyue/sys/user/queryStudentsForTeacher
   */
  @action
  async getTeacherList(text?: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: `/auth/users/list-basic-app-users?blurry=${text}`, params: {}, withToken: true });
    if (res.success) {
      this.selectTeacher = res.result.content;
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async joinNow(lessonId: string | undefined): Promise<boolean | string | void> {
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/lessons-live/' + lessonId + '/enroll', withToken: true });
    console.log(res, '后台模式');
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  @action
  async vodJoinNow(lessonId: string | undefined): Promise<boolean | string | void> {
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/lessons-vod/' + lessonId + '/enroll', withToken: true });
    console.log(res, '后台模式');
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  @action
  async getUserLessonDetail(id: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: `/xueyue/business/lesson/queryById-v2?id=${id}`, params: {}, withToken: true });
    if (res.success) {
      this.lessonDetail = res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }
}

export type studentType = {
  avatar: { url: string; id: string };
  balance: number;
  birthday: Date;
  cashStatus: number;
  createBy: string;
  createTime: Date;
  email: string;
  frozenBalance: number;
  id: string;
  orgCode: string;
  phone: string;
  post: string;
  realname: string;
  referrer: string;
  sex: number;
  status: number;
  telephone: string;
  updateBy: string;
  updateTime: Date;
  userType: 3;
  username: string;
  workNo: string;
};

export type PayOrderDetail = {
  courseCover: string;
  courseFees: number;
  courseName: string;
  createTime: Date;
  id: string;
  lessonId: string;
  parentId: string;
  payOrderId: string;
  status: number;
  studentId: string;
  studentName: string;
  teacherId: string;
  updateTime: string;
};

export type LessonListType = {
  actualStudentCount: number;
  actualStudentCountNotPayed: number;
  actualStudentCountPayed: number;
  actualStudentCountPaying: number;
  cancelDescription: string;
  categoryId: string;
  courseCover: string;
  courseFees: number;
  courseName: string;
  createBy: string;
  createTime: string;
  description: string;
  feature: string;
  gradeId: string;
  groupNames: string;
  id: string;
  presetStudentCount: number;
  scheduleList?: ScheduleListType[];
  scheduleCount: number;
  status: number;
  sysOrgCode: string;
  teacher?: TeacherType;
  teacherList?: TeacherListType[];
  teacherAvatar: string;
  teacherId: string;
  teacherName: string;
  type: number;
  updateTime: string;
  vodScheduleList?: VodScheduleList[];
};

export type CoursesDetail = {
  id?: string;
  createdTime?: Date;
  updatedTime?: Date;
  name?: string;
  description?: string;
  retreatDescription?: string;
  status?: number;
  authType?: number;
  presetStudentCount?: string | number;
  price?: string;
  pricePrevious?: string;
  autoRecord?: boolean;
  secondaryTeacherCount?: number;
  studentCount?: number;
  scheduleCount?: 1;
  createdBy?: string;
  updatedBy?: string;
  category?: {
    id?: string;
    name?: string;
    weight?: boolean;
    description: null;
  };
  primaryTeacher?: PeoplesType;
  imageCover?: {
    id?: string;
    url?: string;
  };
  secondaryTeachers?: SecondaryTeachersType[];
  students?: PeoplesType[];
  schedules?: SchedulesType[];
  imageDetailList?: ImageList[];
};

export type PeoplesType = {
  id?: string;
  createdTime?: Date;
  updatedTime?: Date;
  username?: string;
  phone?: string;
  nickName?: null;
  realName?: null;
  avatar?: { url: string; id: string };
  birthday?: null;
  sex?: null;
  email?: null;
  userType?: 2;
  certified?: string;
  isEnabled?: true;
  lastActiveTime?: Date;
  createdBy?: any;
  updatedBy?: any;
  businessId?: string;
};

export type SecondaryTeachersType = {
  avatar?: { id: string; url: string };
  birthday?: Date;
  businessId?: string;
  certified?: any;
  createdBy?: string;
  createdTime?: Date;
  email?: string;
  id: string;
  isEnabled?: boolean;
  lastActiveTime?: Date;
  nickName?: string;
  phone?: string;
  realName?: string;
  sex?: number;
  updatedBy?: string;
  updatedTime?: Date;
  userType?: number;
  username?: string;
};
export type SchedulesType = {
  id?: string;
  name?: string;
  planningStartTime?: string;
  planningEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  resourceFiles?: ResourceFilesType[];
  weight?: 1;
  canReplay?: boolean;
  businessId?: string;
};
export type TeacherType = { avatar: string; card: any; id: string; name: string };
export type TeacherListType = { isMajor: boolean; lessonId: string; teacherId: string; teacherTitle: string; teacherUsername: string };
export type VodScheduleList = {
  duration: number;
  id: string;
  lessonId: string;
  name: string;
  sort: number;
  vodFileId: string;
  vodFileName: string;
};
export type ScheduleList = {
  actualEndTime?: string;
  actualStartTime?: string;
  id?: string;
  lessonId?: string;
  name?: string;
  noticeTime?: NumberLike;
  planningEndTime?: string;
  planningStartTime?: string;
  status?: number;
  streamChannel?: string;
  whiteboardChannel?: string;
  whiteboardConvertTaskId?: string;
};

export type ScheduleListType = {
  planningEndTime?: Date;
  whiteboardConvertTaskId?: string;
  actualStartTime?: Date;
  name?: string;
  lessonId?: string;
  actualEndTime?: Date;
  id?: string;
  streamChannel?: string;
  noticeTime?: Date;
  planningStartTime?: Date;
  status?: string;
  whiteboardChannel?: string;
};

export type playInfoListType = {
  bitrate: string;
  complexity: string;
  creationTime: Date;
  definition: string;
  duration: string;
  encrypt: number;
  encryptType: string;
  format: string;
  fps: string;
  height: number;
  jobId: string;
  modificationTime: Date;
  narrowBandType: string;
  plaintext: string;
  playURL: string;
  preprocessStatus: 'UnPreprocess';
  rand: string;
  size: number;
  status: string;
  streamType: string;
  watermarkId: string;
  width: number;
};

export type videoBase = {
  coverURL: string;
  creationTime: Date;
  duration: string;
  mediaType: string;
  outputType: string;
  status: string;
  thumbnailList: [];
  title: string;
  transcodeMode: string;
  videoId: string;
};

export type videoDetailType = {
  playInfoList: playInfoListType[];
  requestId: string;
  videoBase: videoBase;
};

export type OldLessonClassLiveType = {
  actualStudentCountPayed: null;
  presetStudentCount: number;
  vodScheduleList: VodScheduleList[];
  description: string;
  teacherList: TeacherListType[];
  actualStudentCount: number;
  type: number;
  teacher: TeacherType;
  belongsToMe: boolean;
  feature: string;
  scheduleList: ScheduleListType[];
  actualStudentCountPaying: number;
  courseFees: number;
  id: string;
  courseCover: string;
  gradeId: string;
  cancelDescription: string;
  actualStudentCountNotPayed: number;
  updateTime: Date;
  groupNames: string;
  courseName: string;
  createBy: string;
  teacherId: string;
  createTime: Date;
  sysOrgCode: string;
  categoryId: string;
  status: number;
};
export type LessonClassLiveType = {
  id?: string;
  createdTime?: Date;
  updatedTime?: Date;
  name?: string;
  description?: string;
  retreatDescription?: string;
  status?: number;
  authType?: number;
  authPassword?: string;
  presetStudentCount?: number;
  price?: number;
  pricePrevious?: number;
  secondaryTeacherCount?: number;
  studentCount?: number;
  scheduleCount?: number;
  createdBy?: string;
  updatedBy?: string;
  category?: {
    id?: string;
    name?: string;
    weight?: number;
    description?: string;
  };
  primaryTeacher?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    username?: string;
    phone?: string;
    nickName?: string;
    realName?: string;
    avatar?: { url: string; id: string };
    birthday?: Date;
    sex?: number;
    email?: string;
    userType?: number;
    certified?: any;
    isEnabled?: any;
    lastActiveTime?: Date;
    createdBy?: any;
    updatedBy?: any;
  };
  imageCover?: {
    id?: string;
    url?: string;
  };
};

export type lessonDetailType = {
  id?: string;
  createdTime?: string;
  updatedTime?: string;
  name?: string;
  description?: string;
  retreatDescription?: string;
  status?: number;
  authType?: number;
  presetStudentCount?: number;
  price?: string;
  pricePrevious?: string;
  secondaryTeacherCount?: number;
  studentCount?: number;
  scheduleCount?: number;
  createdBy?: string;
  updatedBy?: string;
  category?: {
    id?: string;
    name?: string;
    weight?: number;
    description?: string;
  };
  primaryTeacher?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    username?: string;
    phone?: string;
    nickName?: string;
    realName?: string;
    avatar?: { url?: string; id?: string };
    birthday?: Date;
    sex?: number;
    email?: string;
    userType?: number;
    certified?: null;
    isEnabled?: true;
    lastActiveTime?: Date;
    createdBy?: null;
    updatedBy?: string;
    businessId?: string;
  };
  imageCover?: { url?: string; id?: string };
  secondaryTeachers?: TeacherDetailType[];
  students?: any[];
  schedules?: ScheduleListType[];
  imageDetailList?: [];
};

export type summaryType = {
  content: string;
  createTime?: Date;
  id?: string;
  lessonId?: string;
  scheduleId?: string;
  teacherId?: string;
  updateTime?: Date;
};

export interface AttachmentType {
  fileSize?: string; // 1671499,
  id?: string; // "1302925996039839746",
  type?: number; // 1,
  fileId?: string;
  url?: string; // "http://xueyue-homework.oss-cn-chengdu.aliyuncs.com/1265911558981931009/1599476736109214.jpg"
}

// http://192.168.0.100:8080/xueyue/#/default/%E6%94%AF%E4%BB%98%E8%AE%A2%E5%8D%95/queryByIdUsingGET_9
// http://192.168.0.100:50189/organization/lesson/LessonList

export type selectType = {
  id?: string;
  createdTime?: string;
  updatedTime?: string;
  username?: string;
  phone?: string;
  nickName?: string;
  realName?: string;
  avatar?: any;
  birthday?: string;
  sex?: number;
  email?: string;
  userType?: 2;
  certified?: any;
  isEnabled?: boolean;
  lastActiveTime?: Date;
  createdBy?: string;
  updatedBy?: string;
  businessId?: string;
};
export type lectureDetailType = {
  id?: string;
  name?: string;
  weight?: number;
  resourceFiles?: ResourceFilesType[];
  lesson?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    name?: string;
    description?: string;
    retreatDescription?: any;
    status?: number;
    authType?: number;
    price?: string;
    pricePrevious?: string;
    studentCount?: number;
    scheduleCount?: number;
    createdBy?: string;
    updatedBy?: string;
  };
  primaryTeacher?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    username?: string;
    phone?: string;
    nickName?: string;
    avatar?: { id: string; url: string };
    birthday?: Date;
    sex?: number;
    email?: number;
    certified?: null;
    isEnabled?: true;
    lastActiveTime?: Date;
    createdBy?: any;
    updatedBy?: string;
    businessId?: string;
  };
  students?: [];
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
