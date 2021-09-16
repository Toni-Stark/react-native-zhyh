/**
 * Lesson Page
 * Url ./Lesson
 */
import { ScreenList } from '../index';
import { LessonDetail } from './Lesson/LessonDetail';
import { LessonVodDetail } from './Lesson/LessonVodDetail';
import { LessonPlanList } from './Lesson/LessonPlanList';
import { Search } from './Home/Search';
import { StudentOfTeacher } from './Lesson/StudentOfTeacher';
import { LessonDraftBox } from './Lesson/LessonDraftBox';
import { ViewSummary } from './Lesson/ViewSummary';
import { LessonVideoView } from './Lesson/LessonVideoView';
import { CreateLessonCorrect } from './Lesson/CreateLessons/CreateLessonCorrect';
import { CreateLessonsLive } from './Lesson/CreateLessons/CreateLessonsLive';
import { CreateLessonsDemand } from './Lesson/CreateLessons/CreateLessonsDemand';
import { SelectTeacherList } from './Lesson/SelectTeacherList';
import { ReplayVideo } from './Lesson/ReplayVideo';

/**
 * Profile Page
 * Url ./Profile
 */
import { ProfileDetail } from './Profile/ProfileDetail';
import { AboutDetail } from './Profile/AboutDetail';
import { MyQRDetail } from './Profile/MyQRDetail';
import { MyScheduleDetail } from './Profile/MyScheduleDetail';
import { MyProfileDetail } from './Profile/MyProfileDetail';
import { MyCalendar } from './Profile/MyCalendar';
import { BalanceDetail } from './Profile/BalanceDetail';
import { ParentsStudents } from './Profile/ParentsStudents';
import { CodeScan } from './Profile/CodeScan';

/**
 * Profile Page
 * Url ./Profile/AboutDetail
 */
import { ContactUs } from './Profile/AboutDetail/ContactUs';
import { ProblemFeedback } from './Profile/AboutDetail/ProblemFeedback';
/**
 * Profile Page
 * Url ./Profile/MyProfile
 */
import { ChangeInfo } from './Profile/MyProfile/ChangeInfo';
import { ChangeInfoSys } from './Profile/MyProfile/ChangeInfoSys';
/**
 * Profile Page
 * Url ./Profile/BalanceDetail
 */
import { FlowDetail } from './Profile/BalanceDetail/FlowDetail';
import { Recharge } from './Profile/BalanceDetail/Recharge';
import { Withdrawal } from './Profile/BalanceDetail/Withdrawal';
/**
 * Home Page
 * Url ./Profile/BalanceDetail
 */
import { AllCourses } from './Home/AllCourses';
import { SearchPage } from './Home/SearchPage';
import { LectureList } from './Lesson/LectureList';
import { LectureDetail } from './Lesson/LectureDetail';
import { LectureVodList } from './Lesson/LectureVodList';

import { Barner } from './Home/Barner';
import Long from 'long';

import { SectionInfo } from './Lesson/SectionInfo';

/**
 * Homework Page
 * Url ./HomeWork/HomeworkDetail
 */
import { HomeworkCreated } from './HomeWork/HomeworkCreated';

import { BalanceRechargeIOS } from './Profile/BalanceRechargeIOS';

import { HomeworkVideoPlayback } from './HomeWork/HomeworkVideoPlayback';

import { HomeworkList } from './HomeWork/HomeworkList';
import { HomeworkInteraction } from './HomeWork/HomeworkINT/HomeworkInteraction';
import { HomeworkStudentCom } from './HomeWork/HomeworkINT/HomeworkStudentCom';
import { HomeworkTeacherCor } from './HomeWork/HomeworkINT/HomeworkTeacherCor';
import { HomeworkTeacherEdi } from './HomeWork/HomeworkINT/HomeworkTeahcherEdi';
import { HomeworkTeacherCom } from './HomeWork/HomeworkINT/HomeworkTeacherCom';
import { CloudDisk } from '../CloudDisk';
import { AudioPlayer } from './Lesson/AudioPlayer';

