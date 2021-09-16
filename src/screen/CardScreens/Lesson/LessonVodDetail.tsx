import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Appbar, Button, Card, Avatar, Divider, Text, useTheme, Modal, Portal } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import { useStore } from '../../../store';
import BaseView from '../../../component/BaseView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { tw } from 'react-native-tailwindcss';
import FastImage from 'react-native-fast-image';
import { getBottomSpace, getStatusBarHeight, getStr } from '../../../common/tools';
import AvatarView from '../../../component/AvatarView';
import { LessonDetailPlaceholder } from '../../../component/skeleton/LessonDetailPlaceholder';
import BottomSheet from 'reanimated-bottom-sheet';
import { observer } from 'mobx-react-lite';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { t } from '../../../common/tools';
import { LESSON_TYPE_NEED_PAY, LESSON_TYPE_PASSWORD, LESSON_TYPE_PRIVATE, LESSON_TYPE_PUBLIC } from '../../../common/status-module';
import * as WeChat from 'react-native-wechat-lib';
import { appConfig } from '../../../common/app.config';

WeChat.registerApp(appConfig.WX_APP_ID, 'fack universalLink')
  .then((r) => {
    console.log('success', r);
  })
  .catch((e) => {
    console.log('fail', e);
  });

type ScreenRouteProp = RouteProp<ScreensParamList, 'LessonVodDetail'>;
type Props = {
  route: ScreenRouteProp;
};

type imageHType = {
  width: number;
  height: number;
};

const widthD: number = Dimensions.get('window').width;

