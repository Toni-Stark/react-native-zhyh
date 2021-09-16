import { makeAutoObservable } from 'mobx';
import { MsgProto } from '../../../proto/MessageProto';
import { Api, ApiResult } from '../../../common/api';
import { AuthInfoType, DeviceStatus, EXERCISE_ANSWER_JOINER, HandleServerMsgParam, MAX_IM_CHAT_LIST_SIZE } from './Constant';
import { GetAnswerLetter, isPushingVideo, isValidPushingUser, Uint8ArrayToString } from './CommonFunction';
import { Player } from '@react-native-community/audio-toolkit';
import Long from 'long';

export type UserItem = Partial<MsgProto.IUserInfo> & Partial<MsgProto.IUserStatus>;
export type ChatItem = Partial<MsgProto.IChatInfo>;

export class RoomStore {
  public lessonName?: string = undefined;
  public scheduleName?: string = undefined;
  public planningStartTime?: string = undefined;
  public planningEndTime?: string = undefined;
  public actualStartTime?: string = undefined;
  public actualStopTime?: string = undefined;

  public connected: boolean = false;
  public userItemList: UserItem[] = [];
  public roomStatus: MsgProto.EnumClassRoomStatus = MsgProto.EnumClassRoomStatus.NOT_STARTED;
  public chatEnabled: boolean = false;
  public chatItemList: ChatItem[] = [];
  public agoraPushingUserSet: Set<number> = new Set<number>();
  public mediaInfo?: MsgProto.IMediaInfo | null = undefined;
  public exerciseInfo?: MsgProto.IExerciseInfo | null = undefined;
  public exerciseSubmitList: MsgProto.IExerciseSubmit[] = [];

  public roomId?: string = undefined;
  public myId?: string = undefined;
  public initialMedals: number | undefined = undefined;
  public initialMediaPlayer: boolean = false;

  public authInfo?: AuthInfoType = undefined;

  constructor(roomId?: string, userId?: string) {
    makeAutoObservable(this);
    this.roomId = roomId;
    this.myId = userId;
  }

  public get getTeacher(): UserItem | undefined {
    return this.userItemList.find((u) => u.userType === MsgProto.EnumUserType.TEACHER);
  }

  public get getTeacherId(): Long | undefined {
    const teacher = this.getTeacher;
    return teacher?.id ? teacher.id : undefined;
  }

  public get getMyUserType(): MsgProto.EnumUserType {
    return this.getLocalDevice?.userType || MsgProto.EnumUserType.UNKNOWN;
  }

  public get isTeacher(): boolean {
    return this.getMyUserType === MsgProto.EnumUserType.TEACHER;
  }

  public get isTeacherBackstage(): boolean {
    return this.getMyUserType === MsgProto.EnumUserType.TEACHER_BACKSTAGE;
  }

  public get isInspector(): boolean {
    return this.getMyUserType === MsgProto.EnumUserType.INSPECTOR;
  }

  public get isStudent(): boolean {
    return this.getMyUserType === MsgProto.EnumUserType.STUDENT;
  }

  public get getLocalDevice(): UserItem | undefined {
    return this.userItemList.find((u) => u.id?.toString() === this.myId);
  }

  public get getLocalDeviceStatus(): DeviceStatus {
    const device = this.getLocalDevice;
    return { pushingStatus: device?.pushingStatus || MsgProto.EnumPushingStatus.PUSHING_NONE, muteAudio: !!device?.muteAudio };
  }

  public get getLocalDeviceMedals(): number {
    const device = this.getLocalDevice;
    return Number(device?.medals);
  }

  public get getIsLocalDeviceWhiteBoard(): boolean {
    return this.userItemList.some((u) => u.id?.toString() === this.myId && u.whiteBoard);
  }

  public get getIsFullScreen(): boolean {
    return this.userItemList.some((u) => u.fullscreen);
  }

  public get getOnlineStudents(): UserItem[] {
    return this.userItemList.filter((u) => u.online && u.userType === MsgProto.EnumUserType.STUDENT).slice();
  }

  public get getOfflineStudents(): UserItem[] {
    return this.userItemList.filter((u) => !u.online && u.userType === MsgProto.EnumUserType.STUDENT).slice();
  }

  public get getRemoteOnlyAudioList(): UserItem[] {
    return this.userItemList
      .filter(
        (u) => u.online && u.id?.toString() !== this.myId && u.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_AUDIO && isValidPushingUser(u.userType)
      )
      .slice();
  }

