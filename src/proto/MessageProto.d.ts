import * as $protobuf from 'protobufjs';
/** Properties of a MsgProto. */
export interface IMsgProto {}

/** Represents a MsgProto. */
export class MsgProto implements IMsgProto {
  /**
   * Constructs a new MsgProto.
   * @param [properties] Properties to set
   */
  constructor(properties?: IMsgProto);

  /**
   * Creates a new MsgProto instance using the specified properties.
   * @param [properties] Properties to set
   * @returns MsgProto instance
   */
  public static create(properties?: IMsgProto): MsgProto;

  /**
   * Encodes the specified MsgProto message. Does not implicitly {@link MsgProto.verify|verify} messages.
   * @param message MsgProto message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(message: IMsgProto, writer?: $protobuf.Writer): $protobuf.Writer;

  /**
   * Encodes the specified MsgProto message, length delimited. Does not implicitly {@link MsgProto.verify|verify} messages.
   * @param message MsgProto message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(message: IMsgProto, writer?: $protobuf.Writer): $protobuf.Writer;

  /**
   * Decodes a MsgProto message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns MsgProto
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto;

  /**
   * Decodes a MsgProto message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns MsgProto
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto;

  /**
   * Verifies a MsgProto message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null;

  /**
   * Creates a MsgProto message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns MsgProto
   */
  public static fromObject(object: { [k: string]: any }): MsgProto;

  /**
   * Creates a plain object from a MsgProto message. Also converts values to other types if specified.
   * @param message MsgProto
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(message: MsgProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

  /**
   * Converts this MsgProto to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any };
}

export namespace MsgProto {
  /** Properties of a Msg. */
  interface IMsg {
    /** Msg version */
    version?: Uint8Array | null;

    /** Msg msgType */
    msgType?: MsgProto.EnumMsgType | null;

    /** Msg classRoomStatus */
    classRoomStatus?: MsgProto.EnumClassRoomStatus | null;

    /** Msg chatEnabled */
    chatEnabled?: boolean | null;

    /** Msg targetRoomId */
    targetRoomId?: Long | null;

    /** Msg targetGroupRoomIds */
    targetGroupRoomIds?: Long[] | null;

    /** Msg targetUserId */
    targetUserId?: Long | null;

    /** Msg targetGroupUserIds */
    targetGroupUserIds?: Long[] | null;

    /** Msg targetBool */
    targetBool?: boolean | null;

    /** Msg targetInt */
    targetInt?: number | null;

    /** Msg targetLong */
    targetLong?: Long | null;

    /** Msg targetBytes */
    targetBytes?: Uint8Array | null;

    /** Msg targetText */
    targetText?: string | null;

    /** Msg userInfoList */
    userInfoList?: MsgProto.IUserInfo[] | null;

    /** Msg userStatusList */
    userStatusList?: MsgProto.IUserStatus[] | null;

    /** Msg combinedInfo */
    combinedInfo?: MsgProto.ICombinedInfo | null;

    /** Msg pushingStatus */
    pushingStatus?: MsgProto.EnumPushingStatus | null;

    /** Msg mood */
    mood?: MsgProto.EnumMood | null;

    /** Msg chatInfo */
    chatInfo?: MsgProto.IChatInfo | null;

    /** Msg chatInfoList */
    chatInfoList?: MsgProto.IChatInfo[] | null;

    /** Msg mediaInfo */
    mediaInfo?: MsgProto.IMediaInfo | null;

    /** Msg exerciseInfo */
    exerciseInfo?: MsgProto.IExerciseInfo | null;

    /** Msg exerciseSubmitList */
    exerciseSubmitList?: MsgProto.IExerciseSubmit[] | null;
  }

  /** Represents a Msg. */
  class Msg implements IMsg {
    /**
     * Constructs a new Msg.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IMsg);

    /** Msg version. */
    public version: Uint8Array;

    /** Msg msgType. */
    public msgType: MsgProto.EnumMsgType;

    /** Msg classRoomStatus. */
    public classRoomStatus: MsgProto.EnumClassRoomStatus;

    /** Msg chatEnabled. */
    public chatEnabled: boolean;

    /** Msg targetRoomId. */
    public targetRoomId: Long;

