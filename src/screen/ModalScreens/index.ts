import { ScreenList } from '../index';
import { LoginByPhone } from './LoginByPhone';
import { Register } from './Register';
import { LoginByName } from './LoginByName';
import { LoginByScan } from './LoginByScan';
import { OnlineClassRoom } from './OnlineClassRoom/OnlineClassRoom';
import { PrivacyAgreement } from './PrivacyAgreement';
import { UserAgreement } from './UserAgreement';
import { noPhoneRegister } from './noPhoneRegister';
import { MoveFolderSelect } from './NetdiskResources/MoveFolderSelect';
import { CloudSeaDisk } from './NetdiskResources/CloudSeaDisk';
import { UploadFile } from './NetdiskResources/UploadFile';

export const ModalScreens: Array<ScreenList> = [
  { name: 'OnlineClassRoom', component: OnlineClassRoom },
  { name: 'LoginByPhone', component: LoginByPhone },
  { name: 'LoginByName', component: LoginByName },
  { name: 'LoginByScan', component: LoginByScan },
  { name: 'Register', component: Register },
  { name: 'noPhoneRegister', component: noPhoneRegister },
  { name: 'PrivacyAgreement', component: PrivacyAgreement },
  { name: 'MoveFolderSelect', component: MoveFolderSelect },
  { name: 'CloudSeaDisk', component: CloudSeaDisk },
  { name: 'UploadFile', component: UploadFile },
  { name: 'UserAgreement', component: UserAgreement }
];