  public get getRemoteVideoList(): UserItem[] {
    return this.userItemList
      .filter((u) => u.online && u.id?.toString() !== this.myId && isPushingVideo(u.pushingStatus) && isValidPushingUser(u.userType))
      .slice();
  }

  public get getOnlineRemoteVideoList(): UserItem[] {
    return this.userItemList
      .filter((u) => u.online && u.id?.toString() !== this.myId && isPushingVideo(u.pushingStatus) && isValidPushingUser(u.userType))
      .slice();
  }

  public get getStudentVideoList(): UserItem[] {
    const students = this.userItemList.filter((u) => u.userType === MsgProto.EnumUserType.STUDENT && isPushingVideo(u.pushingStatus)).slice();
    const myIndex = students.findIndex((u) => u.id?.toString() === this.myId?.toString());
    if (myIndex !== -1) {
      const me = students.splice(myIndex, 1)[0];
      students.splice(Math.floor(students.length / 2), 0, me);
    }
    return students;
  }

  public get getValidRemoteAudioList(): number[] {
    const remoteList = this.getRemoteOnlyAudioList;
    return remoteList.filter((u) => this.agoraPushingUserSet.has(Number(u.agoraId))).map((u) => Number(u.agoraId));
  }

  public get getValidRemoteAgoraIdList(): number[] {
    const validAudioList = this.getRemoteOnlyAudioList.map((u) => Number(u.agoraId));
    let validVideoList: number[] = [];
    const teacher = this.getTeacher;
    if (this.getIsSharingScreen) {
      // 屏幕共享时，只允许教师头像和屏幕共享
      validVideoList = [Number(teacher?.agoraId), Number(teacher?.agoraShareId)];
    } else if (this.getFullScreenUser) {
      // 全屏时，只允许教师和全屏用户
      if (teacher?.online && isPushingVideo(teacher?.pushingStatus)) {
        validVideoList.push(Number(teacher?.agoraId));
      }
      if (teacher?.agoraId !== Number(this.getFullScreenUser.agoraId)) {
        validVideoList.push(Number(this.getFullScreenUser.agoraId));
      }
    } else {
      validVideoList = this.getOnlineRemoteVideoList.map((u) => Number(u.agoraId));
    }
    return [...validAudioList, ...validVideoList];
  }

  public get getInValidRemoteAgoraIdList(): number[] {
    const validIdList = this.getValidRemoteAgoraIdList;
    return this.getPushingAgoraUsers.filter((u) => u !== this.authInfo?.agoraId && !validIdList.some((v) => v === u)).slice();
  }

  public get getFullScreenUser(): UserItem | undefined {
    return this.userItemList.find((u) => u.fullscreen);
  }

  public get getIsSharingScreen(): boolean {
    return this.userItemList.some((u) => u.userType === MsgProto.EnumUserType.TEACHER && u.sharingScreen);
  }

  public get getLocalDeviceNeedUpgradeVideoResolution(): boolean {
    return this.userItemList.some((u) => u.id?.toString() === this.myId && u.fullscreen);
  }

  public get getMyHandsUpStatus(): boolean {
    return !!this.userItemList.find((u) => u.id?.toString() === this.myId)?.handsUp;
  }

  public get getMyAudioMuteStatus(): boolean {
    const localDevice = this.getLocalDevice;
    return localDevice?.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_NONE ? true : Boolean(localDevice?.muteAudio);
  }

  public get getHaveChatMsg(): boolean {
    return this.chatItemList.length > 0;
  }

  public get getExerciseSubmitCount(): number {
    if (this.exerciseSubmitList) {
      return this.exerciseSubmitList.length;
    } else {
      return 0;
    }
  }

  public get getExerciseIsRightCount(): number {
    if (this.exerciseInfo?.answer) {
      const rightAnswer = Uint8ArrayToString(this.exerciseInfo.answer);
      return this.exerciseSubmitList.filter((e) => Uint8ArrayToString(e.answer) === rightAnswer).length;
    } else {
      return 0;
    }
  }

  public get getExerciseIsWrongCount(): number {
    return this.exerciseSubmitList.length - this.getExerciseIsRightCount;
  }

  public get getExerciseAccuracy(): number {
    const result = Math.round((this.getExerciseIsRightCount * 100) / this.getExerciseSubmitCount);
    if (isNaN(result)) {
      return 0;
    } else {
      return result;
    }
  }

  public get getRightAnswer(): string | undefined {
    if (this.exerciseInfo?.answer) {
      return Uint8ArrayToString(this.exerciseInfo?.answer)
        .split(EXERCISE_ANSWER_JOINER)
        .map((a) => GetAnswerLetter(Number(a)))
        .join(EXERCISE_ANSWER_JOINER);
    } else {
      return undefined;
    }
  }

