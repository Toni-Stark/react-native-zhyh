import { action, makeAutoObservable, observable } from 'mobx';
import { CarouselViewItemType } from '../component/home/CarouselView';
import { FilterDataItemType } from '../component/home/FilterModalView';
import { Api, ApiResult } from '../common/api';
import { CoursesDetail } from './LessonDetailStore';
import { LESSON_TYPE_BIG, LESSON_TYPE_GROUP, LESSON_TYPE_SMALL, LESSON_TYPE_VOD } from '../common/status-module';
import { getEnLen } from '../common/tools';
import { CategoriesType, subjectType } from './LessonCreateStore';

const BaseUrl = '/education';

export class HomeStore {
  @observable refreshLoading: boolean = false;
  @observable error: boolean = false;

  @observable dataFilter: Array<FilterDataItemType> = [];
  @observable dataBanner: Array<CarouselViewItemType> = [];
  @observable dataLessonLive: Array<CoursesDetail> = [];
  @observable dataLessonDemand: Array<CoursesDetail> = [];
  @observable dataTeacher: Array<TeacherItemType> = [];
  @observable pageNumber: number = 1;

  @observable allSearchBigClass: Array<AllClassType> = [];
  @observable allSearchSmallClass: Array<AllClassType> = [];
  @observable allSearchLiveClass: Array<AllClassType> = [];
  @observable allSearchDeMandClass: Array<AllClassType> = [];

  @observable searchBarData?: subjectType[];
  @observable barDataList: CoursesDetail[] = [];

  @observable tabBarDataList: any[] = [
    { name: '推荐', id: '1255226262614' },
    { name: '语文', id: '6246254325245' },
    { name: '数学', id: '1232455515414' },
    { name: '物理', id: '1234152452414' },
    { name: '历史', id: '6262774727224' },
    { name: '化学', id: '1534545245414' },
    { name: '英语', id: '6345515455414' }
  ];

  @observable categories: CategoriesType[] = [];

  @observable tabBarSelect: number = 0;

  @observable isLiveOrDemand: number = 0;
  @observable dataList = [
    { name: '直播课', url: '/lessons-live', index: 0 },
    { name: '点播课', url: '/lessons-vod', index: 1 }
  ];
  constructor() {
    makeAutoObservable(this);
  }