    /** Msg targetGroupRoomIds. */
    public targetGroupRoomIds: Long[];

    /** Msg targetUserId. */
    public targetUserId: Long;

    /** Msg targetGroupUserIds. */
    public targetGroupUserIds: Long[];

    /** Msg targetBool. */
    public targetBool: boolean;

    /** Msg targetInt. */
    public targetInt: number;

    /** Msg targetLong. */
    public targetLong: Long;

    /** Msg targetBytes. */
    public targetBytes: Uint8Array;

    /** Msg targetText. */
    public targetText: string;

    /** Msg userInfoList. */
    public userInfoList: MsgProto.IUserInfo[];

    /** Msg userStatusList. */
    public userStatusList: MsgProto.IUserStatus[];

    /** Msg combinedInfo. */
    public combinedInfo?: MsgProto.ICombinedInfo | null;

    /** Msg pushingStatus. */
    public pushingStatus: MsgProto.EnumPushingStatus;

    /** Msg mood. */
    public mood: MsgProto.EnumMood;

    /** Msg chatInfo. */
    public chatInfo?: MsgProto.IChatInfo | null;

    /** Msg chatInfoList. */
    public chatInfoList: MsgProto.IChatInfo[];

    /** Msg mediaInfo. */
    public mediaInfo?: MsgProto.IMediaInfo | null;

    /** Msg exerciseInfo. */
    public exerciseInfo?: MsgProto.IExerciseInfo | null;

    /** Msg exerciseSubmitList. */
    public exerciseSubmitList: MsgProto.IExerciseSubmit[];

    /**
     * Creates a new Msg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Msg instance
     */
    public static create(properties?: MsgProto.IMsg): MsgProto.Msg;

    /**
     * Encodes the specified Msg message. Does not implicitly {@link MsgProto.Msg.verify|verify} messages.
     * @param message Msg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Msg message, length delimited. Does not implicitly {@link MsgProto.Msg.verify|verify} messages.
     * @param message Msg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Msg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Msg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.Msg;

    /**
     * Decodes a Msg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Msg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.Msg;

    /**
     * Verifies a Msg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Msg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Msg
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.Msg;

    /**
     * Creates a plain object from a Msg message. Also converts values to other types if specified.
     * @param message Msg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.Msg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Msg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** EnumMsgTarget enum. */
  enum EnumMsgTarget {
    MSG_TO_NONE = 0,
    MSG_TO_SENDER = 1,
    MSG_TO_TARGET = 2,
    MSG_TO_GROUP = 3,
    MSG_TO_ALL_EXCEPT_SENDER = 4,
    MSG_TO_ALL = 5,
    MSG_TO_ROOM_TARGET = 6,
    MSG_TO_ROOM_GROUP = 7,
    MSG_TO_ROOMS_ALL = 8,
    MSG_TO_ALL_ROOMS_DANGER = 99
  }