export type ScreensParamList = {
  Login: { message?: string };
  LessonDetail: { lessonId: string; message?: string };
  LessonVodDetail: { lessonId: string; message?: string };
  LessonDraftBox: { lessonId: string };
  ChangeInfo: { name?: string };
  OnlineClassRoom: { roomId: Long; password?: string; pathName: string };
  HomeworkRevision: { homeworkId: string };
  LessonPlayback: { name?: string; url?: string; back?: string };
  LectureList: { lessonId: string; message?: string };
  LectureDetail: { lectureId: string };
  LectureVodList: { lessonId: string };
  // LessonVodPlayback: { lessonId: string };
  LessonVodPlayback: { name?: string; url?: string; back?: string };
  SearchPage: { text: string };
  SelectVodPage: { name: string };
  Barner: { data?: any };
  BalanceRechargeIOS: { message: string };
  ClassSummary: { id: string };
  ViewSummary: { id: string };
  // LessonVideoView: { resourceId: string; back: string };
  LessonVideoView: { name?: string; url?: string; back?: string };
  HomeworkCreated: { lectureId?: string; lessonType?: string };
  HomeworkVideoPlayback: { url: string; back?: string };
  HomeworkFileView: { url?: string };
  HomeworkList: { id: string; lessonType: string };
  HomeworkStudentCom: { lectureId: string };
  HomeworkTeacherEdi: { lectureId: string };
  HomeworkTeacherCor: { lectureId: string };
  HomeworkTeacherCom: { infoId?: string; lessonType: string; lectureId?: string };
  HomeworkInteraction: { infoId?: string; lessonType: string; lectureId?: string };
  MyCalendar: { message?: string };
  AudioPlayer: { name?: string; url?: string; back?: string };
  ReplayVideo: { id: string; index?: number };
};

export const CardScreens: Array<ScreenList> = [
  { name: 'Search', component: Search },
  { name: 'LessonDetail', component: LessonDetail },
  { name: 'LessonVodDetail', component: LessonVodDetail },
  { name: 'LessonPlanList', component: LessonPlanList },
  { name: 'ProfileDetail', component: ProfileDetail },
  { name: 'AboutDetail', component: AboutDetail },
  { name: 'MyProfileDetail', component: MyProfileDetail },
  { name: 'MyQRDetail', component: MyQRDetail },
  { name: 'MySchedule', component: MyScheduleDetail },
  { name: 'ContactUs', component: ContactUs },
  { name: 'ProblemFeedback', component: ProblemFeedback },
  { name: 'ChangeInfo', component: ChangeInfo },
  { name: 'ChangeInfoSys', component: ChangeInfoSys },
  { name: 'MyCalendar', component: MyCalendar },
  { name: 'BalanceDetail', component: BalanceDetail },
  { name: 'FlowDetail', component: FlowDetail },
  { name: 'Recharge', component: Recharge },
  { name: 'Withdrawal', component: Withdrawal },
  { name: 'ParentsStudents', component: ParentsStudents },
  { name: 'AllCourses', component: AllCourses },
  { name: 'LectureList', component: LectureList },
  { name: 'LectureVodList', component: LectureVodList },
  { name: 'LectureDetail', component: LectureDetail },
  { name: 'StudentOfTeacher', component: StudentOfTeacher },
  { name: 'CreateLessonsDemand', component: CreateLessonsDemand },
  { name: 'HomeworkCreated', component: HomeworkCreated },
  { name: 'SearchPage', component: SearchPage },
  { name: 'CodeScan', component: CodeScan },
  { name: 'LessonDraftBox', component: LessonDraftBox },
  { name: 'Barner', component: Barner },
  { name: 'BalanceRechargeIOS', component: BalanceRechargeIOS },
  { name: 'ViewSummary', component: ViewSummary },
  { name: 'LessonVideoView', component: LessonVideoView },
  { name: 'CreateLessonCorrect', component: CreateLessonCorrect },
  { name: 'CreateLessonsLive', component: CreateLessonsLive },
  { name: 'HomeworkVideoPlayback', component: HomeworkVideoPlayback },
  { name: 'SelectTeacherList', component: SelectTeacherList },
  { name: 'SectionInfo', component: SectionInfo },
  { name: 'HomeworkInteraction', component: HomeworkInteraction },
  { name: 'HomeworkStudentCom', component: HomeworkStudentCom },
  { name: 'HomeworkTeacherCor', component: HomeworkTeacherCor },
  { name: 'HomeworkTeacherEdi', component: HomeworkTeacherEdi },
  { name: 'HomeworkTeacherCom', component: HomeworkTeacherCom },
  { name: 'HomeworkList', component: HomeworkList },
  { name: 'CloudDisk', component: CloudDisk },
  { name: 'AudioPlayer', component: AudioPlayer },
  { name: 'ReplayVideo', component: ReplayVideo }
];
