import { MsgProto } from '../../../proto/MessageProto';

export const RIGHT_SIDEBAR_WIDTH_MIN = 220; // 右侧功能区最小宽度
export const RIGHT_SIDEBAR_WIDTH_MAX = 300; // 右侧功能区最大宽度
export const ONLINE_USER_AREA_HEIGHT_MIN = 80; // 底部在线用户区域高度最小值
export const ONLINE_USER_AREA_HEIGHT_MAX = 160; // 底部在线用户区域高度最大值
export const CONTROL_ICON_SIZE = 25; // 控制图标尺寸
export const AUDIO_PLAYER_HEIGHT_TEACHER = 60; // 音频播放器高度
export const AUDIO_PLAYER_HEIGHT_STUDENT = 20; // 音频播放器高度
export const EXERCISE_AREA_HEIGHT = 60; // 互动答题区域高度
export const MAX_IM_CHAT_LIST_SIZE = 50; // 聊天记录最大数量
export const PLAYER_REPORT_POS_INTERVAL = 10; // 播放器上报播放进度间隔(秒)

export const WEBSOCKET_MAX_RETRY_COUNT = 5; // 信令通讯中断重连最大次数
export const WEBSOCKET_HEART_CHECK_INTERVAL = 60; // 信令通讯心跳间隔
export const DEBUG_WEBSOCKET_IN_DEV_MODE = false; // 开发模式下是否开启调试日志

export const MAX_CAMERA_ZOOM_FACTOR = 5; // 摄像头最大放大倍数

export const AWARD_STEP_COUNT = 5; // 单次奖励步进星币数量
export const AWARD_MAX_COUNT = 30; // 单次奖励最大星币数量

export const EXERCISE_ANSWER_JOINER = ',';

/**
 * 视频配置：教师+学生 最大在线数 11
 * 小视频时：1(教师) * 640*480 + 10(学生) * 320*180 = 883200 < 921600(1280*720)
 * 大视频时：1(教师或者学生) * 1280*720
 * 屏幕共享时：1(教师) * 640*480 + 1(屏幕) * 960 * 540 = 825600 < 921600(1280*720)
 **/
export const MAX_PUSHING_COUNT = 10; // 同时在线音视频最大数量
export const MIN_VIDEO_WIDTH_STUDENT = 320; // 小视频初始宽度（学生）
export const MIN_VIDEO_HEIGHT_STUDENT = 180; // 小视频初始高度（学生）
export const MIN_VIDEO_WIDTH_TEACHER = 640; // 小视频初始宽度（教师）
export const MIN_VIDEO_HEIGHT_TEACHER = 480; // 小视频初始高度（教师）
export const MAX_VIDEO_WIDTH = 960; // 最大视频宽度
export const MAX_VIDEO_HEIGHT = 540; // 最大视频高度

export const MSG_ARRAY_TO_STRING_SPLITTER = ',';

export const CLASS_STATUS_CREATED = 1;
export const CLASS_STATUS_STARTED = 2;
export const CLASS_STATUS_FINISHED = 3;
export const CLASS_STATUS_COMPLETE = 4;
export const CLASS_STATUS_CANCELED = 9;

export interface DeviceStatus {
  pushingStatus: MsgProto.EnumPushingStatus;
  muteAudio: boolean;
}

export type AnswerCount = '1' | '2' | '3' | '4' | '5';

export interface HandleServerMsgParam {
  exitClassRoom: (string) => void;
  sendMsgToServer: (msg: MsgProto.Msg) => void;
  handleVersionCheck: (string) => void;
  zoomCameraByString: (string) => void;
  playerSeekAndPause: (pos: number, paused: boolean) => void;
}

export declare type PptDescription = {
  src: string;
  width: number;
  height: number;
  previewURL?: string;
};

export declare type SceneDefinition = {
  name?: string;
  ppt?: PptDescription;
};

export declare type AuthInfoType = {
  userType?: number;
  agoraId?: number;
  agoraShareId?: number;
  tokenAgora?: string;
  tokenAgoraShare?: string;
  tokenWhiteboard?: string;
  whiteboardUploadAccessKeyId?: string;
  whiteboardUploadAccessKeySecret?: string;
  whiteboardUploadBucket?: string;
  whiteboardUploadRegion?: string;
  agoraAppId?: string;
  roomVideoId?: string;
  roomWhiteboardId?: string;
};