  // 用户获取所有课程分类
  @action
  async getSubjectList(businessId): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/categories/all' + '?businessId=' + businessId, withToken: true });
    if (res.success) {
      this.categories = res.result;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async getNaviBarData(categoryId?: string, isAdd?: boolean): Promise<boolean> {
    const params = {
      categoryIds: categoryId
    };
    const res: ApiResult = await Api.getInstance.get({
      url: `${BaseUrl}${this.dataList[this.isLiveOrDemand].url}/list-for-public?pageSize=10&current=${isAdd ? getEnLen(this.barDataList.length, 10) : 1}`,
      params: params,
      withToken: true
    });

    if (res.success) {
      if (!isAdd) {
        this.barDataList = res.result.content;
      } else {
        this.barDataList = this.barDataList.concat(res.result.content);
      }
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async getBanners(): Promise<void> {
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/banners', params: {}, withToken: true, multipart: false });
    if (res.success) {
      this.dataBanner = await res.result;
    } else {
      console.log('error', res);
    }
  }

  @action
  async getLiveLessons(): Promise<void> {
    const params = {
      current: 1,
      pageSize: 10
    };
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/lessons-live/list-for-public', params, withToken: true, multipart: false });
    if (res.success) {
      this.dataLessonLive = await res.result.content;
    }
  }
  @action
  async getDemandLessons(): Promise<void> {
    const params = {
      current: 1,
      pageSize: 10
      // categoryIds: this.categories[this.tabBarSelect].id
    };
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/lessons-vod/list-for-public', params, withToken: true, multipart: false });
    if (res.success) {
      this.dataLessonDemand = await res.result.content;
    }
  }

  @action
  async getTeacherList(): Promise<void> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/business/elite/teachers', params: {}, withToken: true, multipart: false });
    if (res.success) {
      this.dataTeacher = await res.result;
    } else {
      return Promise.reject(res.message);
    }
  }

  // @action
  // async loadHomePage(): Promise<void> {
  //   const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/business/elite/all', params: {}, withToken: false });
  //   this.dataBanner = await res.result.banners;
  //   this.dataLesson = await res.result.lessons;
  //   this.dataTeacher = await res.result.cards;
  //   this.refreshLoading = false;
  //   // setTimeout(() => {
  //   //   // this.dataBanner = [];
  //   //   this.dataFilter = [];
  //   //   this.dataLesson = [];
  //   //
  //   //   // this.dataFilter.push({
  //   //   //   groupName: '小学',
  //   //   //   grades: [{ name: '一年级' }, { name: '二年级' }, { name: '三年级', selected: true }, { name: '四年级' }, { name: '五年级' }, { name: '六年级' }]
  //   //   // });
  //   //   // this.dataFilter.push({
  //   //   //   groupName: '初中',
  //   //   //   grades: [{ name: '一年级' }, { name: '二年级' }, { name: '三年级' }]
  //   //   // });
  //   //   // this.dataFilter.push({
  //   //   //   groupName: '高中',
  //   //   //   grades: [{ name: '一年级' }, { name: '二年级' }, { name: '三年级' }]
  //   //   // });
  //   //
  //   //   for (let i = 1; i <= 20; i++) {
  //   //     this.dataLesson.push({
  //   //       id: `${i}`,
  //   //       cover: 'https://picsum.photos/700',
  //   //       description:
  //   //         '本课程以马克思主义理论为指导,紧密联系我国经济体制改革实际,力求全面系统地介绍国有资产管理的基本理论、基本知识、基本方法和我国现行国有资产管',
  //   //       teacherAvatar: 'https://picsum.photos/100',
  //   //       teacherName: '张老师',
  //   //       scheduleCount: i
  //   //     });
  //   //   }
  //   //
  //   //   this.refreshLoading = false;
  //   // }, 500);
  // }
  @action
  select(selected: number): number {
    switch (selected) {
      case LESSON_TYPE_BIG:
        return this.allSearchBigClass.length;
      case LESSON_TYPE_SMALL:
        return this.allSearchSmallClass.length;
      case LESSON_TYPE_GROUP:
        return this.allSearchLiveClass.length;
      case LESSON_TYPE_VOD:
        return this.allSearchDeMandClass.length;
      default:
        return this.allSearchBigClass.length;
    }
  }
  @action
  async getAll(type: number, actions: boolean): Promise<boolean> {
    if (actions) {
      const res: ApiResult = await Api.getInstance.get({
        url: `/xueyue/business/elite/search-course?type=${type}&pageNo=1&pageSize=6`,
        params: {},
        withToken: true
      });
      if (res.success) {
        switch (type) {
          case LESSON_TYPE_BIG:
            this.allSearchBigClass = res.result.records;
            break;
          case LESSON_TYPE_SMALL:
            this.allSearchSmallClass = res.result.records;
            break;
          case LESSON_TYPE_GROUP:
            this.allSearchLiveClass = res.result.records;
            break;
          case LESSON_TYPE_VOD:
            this.allSearchDeMandClass = res.result.records;
            break;
        }
        return Promise.resolve(true);
      } else {
        return Promise.reject(res.message);
      }
    } else {
      const res: ApiResult = await Api.getInstance.get({
        url: `/xueyue/business/elite/search-course?type=${type}&pageNo=${getEnLen(this.select(type), 6)}&pageSize=6`,
        params: {},
        withToken: true
      });
      if (res.success) {
        switch (type) {
          case LESSON_TYPE_BIG:
            this.allSearchBigClass = this.allSearchBigClass?.concat(res.result.records);
            break;
          case LESSON_TYPE_SMALL:
            this.allSearchSmallClass = this.allSearchSmallClass?.concat(res.result.records);
            break;
          case LESSON_TYPE_GROUP:
            this.allSearchLiveClass = this.allSearchLiveClass?.concat(res.result.records);
            break;
          case LESSON_TYPE_VOD:
            this.allSearchDeMandClass = this.allSearchDeMandClass?.concat(res.result.records);
            break;
        }
        return Promise.resolve(true);
      } else {
        return Promise.reject(res.message);
      }
    }
  }

  @action
  async test() {
    await Api.getInstance.get({ url: '/business/lesson/queryByLoginTeacher' });
  }
}

export type TeacherItemType = {
  avatar: string;
  brief: string;
  id: string;
  name: string;
  targetId: string;
  targetType: string;
};
export type AllClassType = {
  actualStudentCount?: number;
  actualStudentCountNotPayed?: string;
  actualStudentCountPayed?: string;
  actualStudentCountPaying?: string;
  cancelDescription?: string;
  categoryId?: string;
  courseCover?: string;
  courseFees?: number;
  courseName?: string;
  createBy?: string;
  createTime?: string;
  description?: string;
  feature?: string;
  gradeId?: string;
  groupNames?: string;
  id?: string;
  presetStudentCount?: number;
  status?: number;
  sysOrgCode?: string;
  teachers?: TeacherType[];
  type?: number;
  updateTime?: string;
};
export type TeacherType = {
  avatar?: string;
  birthday?: null;
  createTime?: number;
  email?: null;
  id?: null;
  orgCode?: string;
  phone?: null;
  post?: null;
  realname: string;
  sex?: null;
  status?: number;
  telephone?: null;
  userType?: number;
  username?: string;
  workNo?: string | number;
};