  public get getMyAnswer(): string | undefined {
    const answer = this.exerciseSubmitList.find((s) => s.id && s.id.toString() === this.myId);
    if (answer) {
      return Uint8ArrayToString(answer.answer)
        .split(EXERCISE_ANSWER_JOINER)
        .map((a) => GetAnswerLetter(Number(a)))
        .join(EXERCISE_ANSWER_JOINER);
    } else {
      return undefined;
    }
  }

  public get getPushingAgoraUsers(): number[] {
    return Array.from(this.agoraPushingUserSet);
  }

  public handleAgoraUserPushingChange(id: number, online: boolean) {
    if (online) {
      this.agoraPushingUserSet.add(id);
    } else {
      this.agoraPushingUserSet.delete(id);
    }
  }

  public handleAgoraExit() {
    this.agoraPushingUserSet.clear();
  }

  public handleServerMsg(msg: MsgProto.Msg, handler: HandleServerMsgParam) {
    const msgToServer = MsgProto.Msg.create();
    switch (msg.msgType) {
      case MsgProto.EnumMsgType.MSG_UNKNOWN:
        break;
      case MsgProto.EnumMsgType.MSG_PONG:
        if (this.roomStatus === MsgProto.EnumClassRoomStatus.STARTED && this.userItemList.some((u) => !u.agoraId || u.agoraId === 0)) {
          msgToServer.msgType = MsgProto.EnumMsgType.MSG_TO_NONE__UPDATE_USER_INFO;
          handler.sendMsgToServer(msgToServer);
        }
        this.updateUserListStatus(msg.userStatusList);
        this.roomStatus = msg.classRoomStatus;
        this.chatEnabled = msg.chatEnabled;
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__USER_STATUS:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL:
        this.updateUserOnlineStatus(msg.userInfoList[0], msg.userStatusList[0]);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__START_CLASS:
        this.roomStatus = msg.classRoomStatus;
        this.buildAuthInfo(String(this.roomId))
          .then(() => {
            msgToServer.msgType = MsgProto.EnumMsgType.MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO;
            handler.sendMsgToServer(msgToServer);
          })
          .catch((e) => handler.exitClassRoom(e));
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__END_CLASS:
        handler.exitClassRoom('本次课堂已结束');
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__REST:
        this.roomStatus = msg.classRoomStatus;
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__REST_CANCEL:
        this.roomStatus = msg.classRoomStatus;
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__TEACHER_SWITCH__USER_STATUS_PARTIAL:
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        if (this.authInfo?.userType === MsgProto.EnumUserType.TEACHER) {
          if (msg.userStatusList.some((u) => u.handsUp)) {
            new Player('hands_up.mp3').play();
          }
        }
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__LEARN_STATUS__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__PUSHING_STATUS__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__SHARING_STATUS__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__MUTE_AUDIO__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__FULLSCREEN__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__WHITEBOARD__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__KICK_ALL_EXIT_ROOM:
        handler.exitClassRoom('您已退出教室，如有疑问，请再返回教室');
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_GROUP__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__EXERCISE_OPEN:
        this.exerciseInfo = msg.exerciseInfo;
        this.exerciseSubmitList = [];
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__EXERCISE_CLOSE:
        this.exerciseInfo = undefined;
        this.exerciseSubmitList = [];
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__EXERCISE_SUBMIT:
        msg.exerciseSubmitList.forEach((s) => {
          if (!this.exerciseSubmitList.some((is) => is.id === s.id)) {
            this.exerciseSubmitList.push(s);
          }
        });
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__IM_TEXT:
        const chat: ChatItem = { ...msg.chatInfo };
        this.chatItemList.unshift(chat);
        if (this.chatItemList.length > MAX_IM_CHAT_LIST_SIZE) {
          this.chatItemList.pop();
        }
        this.chatItemList = [...this.chatItemList];
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__IM_STATUS:
        this.chatEnabled = msg.targetBool;
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__MEDIA_OPEN:
        this.mediaInfo = msg.mediaInfo;
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL__MEDIA_CLOSE:
        this.mediaInfo = undefined;
        break;
      case MsgProto.EnumMsgType.MSG_TO_NONE__DUMMY:
        break;
      case MsgProto.EnumMsgType.MSG_TO_NONE__MEDIA_UPDATE_POSITION:
        break;
      case MsgProto.EnumMsgType.MSG_TO_NONE__KICK_PUSHING:
        break;
      case MsgProto.EnumMsgType.MSG_TO_NONE__UPDATE_USER_INFO:
        this.updateUserListStatus(msg.userInfoList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_NONE__UPDATE_ALL_STATUS:
        this.roomStatus = msg.classRoomStatus;
        this.chatEnabled = msg.chatEnabled;
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__HANDSHAKE_SUCCESS:
        this.roomStatus = msg.classRoomStatus;
        this.chatEnabled = msg.chatEnabled;
        this.reBuildUserList(msg.userInfoList, msg.userStatusList);
        this.chatItemList = msg.chatInfoList;
        this.mediaInfo = msg.mediaInfo;
        this.exerciseInfo = msg.exerciseInfo;
        this.exerciseSubmitList = [...msg.exerciseSubmitList];
        this.connected = true;
        this.initialMedals = this.getLocalDeviceMedals;
        this.initialMediaPlayer = false;

        handler.handleVersionCheck(Uint8ArrayToString(msg.version));
        // 检查课堂状态
        if (msg.classRoomStatus === MsgProto.EnumClassRoomStatus.END) {
          handler.exitClassRoom('课堂已结束');
        }
        // 通过版本检查，通知服务器准备上线
        msgToServer.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL;
        msgToServer.targetBool = true;
        handler.sendMsgToServer(msgToServer);
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__ROOM_INFO:
        this.roomStatus = msg.classRoomStatus;
        this.mediaInfo = msg.mediaInfo;
        this.exerciseInfo = msg.exerciseInfo;
        this.chatEnabled = msg.chatEnabled;
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__USER_INFO:
        this.reBuildUserList(msg.userInfoList, msg.userStatusList);
        this.roomStatus = msg.classRoomStatus;
        this.mediaInfo = msg.mediaInfo;
        this.exerciseInfo = msg.exerciseInfo;
        this.chatEnabled = msg.chatEnabled;
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__USER_STATUS:
        this.updateUserListStatus(msg.userStatusList);
        this.roomStatus = msg.classRoomStatus;
        this.chatEnabled = msg.chatEnabled;
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__VERSION_CHECK:
        handler.handleVersionCheck(Uint8ArrayToString(msg.version));
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__KICK_BY_NOT_RIGHT_TIME:
        handler.exitClassRoom('时间未到，不能进入教室');
        break;
      case MsgProto.EnumMsgType.MSG_TO_SENDER__KICK_BY_ROOM_FULL:
        handler.exitClassRoom('房间人数已满');
        break;
      case MsgProto.EnumMsgType.MSG_TO_TARGET__USER_STATUS_PARTIAL:
        this.updateUserListStatus(msg.userStatusList);
        break;
      case MsgProto.EnumMsgType.MSG_TO_TARGET__ZOOM_CAMERA:
        handler.zoomCameraByString(Uint8ArrayToString(msg.targetBytes));
        break;
      case MsgProto.EnumMsgType.MSG_TO_TARGET__KICK_EXIT_ROOM:
        handler.exitClassRoom('您已退出教室，如有疑问，请再返回教室');
        break;
      case MsgProto.EnumMsgType.MSG_TO_TARGET__KICK_BY_LOGIN_EXPIRE:
        handler.exitClassRoom('您的账号已在其他地方登陆');
        break;
      case MsgProto.EnumMsgType.MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM:
        if (this.getMyUserType === MsgProto.EnumUserType.STUDENT) {
          handler.exitClassRoom('您已退出教室，如有疑问，请再返回教室');
        }
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL_EXCEPT_SENDER__MEDIA_CHANGE_POSITION:
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE:
        handler.playerSeekAndPause(msg.targetInt, msg.targetBool);
        break;
      case MsgProto.EnumMsgType.MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO:
        this.updateUserListStatus(msg.userInfoList);
        break;
      default:
        break;
    }
  }

  public async validateOnlineClassAuth(roomId: string, password: string = ''): Promise<void> {
    const params = {
      scheduleLiveId: roomId,
      password
    };
    const res: ApiResult = await Api.getInstance.post({ url: 'education/schedule-live/validate-auth', params });
    if (res.success) {
      this.authInfo = res.result;
      return Promise.resolve();
    } else {
      return Promise.reject(res.message);
    }
  }

  public async getOnlineClassInfo(roomId: string): Promise<string | undefined> {
    const res: ApiResult = await Api.getInstance.get({ url: `education/schedule-live/${roomId}/detail` });
    if (res.success) {
      this.scheduleName = res.result.name;
      this.planningStartTime = res.result.planningStartTime;
      this.planningEndTime = res.result.planningEndTime;
      this.actualStartTime = res.result.actualStartTime;
      this.actualStopTime = res.result.actualStopTime;
      this.lessonName = res.result.lesson.name;
      return Promise.resolve(this.actualStartTime);
    } else {
      return Promise.reject(res.message);
    }
  }

  public async startClass(roomId: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.post({ url: `education/schedule-live/start-class?scheduleId=${roomId}` });
    if (res.success) {
      this.roomStatus = MsgProto.EnumClassRoomStatus.STARTING;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  public async endClass(roomId: string): Promise<void> {
    const res: ApiResult = await Api.getInstance.post({ url: `education/schedule-live/end-class?scheduleId=${roomId}` });
    if (res.success) {
      return Promise.resolve();
    } else {
      return Promise.reject(res.message);
    }
  }

  public async buildAuthInfo(roomId: string): Promise<void> {
    const res: ApiResult = await Api.getInstance.post({ url: `education/schedule-live/generate-auth-id-and-token?scheduleId=${roomId}` });
    if (res.success) {
      this.authInfo = res.result;
      return Promise.resolve();
    } else {
      return Promise.reject(res.message);
    }
  }

  public async requestInsertDocumentIntoWhiteboard(ossFileId: string, whiteboardRoomUuid: string): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.post({
      url: 'resource/oss-file/request-insert-document-into-whiteboard',
      params: {
        ossFileId: ossFileId,
        whiteboardRoomUuid: whiteboardRoomUuid
      }
    });
    if (res.success) {
      return Promise.resolve(res.result?.waiting);
    } else {
      return Promise.reject(res);
    }
  }

  private handleBoolUpdate(column: string, id: string, value: boolean) {
    for (const u of this.userItemList) {
      if (u.id?.toString() === id) {
        u[column] = value;
        break;
      }
    }
  }

  private reBuildUserList(userInfoList: MsgProto.IUserInfo[], userStatusList: MsgProto.IUserStatus[]) {
    const list: UserItem[] = [];
    userInfoList.forEach((u) => list.push(this.transToUserItem(u, userStatusList)));
    this.userItemList = [...list];
  }

  private updateUserOnlineStatus(userInfo: MsgProto.IUserInfo, userStatus: MsgProto.IUserStatus) {
    if (!this.userItemList.some((u) => u.id?.toString() === userInfo.id?.toString())) {
      this.userItemList.push(this.transToUserItem(userInfo, [userStatus]));
    } else {
      this.updateUserListStatus([userStatus]);
    }
  }

  private updateUserListStatus(userList: UserItem[]) {
    let needUpdate = false;
    for (let i = 0; i < this.userItemList.length; i++) {
      const u = this.userItemList[i];
      const newStatus = userList.find((s) => s.id?.toString() === u.id?.toString());
      if (newStatus && RoomStore.statusChanged(u, newStatus)) {
        needUpdate = true;
        break;
      }
    }
    if (needUpdate) {
      const list: UserItem[] = [];
      this.userItemList.forEach((u) =>
        list.push(
          RoomStore.updateUserItem(
            u,
            userList.find((s) => s.id?.toString() === u.id?.toString())
          )
        )
      );
      this.userItemList = [...list];
    }
  }

  private transToUserItem(userInfo: MsgProto.IUserInfo, userStatusList: MsgProto.IUserStatus[]): UserItem {
    const user: UserItem = {};
    for (const prop in userInfo) {
      if (prop !== 'toJSON') {
        user[prop] = userInfo[prop];
      }
    }
    const s = userStatusList.find((ui) => ui.id?.toString() === userInfo.id?.toString());
    if (s) {
      for (const prop in s) {
        if (prop !== 'toJSON') {
          user[prop] = s[prop];
        }
      }
    }
    return user;
  }

  private static statusChanged(userItem: UserItem, userStatus: MsgProto.IUserStatus) {
    for (const prop in userStatus) {
      if (prop !== 'toJSON' && prop !== 'id') {
        if (userItem[prop] !== userStatus[prop]) {
          return true;
        }
      }
    }
    return false;
  }

  private static updateUserItem(userItem: UserItem, userStatus: MsgProto.IUserStatus | undefined): UserItem {
    if (userStatus) {
      for (const prop in userStatus) {
        if (prop !== 'toJSON') {
          userItem[prop] = userStatus[prop];
        }
      }
    }
    return userItem;
  }
}
