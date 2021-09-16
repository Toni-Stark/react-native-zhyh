import _, { memoize } from 'lodash';
import i18n from 'i18n-js';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { SERVER_URL } from './app.config';
import AsyncStorage from '@react-native-community/async-storage';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE } from './status-module';
import DeviceInfo from 'react-native-device-info';

export const t = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const throttle = (func: Function, throttleTime: number = 500) => {
  return _.throttle(func, throttleTime, {
    leading: true,
    trailing: false
  });
};

export const delay = (func: Function, delayTime: number = 500) => {
  return _.throttle(func, delayTime, {
    leading: false,
    trailing: true
  });
};

export const isBlank = (str: string) => {
  return str === null || str === undefined || str.trim() === '';
};
export const getClassType = (lessonType: string | number): string => {
  switch (lessonType) {
    case 9:
      return t('lesson.onDemand');
    case 2:
      return '小班课';
    case 1:
      return t('lesson.live');
    default:
      return '大班课';
  }
};

export const getClassNowTime = (lessonType: string | number): string => {
  switch (lessonType) {
    case 9:
      return t('lesson.onDemand');
    case 2:
      return '小班课';
    case 1:
      return t('lesson.live');
    default:
      return '大班课';
  }
};

export const getFileSize = (size?: string): string => {
  if (Number(size) > 900000) {
    return (Number(size) * 0.000001).toFixed(2) + 'MB';
  } else {
    return (Number(size) * 0.001).toFixed(2) + 'kb';
  }
};

export const deviceInfo = DeviceInfo.isTablet() ? (Platform.OS === 'ios' ? 3 : 4) : Platform.OS === 'ios' ? 1 : 2;

export const getSafeAvatar = (changeAvatar: string | undefined | null) => {
  if (changeAvatar && changeAvatar?.length > 0) {
    return { uri: SERVER_URL + '/xueyue/' + changeAvatar };
  } else {
    return { uri: '' };
  }
};

export const getEnLen = (num: number, size): number => {
  if (num === 0) {
    return 1;
  } else if (num !== 1 && num % size === 0) {
    return num / size + 1;
  } else if (num !== 1 && num % size > 0) {
    return Math.floor(num / size) + 2;
  } else return 1;
};

// export const getSize = (_): Promise<{ width: number; height: number }> => {
//   // resolve the source and use it instead
//   const src = Image.resolveAssetSource(_);
//
//   return new Promise((resolve, reject) => {
//     if (!src) {
//       reject(new Error('must pass in a valid source'));
//     } else if (src.uri) {
//       Image.getSize(src.uri, (width, height) => resolve({ width, height }), reject);
//     } else {
//       resolve({ width: src.width, height: src.height });
//     }
//   });
// };

export const getSafeCover = (changeAvatar: string | undefined) => {
  if (changeAvatar && changeAvatar?.length > 0) {
    return { uri: SERVER_URL + '/xueyue/' + changeAvatar };
  } else {
    return { uri: SERVER_URL + '/xueyue/' + 'files/202011/VCG211139532667_1605065186659.jpg' };
  }
};

export const getStr = (str: string | undefined) => {
  if (str) {
    return str;
  } else {
    return '';
  }
};

export const getUserGender = (check) => {
  switch (check) {
    case 1:
      return t('myProfile.man');
    case 2:
      return t('myProfile.women');
    default:
      return t('myProfile.notSet');
  }
};

export const getLessonType = (msg) => {
  switch (msg) {
    case 'live':
      return LESSON_TYPE_LIVE;
    case 'vod':
      return LESSON_TYPE_DEMAND;
    default:
      return LESSON_TYPE_LIVE;
  }
};

export const isIphoneX = () => {
  const window = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (window.height === 812 || window.width === 812 || window.height === 896 || window.width === 896)
  );
};

export const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const getStatusBarHeight = (safe) => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0
  });
};

export const requestSaveImagePermission = async (): Promise<boolean> => {
  const err = '下载图片失败，请稍后重试。';
  if (Platform.OS === 'android') {
    const camera = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (camera !== 'granted') {
      return Promise.reject(err);
    }
    const photo = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    if (photo !== 'granted') {
      return Promise.reject(err);
    }
    return Promise.resolve(true);
  } else {
    const camera = await request(PERMISSIONS.IOS.CAMERA);
    if (camera !== 'granted') {
      return Promise.reject(err);
    }
    return Promise.resolve(true);
  }
};

export const getRandomStringByTime = () => {
  return `${Date.now()}${Math.round(Math.random() * 100000)}`;
};

export const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

export const getOnlyWord = (str: string) => {
  const reg = /[`~!@#$%^&*()_+\-<>?:"{},./;'’[\]]/gi;
  return str.replace(reg, '');
};

export type NumberLike = string | number;

export const genRandomString = (len: number) => {
  const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rdmIndex = (txt: string) => (Math.random() * txt.length) | 0;
  let rdmString = '';
  for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
  return rdmString;
};

// export const requestWeiChatPay = async () => {
//   if (Platform.OS === 'ios') {
//     // fake for temporary
//     // WeChat.registerApp(AppConfig.WX_APP_ID, 'https://www.icst-edu.com/')
//     //   .then()
//     //   .catch((e) => util.log(e));
//     return false;
//   } else {
//     WeChat.registerApp(appConfig.WX_APP_ID, 'https://www.icst-edu.com/')
//       .then((res) => {
//         console.log(res);
//         return res;
//       })
//       .catch((err) => {
//         console.log(err);
//         return false;
//       });
//   }
// };

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if ((await check(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
    if ((await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)) !== 'granted') {
        return Promise.reject('操作需要相册权限');
      }
    }
  } else {
    if ((await check(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
  }
  return Promise.resolve(true);
};

export const requestAudioAndVideoPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if ((await check(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
    if ((await check(PERMISSIONS.ANDROID.RECORD_AUDIO)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.RECORD_AUDIO)) !== 'granted') {
        return Promise.reject('操作需要录音权限');
      }
    }
  } else {
    if ((await check(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
    if ((await check(PERMISSIONS.IOS.MICROPHONE)) !== 'granted') {
      if ((await request(PERMISSIONS.IOS.MICROPHONE)) !== 'granted') {
        return Promise.reject('操作需要录音权限');
      }
    }
  }
  return Promise.resolve(true);
};

export const getStorage = async (name): Promise<string | null> => {
  console.log(await AsyncStorage.getItem(name));
  return Promise.resolve(await AsyncStorage.getItem(name));
};