  /** EnumMsgType enum. */
  enum EnumMsgType {
    MSG_UNKNOWN = 0,
    MSG_PONG = 1,
    MSG_TO_ALL__USER_STATUS_PARTIAL = 11,
    MSG_TO_ALL__USER_STATUS = 12,
    MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL = 13,
    MSG_TO_ALL__START_CLASS = 14,
    MSG_TO_ALL__END_CLASS = 15,
    MSG_TO_ALL__REST = 16,
    MSG_TO_ALL__REST_CANCEL = 17,
    MSG_TO_ALL__TEACHER_SWITCH__USER_STATUS_PARTIAL = 31,
    MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL = 32,
    MSG_TO_ALL__LEARN_STATUS__USER_STATUS_PARTIAL = 33,
    MSG_TO_ALL__PUSHING_STATUS__USER_STATUS_PARTIAL = 34,
    MSG_TO_ALL__SHARING_STATUS__USER_STATUS_PARTIAL = 35,
    MSG_TO_ALL__MUTE_AUDIO__USER_STATUS_PARTIAL = 36,
    MSG_TO_ALL__FULLSCREEN__USER_STATUS_PARTIAL = 37,
    MSG_TO_ALL__WHITEBOARD__USER_STATUS_PARTIAL = 38,
    MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL = 39,
    MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL = 51,
    MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL = 52,
    MSG_TO_ALL__KICK_ALL_EXIT_ROOM = 53,
    MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL = 71,
    MSG_TO_ALL__AWARD_GROUP__USER_STATUS_PARTIAL = 72,
    MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL = 73,
    MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL = 74,
    MSG_TO_ALL__EXERCISE_OPEN = 101,
    MSG_TO_ALL__EXERCISE_CLOSE = 102,
    MSG_TO_ALL__EXERCISE_SUBMIT = 103,
    MSG_TO_ALL__IM_TEXT = 131,
    MSG_TO_ALL__IM_STATUS = 132,
    MSG_TO_ALL__MEDIA_OPEN = 161,
    MSG_TO_ALL__MEDIA_CLOSE = 162,
    MSG_TO_NONE__DUMMY = 201,
    MSG_TO_NONE__MEDIA_UPDATE_POSITION = 202,
    MSG_TO_NONE__KICK_PUSHING = 203,
    MSG_TO_NONE__UPDATE_USER_INFO = 204,
    MSG_TO_NONE__UPDATE_ALL_STATUS = 205,
    MSG_TO_SENDER__USER_STATUS_PARTIAL = 251,
    MSG_TO_SENDER__HANDSHAKE_SUCCESS = 252,
    MSG_TO_SENDER__ROOM_INFO = 253,
    MSG_TO_SENDER__USER_INFO = 254,
    MSG_TO_SENDER__USER_STATUS = 255,
    MSG_TO_SENDER__VERSION_CHECK = 256,
    MSG_TO_SENDER__KICK_BY_NOT_RIGHT_TIME = 257,
    MSG_TO_SENDER__KICK_BY_ROOM_FULL = 258,
    MSG_TO_TARGET__USER_STATUS_PARTIAL = 301,
    MSG_TO_TARGET__ZOOM_CAMERA = 302,
    MSG_TO_TARGET__KICK_EXIT_ROOM = 303,
    MSG_TO_TARGET__KICK_BY_LOGIN_EXPIRE = 304,
    MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM = 351,
    MSG_TO_ALL_EXCEPT_SENDER__MEDIA_CHANGE_POSITION = 401,
    MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE = 402,
    MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO = 403
  }

  /** EnumClassRoomStatus enum. */
  enum EnumClassRoomStatus {
    NOT_STARTED = 0,
    STARTING = 1,
    STARTED = 2,
    STARTED_REST = 3,
    ENDING = 98,
    END = 99
  }

  /** EnumUserType enum. */
  enum EnumUserType {
    UNKNOWN = 0,
    INSPECTOR = 1,
    TEACHER = 2,
    STUDENT = 3,
    TEACHER_BACKSTAGE = 4,
    ADMIN = 5
  }

  /** EnumPushingStatus enum. */
  enum EnumPushingStatus {
    PUSHING_NONE = 0,
    PUSHING_AUDIO = 1,
    PUSHING_FRONT = 2,
    PUSHING_BACK = 3
  }

  /** EnumMood enum. */
  enum EnumMood {
    ACTIVE = 0,
    HARDWORKING = 1,
    NORMAL = 2,
    WONDERING = 3
  }

  /** EnumDeviceType enum. */
  enum EnumDeviceType {
    UNKNOWN_DEVICE = 0,
    MOBILE_IOS = 1,
    MOBILE_ANDROID = 2,
    TABLET_IOS = 3,
    TABLET_ANDROID = 4,
    DESKTOP_WINDOWS = 5,
    DESKTOP_MAC = 6,
    WEB = 7
  }

  /** EnumMediaType enum. */
  enum EnumMediaType {
    AUDIO = 0,
    VIDEO = 1
  }

  /** EnumAwardType enum. */
  enum EnumAwardType {
    NONE = 0,
    SINGLE = 1,
    GROUP = 2,
    ONLINE = 3,
    ALL = 4
  }

  /** EnumCameraType enum. */
  enum EnumCameraType {
    FRONT = 0,
    BACK = 1
  }

  /** Properties of a UserInfo. */
  interface IUserInfo {
    /** UserInfo id */
    id?: Long | null;

    /** UserInfo name */
    name?: string | null;

    /** UserInfo avatar */
    avatar?: string | null;

    /** UserInfo agoraId */
    agoraId?: number | null;

    /** UserInfo agoraShareId */
    agoraShareId?: number | null;
  }

