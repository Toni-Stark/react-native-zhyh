import React, { memo, ReactElement, useEffect, useRef, useState } from 'react';
import { Appbar, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { tw } from 'react-native-tailwindcss';
import { Dimensions, FlatList, RefreshControl, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import AvatarView from '../../../component/AvatarView';
import { getStatusBarHeight, getStr, requestAudioAndVideoPermission } from '../../../common/tools';
import { useStore } from '../../../store';
import { ScheduleList } from '../../../store/LessonDetailStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { t } from '../../../common/tools';
import { LESSON_TYPE_LIVE, LESSON_TYPE_NEED_PAY, LESSON_TYPE_PASSWORD, LESSON_TYPE_PRIVATE } from '../../../common/status-module';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import BottomSheet from 'reanimated-bottom-sheet';
import { BottomSheetChildren } from '../../../component/BootomSheetChildren';
import { LessonDetailPlaceholder } from '../../../component/skeleton/LessonDetailPlaceholder';
import { RSA } from 'react-native-rsa-native';
import FastImage from 'react-native-fast-image';
import WeChat from 'react-native-wechat-lib';

type ScreenRouteProp = RouteProp<ScreensParamList, 'LectureList'>;
type Props = {
  route: ScreenRouteProp;
  message?: string;
};

export const LectureList: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { lessonDetailStore, userStore, homeworkCreateStore, userRolesStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const menuSheet = useRef<any>();
    const [dataLecture, setDataLecture] = useState<any>(undefined);
    const [inputPass, setInputPass] = useState<any>(undefined);
    const [password, setPassword] = useState<any>(undefined);
    const [getInto, setGetInto] = useState<any>(undefined);
    const [isShow, setIsShow] = useState(false);
    const [selectShare, setSelectShare] = useState(false);
    const widthThanHeight = Dimensions.get('window').width > Dimensions.get('window').height;
    const [selectModal, setSelectModal] = useState<boolean>(false);

    useEffect(() => {
      (async () => {
        userStore.isOnClassRoom = false;
        userRolesStore.isStudentId = [];
        userRolesStore.isSecTeacherId = [];
        userRolesStore.isTeacherId = undefined;
        await lessonDetailStore.getLessonLiveDetail(route.params.lessonId);
        userRolesStore.isTeacherId = lessonDetailStore.lessonDetail?.primaryTeacher?.id;
        if (lessonDetailStore.lessonDetail?.secondaryTeachers && lessonDetailStore.lessonDetail.secondaryTeachers.length > 1) {
          lessonDetailStore.lessonDetail.secondaryTeachers.map((item) => {
            userRolesStore.isSecTeacherId.push(item.id);
          });
        }
        if (lessonDetailStore.lessonDetail?.students && lessonDetailStore.lessonDetail.students.length > 1) {
          lessonDetailStore.lessonDetail.students.map((item) => {
            if (item.id) {
              userRolesStore.isStudentId.push(item.id);
            }
          });
        }
      })();
    }, [lessonDetailStore, route.params.lessonId, userRolesStore, userStore]);

    useEffect(() => {
      if (!userStore.isOnClassRoom && route.params.message) {
        baseView.current?.showMessage({ text: route.params?.message, delay: 2 });
      }
    }, [route.params.message, userStore.isOnClassRoom]);

    const handleOnLoadMore = () => {};

    const onRefresh = async () => {
      setRefreshing(true);
      setTimeout(async () => {
        await lessonDetailStore.getLessonLiveDetail(route.params.lessonId);
        setRefreshing(false);
      }, 2);
    };

    /**
     * 上课页面跳转
     */
    const planningGetInto = (item, name, pass?: string) => {
      requestAudioAndVideoPermission()
        .then(() => {
          userStore.isOnClassRoom = true;
          navigation.navigate('OnlineClassRoom', { roomId: item.id, password: pass, pathName: name });
        })
        .catch((e) => baseView.current?.showMessage(e));
    };

    const clickDoing = (item: any) => {
      if (item.actualEndTime) {
        baseView.current.showMessage({ text: '课程已经结束', delay: 3 });
      } else {
        if (moment(item.planningStartTime).format('DD') === moment(new Date().getTime()).format('DD')) {
          console.log(moment(item.planningStartTime).format('HH'), moment(new Date().getTime()).format('HH'));
          if (item.planningStartTime && Number(moment(item.planningStartTime).format('HH')) - 1 > Number(moment(new Date().getTime()).format('HH'))) {
            baseView.current.showMessage({ text: '计划时间未到，请按计划时间进入教室。', delay: 3 });
          } else {
            if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PASSWORD) {
              if (
                userRolesStore.isTeacherId === userStore.userInfoDetail.id ||
                userRolesStore.isSecTeacherId.filter((items) => items === userStore.userInfoDetail.id).length > 0
              ) {
                planningGetInto(item, route.name);
              } else {
                setGetInto(item);
                setPassword('');
                setInputPass(true);
              }
            } else {
              planningGetInto(item, route.name);
            }
          }
        } else if (
          moment(item.planningStartTime).format('DD') < moment(new Date().getTime()).format('DD') ||
          moment(item.planningStartTime).format('MM') < moment(new Date().getTime()).format('MM')
        ) {
          if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PASSWORD) {
            if (
              userRolesStore.isTeacherId === userStore.userInfoDetail.id ||
              userRolesStore.isSecTeacherId.filter((items) => items === userStore.userInfoDetail.id).length > 0
            ) {
              planningGetInto(item, route.name);
            } else {
              setGetInto(item);
              setPassword('');
              setInputPass(true);
            }
          } else {
            planningGetInto(item, route.name);
          }
        } else {
          baseView.current.showMessage({ text: '还未到计划开课时间', delay: 2 });
        }
      }
    };

    const shareModal = async () => {
      setSelectShare(true);
    };

    const shareToWx = async (select: number) => {
      switch (select) {
        case 1:
          const defaultShareForOne = {
            title: `${lessonDetailStore.lessonDetail?.name}`,
            description: `授课教师: ${
              lessonDetailStore.lessonDetail?.primaryTeacher?.nickName ||
              lessonDetailStore.lessonDetail?.primaryTeacher?.realName ||
              lessonDetailStore.lessonDetail?.primaryTeacher?.username
            }`,
            thumbImageUrl: 'https://www.icst-edu.com/weixin-share/share-logo.jpg',
            webpageUrl: 'https://www.icst-edu.com/weixin-share/index.html?lesson-live-id=' + route.params.lessonId,
            scene: 0 // 分享到, 0:会话 1:朋友圈 2:收藏
          };
          try {
            const isInstalled = await WeChat.isWXAppInstalled();
            console.log(isInstalled);
            if (!isInstalled) {
              console.log('请先安装微信');
              return Promise.resolve(false);
            }
            const metadata = { ...defaultShareForOne };
            const res = await WeChat.shareWebpage(metadata);
            if (res.errCode === 0) {
              // 分享成功
              console.log('分享成功');
              return Promise.resolve(true);
            }
          } catch (e) {
            console.log('分享失败');
            if (e) {
              console.warn(e.stack);
            } else {
              console.log(e);
            }
          }
          break;
        case 2:
          const defaultShareForTwo = {
            title: `${lessonDetailStore.lessonDetail?.name}`,
            description: `授课教师: ${
              lessonDetailStore.lessonDetail?.primaryTeacher?.realName ||
              lessonDetailStore.lessonDetail?.primaryTeacher?.nickName ||
              lessonDetailStore.lessonDetail?.primaryTeacher?.username
            }`,
            thumbImageUrl: 'https://www.icst-edu.com/weixin-share/share-logo.jpg',
            webpageUrl: 'https://www.icst-edu.com/weixin-share/index.html?lesson-live-id=' + route.params.lessonId,
            scene: 1 // 分享到, 0:会话 1:朋友圈 2:收藏
          };
          try {
            const isInstalled = await WeChat.isWXAppInstalled();
            console.log(isInstalled);
            if (!isInstalled) {
              console.log('请先安装微信');
              return Promise.resolve(false);
            }
            const metadata = { ...defaultShareForTwo };
            console.log(metadata);
            const res = await WeChat.shareWebpage(metadata);
            if (res.errCode === 0) {
              // 分享成功
              console.log('分享成功');
              return Promise.resolve(true);
            }
          } catch (e) {
            console.log('分享失败');
            if (e) {
              console.warn(e.stack);
            } else {
              console.log(e);
            }
          }
          break;
      }
    };

    const selectShareMode = () => {
      return (
        <Portal>
          <Modal
            onDismiss={() => {
              setSelectShare(false);
            }}
            visible={selectShare}
            contentContainerStyle={[tw.mX5, { borderRadius: 8, backgroundColor: colors.background }]}
          >
            <View style={[tw.m4]}>
              <Text style={[{ fontSize: 15, color: colors.placeholder }]}>发送到:</Text>
              <View style={[tw.mY3, tw.flexRow, tw.flexGrow, tw.justifyAround]}>
                <TouchableWithoutFeedback
                  onPress={async () => {
                    await shareToWx(1);
                  }}
                >
                  <View style={[tw.itemsCenter]}>
                    <FastImage source={require('../../../assets/weChat.png')} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.cover} />
                    <Text style={[tw.mT1, { fontSize: 12, color: colors.text }]}>微信好友</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={async () => {
                    await shareToWx(2);
                  }}
                >
                  <View style={[tw.itemsCenter]}>
                    <FastImage source={require('../../../assets/friends.png')} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.cover} />
                    <Text style={[tw.mT1, { fontSize: 12, color: colors.text }]}>朋友圈</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const inputPassModal = () => {
      return (
        <Portal>
          <Modal visible={inputPass} dismissable={false} contentContainerStyle={[tw.mX10, { borderRadius: 12, backgroundColor: colors.background }]}>
            <Text style={[tw.mT3, tw.mB2, tw.selfCenter, { fontSize: 15, color: colors.placeholder }]}>请输入本节课程的密码</Text>
            <TextInput
              placeholder="输入课程密码"
              style={[tw.mY3, tw.mX3, tw.bgGray200, tw.borderGray200, { height: 40, borderWidth: 0.5, borderRadius: 5 }]}
              value={password}
              onChangeText={(e) => {
                setPassword(e);
              }}
            />
            <View style={[tw.flexRow, tw.justifyBetween, tw.borderGray200, { borderTopWidth: 0.5 }]}>
              <TouchableOpacity
                style={[tw.itemsCenter, tw.flex1, tw.pY3]}
                onPress={() => {
                  setInputPass(false);
                }}
              >
                <Text>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[tw.itemsCenter, tw.flex1, tw.pY3, tw.borderGray200, { borderRightWidth: 0.5 }]}
                onPress={() => {
                  userStore.getPublicKey().then((result) => {
                    if (result) {
                      RSA.encrypt(password, result).then((resPass) => {
                        lessonDetailStore.getValidate({ password: resPass, scheduleLiveId: getInto.id }).then((res) => {
                          if (typeof res === 'boolean') {
                            planningGetInto(getInto, route.name, resPass);
                          } else {
                            baseView.current.showMessage({ text: res, delay: 3 });
                          }
                        });
                        setInputPass(false);
                      });
                    }
                  });
                }}
              >
                <Text>确认</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };

    const comLiveOrDemand = () => {
      if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
        return (
          <View>
            <Text style={[tw.mB1, { color: colors.disabled, fontSize: 13 }]}>
              开始时间：<Text>{dataLecture?.actualEndTime || dataLecture?.planningStartTime}</Text>
            </Text>
            <Text style={[{ color: colors.disabled, fontSize: 13 }]}>
              结束时间：<Text>{dataLecture?.planningEndTime || dataLecture?.actualEndTime}</Text>
            </Text>
          </View>
        );
      } else {
        if (dataLecture?.resourceFiles?.length) {
          return (
            <View>
              <Text style={[{ color: colors.disabled, fontSize: 13 }]}>
                资源数：<Text>{dataLecture.resourceFiles.length}个</Text>
              </Text>
            </View>
          );
        }
      }
    };

    const section = () => {
      return (
        <View style={[tw.p2, tw.wFull, tw.borderGray300, { borderBottomWidth: 0.5 }]}>
          <View style={[tw.flexRow, tw.justifyBetween]}>
            <View>
              <Text style={[tw.mB2, { color: colors.disabled }]}>
                课次名：<Text style={[{ color: colors.accent }]}>{dataLecture?.name}</Text>
              </Text>
              {comLiveOrDemand()}
            </View>
            {lessonDetailStore.typeNum === 0 && lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 ? (
              <View style={[tw.flex, tw.justifyBetween, tw.itemsCenter]}>
                {dataLecture?.actualEndTime ? (
                  <Text style={[{ color: colors.placeholder }]}>已结束</Text>
                ) : (
                  <Text style={[{ color: colors.accent }]}>未开始</Text>
                )}
                <Text style={[{ fontSize: 12, color: colors.placeholder }]}>
                  学生数（<Text style={[{ color: colors.accent, fontWeight: 'bold' }]}>{lessonDetailStore.lessonDetail?.studentCount}</Text>）
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      );
    };

    const renderMenuModal = () => {
      let isTeacher =
        lessonDetailStore.lessonDetail?.primaryTeacher?.id === userStore.userInfoDetail.id ||
        lessonDetailStore.lessonDetail?.secondaryTeachers?.find((item) => item.id === userStore.userInfoDetail.id);

      return (
        <BottomSheetChildren>
          <View style={[tw.flex1]}>
            {section()}
            <View style={[tw.flex1]}>
              {isTeacher ? (
                <TouchableOpacity
                  style={[tw.pB4, tw.pT8, tw.itemsCenter, tw.flexRow]}
                  onPress={() => {
                    if (lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.studentCount !== undefined) {
                      if (lessonDetailStore.lessonDetail.studentCount > 0) {
                        homeworkCreateStore.lectureData = dataLecture;
                        menuSheet.current.snapTo(0);
                        navigation.navigate('Main', { screen: 'HomeworkCreated', params: { lectureId: dataLecture?.id, lessonType: 'live' } });
                      } else {
                        menuSheet.current.snapTo(0);
                        baseView.current.showMessage({ text: '此课程还没有学生报名，无法创建作业', delay: 3 });
                      }
                    }
                  }}
                >
                  <Icon name="add-circle-outline" size={30} color={colors.accent} />

                  <Text style={[tw.mL2, { fontSize: 16, fontWeight: 'bold' }]}>创建作业</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[tw.pB8, tw.pT4, tw.itemsCenter, tw.flexRow]}
                onPress={() => {
                  homeworkCreateStore.lectureData = dataLecture;
                  menuSheet.current.snapTo(0);
                  navigation.navigate('Main', { screen: 'HomeworkList', params: { id: homeworkCreateStore.lectureData.id, lessonType: 'live' } });
                }}
              >
                <Icon name="history-edu" size={30} color={colors.accent} />

                <Text style={[tw.mL2, { fontSize: 16, fontWeight: 'bold' }]}>查看作业</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetChildren>
      );
    };

    const menuModal = () => {
      let isTeacher =
        lessonDetailStore.lessonDetail?.primaryTeacher?.id === userStore.userInfoDetail.id ||
        lessonDetailStore.lessonDetail?.secondaryTeachers?.find((item) => item.id === userStore.userInfoDetail.id);

      return <BottomSheet ref={menuSheet} snapPoints={isTeacher ? [0, 300, 150] : [0, 200, 100]} borderRadius={20} renderContent={renderMenuModal} />;
    };

    const itemView = (item, index) => {
      let isToday = moment(new Date()).format('MM-DD') === moment(item.planningStartTime).format('MM-DD');
      let viceSize = isToday ? 14 : 12;
      let mainSize = isToday ? 17 : 14;

      return (
        <View style={[tw.mB5]} key={index}>
          <Text style={[{ fontWeight: isToday ? 'bold' : undefined, color: isToday ? colors.accent : colors.placeholder, fontSize: mainSize }]}>
            {moment(item.planningStartTime).format('MM-DD')}
          </Text>
          <TouchableOpacity
            // style={[tw.mT3, { backgroundColor: colors.surface, borderRadius: 5 }]}
            style={[tw.mT3, tw.borderGray200, tw.mX3, tw.mT3, tw.pB3, { borderBottomWidth: 0.5 }]}
            onPress={() => {
              menuSheet.current.snapTo(0);
              clickDoing(item);
            }}
          >
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween]}>
              <View>
                <Text style={[tw.mB2, tw.justifyCenter, { fontSize: viceSize, color: colors.placeholder }]}>
                  （{index + 1}）<Text style={[tw.mB2, { fontSize: mainSize }]}>{item?.name}</Text>
                </Text>
                <View style={[tw.flexRow]}>
                  <Text style={[{ fontSize: viceSize, color: colors.placeholder }]}> 上课时间：</Text>
                  <Text style={[{ fontSize: viceSize, color: colors.text }]}>
                    {item.planningStartTime?.trim().split(' ')[1].slice(0, 5)} - {item.planningEndTime?.trim().split(' ')[1].slice(0, 5)}
                  </Text>
                </View>
              </View>
              <View style={[tw.flexRow]}>
                {lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_NEED_PAY || lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PRIVATE ? (
                  <TouchableOpacity
                    style={[tw.p3]}
                    onPress={() => {
                      lessonDetailStore.selectLecture = item;
                      setDataLecture(item);
                      menuSheet.current.snapTo(1);
                    }}
                  >
                    <Icon name="more-vert" color={colors.placeholder} size={22} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    const renderItem = ({ item, index }): ReactElement | null => {
      if (item.actualEndTime === null && item.actualStartTime === null) {
        return itemView(item, index);
      } else {
        return <View key={index} />;
      }
    };

    const demandOrLiveHeader = (scList) => {
      if (lessonDetailStore.typeNum === 0 || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
        if (scList) {
          return (
            <View>
              <View style={[]}>
                <Text style={[{ fontSize: 14 }]}>{moment(scList[0].planningStartTime).format('YYYY年')}</Text>
              </View>
              <View style={[tw.flexRow]}>
                <Text style={[{ fontSize: 14, marginBottom: 12, color: colors.accent }]}>
                  {moment(scList[0].planningStartTime).format('MM月DD日 HH点mm分')}
                </Text>
                <Text style={[{ fontSize: 14, marginBottom: 12, color: colors.placeholder }]}> 至 </Text>
                <Text style={[{ fontSize: 14, marginBottom: 12, color: colors.accent }]}>
                  {moment(scList[scList.length - 1].planningEndTime).format('MM月DD日 HH点mm分')}
                </Text>
              </View>
            </View>
          );
        }
      } else {
        return (
          <View>
            <View style={[tw.flexRow]}>
              <Text style={[{ fontSize: 14, marginBottom: 12, color: colors.placeholder }]}> 创建时间 </Text>
              <Text style={[{ fontSize: 14, marginBottom: 12, color: colors.accent }]}>
                {moment(scList[scList.length - 1].planningStartTime).format('MM月DD日 HH点mm分')}
              </Text>
            </View>
          </View>
        );
      }
    };

    const renderHeader = (props) => {
      return (
        <View style={[tw.p5, tw.flex, { backgroundColor: colors.surface }]}>
          <View style={[tw.flexRow, tw.justifyBetween]}>
            <Text style={[{ fontSize: 18, fontWeight: 'bold', marginBottom: isShow ? 12 : 0 }]}>{lessonDetailStore.lessonDetail?.name}</Text>
            {(isShow && lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PRIVATE) ||
            lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_NEED_PAY ? (
              <TouchableOpacity>
                <View style={[tw.itemsCenter, tw.justifyCenter, { padding: 5, width: 45, height: 45, backgroundColor: colors.accent, borderRadius: 50 }]}>
                  <Text numberOfLines={1} style={[tw.textWhite, { fontSize: 11 }]}>
                    学生数
                  </Text>
                  <Text style={[tw.textWhite, { fontSize: 13 }]}>{lessonDetailStore.lessonDetail?.studentCount}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          {isShow ? demandOrLiveHeader(props.scList) : null}
          {isShow ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={[tw.flexRow]}>
              <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR4]}>
                <AvatarView name="主" avatar={getStr(lessonDetailStore.lessonDetail?.primaryTeacher?.avatar?.url)} size={30} />
                <View style={[tw.mL2]}>
                  <Text style={[tw.mT1, tw.mB1, { fontSize: 10, color: colors.placeholder }]}>{t('lectureList.teacher')}</Text>
                  <Text style={[{ fontSize: 12 }]}>{getStr(lessonDetailStore.lessonDetail?.primaryTeacher?.username)}</Text>
                </View>
              </View>
              {lessonDetailStore.lessonDetail?.secondaryTeachers?.map((item, index) => (
                <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR4]} key={index}>
                  <AvatarView color={colors.accent} name="助" avatar={item.avatar ? item.avatar.url : ''} size={30} />
                  <View style={[tw.mL2]}>
                    <Text style={[tw.mT1, tw.mB1, { fontSize: 10, color: colors.placeholder }]}>{t('lectureList.assistant')}</Text>
                    <Text style={[{ fontSize: 12 }]}>{getStr(item.username)}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>
      );
    };

    const demandOrLiveBody = (data, index) => {
      let isToday = moment(new Date()).format('MM-DD') === moment(data.planningStartTime).format('MM-DD');
      let mainSize = isToday ? 16 : 13;
      if (data.actualEndTime) {
        return (
          <View style={[tw.mB2]} key={index}>
            <Text style={[{ fontWeight: isToday ? 'bold' : undefined, color: isToday ? colors.placeholder : colors.disabled, fontSize: mainSize }]}>
              {moment(data.planningStartTime).format('MM-DD')}
            </Text>
            <TouchableOpacity
              style={[tw.borderGray200, tw.mX3, tw.mT3, tw.pB3, { borderBottomWidth: 0.5 }]}
              onPress={() => {
                if (data.canReplay) {
                  if (widthThanHeight) {
                    lessonDetailStore
                      .getSchedulesReplay(data.id)
                      .then((res) => {
                        if (typeof res === 'string') {
                          baseView.current.showMessage({ text: res, delay: 3 });
                        } else {
                          setSelectModal(true);
                        }
                      })
                      .catch((err) => {
                        console.log('出现错误', err);
                      });
                  } else {
                    lessonDetailStore.lessonDetailSchedules = data;
                    navigation.navigate('Main', { screen: 'ReplayVideo', params: { id: data.id } });
                  }
                } else {
                  baseView.current.showMessage({ text: '已经下课，无法进入教室', delay: 2 });
                }
              }}
            >
              <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
                <View>
                  <Text style={[tw.mB2, { fontSize: 14, color: data.actualEndTime ? colors.placeholder : colors.text }]}>
                    {`（${index + 1}） ${data.name ? data.name : ''}`}
                  </Text>
                  <View style={[tw.flexRow, tw.itemsCenter]}>
                    <Text style={[{ fontSize: 12, color: colors.placeholder }]}> 下课时间：</Text>
                    <Text style={[{ fontSize: 11, color: colors.disabled }]}>{data?.actualEndTime}</Text>
                  </View>
                </View>
                <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.hFull]}>
                  {data.canReplay ? <Text style={[{ fontSize: 13, color: colors.accent }, tw.mX2]}>回放</Text> : null}

                  {lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PRIVATE || lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_NEED_PAY ? (
                    <TouchableOpacity
                      style={[tw.p3]}
                      onPress={() => {
                        lessonDetailStore.selectLecture = data;
                        setDataLecture(data);
                        menuSheet.current.snapTo(1);
                      }}
                    >
                      <Icon name="more-vert" color={colors.placeholder} size={22} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/*{renderCloseClass(item.status)}*/}
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    };

    const showSchModal = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[{ padding: 30, marginLeft: 300, marginRight: 300 }]}
            visible={selectModal}
            onDismiss={() => {
              setSelectModal(false);
            }}
          >
            <View style={[tw.mX5, { borderRadius: 8, backgroundColor: colors.background }]}>
              <Text style={[tw.selfCenter, tw.mT3, { fontSize: 16 }]}>选集</Text>
              <View style={[tw.flexRow, tw.p3, tw.flexWrap, tw.justifyCenter]}>
                {lessonDetailStore.scheduleReplays.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={[tw.m2]}
                      onPress={() => {
                        setSelectModal(false);
                        navigation.navigate('Main', { screen: 'LessonVideoView', params: { url: item, back: 'LectureList' } });
                      }}
                      key={index}
                    >
                      <View style={[tw.itemsCenter, tw.p3, tw.borderBlue500, { borderRadius: 6, borderWidth: 0.5 }]}>
                        <Text style={[{ fontSize: 15, color: colors.accent }]}>第{index + 1}节</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectModal(false);
                }}
              >
                <View style={[tw.itemsCenter, tw.pY3, tw.borderGray600, { borderTopWidth: 0.25 }]}>
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };

    const flatListFooter = () => {
      const scList: ScheduleList[] | undefined = lessonDetailStore.lessonDetail?.schedules;
      if (scList && scList.length > 0) {
        return (
          <View style={[{ marginBottom: 50 }]}>
            {scList.filter((item) => item.actualEndTime !== null).length > 0 ? (
              <Text style={[tw.mY3, { fontSize: 18, color: colors.disabled, fontWeight: 'bold' }]}>
                已结束 （
                {
                  lessonDetailStore.lessonDetail?.schedules?.filter((item) => {
                    if (item.actualStartTime && item.actualEndTime) {
                      return item;
                    }
                  }).length
                }
                节课）
              </Text>
            ) : null}

            {scList.map((item, index) => {
              return demandOrLiveBody(item, index);
            })}
          </View>
        );
      } else {
        return null;
      }
    };

    const headerList = (item, index) => {
      if (item.actualEndTime === null && item.actualStartTime) {
        return itemView(item, index);
      } else {
        return <View key={index} />;
      }
    };

    const flatListHeader = () => {
      const scList: ScheduleList[] | undefined = lessonDetailStore.lessonDetail?.schedules;
      if (scList && scList.length > 0) {
        return (
          <View style={[]}>
            <TouchableOpacity
              style={[tw.absolute, tw.bgBlue200, tw.p2, tw.selfCenter, { borderRadius: 28, right: 10, zIndex: 99 }]}
              onPress={() => {
                setIsShow(!isShow);
              }}
            >
              <Icon
                onPress={() => {
                  setIsShow(!isShow);
                }}
                size={18}
                name={!isShow ? 'arrow-downward' : 'arrow-upward'}
                color={colors.accent}
              />
            </TouchableOpacity>
            {scList.filter((item) => {
              if (item.actualEndTime === null && item.actualStartTime) {
                return item;
              }
            }).length > 0 ? (
              <Text style={[tw.mY3, { fontSize: 18, color: colors.accent, fontWeight: 'bold' }]}>
                已开始 （
                {
                  lessonDetailStore.lessonDetail?.schedules?.filter((item) => {
                    if (item.actualStartTime && item.actualEndTime === null) {
                      return item;
                    }
                  }).length
                }
                节课）
              </Text>
            ) : null}

            {scList.map((item, index) => {
              return headerList(item, index);
            })}
            {scList.filter((item) => {
              if (item.actualEndTime === null && item.actualStartTime === null) {
                return item;
              }
            }).length > 0 ? (
              <Text style={[tw.mY3, tw.textBlue300, { fontSize: 18, fontWeight: 'bold' }]}>
                未开始 （
                {
                  lessonDetailStore.lessonDetail?.schedules?.filter((item) => {
                    if (item.actualStartTime === null && item.actualEndTime === null) {
                      return item;
                    }
                  }).length
                }
                节课）
              </Text>
            ) : null}
          </View>
        );
      } else {
        return null;
      }
    };

    const MemoHeader = memo(renderHeader);

    const renderContent = () => {
      // actualEndTime;
      if (lessonDetailStore.lessonDetail?.schedules) {
        console.log(lessonDetailStore.lessonDetail.schedules, '这是所有的录像文件');
        let lessonList: ScheduleList[] = lessonDetailStore.lessonDetail.schedules.filter((item) => item.actualEndTime === null);
        return (
          <View style={[tw.flex1]}>
            <MemoHeader scList={lessonDetailStore.lessonDetail?.schedules} />
            <FlatList
              style={[tw.flex, tw.p3, { backgroundColor: colors.background }]}
              scrollEnabled={true}
              data={lessonList}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              numColumns={1}
              renderItem={renderItem}
              onEndReached={handleOnLoadMore}
              onEndReachedThreshold={0.1}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListHeaderComponent={flatListHeader}
              ListFooterComponent={flatListFooter}
            />
          </View>
        );
      }
    };
    if (lessonDetailStore.loading) {
      return (
        <View style={[tw.flex1, { marginTop: getStatusBarHeight(true) }]}>
          <LessonDetailPlaceholder />
        </View>
      );
    } else {
      return (
        <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('lectureList.classSchedule')} />
            <Appbar.Action
              icon="share"
              onPress={async () => {
                await shareModal();
              }}
            />
          </Appbar.Header>
          {renderContent()}
          {menuModal()}
          {inputPassModal()}
          {showSchModal()}
          {selectShareMode()}
        </BaseView>
      );
    }
  }
);
