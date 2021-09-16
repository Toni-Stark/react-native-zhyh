import { createContext, useContext } from 'react';
import { UserStore } from './UserStore';
import { LessonDetailStore } from './LessonDetailStore';
import { SettingStore } from './SettingStore';
import { HomeStore } from './HomeStore';
import { SearchStore } from './SearchStore';
import { SystemStore } from './SystemStore';
import { CheckUpdateStore } from './CheckUpdateStore';
import { AgendaLessonStore } from './AgendaLessonStore';
import { PayStore } from './PayStore';
import { HomeworkStore } from './HomeworkStore';
import { HomeworkFormStore } from './HomeworkFormStore';
import { LessonCreateStore } from './LessonCreateStore';
import { CreateVodStore } from './CreateVodStore';
import { HomeworkCreateStore } from './HomeworkCreateStore';
import { CloudSeaDiskStore } from '../screen/ModalScreens/NetdiskResources/CloudSeaDiskStore';
import { UploadFilesStore } from '../screen/ModalScreens/NetdiskResources/UploadFilesStore';
import { GetOssFilesStore } from './GetOssFilesStore';
import { HomeworkInterStore } from '../screen/CardScreens/HomeWork/HomeworkINT/HomeworkInterStore';
import { UserRolesStore } from './UserRolesStore';

const StoreContext = createContext({
  systemStore: new SystemStore(),
  settingStore: new SettingStore(),
  homeStore: new HomeStore(),
  searchStore: new SearchStore(),
  userStore: new UserStore(),
  lessonDetailStore: new LessonDetailStore(),
  checkUpdateStore: new CheckUpdateStore(),
  agendaLessonStore: new AgendaLessonStore(),
  payStore: new PayStore(),
  homeworkStore: new HomeworkStore(),
  homeworkFormStore: new HomeworkFormStore(),
  lessonCreateStore: new LessonCreateStore(),
  createVodStore: new CreateVodStore(),
  homeworkCreateStore: new HomeworkCreateStore(),
  uploadFilesStore: new UploadFilesStore(),
  cloudSeaDiskStore: new CloudSeaDiskStore(),
  getOssFilesStore: new GetOssFilesStore(),
  userRolesStore: new UserRolesStore(),
  homeworkInterStore: new HomeworkInterStore()
});

export const useStore = () => useContext(StoreContext);