  /** Represents a UserInfo. */
  class UserInfo implements IUserInfo {
    /**
     * Constructs a new UserInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IUserInfo);

    /** UserInfo id. */
    public id: Long;

    /** UserInfo name. */
    public name: string;

    /** UserInfo avatar. */
    public avatar: string;

    /** UserInfo agoraId. */
    public agoraId: number;

    /** UserInfo agoraShareId. */
    public agoraShareId: number;

    /**
     * Creates a new UserInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UserInfo instance
     */
    public static create(properties?: MsgProto.IUserInfo): MsgProto.UserInfo;

    /**
     * Encodes the specified UserInfo message. Does not implicitly {@link MsgProto.UserInfo.verify|verify} messages.
     * @param message UserInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link MsgProto.UserInfo.verify|verify} messages.
     * @param message UserInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a UserInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UserInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.UserInfo;

    /**
     * Decodes a UserInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UserInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.UserInfo;

    /**
     * Verifies a UserInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UserInfo
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.UserInfo;

    /**
     * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
     * @param message UserInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.UserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UserInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of a UserStatus. */
  interface IUserStatus {
    /** UserStatus id */
    id?: Long | null;

    /** UserStatus userType */
    userType?: MsgProto.EnumUserType | null;

    /** UserStatus online */
    online?: boolean | null;

    /** UserStatus handsUp */
    handsUp?: boolean | null;

    /** UserStatus pushingStatus */
    pushingStatus?: MsgProto.EnumPushingStatus | null;

    /** UserStatus sharingScreen */
    sharingScreen?: boolean | null;

    /** UserStatus muteAudio */
    muteAudio?: boolean | null;

    /** UserStatus fullscreen */
    fullscreen?: boolean | null;

    /** UserStatus whiteBoard */
    whiteBoard?: boolean | null;

    /** UserStatus deviceType */
    deviceType?: MsgProto.EnumDeviceType | null;

    /** UserStatus group */
    group?: number | null;

    /** UserStatus medals */
    medals?: number | null;

    /** UserStatus mood */
    mood?: MsgProto.EnumMood | null;
  }

  /** Represents a UserStatus. */
  class UserStatus implements IUserStatus {
    /**
     * Constructs a new UserStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IUserStatus);

    /** UserStatus id. */
    public id: Long;

    /** UserStatus userType. */
    public userType: MsgProto.EnumUserType;

    /** UserStatus online. */
    public online: boolean;

    /** UserStatus handsUp. */
    public handsUp: boolean;

    /** UserStatus pushingStatus. */
    public pushingStatus: MsgProto.EnumPushingStatus;

    /** UserStatus sharingScreen. */
    public sharingScreen: boolean;

    /** UserStatus muteAudio. */
    public muteAudio: boolean;

    /** UserStatus fullscreen. */
    public fullscreen: boolean;

    /** UserStatus whiteBoard. */
    public whiteBoard: boolean;

    /** UserStatus deviceType. */
    public deviceType: MsgProto.EnumDeviceType;

    /** UserStatus group. */
    public group: number;

    /** UserStatus medals. */
    public medals: number;

    /** UserStatus mood. */
    public mood: MsgProto.EnumMood;

    /**
     * Creates a new UserStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UserStatus instance
     */
    public static create(properties?: MsgProto.IUserStatus): MsgProto.UserStatus;

    /**
     * Encodes the specified UserStatus message. Does not implicitly {@link MsgProto.UserStatus.verify|verify} messages.
     * @param message UserStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IUserStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified UserStatus message, length delimited. Does not implicitly {@link MsgProto.UserStatus.verify|verify} messages.
     * @param message UserStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IUserStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a UserStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UserStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.UserStatus;

    /**
     * Decodes a UserStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UserStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.UserStatus;

    /**
     * Verifies a UserStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a UserStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UserStatus
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.UserStatus;

    /**
     * Creates a plain object from a UserStatus message. Also converts values to other types if specified.
     * @param message UserStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.UserStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UserStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of a CombinedInfo. */
  interface ICombinedInfo {
    /** CombinedInfo audio */
    audio?: boolean | null;

    /** CombinedInfo video */
    video?: boolean | null;

