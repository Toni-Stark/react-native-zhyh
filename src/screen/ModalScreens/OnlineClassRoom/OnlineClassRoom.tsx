import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NavigatorComponentProps, TopTabStack } from '../../index';
import { ActivityIndicator, Avatar, Button, Checkbox, Dialog, Modal, RadioButton, Snackbar, Switch, Text, useTheme } from 'react-native-paper';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { color as twColor, tw } from 'react-native-tailwindcss';
import { MsgProto } from '../../../proto/MessageProto';
import { TransitionPresets } from '@react-navigation/stack';
import { Alert, BackHandler, Dimensions, FlatList, Platform, StatusBar, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useDimensions } from '@react-native-community/hooks';
import {
  AUDIO_PLAYER_HEIGHT_STUDENT,
  AUDIO_PLAYER_HEIGHT_TEACHER,
  AWARD_MAX_COUNT,
  AWARD_STEP_COUNT,
  CONTROL_ICON_SIZE,
  DEBUG_WEBSOCKET_IN_DEV_MODE,
  DeviceStatus,
  EXERCISE_ANSWER_JOINER,
  EXERCISE_AREA_HEIGHT,
  MAX_CAMERA_ZOOM_FACTOR,
  MAX_VIDEO_HEIGHT,
  MAX_VIDEO_WIDTH,
  MIN_VIDEO_HEIGHT_STUDENT,
  MIN_VIDEO_HEIGHT_TEACHER,
  MIN_VIDEO_WIDTH_STUDENT,
  MIN_VIDEO_WIDTH_TEACHER,
  MSG_ARRAY_TO_STRING_SPLITTER,
  ONLINE_USER_AREA_HEIGHT_MAX,
  ONLINE_USER_AREA_HEIGHT_MIN,
  PLAYER_REPORT_POS_INTERVAL,
  RIGHT_SIDEBAR_WIDTH_MAX,
  RIGHT_SIDEBAR_WIDTH_MIN,
  WEBSOCKET_HEART_CHECK_INTERVAL,
  WEBSOCKET_MAX_RETRY_COUNT
} from './Constant';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../store';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import StarView from './StarView';
import { throttle } from '../../../common/tools';
import { ConvertFromPushingStatus, GetAnswerLetter, GetFirstLetter, isPushingVideo, StringToUint8Array, VersionValid } from './CommonFunction';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../../CardScreens';
import { UserStore } from '../../../store/UserStore';
import { ChatItem, RoomStore, UserItem } from './RoomStore';
import { SERVER_WEBSOCKET_URL, SERVER_WHITEBOARD_URL } from '../../../common/app.config';
import DeviceInfo from 'react-native-device-info';
import IdleTimerManager from 'react-native-idle-timer';
import RtcEngine, {
  AudioProfile,
  AudioScenario,
  BitRate,
  CameraCaptureOutputPreference,
  CameraDirection,
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  RtcStats,
  VideoFrameRate,
  VideoOutputOrientationMode,
  VideoRenderMode
} from 'react-native-agora';
import moment from 'moment';
import { observer, Observer } from 'mobx-react-lite';
import Long from 'long';
import { CloseEvent, ErrorEvent, Event } from 'reconnecting-websocket/events';
import WebView from 'react-native-webview';
import SyncVideoPlayer from './SyncVideoPlayer';
import { Chase } from 'react-native-animated-spinkit';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { ErrorCode } from 'react-native-agora/src/common/Enums';
import { NetStatus } from './NetStatus';
import { FileType } from '../NetdiskResources/CloudSeaDiskStore';

type ScreenRouteProp = RouteProp<ScreensParamList, 'OnlineClassRoom'>;
type Props = {
  route: ScreenRouteProp;
  pathName: string;
};

