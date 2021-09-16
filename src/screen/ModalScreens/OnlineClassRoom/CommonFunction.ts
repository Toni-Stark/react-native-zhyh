import { Platform } from 'react-native';
import { appConfig } from '../../../common/app.config';
import DeviceInfo from 'react-native-device-info';
import { MsgProto } from '../../../proto/MessageProto';

export const Uint8ArrayToString = (fileData: Uint8Array | undefined | null): string => {
  if (fileData) {
    let dataString = '';
    for (let i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }
    return dataString;
  } else {
    return '';
  }
};

export const StringToUint8Array = (str): Uint8Array => {
  const arr: any = [];
  let i = 0,
    j = str.length;
  for (; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
};

export const VersionValid = (version: string): boolean => {
  const versionServer = version.split('.');
  const versionClient = appConfig.MSG_API_VERSION.split('.');
  if (versionServer.length !== 3 || versionClient.length !== 3) {
    return false;
  }
  if (versionServer[0] > versionClient[0] || versionServer[1] > versionClient[1]) {
    return false;
  }
  if (versionServer[2] > versionClient[2]) {
    console.log('服务端有更新，请及时更新客户端');
  }
  return true;
};

export const GetFirstLetter = (name: string | null | undefined): string => {
  if (name) {
    return name.substr(0, 1).toUpperCase();
  } else {
    return '学';
  }
};

export const GetDeviceType = (): number => {
  if (Platform.OS === 'ios') {
    return DeviceInfo.isTablet() ? MsgProto.EnumDeviceType.TABLET_IOS : MsgProto.EnumDeviceType.MOBILE_IOS;
  }
  if (Platform.OS === 'android') {
    return DeviceInfo.isTablet() ? MsgProto.EnumDeviceType.TABLET_ANDROID : MsgProto.EnumDeviceType.MOBILE_ANDROID;
  }
  return MsgProto.EnumDeviceType.UNKNOWN_DEVICE;
};

export const GetAnswerLetter = (item: number) => {
  switch (item) {
    case 1:
      return 'A';
    case 2:
      return 'B';
    case 3:
      return 'C';
    case 4:
      return 'D';
    case 5:
    default:
      return 'E';
  }
};

export const ConvertFromPushingStatus = (pushingStatus: MsgProto.EnumPushingStatus | undefined | null) => {
  switch (pushingStatus) {
    case MsgProto.EnumPushingStatus.PUSHING_BACK:
      return MsgProto.EnumCameraType.BACK;
    case MsgProto.EnumPushingStatus.PUSHING_FRONT:
    default:
      return MsgProto.EnumCameraType.FRONT;
  }
};

export const isPushingVideo = (pushingStatus: MsgProto.EnumPushingStatus | undefined | null): boolean => {
  return pushingStatus === MsgProto.EnumPushingStatus.PUSHING_FRONT || pushingStatus === MsgProto.EnumPushingStatus.PUSHING_BACK;
};

export const isValidPushingUser = (userType: MsgProto.EnumUserType | undefined | null): boolean => {
  return userType === MsgProto.EnumUserType.TEACHER || userType === MsgProto.EnumUserType.STUDENT;
};