    /** CombinedInfo whiteBoard */
    whiteBoard?: boolean | null;

    /** CombinedInfo fullScreen */
    fullScreen?: boolean | null;

    /** CombinedInfo cameraType */
    cameraType?: MsgProto.EnumCameraType | null;
  }

  /** Represents a CombinedInfo. */
  class CombinedInfo implements ICombinedInfo {
    /**
     * Constructs a new CombinedInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.ICombinedInfo);

    /** CombinedInfo audio. */
    public audio: boolean;

    /** CombinedInfo video. */
    public video: boolean;

    /** CombinedInfo whiteBoard. */
    public whiteBoard: boolean;

    /** CombinedInfo fullScreen. */
    public fullScreen: boolean;

    /** CombinedInfo cameraType. */
    public cameraType: MsgProto.EnumCameraType;

    /**
     * Creates a new CombinedInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CombinedInfo instance
     */
    public static create(properties?: MsgProto.ICombinedInfo): MsgProto.CombinedInfo;

    /**
     * Encodes the specified CombinedInfo message. Does not implicitly {@link MsgProto.CombinedInfo.verify|verify} messages.
     * @param message CombinedInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.ICombinedInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CombinedInfo message, length delimited. Does not implicitly {@link MsgProto.CombinedInfo.verify|verify} messages.
     * @param message CombinedInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.ICombinedInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CombinedInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CombinedInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.CombinedInfo;

    /**
     * Decodes a CombinedInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CombinedInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.CombinedInfo;

    /**
     * Verifies a CombinedInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CombinedInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CombinedInfo
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.CombinedInfo;

    /**
     * Creates a plain object from a CombinedInfo message. Also converts values to other types if specified.
     * @param message CombinedInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.CombinedInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CombinedInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of a ChatInfo. */
  interface IChatInfo {
    /** ChatInfo id */
    id?: Long | null;

    /** ChatInfo name */
    name?: string | null;

    /** ChatInfo timestamp */
    timestamp?: number | null;

    /** ChatInfo content */
    content?: string | null;
  }

  /** Represents a ChatInfo. */
  class ChatInfo implements IChatInfo {
    /**
     * Constructs a new ChatInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IChatInfo);

    /** ChatInfo id. */
    public id: Long;

    /** ChatInfo name. */
    public name: string;

    /** ChatInfo timestamp. */
    public timestamp: number;

    /** ChatInfo content. */
    public content: string;

    /**
     * Creates a new ChatInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ChatInfo instance
     */
    public static create(properties?: MsgProto.IChatInfo): MsgProto.ChatInfo;

    /**
     * Encodes the specified ChatInfo message. Does not implicitly {@link MsgProto.ChatInfo.verify|verify} messages.
     * @param message ChatInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IChatInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ChatInfo message, length delimited. Does not implicitly {@link MsgProto.ChatInfo.verify|verify} messages.
     * @param message ChatInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IChatInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ChatInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ChatInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.ChatInfo;

    /**
     * Decodes a ChatInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ChatInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.ChatInfo;

    /**
     * Verifies a ChatInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ChatInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ChatInfo
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.ChatInfo;

    /**
     * Creates a plain object from a ChatInfo message. Also converts values to other types if specified.
     * @param message ChatInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.ChatInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ChatInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of a MediaInfo. */
  interface IMediaInfo {
    /** MediaInfo type */
    type?: MsgProto.EnumMediaType | null;

    /** MediaInfo uri */
    uri?: string | null;

    /** MediaInfo position */
    position?: number | null;

    /** MediaInfo paused */
    paused?: boolean | null;

    /** MediaInfo mute */
    mute?: boolean | null;
  }

  /** Represents a MediaInfo. */
  class MediaInfo implements IMediaInfo {
    /**
     * Constructs a new MediaInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IMediaInfo);

    /** MediaInfo type. */
    public type: MsgProto.EnumMediaType;

    /** MediaInfo uri. */
    public uri: string;

    /** MediaInfo position. */
    public position: number;

    /** MediaInfo paused. */
    public paused: boolean;

    /** MediaInfo mute. */
    public mute: boolean;