export const OnlineClassRoom: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const { userStore, cloudSeaDiskStore } = useStore();

    const [roomStore] = useState(() => new RoomStore(route.params.roomId.toString(), userStore.userInfoDetail.id));

    const widthQuarter = useDimensions().window.width / 4;
    const heightOneOfEight = useDimensions().window.height / 8;
    const [rightSideBarWidth, setRightSideBarWidth] = useState(RIGHT_SIDEBAR_WIDTH_MIN);
    const [bottomOnlineUserAreaHeight, setBottomOnlineUserAreaHeight] = useState(ONLINE_USER_AREA_HEIGHT_MIN);
    const [mainArea, setMainArea] = useState({ width: 0, height: 0 });

    const [token, setToken] = useState<string>();
    const [rtcEngine, setRtcEngine] = useState<RtcEngine>();
    const [hideRightSideBar, setHideRightSideBar] = useState<boolean>(false);
    const [userAgent, setUserAgent] = useState<string>();
    const [cameraZoomFactor, setCameraZoomFactor] = useState<number>(1);
    const [editing, setEditing] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserItem>();
    const [selectedUserCamera, setSelectedUserCamera] = useState<MsgProto.EnumCameraType>(MsgProto.EnumCameraType.FRONT);
    const [chatContent, setChatContent] = useState<string>('');
    const [showMessage, setShowMessage] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [whiteboardConnected, setWhiteboardConnected] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string>();
    const [joinAgoraSuccess, setJoinAgoraSuccess] = useState<boolean>(false);
    const [timeCounting, setTimeCounting] = useState<string>();
    const [exitingClassRoom, setExitingClassRoom] = useState<boolean>(false);
    const cameraZoom = useRef<number[]>([]);

    const [showChangeStatusDialog, setShowChangeStatusDialog] = useState<boolean>(false);
    const [awardType, setAwardType] = useState<MsgProto.EnumAwardType>(MsgProto.EnumAwardType.NONE);
    const [showGroupAwardDialog, setShowGroupAwardDialog] = useState<boolean>(false);
    const [showGroupControlDialog, setShowGroupControlDialog] = useState<boolean>(false);
    const [showExercisesDialog, setShowExerciseDialog] = useState<boolean>(false);
    const [enableAudioStatus, setEnableAudioStatus] = useState<boolean>(false);
    const [enableVideoStatus, setEnableVideoStatus] = useState<boolean>(false);
    const [enableFullScreenStatus, setEnableFullScreenStatus] = useState<boolean>(false);
    const [enableWhiteBoardStatus, setEnableWhiteBoardStatus] = useState<boolean>(false);
    const [showAwardCountModal, setShowWardCountModal] = useState<boolean>(false);
    const [awardCount, setAwardCount] = useState<number>(AWARD_STEP_COUNT);
    const [playerReady, setPlayerReady] = useState<boolean>(false);

    const [teacherAnswerCount, setTeacherAnswerCount] = useState<number>(1);
    const [teacherAnswer, setTeacherAnswer] = useState<string>('');
    const [studentAnswer, setStudentAnswer] = useState<string>('');

    const widthThanHeight = Dimensions.get('window').width > Dimensions.get('window').height;
    const websocketRef = useRef<ReconnectingWebSocket>();
    const exitClassRoomRef = useRef<any>();
    const sendMsgToServerRef = useRef<any>();
    const handleVersionCheckRef = useRef<any>();
    const zoomCameraByStringRef = useRef<any>();
    const playerSeekAndPauseRef = useRef<any>();

    const imInputRef = useRef<TextInput | null>();
    const webViewRef = useRef<any>();
    const websocketHeartCheckRef = useRef<any>();
    const star = useRef<any>();
    const chatListRef = useRef<any>();
    const timeTickerRef = useRef<any>();
    const playerRef = useRef<any>();
    const websocketResetCounterRef = useRef<number>(0);

    // >>>>>>>>>>>>>>>>>>>> 函数区域 >>>>>>>>>>>>>>>>>>>>
    const calculateFactor = useCallback(
      (scale: number): number => {
        const newFactor = cameraZoomFactor * scale;
        if (newFactor > MAX_CAMERA_ZOOM_FACTOR) {
          return MAX_CAMERA_ZOOM_FACTOR;
        } else if (newFactor < 1) {
          return 1;
        } else {
          return Number(newFactor.toFixed(0));
        }
      },
      [cameraZoomFactor]
    );

    const zoomCameraByString = useCallback(
      (factorString: string) => {
        if (rtcEngine && rtcEngine.isCameraZoomSupported()) {
          factorString
            .split(MSG_ARRAY_TO_STRING_SPLITTER)
            .map((f) => Number(f))
            .filter((f) => f > 0)
            .forEach((f) => {
              rtcEngine.setCameraZoomFactor(Number(f.toFixed(0)));
            });
        }
      },
      [rtcEngine]
    );
    zoomCameraByStringRef.current = zoomCameraByString;

    const enableLocalPushing = useCallback(
      (value: boolean) => {
        if (rtcEngine) {
          (async () => await rtcEngine.setClientRole(value ? ClientRole.Broadcaster : ClientRole.Audience))();
          roomStore.handleAgoraUserPushingChange(Number(roomStore.authInfo?.agoraId), value);
          console.log(`[RtcEngine] user(${userStore.userInfoDetail.username}) setClientRole(${value ? 'Broadcaster' : 'Audience'})`);
        }
      },
      [roomStore, rtcEngine, userStore.userInfoDetail.username]
    );

    const muteAudio = useCallback(
      (mute: boolean) => {
        if (rtcEngine) {
          (async () => await rtcEngine.muteLocalAudioStream(mute))();
          console.log(`[RtcEngine] user(${userStore.userInfoDetail.username}) muteLocalAudioStream(${mute})`);
        }
      },
      [rtcEngine, userStore.userInfoDetail.username]
    );

    const muteVideo = useCallback(
      (mute: boolean) => {
        if (rtcEngine) {
          (async () => await rtcEngine.muteLocalVideoStream(mute))();
          console.log(`[RtcEngine] user(${userStore.userInfoDetail.username}) muteLocalVideoStream(${mute})`);
        }
      },
      [rtcEngine, userStore.userInfoDetail.username]
    );

    const adjustLocalDevice = useCallback(
      (deviceStatus: DeviceStatus) => {
        if (rtcEngine && joinAgoraSuccess) {
          if (deviceStatus.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_NONE) {
            enableLocalPushing(false);
            muteVideo(true);
            muteVideo(true);
          } else if (deviceStatus.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_AUDIO) {
            enableLocalPushing(true);
            muteAudio(deviceStatus.muteAudio);
            muteVideo(true);
          } else if (
            deviceStatus.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_FRONT ||
            deviceStatus.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_BACK
          ) {
            // 此处必须先设置enableLocalPushing，来设置好角色，再设置音视频设备才能生效
            enableLocalPushing(true);
            muteAudio(deviceStatus.muteAudio);
            muteVideo(false);
            switch (deviceStatus.pushingStatus) {
              case MsgProto.EnumPushingStatus.PUSHING_FRONT:
                (async () =>
                  await rtcEngine.setCameraCapturerConfiguration({
                    preference: CameraCaptureOutputPreference.Auto,
                    cameraDirection: CameraDirection.Front
                  }))();
                break;
              case MsgProto.EnumPushingStatus.PUSHING_BACK:
                (async () =>
                  await rtcEngine.setCameraCapturerConfiguration({
                    preference: CameraCaptureOutputPreference.Auto,
                    cameraDirection: CameraDirection.Rear
                  }))();
                break;
              default:
                break;
            }
          }
        }
      },
      [enableLocalPushing, joinAgoraSuccess, muteAudio, muteVideo, rtcEngine]
    );

    const shutDownRtcEngine = useCallback(() => {
      if (rtcEngine) {
        console.log(`[RtcEngine] user(${userStore.userInfoDetail.username}) shutDownRtcEngine`);
        rtcEngine.muteLocalAudioStream(true);
        rtcEngine.muteLocalVideoStream(true);
        rtcEngine.muteAllRemoteAudioStreams(true);
        rtcEngine.muteAllRemoteVideoStreams(true);
        rtcEngine.enableLocalAudio(false);
        rtcEngine.enableLocalVideo(false);
        rtcEngine.leaveChannel();
        rtcEngine.destroy();
        roomStore.handleAgoraExit();
        setRtcEngine(undefined);
      }
    }, [roomStore, rtcEngine, userStore.userInfoDetail.username]);

    const shutDownWhiteboard = useCallback(() => {
      console.log(`[Whiteboard] ${userStore.userInfoDetail.username} ready release Whiteboard`);
      webViewRef.current?.injectJavaScript(`
          if (window.netlessRoom) {
            window.netlessRoom.release();
          }
          true;
        `);
      // 等待Webview执行命令
      setTimeout(() => setWhiteboardConnected(false), 500);
    }, [userStore.userInfoDetail.username]);

    // 退出房间
    const exitClassRoom = useCallback(
      (msg: string = '') => {
        setExitingClassRoom(true);
        websocketRef.current?.close();
        websocketRef.current = undefined;
        shutDownRtcEngine();
        shutDownWhiteboard();
        // hack for release whiteboard
        setTimeout(() => {
          setUserAgent(''); // hack for unload WebView
          userStore.isOnClassRoom = false;
          navigation.navigate(route.params.pathName, { message: msg });
        }, 500);
      },
      [navigation, route.params.pathName, shutDownRtcEngine, shutDownWhiteboard, userStore]
    );
    exitClassRoomRef.current = exitClassRoom;

    const handleVersionCheck = useCallback(
      (version: string) => {
        if (VersionValid(version)) {
          if (!websocketHeartCheckRef.current) {
            websocketHeartCheckRef.current = setInterval(() => websocketRef.current?.send('ping'), 1000 * WEBSOCKET_HEART_CHECK_INTERVAL);
          }
        } else {
          exitClassRoom('您的App版本太低，请更新后再进入教室');
        }
      },
      [exitClassRoom]
    );
    handleVersionCheckRef.current = handleVersionCheck;

    const sendMsgToServer = useCallback((msg: MsgProto.Msg) => {
      console.log('[Msg] 发送消息到信令服务器:', msg);
      websocketRef.current?.send(MsgProto.Msg.encode(msg).finish());
    }, []);
    sendMsgToServerRef.current = sendMsgToServer;

    const playerSeekAndPause = useCallback((pos: number, pause: boolean) => {
      playerRef.current?.seekAndPause(pos, pause);
    }, []);
    playerSeekAndPauseRef.current = playerSeekAndPause;

    const startClass = useCallback(() => {
      Alert.alert(
        '确认操作',
        `是否确认开始上课`,
        [
          {
            text: '确认',
            onPress: () => {
              roomStore
                .startClass(route.params.roomId.toString())
                .then(() => {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__START_CLASS;
                  sendMsgToServer(msg);
                })
                .catch((e) => {
                  setToastMessage(e);
                  setShowMessage(e);
                });
            }
          },
          {
            text: '取消',
            style: 'cancel'
          }
        ],
        {
          cancelable: true
        }
      );
    }, [roomStore, route.params.roomId, sendMsgToServer]);

    const endClass = useCallback(() => {
      Alert.alert(
        '确认操作',
        `下课后所有人将不能再进入教室上课，是否确认下课？`,
        [
          {
            text: '确认',
            onPress: () => {
              if (roomStore.isTeacher) {
                roomStore
                  .endClass(String(route.params.roomId))
                  .then(() => {
                    roomStore.roomStatus = MsgProto.EnumClassRoomStatus.ENDING;
                    const msg = MsgProto.Msg.create();
                    msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__END_CLASS;
                    sendMsgToServer(msg);
                  })
                  .catch((e) => {
                    console.log('下课发生错误:', e);
                    exitClassRoom('请求下课发生异常，请再次尝试下课');
                  });
              }
            }
          },
          {
            text: '取消',
            style: 'cancel'
          }
        ],
        {
          cancelable: true
        }
      );
    }, [exitClassRoom, roomStore, route.params.roomId, sendMsgToServer]);
    // <<<<<<<<<<<<<<<<<<<< 函数区域 <<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>> useEffect区域 >>>>>>>>>>>>>>>>>>>>
    // 计算右边栏宽度
    useLayoutEffect(() => {
      if (widthQuarter < RIGHT_SIDEBAR_WIDTH_MIN) {
        setRightSideBarWidth(RIGHT_SIDEBAR_WIDTH_MIN);
      } else if (widthQuarter > RIGHT_SIDEBAR_WIDTH_MAX) {
        setRightSideBarWidth(RIGHT_SIDEBAR_WIDTH_MAX);
      } else {
        setRightSideBarWidth(widthQuarter);
      }
    }, [widthQuarter]);

    // 计算下边栏高度
    useLayoutEffect(() => {
      if (heightOneOfEight < ONLINE_USER_AREA_HEIGHT_MIN) {
        setBottomOnlineUserAreaHeight(ONLINE_USER_AREA_HEIGHT_MIN);
      } else if (heightOneOfEight > ONLINE_USER_AREA_HEIGHT_MAX) {
        setBottomOnlineUserAreaHeight(ONLINE_USER_AREA_HEIGHT_MAX);
      } else {
        setBottomOnlineUserAreaHeight(heightOneOfEight);
      }
    }, [heightOneOfEight]);

    // 禁用Android返回键
    useEffect(() => {
      const handleAndroidBack = () => {
        return true;
      };
      if (Platform.OS === 'android') {
        try {
          BackHandler.addEventListener('hardwareBackPress', handleAndroidBack);
        } catch (err) {
          console.log('禁用Android返回键错误:', err);
        }
      }
      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener('hardwareBackPress', handleAndroidBack);
        }
      };
    }, []);

    const fixRNDimensions = (orientation: OrientationType) => {
      const windowDim = Dimensions.get('window');
      const screenDim = Dimensions.get('screen');
      if ((orientation.match(/LANDSCAPE/i) && windowDim.width < windowDim.height) || (orientation.match(/PORTRAIT/i) && windowDim.width > windowDim.height)) {
        console.log('fixing dimensions after rotation', windowDim);
        Dimensions.set({
          screen: {
            ...screenDim,
            width: screenDim.height,
            height: screenDim.width
          },
          window: {
            ...windowDim,
            width: windowDim.height,
            height: windowDim.width
          }
        });
      }
    };
    const lockToLandscape = (orientation: OrientationType) => {
      if (orientation !== 'LANDSCAPE-LEFT' && orientation !== 'LANDSCAPE-RIGHT') {
        Orientation.lockToLandscape();
      }
    };

    // 调整窗口载入效果，设置强制横屏，退出时注销所有操作和设置
    useLayoutEffect(() => {
      navigation.setOptions({
        ...TransitionPresets.ScaleFromCenterAndroid,
        gestureEnabled: false
      });

      StatusBar.setHidden(true, 'fade');
      Orientation.lockToLandscape();
      Orientation.addOrientationListener(fixRNDimensions);
      Orientation.addOrientationListener(lockToLandscape);

      return () => {
        StatusBar.setHidden(false, 'fade');
        // if (widthThanHeight) {
        //   Orientation.removeOrientationListener(fixRNDimensions);
        // }
        Orientation.removeOrientationListener(lockToLandscape);
        Orientation.lockToPortrait();
      };
    }, [navigation]);

    useEffect(() => {
      return () => {
        if (widthThanHeight) {
          Orientation.removeOrientationListener(fixRNDimensions);
        }
      };
    }, [widthThanHeight]);

    // 获取浏览器Agent，设置禁用屏幕锁定
    useEffect(() => {
      DeviceInfo.getUserAgent().then((agent) => {
        setUserAgent(agent);
      });
      IdleTimerManager.setIdleTimerDisabled(true);
      return () => {
        IdleTimerManager.setIdleTimerDisabled(false);
      };
    }, []);

    // 初始化媒体播放器
    useEffect(() => {
      if (playerReady && playerRef.current && !roomStore.initialMediaPlayer) {
        roomStore.initialMediaPlayer = true;
        const position = roomStore.mediaInfo?.position;
        playerRef.current.seekAndPause((position ? position : 0) + PLAYER_REPORT_POS_INTERVAL / 2, roomStore.mediaInfo?.paused);
      }
    }, [playerReady, roomStore, roomStore.initialMediaPlayer, roomStore.mediaInfo?.paused, roomStore.mediaInfo?.position]);

    // 获取本地令牌
    useEffect(() => {
      if (!token) {
        UserStore.getToken()
          .then((t) => {
            if (t) {
              setToken(t);
            } else {
              exitClassRoom('登陆失效，请重新登录');
            }
          })
          .catch(() => exitClassRoom('登陆失效，请重新登录'));
      }
    }, [exitClassRoom, token]);

    useEffect(() => {
      if (token && userStore.userInfoDetail.username && !exitingClassRoom && !roomStore.authInfo) {
        roomStore
          .validateOnlineClassAuth(route.params.roomId.toString(), route.params.password)
          .then(() => {
            console.log('获取认证信息成功');
          })
          .catch((e) => exitClassRoom(e));
      }
    }, [exitClassRoom, exitingClassRoom, roomStore, route.params.password, route.params.roomId, token, userStore.userInfoDetail.username]);

    // 连接信令服务器
    useEffect(() => {
      if (token && !websocketRef.current && userStore.userInfoDetail.username && !exitingClassRoom && roomStore.authInfo) {
        setAuthToken(token);
        const rws = new ReconnectingWebSocket(`${SERVER_WEBSOCKET_URL}?roomId=${route.params.roomId}&token=${token}`, [], {
          debug: __DEV__ ? DEBUG_WEBSOCKET_IN_DEV_MODE : false,
          maxRetries: WEBSOCKET_MAX_RETRY_COUNT
        });
        websocketRef.current = rws;
        rws.binaryType = 'arraybuffer';
        rws.addEventListener('open', (event: Event) => {
          console.log('[WebSocket] 与信令服务器建立连接:', event);
        });
        rws.addEventListener('message', (event) => {
          try {
            const msg = MsgProto.Msg.decode(new Uint8Array(event.data));
            console.log('[Msg] 收到服务端消息:', msg);
            // 必须强制采用引用类型，保证函数调用正确性
            roomStore.handleServerMsg(msg, {
              exitClassRoom: exitClassRoomRef.current,
              sendMsgToServer: sendMsgToServerRef.current,
              handleVersionCheck: handleVersionCheckRef.current,
              zoomCameraByString: zoomCameraByStringRef.current,
              playerSeekAndPause: playerSeekAndPauseRef.current
            });
          } catch (e) {
            console.log('[WebSocket] 解码信令数据错误：', e);
            exitClassRoomRef.current('与信令服务器连接发生错误，请检查网络再做尝试');
          }
        });
        rws.addEventListener('error', (event: ErrorEvent) => {
          console.log('[WebSocket] 与信令服务器连接发生错误:', event);
          if (event.message?.includes('401')) {
            exitClassRoomRef.current('身份认证失败');
          }
        });
        rws.addEventListener('close', (event: CloseEvent) => {
          console.log('[WebSocket] 与信令服务器断开连接:', event);
          if (event.target._retryCount >= WEBSOCKET_MAX_RETRY_COUNT && !exitingClassRoom) {
            exitClassRoomRef.current('与信令服务器连接发生错误');
          }
        });
      }
    }, [
      exitClassRoom,
      exitingClassRoom,
      roomStore,
      roomStore.authInfo,
      route.params.roomId,
      token,
      userStore.userInfoDetail.id,
      userStore.userInfoDetail.username
    ]);

    // 请求课程信息，获取房间状态
    useEffect(() => {
      if (roomStore.connected && !roomStore.lessonName) {
        roomStore
          .getOnlineClassInfo(route.params.roomId.toString())
          .then((actualStartTime) => {
            if (actualStartTime && !roomStore.authInfo?.agoraId) {
              roomStore.buildAuthInfo(route.params.roomId.toString()).then(() => {
                const msg = MsgProto.Msg.create();
                msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO;
                sendMsgToServer(msg);
              });
            }
          })
          .catch((e) => exitClassRoom(e));
      }
    }, [exitClassRoom, roomStore, roomStore.connected, roomStore.lessonName, roomStore.authInfo?.agoraId, route.params.roomId, sendMsgToServer]);

    // 对上课时间进行计时
    useEffect(() => {
      const updateTimeTicker = () => {
        setTimeCounting('已上课' + moment().diff(moment(roomStore.actualStartTime), 'minute').toString() + '分');
      };
      if (roomStore.roomStatus !== MsgProto.EnumClassRoomStatus.NOT_STARTED && roomStore.actualStartTime && !timeTickerRef.current) {
        updateTimeTicker();
        timeTickerRef.current = setInterval(() => updateTimeTicker(), 1000 * 60);
      }
      return () => {
        if (timeTickerRef.current) {
          clearInterval(timeTickerRef.current);
          timeTickerRef.current = undefined;
        }
      };
    }, [roomStore.actualStartTime, roomStore.roomStatus, timeTickerRef]);

    // 跟随本机状态变化，调整音视频状态
    useEffect(() => {
      adjustLocalDevice(roomStore.getLocalDeviceStatus);
    }, [adjustLocalDevice, roomStore.getLocalDeviceStatus]);

    // 调整本机视频分辨率
    useEffect(() => {
      if (rtcEngine) {
        const needUpgrade = roomStore.getLocalDeviceNeedUpgradeVideoResolution;
        const width = needUpgrade ? MAX_VIDEO_WIDTH : userStore.isTeacher ? MIN_VIDEO_WIDTH_TEACHER : MIN_VIDEO_WIDTH_STUDENT;
        const height = needUpgrade ? MAX_VIDEO_HEIGHT : userStore.isTeacher ? MIN_VIDEO_HEIGHT_TEACHER : MIN_VIDEO_HEIGHT_STUDENT;
        console.log(`[RtcEngine] ${userStore.userInfoDetail.username} adjust video config: ${width}x${height}`);
        rtcEngine.setVideoEncoderConfiguration({
          dimensions: { width, height },
          frameRate: VideoFrameRate.Fps15,
          bitrate: BitRate.Standard,
          orientationMode: VideoOutputOrientationMode.Adaptative
        });
      }
    }, [roomStore.getLocalDeviceNeedUpgradeVideoResolution, rtcEngine, userStore.isTeacher, userStore.userInfoDetail.username]);

    // 初始化音视频引擎
    useEffect(() => {
      if (
        !exitingClassRoom &&
        !rtcEngine &&
        roomStore.roomStatus === MsgProto.EnumClassRoomStatus.STARTED &&
        roomStore.authInfo?.agoraAppId &&
        roomStore.authInfo?.roomVideoId &&
        roomStore.authInfo?.agoraId &&
        roomStore.authInfo?.tokenAgora
      ) {
        console.log(`[RtcEngine] ${userStore.userInfoDetail.username} initializing RtcEngine ...`);
        RtcEngine.create(String(roomStore.authInfo?.agoraAppId)).then((engine) => {
          engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
          // 此处统一先设置为观众，考虑到助教或者其他没有上讲台的教师可能在教师，不能让所有教师都为主播模式
          engine.setClientRole(ClientRole.Audience);
          engine.setVideoEncoderConfiguration({
            dimensions: {
              width: userStore.isTeacher ? MIN_VIDEO_WIDTH_TEACHER : MIN_VIDEO_WIDTH_STUDENT,
              height: userStore.isTeacher ? MIN_VIDEO_HEIGHT_TEACHER : MIN_VIDEO_HEIGHT_STUDENT
            },
            frameRate: VideoFrameRate.Fps15,
            bitrate: BitRate.Standard,
            orientationMode: VideoOutputOrientationMode.Adaptative
          });
          engine.setAudioProfile(AudioProfile.MusicStandard, AudioScenario.Education);
          engine.addListener('JoinChannelSuccess', async (channel: string, uid: number, elapsed: number) => {
            console.log(
              `[RtcEngine] ${userStore.userInfoDetail.username} (${uid}) JoinChannelSuccess ${roomStore.authInfo?.roomVideoId} Success, elapsed: ${elapsed}`
            );
            setJoinAgoraSuccess(true);
            roomStore.handleAgoraUserPushingChange(uid, true);
          });
          engine.addListener('LeaveChannel', (stats: RtcStats) => {
            console.log(`[RtcEngine] ${userStore.userInfoDetail.username} LeaveChannel ${roomStore.authInfo?.roomVideoId}, stats: ${JSON.stringify(stats)}`);
          });
          engine.addListener('UserJoined', (id: number, elapsed: number) => {
            console.log(`[RtcEngine] ${userStore.userInfoDetail.username} UserJoined: uid ${id}, elapsed ${elapsed}`);
            roomStore.handleAgoraUserPushingChange(id, true);
          });
          engine.addListener('UserOffline', (id: number, elapsed: number) => {
            console.log(`[RtcEngine] ${userStore.userInfoDetail.username} UserOffline: uid ${id}, elapsed ${elapsed}`);
            roomStore.handleAgoraUserPushingChange(id, false);
          });
          engine.addListener('Error', (err: ErrorCode) => {
            console.log(`[RtcEngine] ${userStore.userInfoDetail.username} Error`, err);
          });
          engine.addListener('ConnectionLost', () => {
            exitClassRoomRef.current('与服务器断开连接，请检查网络');
          });
          engine.addListener('RtcStats', () => {
            if (!websocketRef.current || websocketRef.current?.readyState !== ReconnectingWebSocket.OPEN) {
              if (websocketResetCounterRef.current > WEBSOCKET_MAX_RETRY_COUNT) {
                exitClassRoomRef.current('与信令服务器连接发生错误');
              } else {
                websocketResetCounterRef.current = websocketResetCounterRef.current + 1;
              }
            } else {
              websocketResetCounterRef.current = 0;
            }
          });
          engine.enableAudio();
          engine.enableVideo();
          engine
            .joinChannel(roomStore.authInfo?.tokenAgora, String(roomStore.authInfo?.roomVideoId), null, Number(roomStore.authInfo?.agoraId))
            .then(() => {
              setRtcEngine(engine);
              console.log(`[RtcEngine] ${userStore.userInfoDetail.username} init RtcEngine and Join Channel Success !`);
            })
            .catch(() => exitClassRoomRef.current('连接音视频服务器失败，请稍后重试'));
        });
      }
    }, [
      exitClassRoom,
      roomStore,
      roomStore.roomStatus,
      roomStore.authInfo?.agoraAppId,
      roomStore.authInfo?.roomVideoId,
      roomStore.authInfo?.agoraId,
      roomStore.authInfo?.tokenAgora,
      rtcEngine,
      userStore.isTeacher,
      userStore.userInfoDetail.username,
      exitingClassRoom
    ]);

    // 在不用声网时，断开连接
    useEffect(() => {
      if (roomStore.roomStatus !== MsgProto.EnumClassRoomStatus.STARTED && rtcEngine) {
        shutDownRtcEngine();
      }
    }, [roomStore.roomStatus, rtcEngine, shutDownRtcEngine]);

    // 在不用白板时，断开连接
    useEffect(() => {
      if (whiteboardConnected) {
        if (
          roomStore.roomStatus !== MsgProto.EnumClassRoomStatus.STARTED ||
          roomStore.getIsFullScreen ||
          roomStore.getIsSharingScreen ||
          (roomStore.mediaInfo?.uri && roomStore.mediaInfo?.type === MsgProto.EnumMediaType.VIDEO)
        ) {
          shutDownWhiteboard();
        }
      }
    }, [
      roomStore.getIsFullScreen,
      roomStore.getIsSharingScreen,
      roomStore.mediaInfo?.type,
      roomStore.mediaInfo?.uri,
      roomStore.roomStatus,
      shutDownWhiteboard,
      whiteboardConnected
    ]);

    // 调整开启和禁用音视频流
    useEffect(() => {
      if (rtcEngine) {
        const validIdList = roomStore.getValidRemoteAgoraIdList;
        const inValidIdList = roomStore.getInValidRemoteAgoraIdList;
        validIdList.forEach((id) => {
          rtcEngine.muteRemoteAudioStream(id, false);
          rtcEngine.muteRemoteVideoStream(id, false);
        });
        inValidIdList.forEach((id) => {
          rtcEngine.muteRemoteAudioStream(id, true);
          rtcEngine.muteRemoteVideoStream(id, true);
        });
        if (validIdList.length > 0) {
          console.log(`[RtcEngine] ${userStore.userInfoDetail.username} open Audio/Video -> ${validIdList.join(',')}`);
        }
        if (inValidIdList.length > 0) {
          console.log(`[RtcEngine] ${userStore.userInfoDetail.username} mute Audio/Video -> ${inValidIdList.join(',')}`);
        }
      }
    }, [roomStore.getValidRemoteAgoraIdList, roomStore.getInValidRemoteAgoraIdList, rtcEngine, userStore.userInfoDetail.username]);

    // 获得奖牌时调用动画
    useEffect(() => {
      if (roomStore.initialMedals !== undefined && roomStore.getLocalDeviceMedals > roomStore.initialMedals) {
        star.current?.animate();
      }
    }, [roomStore.initialMedals, roomStore.getLocalDeviceMedals]);

    // 改变白板角色
    useEffect(() => {
      if (webViewRef.current && whiteboardConnected) {
        console.log(`[Whiteboard] ${userStore.userInfoDetail.username} Change Whiteboard Role`);
        webViewRef.current.injectJavaScript(`
          if (window.netlessRoom) {
            const result = window.netlessRoom.changeRole(${roomStore.getIsLocalDeviceWhiteBoard});
            window.ReactNativeWebView.postMessage(result);
          }
          true;
        `);
      }
    }, [roomStore.getIsLocalDeviceWhiteBoard, userStore.userInfoDetail.username, whiteboardConnected]);

    useEffect(() => {
      if (cloudSeaDiskStore.classSelectInfo) {
        let msg: MsgProto.Msg;
        switch (cloudSeaDiskStore.classSelectInfo?.type) {
          case FileType.AUDIO:
          case FileType.VIDEO:
            msg = MsgProto.Msg.create();
            msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__MEDIA_OPEN;
            msg.targetBytes = StringToUint8Array(cloudSeaDiskStore.classSelectInfo?.resourceId);
            sendMsgToServer(msg);
            break;
          case FileType.WORD:
          case FileType.PDF:
          case FileType.PPT:
            if (roomStore.authInfo?.roomWhiteboardId) {
              roomStore
                .requestInsertDocumentIntoWhiteboard(cloudSeaDiskStore.classSelectInfo?.resourceId as string, roomStore.authInfo?.roomWhiteboardId)
                .then((res) => {
                  if (res) {
                    setToastMessage('文档正在转码中，需要较长时间(页数较多可能需要数分钟)，请耐心等待...');
                    setShowMessage(true);
                  }
                })
                .catch((e) => console.log(e));
            }
            break;
          default:
            console.log(`[OssFile] 暂时不处理该类型的文件[${cloudSeaDiskStore.classSelectInfo?.type}]`);
        }
        // cloudSeaDiskStore.classSelectInfo = undefined;
      }
    }, [cloudSeaDiskStore, cloudSeaDiskStore.classSelectInfo, roomStore, sendMsgToServer]);
    // <<<<<<<<<<<<<<<<<<<< useEffect区域 <<<<<<<<<<<<<<<<<<<<

    const handleSelectUser = useCallback(
      (user: UserItem | undefined) => {
        if (user && roomStore.isTeacher) {
          setSelectedUser(user);
          setEnableAudioStatus(user?.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_NONE ? false : !user.muteAudio);
          setEnableVideoStatus(isPushingVideo(user.pushingStatus));
          setEnableWhiteBoardStatus(!!user.whiteBoard);
          setEnableFullScreenStatus(!!user.fullscreen);
          setSelectedUserCamera(ConvertFromPushingStatus(user.pushingStatus));
          setShowChangeStatusDialog(true);
        }
      },
      [roomStore.isTeacher]
    );

    const rawLocalView = useCallback((sharingScreen: boolean, key: string, width: number, height: number, maximum: boolean = false) => {
      return (
        <RtcLocalView.SurfaceView
          key={key}
          style={{
            backgroundColor: twColor.gray900,
            width: maximum ? '100%' : width,
            height: maximum ? '100%' : height
          }}
          zOrderMediaOverlay={maximum || (width > 0 && height > 0)}
          renderMode={sharingScreen ? VideoRenderMode.Fit : VideoRenderMode.Hidden}
        />
      );
    }, []);

    const rawRemoteView = useCallback(
      (sharingScreen: boolean, channelId: string, uid: number, key: string, width: number, height: number, maximum: boolean = false) => {
        return (
          <RtcRemoteView.SurfaceView
            key={key}
            style={{
              backgroundColor: twColor.gray900,
              width: maximum ? '100%' : width,
              height: maximum ? '100%' : height
            }}
            channelId={channelId}
            uid={uid}
            zOrderMediaOverlay={maximum || (width > 0 && height > 0)}
            renderMode={sharingScreen ? VideoRenderMode.Fit : VideoRenderMode.Hidden}
          />
        );
      },
      []
    );

    const renderRemoteAudioList = useCallback(() => {
      return roomStore.getValidRemoteAudioList.map((id) => rawRemoteView(false, String(roomStore.authInfo?.roomVideoId), id, `live-audio-${id}`, 0, 0));
    }, [rawRemoteView, roomStore.authInfo?.roomVideoId, roomStore.getValidRemoteAudioList]);

    const handleOnPinchHandlerStateChange = useCallback(
      (scale: number, isLocal: boolean) => {
        const factor = calculateFactor(scale);
        cameraZoom.current.push(scale);
        if (isLocal && rtcEngine && rtcEngine.isCameraZoomSupported()) {
          console.log(factor);
          rtcEngine.setCameraZoomFactor(factor);
        }
      },
      [calculateFactor, rtcEngine]
    );

    const handleStateChange = useCallback(
      (scale: number, isLocal: boolean, userId: Long | undefined | null) => {
        if (isLocal) {
          setCameraZoomFactor(calculateFactor(scale));
        } else if (userId && cameraZoom.current.length > 0) {
          if (cameraZoom.current.length > 10) {
            cameraZoom.current.splice(5, cameraZoom.current.length - 10);
          }
          const data: string = Array.from(new Set(cameraZoom.current.map((d) => d.toFixed(0)))).join(MSG_ARRAY_TO_STRING_SPLITTER);
          const msg = MsgProto.Msg.create();
          msg.msgType = MsgProto.EnumMsgType.MSG_TO_TARGET__ZOOM_CAMERA;
          msg.targetUserId = userId;
          msg.targetBytes = StringToUint8Array(data);
          sendMsgToServer(msg);
        }
        cameraZoom.current = [];
      },
      [calculateFactor, sendMsgToServer]
    );

    const renderLiveVideo = useCallback(
      (user: UserItem | undefined, isSharingScreen: boolean, width: number, height: number, maximum: boolean = false, renderEmpty: boolean = false) => {
        const renderRawVideo = () => {
          const iconSize = maximum ? CONTROL_ICON_SIZE * 3 : width / 3;
          if (user?.online && !exitingClassRoom) {
            if (rtcEngine && !renderEmpty) {
              if (isPushingVideo(user.pushingStatus) || isSharingScreen) {
                if (user.id?.toString() === roomStore.myId?.toString()) {
                  // 本地视频
                  if (roomStore.isTeacher && maximum) {
                    return (
                      <PinchGestureHandler
                        onGestureEvent={(event) => handleOnPinchHandlerStateChange(event.nativeEvent.scale, true)}
                        onHandlerStateChange={(event) => handleStateChange(event.nativeEvent.scale, true, user?.id)}
                      >
                        {rawLocalView(isSharingScreen, `raw-local-${user.id?.toString()}`, width, height, maximum)}
                      </PinchGestureHandler>
                    );
                  } else {
                    return rawLocalView(isSharingScreen, `raw-local-${user.id?.toString()}`, width, height, maximum);
                  }
                } else {
                  if (roomStore.getPushingAgoraUsers.some((u) => u === (isSharingScreen ? user.agoraShareId : user.agoraId))) {
                    // 远端视频
                    if (roomStore.isTeacher && maximum) {
                      return (
                        <PinchGestureHandler
                          onGestureEvent={(event) => handleOnPinchHandlerStateChange(event.nativeEvent.scale, false)}
                          onHandlerStateChange={(event) => handleStateChange(event.nativeEvent.scale, false, user?.id)}
                        >
                          {rawRemoteView(
                            isSharingScreen,
                            String(roomStore.authInfo?.roomVideoId),
                            Number(isSharingScreen ? user.agoraShareId : user.agoraId),
                            `raw-remote-${user.id?.toString()}`,
                            width,
                            height,
                            maximum
                          )}
                        </PinchGestureHandler>
                      );
                    } else {
                      return rawRemoteView(
                        isSharingScreen,
                        String(roomStore.authInfo?.roomVideoId),
                        Number(isSharingScreen ? user.agoraShareId : user.agoraId),
                        `raw-remote-${user.id?.toString()}`,
                        width,
                        height,
                        maximum
                      );
                    }
                  } else {
                    // 用户没连上声网
                    return <Icon size={iconSize} name="voice-over-off" color={twColor.green600} />;
                  }
                }
              } else if (user.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_AUDIO) {
                // 用户仅仅开启音频，没开启视频
                return <Icon size={iconSize} name="record-voice-over" color={twColor.green600} />;
              } else {
                // 没开音频和视频
                return <Icon size={iconSize} name="record-voice-over" color={twColor.green600} />;
              }
            } else {
              // 用户在线，但是没初始化音视频
              return <Icon size={iconSize} name="person" color={twColor.green600} />;
            }
          } else {
            // 用户离线
            return <Icon size={iconSize} name="person" color={twColor.gray800} />;
          }
        };
        const position = Math.round(maximum ? 6 : width / 30);
        const isMicOff = () => {
          return (
            user?.muteAudio ||
            user?.pushingStatus === undefined ||
            user?.pushingStatus === null ||
            user?.pushingStatus === MsgProto.EnumPushingStatus.PUSHING_NONE
          );
        };
        const isVideoCamOff = () => {
          return user?.pushingStatus !== MsgProto.EnumPushingStatus.PUSHING_FRONT && user?.pushingStatus !== MsgProto.EnumPushingStatus.PUSHING_BACK;
        };
        return (
          <Observer>
            {() => (
              <View
                key={`live-video-${user?.id?.toString()}`}
                style={[
                  tw.bgGray900,
                  tw.justifyCenter,
                  tw.itemsCenter,
                  tw.overflowHidden,
                  maximum
                    ? {
                        display: 'flex',
                        flex: 1
                      }
                    : {
                        width,
                        height
                      }
                ]}
              >
                {renderRawVideo()}
                <View style={[tw.absolute, { top: position, left: position }]}>
                  <Text style={[{ color: twColor.gray400, fontSize: 10 }]}>{user?.name}</Text>
                </View>
                <View style={[tw.absolute, tw.flexRow, { bottom: position, right: position }]}>
                  <Icon name={isMicOff() ? 'mic-off' : 'mic'} size={CONTROL_ICON_SIZE / 2} color={isMicOff() ? twColor.gray400 : twColor.green400} />
                  <Icon
                    name={isVideoCamOff() ? 'videocam-off' : 'videocam'}
                    size={CONTROL_ICON_SIZE / 2}
                    color={isVideoCamOff() ? twColor.gray400 : twColor.green400}
                  />
                </View>
              </View>
            )}
          </Observer>
        );
      },
      [
        exitingClassRoom,
        rtcEngine,
        roomStore.myId,
        roomStore.isTeacher,
        roomStore.getPushingAgoraUsers,
        roomStore.authInfo?.roomVideoId,
        rawLocalView,
        handleOnPinchHandlerStateChange,
        handleStateChange,
        rawRemoteView
      ]
    );

    const renderStudentControls = useCallback(() => {
      return (
        <View style={[tw.wFull, tw.flexRow, tw.itemsCenter, tw.justifyCenter]}>
          <Icon
            style={[tw.absolute, { left: 3 }]}
            name="keyboard-arrow-right"
            size={CONTROL_ICON_SIZE * 0.8}
            color={colors.disabled}
            onPress={() => setHideRightSideBar(true)}
          />
          <View style={[tw.flexRow, tw.itemsCenter, tw.m1]}>
            <StarView ref={star}>
              <Icon name="star-rate" size={CONTROL_ICON_SIZE} color={colors.notification} />
            </StarView>
            <Text style={{ fontSize: 10 }}>{roomStore.getLocalDeviceMedals}</Text>
          </View>
          <Icon
            style={[tw.m1]}
            name="pan-tool"
            size={CONTROL_ICON_SIZE}
            color={roomStore.getMyHandsUpStatus ? colors.notification2 : colors.disabled}
            onPress={() => {
              const msg = MsgProto.Msg.create();
              msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL;
              msg.targetBool = !roomStore.getMyHandsUpStatus;
              sendMsgToServer(msg);
            }}
          />
        </View>
      );
    }, [colors.disabled, colors.notification, colors.notification2, roomStore.getLocalDeviceMedals, roomStore.getMyHandsUpStatus, sendMsgToServer]);

    const renderTeacherControls = useCallback(() => {
      return (
        <View style={[tw.wFull, tw.flexRow, tw.itemsCenter, tw.justifyCenter]}>
          <Icon
            style={[tw.absolute, { left: 3 }]}
            name="keyboard-arrow-right"
            size={CONTROL_ICON_SIZE * 0.8}
            color={colors.disabled}
            onPress={() => setHideRightSideBar(true)}
          />
          <Icon
            style={[tw.m1]}
            name="star-rate"
            size={CONTROL_ICON_SIZE}
            color={colors.notification}
            onPress={() => {
              if (roomStore.isTeacher) {
                setShowGroupAwardDialog(true);
              }
            }}
          />
          <Text style={{ fontSize: 9 }}>{roomStore.getLocalDeviceMedals}</Text>
          <Icon
            style={[tw.m1]}
            name="settings-brightness"
            size={CONTROL_ICON_SIZE}
            color={colors.notification7}
            onPress={() => {
              if (roomStore.isTeacher) {
                setShowGroupControlDialog(true);
              }
            }}
          />
          <Icon
            style={[tw.m1]}
            name="dvr"
            size={CONTROL_ICON_SIZE}
            color={colors.notification4}
            onPress={() => {
              if (roomStore.isTeacher) {
                setShowExerciseDialog(true);
              }
            }}
          />
        </View>
      );
    }, [colors.disabled, colors.notification, colors.notification4, colors.notification7, roomStore.getLocalDeviceMedals, roomStore.isTeacher]);

    const renderSyncPlayer = useCallback(
      (uri: string | undefined | null, width: number, height: number, onlyAudio: boolean, isTeacher: boolean) => {
        if (uri) {
          return (
            <SyncVideoPlayer
              ref={playerRef}
              uri={uri}
              width={width}
              height={height}
              onlyAudio={onlyAudio}
              mainColor={colors.primary}
              showControls={isTeacher}
              onResetReadyHandler={() => setPlayerReady(false)}
              onReadyHandler={() => setPlayerReady(true)}
              onCloseHandler={() => {
                if (isTeacher) {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__MEDIA_CLOSE;
                  sendMsgToServer(msg);
                }
              }}
              onPauseHandler={(paused: boolean, pos: number) => {
                if (isTeacher) {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE;
                  msg.targetBool = paused;
                  msg.targetInt = pos;
                  sendMsgToServer(msg);
                }
              }}
              onProgressHandler={(pos: number) => {
                if (isTeacher) {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_NONE__MEDIA_UPDATE_POSITION;
                  msg.targetInt = pos;
                  sendMsgToServer(msg);
                }
              }}
            />
          );
        } else {
          return (
            <View style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}>
              <ActivityIndicator />
            </View>
          );
        }
      },
      [colors.primary, sendMsgToServer]
    );

    const renderAudioPlayer = useCallback(() => {
      if (roomStore.mediaInfo?.uri && roomStore.mediaInfo?.type === MsgProto.EnumMediaType.AUDIO && !exitingClassRoom) {
        const height = roomStore.isTeacher ? AUDIO_PLAYER_HEIGHT_TEACHER : AUDIO_PLAYER_HEIGHT_STUDENT;
        return (
          <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter, { height }]}>
            {renderSyncPlayer(roomStore.mediaInfo?.uri, mainArea.width, height, true, roomStore.isTeacher)}
          </View>
        );
      }
    }, [exitingClassRoom, mainArea.width, renderSyncPlayer, roomStore.isTeacher, roomStore.mediaInfo?.type, roomStore.mediaInfo?.uri]);

    const isAnswerSelected = (item: number, answer: string): boolean => {
      return answer.split(EXERCISE_ANSWER_JOINER)?.includes(String(item));
    };

    const renderStudentExercise = useCallback(() => {
      const renderAnswerCheckBox = (item: number) => {
        return (
          <TouchableOpacity
            key={`student-answer-${item}`}
            activeOpacity={0.9}
            style={[tw.flexRow, tw.itemsCenter]}
            onPress={() => {
              if (isAnswerSelected(item, studentAnswer)) {
                setStudentAnswer(
                  studentAnswer
                    .split(EXERCISE_ANSWER_JOINER)
                    .map((i) => Number(i))
                    .filter((i) => i > 0 && i !== item)
                    .sort((a, b) => a - b)
                    .join(EXERCISE_ANSWER_JOINER)
                );
              } else {
                const newAnswer = studentAnswer
                  .split(EXERCISE_ANSWER_JOINER)
                  .map((i) => Number(i))
                  .filter((i) => i > 0);
                newAnswer.push(item);
                setStudentAnswer(newAnswer.sort((a, b) => a - b).join(EXERCISE_ANSWER_JOINER));
              }
            }}
          >
            <Avatar.Text size={CONTROL_ICON_SIZE} color={colors.background} style={{ backgroundColor: colors.notification }} label={GetAnswerLetter(item)} />
            <Checkbox status={isAnswerSelected(item, studentAnswer) ? 'checked' : 'unchecked'} />
          </TouchableOpacity>
        );
      };
      const renderSubmitForm = (choiceCount: number) => {
        const a: number[] = [];
        for (let i = 0; i < choiceCount; i++) {
          a.push(i + 1);
        }
        return (
          <View style={[tw.wFull, tw.flexRow, tw.justifyCenter, tw.itemsCenter, { height: EXERCISE_AREA_HEIGHT, backgroundColor: colors.background2 }]}>
            {a.map((i) => renderAnswerCheckBox(i))}
            <Button
              mode="contained"
              disabled={studentAnswer === ''}
              style={[tw.mL3]}
              onPress={() => {
                if (studentAnswer && roomStore.getTeacherId) {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__EXERCISE_SUBMIT;
                  msg.targetUserId = roomStore.getTeacherId;
                  msg.targetBytes = StringToUint8Array(studentAnswer);
                  sendMsgToServer(msg);
                  setStudentAnswer('');
                }
              }}
            >
              提交
            </Button>
          </View>
        );
      };
      const renderSubmitResult = () => {
        const isRight = () => {
          return roomStore.getRightAnswer === roomStore.getMyAnswer;
        };
        const renderModeForAnswer = () => {
          if (isRight()) {
            return <Icon name="sentiment-very-satisfied" size={CONTROL_ICON_SIZE} color={colors.notification} />;
          } else {
            return <Icon name="sentiment-very-dissatisfied" size={CONTROL_ICON_SIZE} color={colors.notification2} />;
          }
        };
        return (
          <View style={[tw.wFull, tw.flexRow, tw.justifyCenter, tw.itemsCenter, { height: EXERCISE_AREA_HEIGHT, backgroundColor: colors.background2 }]}>
            <Text>正确答案:{roomStore.getRightAnswer}, </Text>
            <Text>你的选择:{roomStore.getMyAnswer}, </Text>
            <Text>结果:{isRight() ? '正确' : '错误'}</Text>
            {renderModeForAnswer()}
            <Button mode="contained" disabled={true} style={[tw.mL3]}>
              已提交
            </Button>
          </View>
        );
      };
      if (roomStore.exerciseInfo && roomStore.exerciseInfo.choiceCount) {
        if (roomStore.getMyAnswer) {
          return renderSubmitResult();
        } else {
          return renderSubmitForm(roomStore.exerciseInfo.choiceCount);
        }
      }
    }, [
      colors.background,
      colors.background2,
      colors.notification,
      colors.notification2,
      roomStore.exerciseInfo,
      roomStore.getMyAnswer,
      roomStore.getRightAnswer,
      roomStore.getTeacherId,
      sendMsgToServer,
      studentAnswer
    ]);

    const renderTeacherExercise = useCallback(() => {
      if (roomStore.exerciseInfo && roomStore.exerciseInfo.choiceCount) {
        return (
          <View style={[tw.wFull, tw.flexRow, tw.justifyCenter, tw.itemsCenter, { height: EXERCISE_AREA_HEIGHT, backgroundColor: colors.background2 }]}>
            <Text>已提交:{roomStore.getExerciseSubmitCount}人 | </Text>
            <Text>正确:{roomStore.getExerciseIsRightCount}人 | </Text>
            <Text>错误:{roomStore.getExerciseIsWrongCount}人 | </Text>
            <Text>正确率:{roomStore.getExerciseAccuracy}%</Text>
            <Button
              style={[tw.mL5]}
              mode="contained"
              onPress={() => {
                renderConfirmDialog('关闭答题', () => {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__EXERCISE_CLOSE;
                  sendMsgToServer(msg);
                  setTeacherAnswer('');
                });
              }}
            >
              结束答题
            </Button>
          </View>
        );
      }
    }, [
      colors.background2,
      roomStore.exerciseInfo,
      roomStore.getExerciseAccuracy,
      roomStore.getExerciseIsRightCount,
      roomStore.getExerciseIsWrongCount,
      roomStore.getExerciseSubmitCount,
      sendMsgToServer
    ]);

    const renderExercise = useCallback(() => {
      if (roomStore.isTeacher && !exitingClassRoom) {
        return renderTeacherExercise();
      } else if (roomStore.isStudent && !exitingClassRoom) {
        return renderStudentExercise();
      }
    }, [exitingClassRoom, renderStudentExercise, renderTeacherExercise, roomStore.isStudent, roomStore.isTeacher]);

    const renderCover = useMemo(() => {
      const renderStartOrResumeBtn = () => {
        if (roomStore.roomStatus === MsgProto.EnumClassRoomStatus.NOT_STARTED && roomStore.isTeacher) {
          return (
            <Button mode="contained" icon="book-open" color={colors.notification} style={[tw.mT6]} loading={exitingClassRoom} onPress={throttle(startClass)}>
              开始上课
            </Button>
          );
        } else if (roomStore.roomStatus === MsgProto.EnumClassRoomStatus.STARTED_REST && roomStore.isTeacher) {
          return (
            <Button
              mode="contained"
              icon="alarm"
              color={colors.notification}
              style={[tw.mT6]}
              loading={exitingClassRoom}
              onPress={() => {
                renderConfirmDialog('恢复上课', () => {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__REST_CANCEL;
                  sendMsgToServer(msg);
                });
              }}
            >
              恢复上课
            </Button>
          );
        }
      };
      const renderRestDescription = () => {
        if (roomStore.roomStatus === MsgProto.EnumClassRoomStatus.STARTED_REST) {
          return <Text style={[tw.mT3, tw.text2xl, { color: colors.notification2 }]}>课间休息中</Text>;
        }
      };
      if (roomStore.mediaInfo?.uri && roomStore.mediaInfo?.type === MsgProto.EnumMediaType.VIDEO) {
        return renderSyncPlayer(roomStore.mediaInfo?.uri, mainArea.width, mainArea.height, false, roomStore.isTeacher);
      } else if (roomStore.lessonName) {
        return (
          <View style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}>
            <Text style={[tw.text3xl]}>{roomStore.lessonName}</Text>
            {renderRestDescription()}
            <Text style={[tw.mY2, tw.textXl]}>{roomStore.scheduleName}</Text>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <Icon name="timer" size={CONTROL_ICON_SIZE / 2} color={colors.placeholder} style={[tw.mR1]} />
              <Text style={{ color: colors.placeholder }}>
                {moment(roomStore.planningStartTime).format('YYYY-MM-DD HH:mm')} - {moment(roomStore.planningEndTime).format('HH:mm')}
              </Text>
            </View>
            {renderStartOrResumeBtn()}
          </View>
        );
      } else {
        return (
          <View style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}>
            <ActivityIndicator />
          </View>
        );
      }
    }, [
      roomStore.mediaInfo?.uri,
      roomStore.mediaInfo?.type,
      roomStore.lessonName,
      roomStore.roomStatus,
      roomStore.isTeacher,
      roomStore.scheduleName,
      roomStore.planningStartTime,
      roomStore.planningEndTime,
      colors.notification,
      colors.notification2,
      colors.placeholder,
      exitingClassRoom,
      startClass,
      sendMsgToServer,
      renderSyncPlayer,
      mainArea.width,
      mainArea.height
    ]);

    const renderWhiteBoard = useMemo(() => {
      if (
        userAgent &&
        authToken &&
        userStore.userInfoDetail.id &&
        roomStore.authInfo?.tokenAgora &&
        roomStore.authInfo?.roomWhiteboardId &&
        roomStore.authInfo?.tokenWhiteboard &&
        roomStore.authInfo?.whiteboardUploadAccessKeyId &&
        roomStore.authInfo?.whiteboardUploadAccessKeySecret &&
        roomStore.authInfo?.whiteboardUploadBucket &&
        roomStore.authInfo?.whiteboardUploadRegion
      ) {
        return (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            userAgent={userAgent}
            cacheEnabled={true}
            onLoadStart={() => {
              setWhiteboardConnected(false);
              console.log(`[Whiteboard] ${userStore.userInfoDetail.username} Webview Load Start`);
            }}
            onLoadEnd={() => {
              console.log(`[Whiteboard] ${userStore.userInfoDetail.username} Webview Load End`);
            }}
            source={{ uri: SERVER_WHITEBOARD_URL }}
            injectedJavaScript={`
              window.netlessRoom = WhiteboardSDK.createWhiteboard("whiteboard", {
                authToken: "${authToken}",
                uuid: "${roomStore.authInfo?.roomWhiteboardId}",
                roomToken: "${roomStore.authInfo?.tokenWhiteboard}",
                userId: "${userStore.userInfoDetail.id}",
                userName: "${userStore.userInfoDetail.username}",
                isWritable: false,
              });
              window.notify = setInterval(() => {
                if (window.netlessRoom.ready()) {
                    window.ReactNativeWebView.postMessage('ready');
                    window.ReactNativeWebView.postMessage('version:' + window.netlessRoom.getVersion());
                    clearInterval(window.notify);
                }
              }, 500);
              setTimeout(() => {
                if (!window.netlessRoom || !window.netlessRoom.ready()) {
                  window.location.reload();
                }
              }, 5000);
              true;
            `}
            onMessage={(event) => {
              if (event.nativeEvent.data === 'ready') {
                setWhiteboardConnected(true);
                console.log(`[Whiteboard] ${userStore.userInfoDetail.username} Whiteboard connected !`);
              }
              if (event.nativeEvent.data.startsWith('version')) {
                console.log(`[Whiteboard] ${userStore.userInfoDetail.username} Whiteboard version: ${event.nativeEvent.data}`);
              }
              if (event.nativeEvent.data.startsWith('[Whiteboard]')) {
                console.log(`[Whiteboard] ${userStore.userInfoDetail.username} Message from webview: ${event.nativeEvent.data}`);
              }
            }}
          />
        );
      } else {
        return (
          <View style={[tw.flex1, tw.justifyCenter, tw.itemsCenter, tw.bgGray300]}>
            <ActivityIndicator />
          </View>
        );
      }
    }, [
      userAgent,
      authToken,
      userStore.userInfoDetail.id,
      userStore.userInfoDetail.username,
      roomStore.authInfo?.tokenAgora,
      roomStore.authInfo?.roomWhiteboardId,
      roomStore.authInfo?.tokenWhiteboard,
      roomStore.authInfo?.whiteboardUploadAccessKeyId,
      roomStore.authInfo?.whiteboardUploadAccessKeySecret,
      roomStore.authInfo?.whiteboardUploadBucket,
      roomStore.authInfo?.whiteboardUploadRegion
    ]);

    const renderWhiteBoardOrLive = useMemo(() => {
      if (roomStore.getIsSharingScreen && !whiteboardConnected) {
        return (
          <TouchableOpacity style={[tw.flex1]} activeOpacity={0.9} onLongPress={() => handleSelectUser(roomStore.getTeacher)}>
            {renderLiveVideo(roomStore.getTeacher, true, 0, 0, true)}
          </TouchableOpacity>
        );
      } else if (roomStore.getIsFullScreen && !whiteboardConnected) {
        return (
          <TouchableOpacity style={[tw.flex1]} activeOpacity={0.9} onLongPress={() => handleSelectUser(roomStore.getFullScreenUser)}>
            {renderLiveVideo(roomStore.getFullScreenUser, false, 0, 0, true)}
          </TouchableOpacity>
        );
      } else if (roomStore.mediaInfo?.uri && roomStore.mediaInfo?.type === MsgProto.EnumMediaType.VIDEO && !whiteboardConnected) {
        return renderSyncPlayer(roomStore.mediaInfo?.uri, mainArea.width, mainArea.height, false, roomStore.isTeacher);
      } else {
        return renderWhiteBoard;
      }
    }, [
      handleSelectUser,
      mainArea.height,
      mainArea.width,
      renderLiveVideo,
      renderSyncPlayer,
      renderWhiteBoard,
      roomStore.getFullScreenUser,
      roomStore.getIsFullScreen,
      roomStore.getIsSharingScreen,
      roomStore.getTeacher,
      roomStore.isTeacher,
      roomStore.mediaInfo?.type,
      roomStore.mediaInfo?.uri,
      whiteboardConnected
    ]);

    const renderWaiting = useCallback(() => {
      return (
        <View style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}>
          <Chase size={CONTROL_ICON_SIZE * 3} color={colors.primary} />
        </View>
      );
    }, [colors.primary]);

    const renderMainArea = useMemo(() => {
      switch (roomStore.roomStatus) {
        case MsgProto.EnumClassRoomStatus.NOT_STARTED:
        case MsgProto.EnumClassRoomStatus.STARTED_REST:
          return renderCover;
        case MsgProto.EnumClassRoomStatus.STARTING:
        case MsgProto.EnumClassRoomStatus.ENDING:
          return renderWaiting();
        case MsgProto.EnumClassRoomStatus.STARTED:
          return renderWhiteBoardOrLive;
        case MsgProto.EnumClassRoomStatus.END:
        default:
          exitClassRoom('课堂已结束');
      }
    }, [exitClassRoom, renderCover, renderWaiting, renderWhiteBoardOrLive, roomStore.roomStatus]);

    const renderKeyboardView = useMemo(() => {
      const handleChangeText = (text: string) => {
        setChatContent(text);
      };
      const submitChat = () => {
        if (roomStore.chatEnabled && chatContent.trim() !== '') {
          const chatInfo = MsgProto.ChatInfo.create();
          chatInfo.id = Long.fromString(String(userStore.userInfoDetail.id));
          chatInfo.name = String(userStore.userInfoDetail.username);
          chatInfo.timestamp = new Date().getTime();
          chatInfo.content = chatContent;
          const msg = MsgProto.Msg.create();
          msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__IM_TEXT;
          msg.chatInfo = chatInfo;
          sendMsgToServer(msg);
          setChatContent('');
        }
        imInputRef.current?.clear();
        imInputRef.current?.blur();
      };
      return (
        <KeyboardAccessoryView alwaysVisible={editing} style={{ backgroundColor: colors.background }}>
          <View style={[tw.flexRow, tw.p2, tw.justifyCenter, tw.itemsCenter, { backgroundColor: colors.background }]}>
            <Button icon="arrow-down-circle" compact onPress={() => imInputRef.current?.blur()}>
              收起
            </Button>
            <TextInput
              ref={(ref) => (imInputRef.current = ref)}
              style={[
                tw.flex1,
                tw.pY2,
                tw.mR2,
                tw.pX1,
                tw.justifyCenter,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: colors.placeholder
                }
              ]}
              returnKeyType={'send'}
              placeholder={'说点什么吧'}
              onFocus={() => setEditing(true)}
              onEndEditing={() => setEditing(false)}
              onBlur={() => setEditing(false)}
              multiline={false}
              numberOfLines={1}
              maxLength={50}
              onChangeText={handleChangeText}
              onSubmitEditing={submitChat}
            />
            <Button mode="contained" compact onPress={submitChat}>
              发送
            </Button>
          </View>
        </KeyboardAccessoryView>
      );
    }, [
      chatContent,
      colors.background,
      colors.placeholder,
      colors.text,
      editing,
      roomStore.chatEnabled,
      sendMsgToServer,
      userStore.userInfoDetail.id,
      userStore.userInfoDetail.username
    ]);

    const renderMeIcon = useCallback(
      (isMe: boolean) => {
        if (isMe) {
          return <Text style={{ fontSize: 9, color: colors.placeholder, marginRight: 1 }}>我</Text>;
        }
      },
      [colors.placeholder]
    );

    const renderUserDeviceIcon = useCallback(
      (deviceType: MsgProto.EnumDeviceType) => {
        let iconName: string;
        switch (deviceType) {
          case MsgProto.EnumDeviceType.MOBILE_IOS:
            iconName = 'phone-iphone';
            break;
          case MsgProto.EnumDeviceType.MOBILE_ANDROID:
            iconName = 'phone-android';
            break;
          case MsgProto.EnumDeviceType.TABLET_IOS:
            iconName = 'tablet-mac';
            break;
          case MsgProto.EnumDeviceType.TABLET_ANDROID:
            iconName = 'tablet-android';
            break;
          case MsgProto.EnumDeviceType.DESKTOP_MAC:
            iconName = 'desktop-mac';
            break;
          case MsgProto.EnumDeviceType.DESKTOP_WINDOWS:
            iconName = 'desktop-windows';
            break;
          default:
            iconName = 'computer';
        }
        return <Icon name={iconName} size={CONTROL_ICON_SIZE / 3} color={colors.placeholder} style={{ marginRight: 1 }} />;
      },

      [colors.placeholder]
    );

    const renderUserMicIcon = useCallback(
      (isOpen: boolean) => {
        if (isOpen) {
          return <Icon name="mic" size={CONTROL_ICON_SIZE / 3} color={colors.notification2} style={{ marginRight: 1 }} />;
        }
      },
      [colors.notification2]
    );

    const renderUserCameraIcon = useCallback(
      (isOpen: boolean) => {
        if (isOpen) {
          return <Icon name="videocam" size={CONTROL_ICON_SIZE / 3} color={colors.notification2} style={{ marginRight: 1 }} />;
        }
      },
      [colors.notification2]
    );

    const renderUserWhiteBoardIcon = useCallback(
      (isDraw: boolean) => {
        if (isDraw) {
          return <Icon name="brush" size={CONTROL_ICON_SIZE / 3} color={colors.notification2} style={{ marginRight: 1 }} />;
        }
      },
      [colors.notification2]
    );

    const renderUserHandUp = useCallback(
      (handUp: boolean) => {
        if (handUp) {
          return <Icon name="pan-tool" size={CONTROL_ICON_SIZE / 3} color={colors.notification2} style={{ marginRight: 1 }} />;
        }
      },
      [colors.notification2]
    );

    const renderStudent = useCallback(
      ({ item }) => {
        const user: UserItem = item;
        return (
          <Observer>
            {() => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[tw.p1, tw.justifyCenter, { width: '50%', backgroundColor: colors.background }]}
                onLongPress={() => handleSelectUser(user)}
              >
                <View style={[tw.itemsCenter, tw.flexRow, tw.p1, tw.roundedLg, tw.overflowHidden, { backgroundColor: colors.deepBackground }]}>
                  <Avatar.Text size={CONTROL_ICON_SIZE} label={GetFirstLetter(user.name)} />
                  <View style={[tw.mL1, tw.justifyCenter, tw.itemsStart]}>
                    <Text style={[{ fontSize: 11 }]}>{user.name}</Text>
                    <View style={[tw.flexRow, tw.itemsEnd, tw.mT1]}>
                      {renderMeIcon(user.id?.toString() === roomStore.myId?.toString())}
                      {renderUserDeviceIcon(user.deviceType ? user.deviceType : MsgProto.EnumDeviceType.UNKNOWN_DEVICE)}
                      {renderUserMicIcon(!user.muteAudio && user.pushingStatus !== MsgProto.EnumPushingStatus.PUSHING_NONE)}
                      {renderUserCameraIcon(isPushingVideo(user.pushingStatus))}
                      {renderUserWhiteBoardIcon(!!user.whiteBoard)}
                      {renderUserHandUp(!!user.handsUp)}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </Observer>
        );
      },
      [
        colors.background,
        colors.deepBackground,
        renderMeIcon,
        roomStore.myId,
        renderUserDeviceIcon,
        renderUserMicIcon,
        renderUserCameraIcon,
        renderUserWhiteBoardIcon,
        renderUserHandUp,
        handleSelectUser
      ]
    );

    const renderUserList = useCallback(
      (users: UserItem[]) => {
        if (roomStore.connected) {
          console.log('[Performance] render user list');
          return <FlatList data={users} renderItem={renderStudent} keyExtractor={(item) => `student-${item.id?.toString()}`} numColumns={2} />;
        } else {
          return (
            <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}>
              <ActivityIndicator />
            </View>
          );
        }
      },
      [roomStore.connected, renderStudent]
    );

    const renderOnline = useMemo(() => {
      const renderEndClassBtn = () => {
        if (
          roomStore.isTeacher &&
          roomStore.roomStatus !== MsgProto.EnumClassRoomStatus.NOT_STARTED &&
          roomStore.roomStatus !== MsgProto.EnumClassRoomStatus.END
        ) {
          return (
            <Button
              style={[tw.mX1]}
              mode="contained"
              compact
              icon="bell-alert"
              color={colors.notification}
              loading={exitingClassRoom}
              onPress={throttle(endClass)}
            >
              下课
            </Button>
          );
        } else {
          return null;
        }
      };
      return (
        <View style={[tw.flex1, { backgroundColor: colors.background }]}>
          {renderUserList(roomStore.getOnlineStudents)}
          <View style={[tw.wFull, tw.flexRow, tw.p1, tw.justifyCenter, { backgroundColor: colors.deepBackground }]}>
            <Button style={[tw.mX1]} mode="contained" compact icon="exit-run" loading={exitingClassRoom} onPress={() => exitClassRoom()}>
              暂离
            </Button>
            {renderEndClassBtn()}
          </View>
        </View>
      );
    }, [
      colors.background,
      colors.deepBackground,
      colors.notification,
      renderUserList,
      roomStore.getOnlineStudents,
      roomStore.isTeacher,
      roomStore.roomStatus,
      exitingClassRoom,
      endClass,
      exitClassRoom
    ]);

    const renderChatItem = useCallback(
      ({ item }) => {
        const chat: ChatItem = item;
        const isMine = chat.id?.toString() === roomStore.myId;
        return (
          <View style={[tw.flexRow, tw.p1, tw.itemsCenter, { justifyContent: isMine ? 'flex-end' : 'flex-start' }]}>
            {isMine ? null : <Avatar.Text size={(CONTROL_ICON_SIZE * 2) / 3} label={GetFirstLetter(chat.name)} />}
            <View style={[tw.pX1, { alignItems: isMine ? 'flex-end' : 'flex-start' }]}>
              <Text
                style={[
                  tw.mX1,
                  tw.itemsStart,
                  {
                    color: colors.placeholder,
                    fontSize: 9,
                    marginBottom: 1
                  }
                ]}
              >
                {chat.name}
              </Text>
              <View
                style={[
                  tw.p1,
                  tw.itemsStart,
                  tw.roundedLg,
                  {
                    backgroundColor: colors.deepBackground,
                    marginLeft: isMine ? CONTROL_ICON_SIZE : 2,
                    marginRight: isMine ? 2 : CONTROL_ICON_SIZE
                  }
                ]}
              >
                <Text style={[{ fontSize: 11 }]}>{chat.content}</Text>
              </View>
            </View>
            {isMine ? <Avatar.Text size={(CONTROL_ICON_SIZE * 2) / 3} label={GetFirstLetter(chat.name)} /> : null}
          </View>
        );
      },
      [colors.deepBackground, colors.placeholder, roomStore.myId]
    );

    const renderChatList = useCallback(
      (chatList: ChatItem[]) => {
        if (roomStore.connected) {
          console.log('[Performance] render chat list');
          return (
            <FlatList
              style={[tw.pX2]}
              ref={chatListRef}
              data={chatList}
              inverted={true}
              renderItem={renderChatItem}
              keyExtractor={(item) => `chat-${item.timestamp}`}
              onContentSizeChange={chatListRef.current?.scrollToEnd()}
            />
          );
        } else {
          return (
            <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}>
              <ActivityIndicator />
            </View>
          );
        }
      },
      [roomStore.connected, renderChatItem]
    );

    const renderChat = useMemo(() => {
      return (
        <View style={[tw.flex1, { backgroundColor: colors.background }]}>
          {renderChatList(roomStore.chatItemList.slice())}
          <TouchableWithoutFeedback
            onPress={() => {
              if (roomStore.chatEnabled) {
                imInputRef.current?.focus();
              } else {
                setToastMessage('教室已禁言');
                setShowMessage(true);
              }
            }}
          >
            <View style={{ backgroundColor: colors.deepBackground }}>
              <View
                style={[
                  tw.h8,
                  tw.m1,
                  tw.pL1,
                  tw.justifyCenter,
                  {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: colors.disabled,
                    display: editing ? 'none' : 'flex'
                  }
                ]}
              >
                <Text style={{ color: colors.placeholder }}>{roomStore.chatEnabled ? '说点什么吧' : '教室已禁言'}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }, [colors.background, colors.deepBackground, colors.disabled, colors.placeholder, editing, roomStore.chatEnabled, roomStore.chatItemList, renderChatList]);

    const renderOffline = useMemo(() => {
      return <View style={[tw.flex1, { backgroundColor: colors.background }]}>{renderUserList(roomStore.getOfflineStudents)}</View>;
    }, [colors.background, roomStore.getOfflineStudents, renderUserList]);

    const renderUserAndChatList = useCallback(() => {
      const online = () => {
        return renderOnline;
      };
      const chat = () => {
        return renderChat;
      };
      const offline = () => {
        return renderOffline;
      };
      const userList = roomStore.userItemList.slice();
      const onlineCount = userList.filter((u) => u.online && u.userType === MsgProto.EnumUserType.STUDENT).length;
      const offlineCount = userList.filter((u) => !u.online && u.userType === MsgProto.EnumUserType.STUDENT).length;
      return (
        <TopTabStack.Navigator
          backBehavior="none"
          lazy={true}
          lazyPlaceholder={() => (
            <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, { backgroundColor: colors.background }]}>
              <ActivityIndicator />
            </View>
          )}
          initialRouteName="online"
          initialLayout={{ width: rightSideBarWidth }}
          pager={(props) => <ViewPagerAdapter {...props}>{props.children}</ViewPagerAdapter>}
          tabBarOptions={{
            labelStyle: { fontSize: 11, color: colors.text, marginTop: -15 },
            style: { backgroundColor: colors.background, height: 30 }
          }}
          style={{
            width: rightSideBarWidth,
            backgroundColor: colors.background
          }}
        >
          <TopTabStack.Screen
            name="online"
            component={online}
            options={{
              tabBarLabel: '在线' + onlineCount
            }}
          />
          <TopTabStack.Screen
            name="offline"
            component={offline}
            options={{
              tabBarLabel: '离线' + offlineCount
            }}
          />
          <TopTabStack.Screen
            name="chat"
            component={chat}
            options={{
              tabBarLabel: '消息' + (roomStore.getHaveChatMsg ? '*' : '')
            }}
          />
        </TopTabStack.Navigator>
      );
    }, [colors.background, colors.text, renderChat, renderOffline, renderOnline, rightSideBarWidth, roomStore.getHaveChatMsg, roomStore.userItemList]);

    const renderConfirmDialog = (actionName: string, action: () => void) => {
      return Alert.alert(
        '确认操作',
        `是否确认${actionName}`,
        [
          {
            text: '确认',
            onPress: action
          },
          {
            text: '取消',
            style: 'cancel'
          }
        ],
        {
          cancelable: true
        }
      );
    };

    const renderSelectUserDialog = () => {
      const renderAward = () => {
        if (selectedUser?.userType === MsgProto.EnumUserType.STUDENT) {
          return (
            <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
              <Icon name="star-rate" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification5} style={[tw.mY1]} />
              <Text style={[tw.mY1]}>单个奖励</Text>
              <Switch
                style={[tw.mY1]}
                color={colors.notification5}
                onValueChange={() => {
                  setShowChangeStatusDialog(false);
                  setAwardType(MsgProto.EnumAwardType.SINGLE);
                  setShowWardCountModal(!showAwardCountModal);
                }}
              />
            </View>
          );
        }
      };
      const renderExitClassRoom = () => {
        if (selectedUser?.userType === MsgProto.EnumUserType.STUDENT) {
          return (
            <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
              <Icon name="exit-to-app" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification3} style={[tw.mY1]} />
              <Text style={[tw.mY1]}>强制离开教室</Text>
              <Switch
                style={[tw.mY1]}
                color={colors.notification3}
                onValueChange={() => {
                  setShowChangeStatusDialog(false);
                  renderConfirmDialog(`让${selectedUser?.name}暂离教室`, () => {
                    if (selectedUser?.id) {
                      const msg = MsgProto.Msg.create();
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_TARGET__KICK_EXIT_ROOM;
                      msg.targetUserId = selectedUser?.id;
                      sendMsgToServer(msg);
                    }
                  });
                }}
              />
            </View>
          );
        }
      };
      const renderCameraTypeSelection = () => {
        if (enableVideoStatus) {
          return (
            <RadioButton.Group
              onValueChange={(value) => {
                switch (value) {
                  case MsgProto.EnumCameraType.BACK.toString():
                    setSelectedUserCamera(MsgProto.EnumCameraType.BACK);
                    break;
                  case MsgProto.EnumCameraType.FRONT.toString():
                  default:
                    setSelectedUserCamera(MsgProto.EnumCameraType.FRONT);
                    break;
                }
              }}
              value={selectedUserCamera.toString()}
            >
              <RadioButton.Item labelStyle={{ fontSize: 11 }} label={'前摄'} value={MsgProto.EnumCameraType.FRONT.toString()} />
              <RadioButton.Item labelStyle={{ fontSize: 11 }} label={'后摄'} value={MsgProto.EnumCameraType.BACK.toString()} />
            </RadioButton.Group>
          );
        }
      };
      return (
        <Dialog dismissable={false} visible={showChangeStatusDialog} onDismiss={() => setShowChangeStatusDialog(false)}>
          <Dialog.Title>{selectedUser?.name}</Dialog.Title>
          <Dialog.Content>
            <View style={[tw.flexRow, tw.justifyEvenly, tw.itemsStart]}>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="mic" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification2} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>音频开关</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification2}
                  value={enableAudioStatus}
                  onValueChange={() => setEnableAudioStatus(!enableAudioStatus)}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="videocam" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification2} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>视频开关</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification2}
                  value={enableVideoStatus}
                  onValueChange={() => {
                    if (enableVideoStatus) {
                      setEnableFullScreenStatus(false);
                    }
                    setEnableVideoStatus(!enableVideoStatus);
                  }}
                />
                {renderCameraTypeSelection()}
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="tv" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification3} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>视频全屏开关</Text>
                <Switch
                  disabled={!enableVideoStatus}
                  style={[tw.mY1]}
                  color={colors.notification3}
                  value={enableFullScreenStatus}
                  onValueChange={() => setEnableFullScreenStatus(!enableFullScreenStatus)}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="brush" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification6} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>书写白板开关</Text>
                <Switch
                  disabled={selectedUser?.userType === MsgProto.EnumUserType.TEACHER && !!selectedUser.whiteBoard}
                  style={[tw.mY1]}
                  color={colors.notification6}
                  value={enableWhiteBoardStatus}
                  onValueChange={() => setEnableWhiteBoardStatus(!enableWhiteBoardStatus)}
                />
              </View>
              {renderAward()}
              {renderExitClassRoom()}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" icon="close-circle" style={[tw.mR3]} onPress={() => setShowChangeStatusDialog(false)}>
              取消
            </Button>
            <Button
              mode="contained"
              icon="check-circle"
              style={{ backgroundColor: colors.notification }}
              onPress={() => {
                if (selectedUser?.id) {
                  setShowChangeStatusDialog(false);
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL;
                  const info = MsgProto.CombinedInfo.create();
                  info.audio = enableAudioStatus;
                  info.video = enableVideoStatus;
                  info.whiteBoard = enableWhiteBoardStatus;
                  info.fullScreen = enableFullScreenStatus;
                  if (enableVideoStatus) {
                    info.cameraType = selectedUserCamera;
                  }
                  msg.targetUserId = selectedUser?.id;
                  msg.combinedInfo = info;
                  sendMsgToServer(msg);
                }
              }}
            >
              确认
            </Button>
          </Dialog.Actions>
        </Dialog>
      );
    };

    const renderGroupAwardDialog = () => {
      return (
        <Dialog dismissable={false} visible={showGroupAwardDialog} onDismiss={() => setShowGroupAwardDialog(false)}>
          <Dialog.Title>{'多用户奖励'}</Dialog.Title>
          <Dialog.Content>
            <View style={[tw.flexRow, tw.justifyEvenly]}>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="group" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification4} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>奖励在线学生</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification2}
                  onValueChange={() => {
                    setShowGroupAwardDialog(false);
                    setAwardType(MsgProto.EnumAwardType.ONLINE);
                    setShowWardCountModal(true);
                  }}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="people-outline" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification6} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>奖励所有学生</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification2}
                  onValueChange={() => {
                    setShowGroupAwardDialog(false);
                    setAwardType(MsgProto.EnumAwardType.ALL);
                    setShowWardCountModal(true);
                  }}
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" icon="close-circle" style={[tw.mR3]} onPress={() => setShowGroupAwardDialog(false)}>
              关闭
            </Button>
          </Dialog.Actions>
        </Dialog>
      );
    };

    const renderGroupControlDialog = () => {
      return (
        <Dialog dismissable={false} visible={showGroupControlDialog} onDismiss={() => setShowGroupControlDialog(false)}>
          <Dialog.Title>{'教室控制'}</Dialog.Title>
          <Dialog.Content>
            <View style={[tw.flexRow, tw.justifyEvenly]}>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="mic" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification2} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>全员静音</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification2}
                  onValueChange={() => {
                    setShowGroupControlDialog(false);
                    renderConfirmDialog('全员静音', () => {
                      const msg = MsgProto.Msg.create();
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL;
                      sendMsgToServer(msg);
                    });
                  }}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="pan-tool" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification6} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>清除举手</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification6}
                  onValueChange={() => {
                    setShowGroupControlDialog(false);
                    renderConfirmDialog('清除全部举手状态', () => {
                      const msg = MsgProto.Msg.create();
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL;
                      sendMsgToServer(msg);
                    });
                  }}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="movie" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification5} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>在线资源</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification5}
                  onValueChange={() => {
                    setShowGroupControlDialog(false);
                    cloudSeaDiskStore.screenName = 'OnlineClassRoom';
                    cloudSeaDiskStore.classSelectInfo = undefined;
                    navigation.navigate('CloudSeaDisk');
                  }}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="sms" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification6} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>聊天禁言({roomStore.chatEnabled ? '已开' : '已关'})</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification6}
                  value={roomStore.chatEnabled}
                  onValueChange={() => {
                    setShowGroupControlDialog(false);
                    renderConfirmDialog('切换聊天禁言状态', () => {
                      const msg = MsgProto.Msg.create();
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__IM_STATUS;
                      msg.targetBool = !roomStore.chatEnabled;
                      sendMsgToServer(msg);
                    });
                  }}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="exit-to-app" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification4} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>全员暂离</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification4}
                  onValueChange={() => {
                    setShowGroupControlDialog(false);
                    renderConfirmDialog('让全部学生暂离教室', () => {
                      const msg = MsgProto.Msg.create();
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM;
                      sendMsgToServer(msg);
                    });
                  }}
                />
              </View>
              <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
                <Icon name="free-breakfast" size={CONTROL_ICON_SIZE * 1.5} color={colors.notification7} style={[tw.mY1]} />
                <Text style={[tw.mY1]}>课间休息</Text>
                <Switch
                  style={[tw.mY1]}
                  color={colors.notification7}
                  disabled={roomStore.roomStatus !== MsgProto.EnumClassRoomStatus.STARTED}
                  onValueChange={() => {
                    setShowGroupControlDialog(false);
                    renderConfirmDialog('进行课间休息', () => {
                      const msg = MsgProto.Msg.create();
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__REST;
                      sendMsgToServer(msg);
                    });
                  }}
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" icon="close-circle" style={[tw.mR3]} onPress={() => setShowGroupControlDialog(false)}>
              关闭
            </Button>
          </Dialog.Actions>
        </Dialog>
      );
    };

    const renderExercisesDialog = () => {
      const renderOption = (item: number) => {
        const renderAnswerCheckBox = () => {
          if (item <= teacherAnswerCount) {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[tw.flexRow, tw.itemsCenter]}
                onPress={() => {
                  if (isAnswerSelected(item, teacherAnswer) && teacherAnswerCount >= item) {
                    setTeacherAnswer(
                      teacherAnswer
                        .split(EXERCISE_ANSWER_JOINER)
                        .map((i) => Number(i))
                        .filter((i) => i > 0 && i !== item)
                        .sort((a, b) => a - b)
                        .join(EXERCISE_ANSWER_JOINER)
                    );
                  } else {
                    const newAnswer = teacherAnswer
                      .split(EXERCISE_ANSWER_JOINER)
                      .map((i) => Number(i))
                      .filter((i) => i > 0);
                    newAnswer.push(item);
                    setTeacherAnswer(newAnswer.sort((a, b) => a - b).join(EXERCISE_ANSWER_JOINER));
                  }
                }}
              >
                <Avatar.Text
                  size={CONTROL_ICON_SIZE}
                  color={colors.background}
                  style={{ backgroundColor: colors.notification }}
                  label={GetAnswerLetter(item)}
                />
                <Checkbox status={isAnswerSelected(item, teacherAnswer) ? 'checked' : 'unchecked'} disabled={Number(teacherAnswerCount) < Number(item)} />
              </TouchableOpacity>
            );
          }
        };
        return (
          <View key={`exercise-option-${item}`} style={[tw.itemsCenter, tw.mX2]}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[tw.flexRow, tw.itemsCenter]}
              onPress={() => {
                setTeacherAnswerCount(item);
                setTeacherAnswer('');
              }}
            >
              <Text>{item}选项</Text>
              <Checkbox status={teacherAnswerCount === item ? 'checked' : 'unchecked'} />
            </TouchableOpacity>
            {renderAnswerCheckBox()}
          </View>
        );
      };
      return (
        <Dialog dismissable={false} visible={showExercisesDialog} onDismiss={() => setShowExerciseDialog(false)}>
          <Dialog.Title>{'互动答题'}</Dialog.Title>
          <Dialog.Content>
            <View style={[tw.flexRow, tw.justifyEvenly]}>{[1, 2, 3, 4, 5].map((i) => renderOption(i))}</View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" icon="close-circle" style={[tw.mR3]} onPress={() => setShowExerciseDialog(false)}>
              关闭
            </Button>
            <Button
              mode="contained"
              icon="check-circle"
              disabled={teacherAnswer === ''}
              style={{ backgroundColor: colors.notification }}
              onPress={() => {
                setShowExerciseDialog(false);
                if (teacherAnswer !== '') {
                  const msg = MsgProto.Msg.create();
                  msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__EXERCISE_OPEN;
                  msg.exerciseInfo = MsgProto.ExerciseInfo.create();
                  msg.exerciseInfo.choiceCount = Number(teacherAnswerCount);
                  msg.exerciseInfo.answer = StringToUint8Array(teacherAnswer);
                  sendMsgToServer(msg);
                }
              }}
            >
              确认
            </Button>
          </Dialog.Actions>
        </Dialog>
      );
    };

    const renderAwardModal = () => {
      return (
        <Modal
          dismissable={false}
          visible={showAwardCountModal && awardType !== MsgProto.EnumAwardType.NONE}
          contentContainerStyle={[tw.justifyCenter, tw.itemsCenter]}
        >
          <View style={[tw.pY6, tw.pX12, tw.justifyCenter, tw.itemsCenter, tw.roundedLg, { backgroundColor: colors.surface }]}>
            <Text style={[tw.textLg]}>奖励星币数量</Text>
            <View style={[tw.flexRow, tw.justifyCenter, tw.itemsCenter, tw.mY5]}>
              <Icon
                name="remove-circle-outline"
                size={CONTROL_ICON_SIZE}
                color={colors.text}
                onPress={() => {
                  const count = awardCount - AWARD_STEP_COUNT;
                  setAwardCount(count < AWARD_STEP_COUNT ? AWARD_STEP_COUNT : count);
                  if (count < AWARD_STEP_COUNT && !showMessage) {
                    setToastMessage(`最少可奖励${AWARD_STEP_COUNT}枚星币`);
                    setShowMessage(true);
                  }
                }}
              />
              <View
                style={[
                  tw.flex,
                  tw.justifyCenter,
                  tw.itemsCenter,
                  tw.mX2,
                  tw.pY2,
                  tw.w16,
                  tw.border,
                  {
                    color: colors.text,
                    borderColor: colors.disabled
                  }
                ]}
              >
                <Text>{awardCount}</Text>
              </View>
              <Icon
                name="add-circle-outline"
                size={CONTROL_ICON_SIZE}
                color={colors.text}
                onPress={() => {
                  const count = awardCount + AWARD_STEP_COUNT;
                  setAwardCount(count > AWARD_MAX_COUNT ? AWARD_MAX_COUNT : count);
                  if (count > AWARD_MAX_COUNT && !showMessage) {
                    setToastMessage(`最多可奖励${AWARD_MAX_COUNT}枚星币`);
                    setShowMessage(true);
                  }
                }}
              />
            </View>
            <View style={[tw.flexRow]}>
              <Button mode="contained" style={[tw.mX2]} onPress={() => setShowWardCountModal(false)}>
                取消
              </Button>
              <Button
                mode="contained"
                style={[tw.mX2]}
                color={colors.notification}
                onPress={() => {
                  setShowWardCountModal(false);
                  const msg = MsgProto.Msg.create();
                  switch (awardType) {
                    case MsgProto.EnumAwardType.SINGLE:
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL;
                      break;
                    case MsgProto.EnumAwardType.ONLINE:
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL;
                      break;
                    case MsgProto.EnumAwardType.ALL:
                      msg.msgType = MsgProto.EnumMsgType.MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL;
                      break;
                    default:
                      break;
                  }
                  if (selectedUser?.id) {
                    msg.targetUserId = selectedUser?.id;
                  }
                  msg.targetInt = awardCount;
                  if (awardType !== MsgProto.EnumAwardType.NONE) {
                    sendMsgToServer(msg);
                  }
                }}
              >
                确认
              </Button>
            </View>
          </View>
        </Modal>
      );
    };

    const renderMessage = () => {
      return (
        <Snackbar
          style={{ backgroundColor: colors.background }}
          visible={showMessage}
          duration={5 * 1000}
          onDismiss={() => {
            setShowMessage(false);
            setToastMessage('');
          }}
          action={{
            label: '关闭',
            onPress: () => {
              setShowMessage(false);
              setToastMessage('');
            }
          }}
        >
          <Text>{toastMessage}</Text>
        </Snackbar>
      );
    };

    const renderRightSideBar = useCallback(() => {
      const renderControls = () => {
        if (roomStore.isTeacher || roomStore.isTeacherBackstage || roomStore.isInspector) {
          return renderTeacherControls();
        } else if (roomStore.isStudent) {
          return renderStudentControls();
        }
      };
      const renderTeacherVideoOrPlaceHolder = () => {
        if (roomStore.getTeacherId && roomStore.getFullScreenUser?.id?.toString() === roomStore.getTeacherId.toString()) {
          return renderLiveVideo(roomStore.getTeacher, false, Math.round(rightSideBarWidth), Math.round((rightSideBarWidth * 10) / 16), false, true);
        } else {
          return renderLiveVideo(roomStore.getTeacher, false, Math.round(rightSideBarWidth), Math.round((rightSideBarWidth * 10) / 16));
        }
      };
      if (!hideRightSideBar) {
        return (
          <View
            style={[
              tw.flex,
              tw.itemsCenter,
              tw.justifyStart,
              {
                width: rightSideBarWidth,
                backgroundColor: colors.deepBackground
              }
            ]}
          >
            <TouchableOpacity activeOpacity={0.9} onLongPress={() => handleSelectUser(roomStore.getTeacher)}>
              {renderTeacherVideoOrPlaceHolder()}
            </TouchableOpacity>
            {renderControls()}
            {renderUserAndChatList()}
          </View>
        );
      }
    }, [
      colors.deepBackground,
      handleSelectUser,
      hideRightSideBar,
      renderLiveVideo,
      renderStudentControls,
      renderTeacherControls,
      renderUserAndChatList,
      rightSideBarWidth,
      roomStore.getFullScreenUser?.id,
      roomStore.getTeacher,
      roomStore.getTeacherId,
      roomStore.isInspector,
      roomStore.isStudent,
      roomStore.isTeacher,
      roomStore.isTeacherBackstage
    ]);

    const renderShowRightSideBarButton = useMemo(() => {
      if (hideRightSideBar) {
        return (
          <Icon
            style={[
              tw.absolute,
              {
                right: CONTROL_ICON_SIZE / 2,
                top: (rightSideBarWidth * 10) / 16 + CONTROL_ICON_SIZE / 2
              }
            ]}
            name="navigate-before"
            size={CONTROL_ICON_SIZE * 0.8}
            color={twColor.gray500}
            onPress={() => setHideRightSideBar(false)}
          />
        );
      }
    }, [hideRightSideBar, rightSideBarWidth]);

    const renderStudentVideo = useCallback(
      ({ item }) => {
        const user: UserItem = item;
        const height = bottomOnlineUserAreaHeight - CONTROL_ICON_SIZE / 2;
        return (
          <TouchableOpacity activeOpacity={0.9} onLongPress={() => handleSelectUser(user)} style={[tw.mX1]}>
            {renderLiveVideo(user, false, (height * 4) / 3, height)}
          </TouchableOpacity>
        );
      },
      [bottomOnlineUserAreaHeight, handleSelectUser, renderLiveVideo]
    );

    const renderOnlineStudentVideos = useMemo(() => {
      if (rtcEngine && roomStore.connected && roomStore.getStudentVideoList.length > 0 && !roomStore.getIsSharingScreen && !roomStore.getIsFullScreen) {
        console.log('[Performance] render online user video list');
        return (
          <View style={[tw.wFull, tw.itemsCenter, tw.justifyCenter, { backgroundColor: colors.background, height: bottomOnlineUserAreaHeight }]}>
            <FlatList
              contentContainerStyle={[tw.itemsCenter, tw.justifyCenter]}
              data={roomStore.getStudentVideoList}
              renderItem={renderStudentVideo}
              keyExtractor={(item) => `student-video-${item.id?.toString()}`}
              horizontal={true}
            />
          </View>
        );
      }
    }, [
      rtcEngine,
      roomStore.connected,
      roomStore.getStudentVideoList,
      roomStore.getIsSharingScreen,
      roomStore.getIsFullScreen,
      colors.background,
      bottomOnlineUserAreaHeight,
      renderStudentVideo
    ]);

    const renderTimeCounting = useMemo(() => {
      if (timeCounting) {
        return <Text style={[tw.absolute, { zIndex: 99, top: 5, left: 5, color: colors.notification2, fontSize: 9 }]}>{timeCounting}</Text>;
      }
    }, [colors.notification2, timeCounting]);

    const handleMainAreaOnLayout = (event) => {
      const { width, height } = event.nativeEvent.layout;
      setMainArea({ width, height });
    };

    const renderNetStatus = () => {
      return (
        <View style={{ zIndex: 99, opacity: 0.5, position: 'absolute', right: 5, top: 5 }}>
          <NetStatus />
        </View>
      );
    };

    return (
      <View style={[tw.flex1]}>
        <View style={[tw.flex1, tw.flexRow]}>
          <View style={[tw.flex1, { backgroundColor: colors.deepMoreBackground }]} onLayout={handleMainAreaOnLayout}>
            {renderAudioPlayer()}
            {renderMainArea}
            {renderExercise()}
            {renderOnlineStudentVideos}
            {renderShowRightSideBarButton}
            {renderTimeCounting}
          </View>
          {renderRightSideBar()}
        </View>
        {renderSelectUserDialog()}
        {renderGroupAwardDialog()}
        {renderGroupControlDialog()}
        {renderExercisesDialog()}
        {renderAwardModal()}
        {renderMessage()}
        {renderRemoteAudioList()}
        {renderKeyboardView}
        {renderNetStatus()}
      </View>
    );
  }
);