export const LessonVodDetail: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const BAR_HEIGHT = 56;
    const baseView = useRef<any>();
    const { lessonDetailStore, userStore, payStore } = useStore();
    const paySheet = useRef<any>(null);
    const [paySelect, setPaySelect] = useState(0);
    const [imageH, setImageH] = useState<imageHType[]>([]);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    const [heightOrWidth] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
    const [selectShare, setSelectShare] = useState(false);
    const [isMainTeacher, setIsMainTeacher] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const updateSignUp = useCallback(() => {
      lessonDetailStore.getLessonVodDetail(route.params.lessonId).then(() => {
        console.log('进入页面');
        if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PUBLIC || lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PASSWORD) {
          console.log('公开课不需要报名');
          setIsMainTeacher(true);
        } else {
          if (lessonDetailStore.lessonDetail?.primaryTeacher?.id === userStore.userInfoDetail.id) {
            console.log('课程就是我自己创建的');
            setIsMainTeacher(true);
          } else {
            console.log('课程不是我自己创建的');
            let list = lessonDetailStore.lessonDetail?.secondaryTeachers?.filter((item) => item.id === userStore.userInfoDetail.id);
            if (list && list.length > 0) {
              console.log('课程是我参与的');
              setIsMainTeacher(true);
            } else {
              console.log('课程不是我参与的');
              setIsMainTeacher(false);
            }
          }
        }
        let studentsList = lessonDetailStore.lessonDetail?.students?.filter((item) => item.id === userStore.userInfoDetail.id);
        if (studentsList && studentsList.length > 0) {
          console.log('我已经报名了');
          setIsSignUp(true);
        } else {
          console.log('我还没有报名');
          setIsSignUp(false);
        }
      });
    }, [lessonDetailStore, route.params.lessonId, userStore.userInfoDetail.id]);

    useEffect(() => {
      (async () => {
        lessonDetailStore.loading = true;
        updateSignUp();
        setTimeout(() => {
          lessonDetailStore.loading = false;
        }, 500);
      })();
    }, [lessonDetailStore, updateSignUp]);

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
            webpageUrl: 'https://www.icst-edu.com/weixin-share/index.html?lesson-vod-id=' + route.params.lessonId,
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
        case 2:
          const defaultShareForTwo = {
            title: `${lessonDetailStore.lessonDetail?.name}`,
            description: `授课教师: ${
              lessonDetailStore.lessonDetail?.primaryTeacher?.realName ||
              lessonDetailStore.lessonDetail?.primaryTeacher?.nickName ||
              lessonDetailStore.lessonDetail?.primaryTeacher?.username
            }`,
            thumbImageUrl: 'https://www.icst-edu.com/weixin-share/share-logo.jpg',
            webpageUrl: 'https://www.icst-edu.com/weixin-share/index.html?lesson-vod-id=' + route.params.lessonId,
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

    // const getLessonTypeContent = (type) => {
    //   switch (type) {
    //     case LESSON_TYPE_PUBLIC:
    //       return (
    //         <>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>公</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>开</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>课</Text>
    //         </>
    //       );
    //     case LESSON_TYPE_PASSWORD:
    //       return (
    //         <>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>密</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>码</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>课</Text>
    //         </>
    //       );
    //     case LESSON_TYPE_NEED_PAY:
    //       return (
    //         <>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>付</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>费</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>课</Text>
    //         </>
    //       );
    //     case LESSON_TYPE_PRIVATE:
    //       return (
    //         <>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>管</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>理</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>员</Text>
    //           <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 12 }]}>课</Text>
    //         </>
    //       );
    //   }
    // };

    const getLessonTypeContent = (type) => {
      switch (type) {
        case LESSON_TYPE_PUBLIC:
          return '公开课';
        case LESSON_TYPE_PASSWORD:
          return '密码课';
        case LESSON_TYPE_NEED_PAY:
          return '付费课';
        case LESSON_TYPE_PRIVATE:
          return '管理员课';
      }
    };

    const renderHeader = () => {
      if (lessonDetailStore.lessonDetail?.imageCover?.url) {
        return (
          <FastImage
            source={{ uri: lessonDetailStore.lessonDetail.imageCover.url }}
            onLoad={(e) => {
              if (heightOrWidth) {
                setHeaderWidth(((Dimensions.get('window').height / e.nativeEvent.height) * e.nativeEvent.width) / 2);
              } else if (e.nativeEvent.height > Dimensions.get('window').height / 1.5 && e.nativeEvent.height > e.nativeEvent.width) {
                setHeaderHeight(Dimensions.get('window').height / 2);
                setHeaderWidth((Dimensions.get('window').height / 2 / e.nativeEvent.height) * e.nativeEvent.width);
              } else {
                setHeaderHeight((Dimensions.get('window').width / e.nativeEvent.width) * e.nativeEvent.height);
              }
            }}
            style={[
              heightOrWidth ? tw.selfCenter : null,
              { width: heightOrWidth ? headerWidth : '100%', height: heightOrWidth ? Dimensions.get('window').height / 2 : headerHeight }
            ]}
            resizeMode={heightOrWidth ? FastImage.resizeMode.stretch : FastImage.resizeMode.contain}
          />
        );
      }
    };

    const description = () => {
      return (
        <View style={[tw.mB2]}>
          <Text numberOfLines={1} style={[tw.p3, tw.textLg, tw.fontBold]}>
            {lessonDetailStore.lessonDetail?.name}
          </Text>
          {lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.description && lessonDetailStore.lessonDetail.description.length > 0 ? (
            <View style={[tw.leadingLoose, tw.flexRow, tw.pX3, tw.itemsCenter]}>
              <Text>{t('lessonDetail.detail')}: </Text>
              <View style={[tw.flex1]}>
                <Text style={[tw.fontLight, { fontSize: 12 }]}>{lessonDetailStore.lessonDetail.description}</Text>
              </View>
            </View>
          ) : null}
          {/*<View style={[tw.bgBlue400, tw.absolute, tw.pB5, tw.itemsCenter, { width: 30, top: 0, right: 40, overflow: 'hidden' }]}>*/}
          {/*  {getLessonTypeContent(lessonDetailStore.lessonDetail?.authType)}*/}
          {/*  <View style={[tw.bgWhite, tw.absolute, { opacity: 1, bottom: -10.6, height: 21.2, width: 21.2, transform: [{ rotate: '45deg' }] }]} />*/}
          {/*</View>*/}
        </View>
      );
    };
    const coursePrice = () => {
      if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_NEED_PAY) {
        return (
          <View style={[tw.p3, tw.flexRow, tw.itemsCenter]}>
            <View style={[tw.flex1, tw.flexRow, tw.itemsCenter]}>
              <Icon name="local-offer" size={15} color={colors.notification} />
              <Text style={[tw.textBase, tw.mL1, { color: colors.notification }]}>{lessonDetailStore.lessonDetail?.price}学悦币</Text>
              <Text style={[tw.mL2, { color: colors.disabled }]}>原价：{lessonDetailStore.lessonDetail.pricePrevious}</Text>
            </View>
            {/*{lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 ? (*/}
            {/*  <View style={[tw.flex1, tw.itemsEnd]}>*/}
            {/*    <Text style={[tw.textXs, tw.fontLight]}>*/}
            {/*      {t('lessonDetail.rePlaces')}: {lessonDetailStore.lessonDetail?.presetStudentCount}*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*) : null}*/}
          </View>
        );
      }
    };

    const renderLessonHeader = () => {
      return (
        <View>
          {renderHeader()}
          <View
            style={[
              tw.bgBlue400,
              tw.absolute,
              tw.itemsCenter,
              Platform.OS === 'ios' ? tw.pX2 : { padding: 5 },
              Platform.OS === 'ios' ? tw.pY2 : { padding: 5 },
              { borderBottomLeftRadius: 5, top: 0, right: 0, overflow: 'hidden' }
            ]}
          >
            <Text style={[tw.textWhite, { fontWeight: 'bold', fontSize: 16 }]}>{getLessonTypeContent(lessonDetailStore.lessonDetail?.authType)}</Text>
          </View>
          {description()}
          {coursePrice()}
          <Divider />
          <TouchableOpacity style={[tw.flexRow, tw.mX3, tw.mY4, tw.itemsCenter]}>
            <Icon name="laptop" size={15} color={colors.notification} />
            <Text style={[tw.mR4, tw.mL2]}>{t('lessonDetail.service')}</Text>
            <View style={[tw.flex1, tw.flexRow]}>
              <Text numberOfLines={2} style={{ fontSize: 11 }}>
                {t('lessonDetail.seDetail')}
              </Text>
            </View>
          </TouchableOpacity>
          <Divider />
        </View>
      );
    };

    const renderTeacherDetail = () => {
      return (
        <View style={[tw.m3]}>
          <Text style={[tw.textBase, tw.fontBold]}>{t('lessonDetail.teacher')}</Text>
          <View style={[tw.flexRow]}>
            {lessonDetailStore.lessonDetail?.primaryTeacher ? (
              <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR3]}>
                <AvatarView
                  name="主"
                  avatar={lessonDetailStore.lessonDetail?.primaryTeacher.avatar ? lessonDetailStore.lessonDetail?.primaryTeacher.avatar.url : ''}
                  size={40}
                />
                <View style={[tw.mL2]}>
                  <Text style={[tw.textSm]}>{getStr(lessonDetailStore.lessonDetail?.primaryTeacher.username)}</Text>
                  <Text style={[tw.mT1, { fontSize: 10, color: colors.placeholder }]}>{t('lessonDetail.mainTeacher')}</Text>
                </View>
              </View>
            ) : null}
            {lessonDetailStore.lessonDetail?.secondaryTeachers?.map((item, index) => {
              return (
                <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR3]} key={index}>
                  <AvatarView name="助" avatar={item.avatar ? item.avatar.url : ''} size={40} />
                  <View style={[tw.mL2]}>
                    <Text style={[tw.textSm]}>{getStr(item.username)}</Text>
                    <Text style={[tw.mT1, { fontSize: 10, color: colors.placeholder }]}>{t('lessonDetail.assistant')}</Text>
                  </View>
                </View>
              );
            })}
            {/*{lessonDetailStore.lessonDetail?.teacherList?.map((item, index) => {*/}
            {/*  if (!item.isMajor) {*/}
            {/*    return (*/}
            {/*      <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR3]} key={index}>*/}
            {/*        <AvatarView name={getStr(item.teacherUsername)} avatar={getSafeAvatar(getStr('')).uri} size={40} />*/}
            {/*        <View style={[tw.mL2]}>*/}
            {/*          <Text style={[tw.textSm]}>{getStr(item.teacherUsername)}</Text>*/}
            {/*          <Text style={[tw.mT1, { fontSize: 10, color: colors.placeholder }]}>*/}
            {/*            {item.isMajor ? t('lessonDetail.mainTeacher') : t('lessonDetail.assistant')}*/}
            {/*          </Text>*/}
            {/*        </View>*/}
            {/*      </View>*/}
            {/*    );*/}
            {/*  }*/}
            {/*})}*/}
          </View>
        </View>
      );
    };

    const courseItem = (infoDetail) => {
      let list: JSX.Element[] = [];
      let finalLength = infoDetail?.length > 6 ? 6 : infoDetail?.length;
      // if (lessonDetailStore.lessonDetail?.type !== 9) {
      if (finalLength) {
        for (let i = 0; i < finalLength; i++) {
          list.push(
            <View key={i} style={[tw.mY3, tw.mX3, tw.flexRow, tw.itemsCenter]}>
              <View style={[{}]}>
                <Text numberOfLines={1}>（{i + 1}）</Text>
              </View>
              <View style={[tw.mL2, tw.flex1]}>
                <Text numberOfLines={1}>{infoDetail[i].name}</Text>
                <Text numberOfLines={1} style={[tw.mT1, { color: colors.placeholder, fontSize: 11 }]}>
                  {/*{moment(infoDetail[i].planningStartTime).format('YYYY-MM-DD HH:mm')}*/}
                  {/*{' - '}*/}
                  {/*{moment(infoDetail[i].planningEndTime).format('HH:mm')}*/}
                  资源数量：{infoDetail[i]?.resourceFiles?.length}
                </Text>
              </View>
              <Divider />
            </View>
          );
        }
      }
      // } else if (lessonDetailStore.lessonDetail?.type === 9) {
      //   for (let i = 0; i < finalLength; i++) {
      //     list.push(
      //       <View key={i} style={[tw.mY3, tw.mX3, tw.flexRow, tw.itemsCenter]}>
      //         <View style={[tw.w16]}>
      //           <Text numberOfLines={1}>{i + 1} .</Text>
      //         </View>
      //         <View style={[tw.mL2, tw.flex1]}>
      //           <Text numberOfLines={1}>{infoDetail[i].vodFileName}</Text>
      //           <Text numberOfLines={1} style={[tw.mT1, { color: colors.placeholder, fontSize: 11 }]}>
      //             {t('lessonDetail.duration')}: {infoDetail[i].duration} {t('lessonDetail.second')}
      //           </Text>
      //         </View>
      //         <Divider />
      //       </View>
      //     );
      //   }
      // }
      return list;
    };

    const courseList = () => {
      // // if (lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail?.type !== 9) {
      // return (
      //   <>
      //     {courseItem(lessonDetailStore.lessonDetail?.schedules)}
      //     {lessonDetailStore.lessonDetail?.schedules && lessonDetailStore.lessonDetail?.schedules.length > 6 ? (
      //       <TouchableOpacity
      //         style={[tw.selfCenter, tw.pY3]}
      //         onPress={async () => {
      //           await getCourseList();
      //         }}
      //       >
      //         <Text>{t('lessonDetail.viewAll')}</Text>
      //       </TouchableOpacity>
      //     ) : null}
      //   </>
      // );
      // }
      // else if (lessonDetailStore.lessonDetail?.type === 9) {
      return <>{courseItem(lessonDetailStore.lessonDetail?.schedules)}</>;
      // }
    };

    const renderScheduleDetail = () => {
      return (
        <View style={[tw.m3]}>
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <Text style={[tw.textBase, tw.fontBold]}>{t('lessonDetail.courseOutline')}</Text>
            <Text style={[tw.mL2, tw.textXs, tw.fontLight]}>
              {t('lessonDetail.total')}:{lessonDetailStore.lessonDetail?.schedules?.length}
            </Text>
          </View>
          {courseList()}
        </View>
      );
    };

    const getImageHeight = (height: number, width: number) => {
      let imagesStyle: imageHType[] = imageH.concat([{ width: widthD, height: Math.ceil(height * (widthD / width)) }]);
      setImageH(imagesStyle);
      console.log(imageH);
    };

    const renderLessonDetail = () => {
      if (lessonDetailStore.lessonDetail?.imageDetailList && lessonDetailStore.lessonDetail?.imageDetailList?.length > 0) {
        return (
          <View style={[tw.mT3]}>
            <Text style={[tw.mX3, tw.textBase, tw.fontBold]}>{t('lessonDetail.courseDetails')}</Text>
            <View style={[tw.mY3, tw.flexCol, { color: colors.placeholder }]}>
              {lessonDetailStore.lessonDetail?.imageDetailList?.map((item, index) => {
                return (
                  <FastImage
                    key={index}
                    onLoad={(e) => {
                      getImageHeight(e.nativeEvent.height, e.nativeEvent.width);
                    }}
                    style={[{ width: widthD, height: imageH.length > index ? imageH[index].height : 0 }]}
                    source={{ uri: item.url, priority: 'low' }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                );
              })}
            </View>
          </View>
        );
      }
    };

    const joinInLearning = async () => {
      if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PRIVATE) {
        baseView.current.showMessage({ text: '管理员模式课程需要管理员为学生报名。', delay: 3 });
      } else {
        baseView.current.showLoading({ text: t('lessonDetail.loading') });
        const res = await lessonDetailStore.vodJoinNow(lessonDetailStore.lessonDetail?.id);
        if (typeof res !== 'string') {
          updateSignUp();
        } else {
          baseView.current.hideLoading();
          baseView.current.showMessage({ text: res, delay: 3 });
        }
        baseView.current.hideLoading();
      }
    };

    const goToLearning = async () => {
      navigation.navigate('Main', { screen: 'LectureVodList', options: { animationEnabled: false } });
    };

    const payForOrder = async (userType: number) => {
      const res = await payStore.doOrderPay(paySelect, lessonDetailStore.lessonDetail?.id, userType);
      baseView.current.showToast({ text: res, delay: 1 });
      if (res) {
        if (paySelect === 0) {
          paySheet.current.snapTo(0);
          await lessonDetailStore.getLessonLiveDetail(route.params.lessonId);
          lessonDetailStore.loading = false;
          baseView.current.showToast({ text: t('lessonDetail.payment'), delay: 1 });
        } else if (paySelect === 1) {
          if (res && typeof res === 'boolean') {
            paySheet.current.snapTo(0);
            await lessonDetailStore.getLessonLiveDetail(route.params.lessonId);
            lessonDetailStore.loading = false;
            baseView.current.showToast({ text: t('lessonDetail.payment'), delay: 1 });
          }
          baseView.current.showToast({ text: res, delay: 1 });
        } else if (paySelect === 2) {
          if (res && typeof res === 'boolean') {
            paySheet.current.snapTo(0);
            await lessonDetailStore.getLessonLiveDetail(route.params.lessonId);
            lessonDetailStore.loading = false;
            baseView.current.showToast({ text: t('lessonDetail.payment'), delay: 1 });
          } else if (typeof res === 'string') {
            baseView.current.showToast({ text: res, delay: 1 });
          }
        }
      }
    };

    const renderPayModal = () => {
      return (
        <View style={[tw.wFull, tw.hFull, tw.p5, { backgroundColor: colors.surface, borderTopStartRadius: 20 }]}>
          <Avatar.Icon
            size={32}
            icon="close-circle-outline"
            style={[tw.selfEnd, tw.absolute, tw.m3, { backgroundColor: colors.surface }]}
            color={colors.onBackground}
            onTouchEnd={() => {
              paySheet.current.snapTo(0);
            }}
          />
          <Text style={[tw.selfCenter, { fontSize: 18, fontWeight: 'bold' }]}>{t('lessonDetail.purchase')}</Text>
          <View style={[tw.selfCenter, tw.flexRow, tw.itemsCenter, tw.mT5]}>
            <Text style={[{ color: colors.placeholder, fontSize: 16 }]}>{t('lessonDetail.get')}</Text>
            <Text style={[{ color: colors.accent, fontSize: 16, fontWeight: 'bold' }]}>《{lessonDetailStore.lessonDetail?.name}》</Text>
          </View>

          <View style={[tw.selfCenter, tw.flexRow, tw.itemsCenter, tw.mT5]}>
            <Text style={[{ fontSize: 16, fontWeight: 'bold', color: colors.placeholder }]}>{t('lessonDetail.payable')}</Text>
            <Text style={[{ fontSize: 16, fontWeight: 'bold', color: colors.notification }]}>￥{lessonDetailStore.lessonDetail?.name}</Text>
          </View>

          <View style={[tw.mT3, tw.flexRow, tw.flexWrap, tw.justifyCenter]}>
            {Platform.OS === 'android' ? (
              <Card
                style={[
                  tw.p3,
                  tw.mX2,
                  tw.mT2,
                  {
                    width: '45%',
                    backgroundColor: paySelect === 0 ? colors.deepBackground : colors.background
                  }
                ]}
                onPress={() => {
                  setPaySelect(0);
                }}
              >
                <View style={[tw.flexRow, tw.itemsCenter, tw.selfCenter]}>
                  <Avatar.Image size={32} style={[{ backgroundColor: colors.background }]} source={require('../../../assets/aliPay.png')} />
                  <Text style={[tw.mL3]}> {t('lessonDetail.aliPay')}</Text>
                </View>
              </Card>
            ) : null}
            {Platform.OS === 'android' ? (
              <Card
                style={[tw.p3, tw.mX2, tw.mT2, { width: '45%', backgroundColor: paySelect === 1 ? colors.deepBackground : colors.background }]}
                onPress={() => {
                  setPaySelect(1);
                }}
              >
                <View style={[tw.flexRow, tw.itemsCenter, tw.selfCenter]}>
                  <Avatar.Image size={32} style={[{ backgroundColor: colors.background }]} source={require('../../../assets/weChat.png')} />
                  <Text style={[tw.mL3]}> {t('lessonDetail.weChatPay')}</Text>
                </View>
              </Card>
            ) : null}
            <Card
              style={[tw.p3, tw.mX2, tw.mT2, { width: '45%', backgroundColor: paySelect === 2 ? colors.deepBackground : colors.background }]}
              onPress={() => {
                setPaySelect(2);
              }}
            >
              <View style={[tw.flexRow, tw.itemsCenter, tw.selfCenter]}>
                <Avatar.Image size={32} style={[{ backgroundColor: colors.background }]} source={require('../../../assets/balance.png')} />
                <Text style={[tw.mL3]}> {t('lessonDetail.balancePay')}</Text>
              </View>
            </Card>
          </View>
          <Button
            style={[tw.mT3]}
            contentStyle={[tw.pY1]}
            mode={'contained'}
            onPress={async () => {
              if (userStore.userInfo.userType) {
                await payForOrder(userStore.userInfo.userType);
              }
            }}
          >
            {t('lessonDetail.payImmediately')}
          </Button>
        </View>
      );
    };

    const showPayModal = () => {
      return <BottomSheet ref={paySheet} snapPoints={[0, 350, 200]} borderRadius={10} renderContent={renderPayModal} />;
    };

    const renderBottomBar = () => {
      if (isMainTeacher) {
        return (
          <View style={[tw.wFull, tw.pX5, tw.pT2, tw.pB3, { backgroundColor: colors.background, height: getBottomSpace() + BAR_HEIGHT }]}>
            <Button mode="contained" compact icon="clipboard-check" color={colors.notification} onPress={() => goToLearning()}>
              去上课
            </Button>
          </View>
        );
      } else if (!isSignUp) {
        return (
          <View style={[tw.wFull, { backgroundColor: colors.background, height: getBottomSpace() + BAR_HEIGHT }]}>
            <Divider />
            <View style={[tw.flex1, tw.flexRow, tw.itemsCenter, tw.pX6, { marginBottom: getBottomSpace() }]}>
              {/*{typeContent()}*/}
              <View style={[tw.flex1, tw.itemsEnd]}>
                <Button mode="contained" compact icon="clipboard-check" color={colors.notification} onPress={async () => await joinInLearning()}>
                  {t('lessonDetail.registerNow')}
                </Button>
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View style={[tw.wFull, tw.pY3, tw.pX10, { backgroundColor: colors.surface, height: getBottomSpace() + BAR_HEIGHT }]}>
            <Divider />
            <Button mode="contained" compact icon="clipboard-check" color={colors.notification} onPress={() => goToLearning()}>
              {t('lessonDetail.goClass')}
            </Button>
          </View>
        );
      }
    };

    const renderContent = () => {
      if (lessonDetailStore.loading) {
        return (
          <View style={[tw.flex1, { marginTop: getStatusBarHeight(true) }]}>
            <LessonDetailPlaceholder />
          </View>
        );
      } else {
        return (
          <View style={[tw.flex1]}>
            <Appbar.Header style={[tw.justifyBetween, { backgroundColor: colors.background }]}>
              <Appbar.BackAction onPress={navigation.goBack} />
              <Appbar.Content title={lessonDetailStore.lessonDetail?.name} />
              <Appbar.Action
                icon="share"
                onPress={async () => {
                  await shareModal();
                }}
              />
            </Appbar.Header>
            <ScrollView style={[tw.flexGrow, { backgroundColor: colors.background }]}>
              {renderLessonHeader()}
              <View style={[tw.h3, { backgroundColor: colors.surface }]} />
              <Divider />
              {renderTeacherDetail()}
              <Divider />
              <Divider />
              <View style={[tw.h3, { backgroundColor: colors.surface }]} />
              <Divider />
              {renderScheduleDetail()}
              <Divider />
              <View style={[tw.h3, { backgroundColor: colors.surface }]} />
              <Divider />
              {renderLessonDetail()}
            </ScrollView>
            {renderBottomBar()}
            <View style={{ height: Platform.OS === 'ios' ? 0 : getStatusBarHeight(false) }} />
          </View>
        );
      }
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1, { backgroundColor: lessonDetailStore.loading ? colors.background : colors.surface }]}>
        {renderContent()}
        {showPayModal()}
        {selectShareMode()}
      </BaseView>
    );
  }
);