    /**
     * Creates a new MediaInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MediaInfo instance
     */
    public static create(properties?: MsgProto.IMediaInfo): MsgProto.MediaInfo;

    /**
     * Encodes the specified MediaInfo message. Does not implicitly {@link MsgProto.MediaInfo.verify|verify} messages.
     * @param message MediaInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IMediaInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MediaInfo message, length delimited. Does not implicitly {@link MsgProto.MediaInfo.verify|verify} messages.
     * @param message MediaInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IMediaInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MediaInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MediaInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.MediaInfo;

    /**
     * Decodes a MediaInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MediaInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.MediaInfo;

    /**
     * Verifies a MediaInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MediaInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MediaInfo
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.MediaInfo;

    /**
     * Creates a plain object from a MediaInfo message. Also converts values to other types if specified.
     * @param message MediaInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.MediaInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MediaInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of an ExerciseSubmit. */
  interface IExerciseSubmit {
    /** ExerciseSubmit id */
    id?: Long | null;

    /** ExerciseSubmit answer */
    answer?: Uint8Array | null;
  }

  /** Represents an ExerciseSubmit. */
  class ExerciseSubmit implements IExerciseSubmit {
    /**
     * Constructs a new ExerciseSubmit.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IExerciseSubmit);

    /** ExerciseSubmit id. */
    public id: Long;

    /** ExerciseSubmit answer. */
    public answer: Uint8Array;

    /**
     * Creates a new ExerciseSubmit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ExerciseSubmit instance
     */
    public static create(properties?: MsgProto.IExerciseSubmit): MsgProto.ExerciseSubmit;

    /**
     * Encodes the specified ExerciseSubmit message. Does not implicitly {@link MsgProto.ExerciseSubmit.verify|verify} messages.
     * @param message ExerciseSubmit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IExerciseSubmit, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ExerciseSubmit message, length delimited. Does not implicitly {@link MsgProto.ExerciseSubmit.verify|verify} messages.
     * @param message ExerciseSubmit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IExerciseSubmit, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ExerciseSubmit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ExerciseSubmit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.ExerciseSubmit;

    /**
     * Decodes an ExerciseSubmit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ExerciseSubmit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.ExerciseSubmit;

    /**
     * Verifies an ExerciseSubmit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ExerciseSubmit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ExerciseSubmit
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.ExerciseSubmit;

    /**
     * Creates a plain object from an ExerciseSubmit message. Also converts values to other types if specified.
     * @param message ExerciseSubmit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.ExerciseSubmit, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ExerciseSubmit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of an ExerciseInfo. */
  interface IExerciseInfo {
    /** ExerciseInfo choiceCount */
    choiceCount?: number | null;

    /** ExerciseInfo answer */
    answer?: Uint8Array | null;
  }

  /** Represents an ExerciseInfo. */
  class ExerciseInfo implements IExerciseInfo {
    /**
     * Constructs a new ExerciseInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: MsgProto.IExerciseInfo);

    /** ExerciseInfo choiceCount. */
    public choiceCount: number;

    /** ExerciseInfo answer. */
    public answer: Uint8Array;

    /**
     * Creates a new ExerciseInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ExerciseInfo instance
     */
    public static create(properties?: MsgProto.IExerciseInfo): MsgProto.ExerciseInfo;

    /**
     * Encodes the specified ExerciseInfo message. Does not implicitly {@link MsgProto.ExerciseInfo.verify|verify} messages.
     * @param message ExerciseInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: MsgProto.IExerciseInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ExerciseInfo message, length delimited. Does not implicitly {@link MsgProto.ExerciseInfo.verify|verify} messages.
     * @param message ExerciseInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: MsgProto.IExerciseInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ExerciseInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ExerciseInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): MsgProto.ExerciseInfo;

    /**
     * Decodes an ExerciseInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ExerciseInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): MsgProto.ExerciseInfo;

    /**
     * Verifies an ExerciseInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ExerciseInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ExerciseInfo
     */
    public static fromObject(object: { [k: string]: any }): MsgProto.ExerciseInfo;

    /**
     * Creates a plain object from an ExerciseInfo message. Also converts values to other types if specified.
     * @param message ExerciseInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MsgProto.ExerciseInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ExerciseInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }
}
