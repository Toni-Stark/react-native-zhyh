import React, { memo, useEffect, useRef, useState } from 'react';
import { Appbar, Text, useTheme, Portal, Modal } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { tw } from 'react-native-tailwindcss';
import { FlatList, RefreshControl, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import AvatarView from '../../../component/AvatarView';
import { getStatusBarHeight, getStr } from '../../../common/tools';
import { useStore } from '../../../store';
import { ScheduleList } from '../../../store/LessonDetailStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { t } from '../../../common/tools';
import { LESSON_TYPE_LIVE, LESSON_TYPE_NEED_PAY, LESSON_TYPE_PRIVATE } from '../../../common/status-module';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import BottomSheet from 'reanimated-bottom-sheet';
import { BottomSheetChildren } from '../../../component/BootomSheetChildren';
import { LessonDetailPlaceholder } from '../../../component/skeleton/LessonDetailPlaceholder';
import FastImage from 'react-native-fast-image';
import WeChat from 'react-native-wechat-lib';

type ScreenRouteProp = RouteProp<ScreensParamList, 'LectureVodList'>;
type Props = {
  route: ScreenRouteProp;
};

export const LectureVodList: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { lessonDetailStore, userStore, homeworkCreateStore, userRolesStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const menuSheet = useRef<any>();
    const [dataLecture, setDataLecture] = useState<any>(undefined);
    const [selectShare, setSelectShare] = useState(false);

    useEffect(() => {
      (async () => {
        userStore.isOnClassRoom = false;
        lessonDetailStore.loading = true;
        userRolesStore.isStudentId = [];
        userRolesStore.isSecTeacherId = [];
        userRolesStore.isTeacherId = undefined;
        lessonDetailStore.getLessonVodDetail(route.params.lessonId).then(() => {
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
          setTimeout(() => {
            lessonDetailStore.loading = false;
          }, 400);
        });
      })();
    }, [route, lessonDetailStore, userStore, userRolesStore]);

    const handleOnLoadMore = () => {};

    const onRefresh = async () => {
      setRefreshing(true);
      setTimeout(async () => {
        await lessonDetailStore.getLessonVodDetail(route.params.lessonId);
        console.log('刷新页面查询的课程详情');
        setRefreshing(false);
      }, 2);
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

    const section = () => {
      return (
        <View style={[tw.p2, tw.flexRow, tw.justifyBetween, tw.wFull, tw.borderGray300, { borderBottomWidth: 0.5 }]}>
          <View>
            <Text style={[tw.mB2, { color: colors.disabled }]}>
              课次名：<Text style={[{ color: colors.accent }]}>{dataLecture?.name}</Text>
            </Text>
          </View>
          <View>
            <Text style={[{ color: colors.disabled, fontSize: 13 }]}>
              资源数：<Text>{dataLecture?.resourceFiles?.length}个</Text>
            </Text>
          </View>
        </View>
      );
    };

    const renderMenuModal = () => {
      let isTeacher =
        lessonDetailStore.lessonDetail?.primaryTeacher?.id === userStore.userInfoDetail.id ||
        lessonDetailStore.lessonDetail?.secondaryTeachers?.filter((item) => item.id === userStore.userInfoDetail.id).length;

      return (
        <BottomSheetChildren>
          <View style={[tw.flex1]}>
            {section()}
            {(lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_NEED_PAY || lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PRIVATE) &&
            isTeacher ? (
              <TouchableOpacity
                style={[tw.pB4, tw.pT8, tw.itemsCenter, tw.flexRow]}
                onPress={() => {
                  if (lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.studentCount !== undefined) {
                    if (lessonDetailStore.lessonDetail.studentCount > 0) {
                      homeworkCreateStore.lectureData = dataLecture;
                      menuSheet.current.snapTo(0);
                      navigation.navigate('Main', { screen: 'HomeworkCreated', params: { lectureId: dataLecture?.id, lessonType: 'vod' } });
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
                navigation.navigate('Main', { screen: 'HomeworkList', params: { id: homeworkCreateStore.lectureData.id, lessonType: 'vod' } });
              }}
            >
              <Icon name="history-edu" size={30} color={colors.accent} />

              <Text style={[tw.mL2, { fontSize: 16, fontWeight: 'bold' }]}>查看作业</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetChildren>
      );
    };

    const menuModal = () => {
      let isTeacher =
        lessonDetailStore.lessonDetail?.primaryTeacher?.id === userStore.userInfoDetail.id ||
        lessonDetailStore.lessonDetail?.secondaryTeachers?.find((item) => item.id === userStore.userInfoDetail.id);
      let type = lessonDetailStore.lessonDetail?.authType;
      return (
        <BottomSheet
          ref={menuSheet}
          snapPoints={isTeacher && (type === 3 || type === 4) ? [0, 250, 160] : [0, 200, 100]}
          borderRadius={20}
          renderContent={renderMenuModal}
        />
      );
    };

    const flatListFooter = () => {
      const scList: ScheduleList[] | undefined = lessonDetailStore.lessonDetail?.schedules;
      if (scList && scList.length > 0) {
        return (
          <View style={[{ marginBottom: 50 }]}>
            {scList.map((item, index) => {
              return demandOrLiveBody(item, index);
            })}
          </View>
        );
      } else {
        return null;
      }
    };

    const demandOrLiveHeader = (scList) => {
      if (lessonDetailStore.typeNum === 0 || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
        if (scList) {
          return (
            <View>
              <View>
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

    const demandOrLiveBody = (data, index) => {
      return (
        <View style={[tw.mB2]} key={index}>
          <TouchableOpacity
            style={[tw.borderGray200, tw.mX3, tw.mT3, tw.pB3, { borderBottomWidth: 0.5 }]}
            onPress={() => {
              navigation.navigate('Main', { screen: 'LectureDetail', params: { lectureId: data.id } });
            }}
          >
            <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
              <View>
                <Text style={[tw.mB2, { fontSize: 14, color: data.actualEndTime ? colors.placeholder : colors.text }]}>
                  {`（${index + 1}） ${data.name ? data.name : ''}`}
                </Text>
                <View style={[tw.flexRow]}>
                  <Text style={[{ fontSize: 12, color: colors.placeholder }]}> 资源数量：</Text>
                  <Text style={[{ fontSize: 12, color: colors.text }]}>{data?.resourceFiles ? data?.resourceFiles.length : 0}个</Text>
                </View>
              </View>
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
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    const renderHeader = (props) => {
      return (
        <View style={[tw.p5, tw.flex, { backgroundColor: colors.surface }]}>
          <View style={[tw.flexRow, tw.justifyBetween]}>
            <Text style={[{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }]}>{lessonDetailStore.lessonDetail?.name}</Text>

            <TouchableOpacity onPress={() => {}}>
              <View style={[tw.itemsCenter, tw.justifyCenter, { padding: 5, width: 45, height: 45, backgroundColor: colors.accent, borderRadius: 50 }]}>
                <Text numberOfLines={1} style={[tw.textWhite, { fontSize: 11 }]}>
                  学生数
                </Text>
                <Text style={[tw.textWhite, { fontSize: 13 }]}>{lessonDetailStore.lessonDetail?.studentCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {demandOrLiveHeader(props.scList)}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={[tw.flexRow]}>
            <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR4]}>
              <AvatarView
                name={getStr(lessonDetailStore.lessonDetail?.primaryTeacher?.username)}
                avatar={getStr(lessonDetailStore.lessonDetail?.primaryTeacher?.avatar?.url)}
                size={30}
              />
              <View style={[tw.mL2]}>
                <Text style={[tw.mT1, tw.mB1, { fontSize: 10, color: colors.placeholder }]}>{t('lectureList.teacher')}</Text>
                <Text style={[{ fontSize: 12 }]}>{getStr(lessonDetailStore.lessonDetail?.primaryTeacher?.username)}</Text>
              </View>
            </View>
            {lessonDetailStore.lessonDetail?.secondaryTeachers?.map((item, index) => (
              <View style={[tw.mT2, tw.flexRow, tw.itemsCenter, tw.mR4]} key={index}>
                <AvatarView color={colors.accent} name={getStr(item.username)} avatar={item.avatar ? item.avatar.url : ''} size={30} />
                <View style={[tw.mL2]}>
                  <Text style={[tw.mT1, tw.mB1, { fontSize: 10, color: colors.placeholder }]}>{t('lectureList.assistant')}</Text>
                  <Text style={[{ fontSize: 12 }]}>{getStr(item.username)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    };

    const MemoHeader = memo(renderHeader);

    const renderContent = () => {
      if (lessonDetailStore.lessonDetail?.schedules) {
        let lessonList: ScheduleList[] = lessonDetailStore.lessonDetail.schedules.filter((item) => item.actualEndTime === null);
        return (
          <View style={[tw.flex1]}>
            <MemoHeader scList={lessonDetailStore.lessonDetail?.schedules} />
            <FlatList
              style={[tw.flex1, tw.p3, { backgroundColor: colors.background }]}
              scrollEnabled={true}
              data={lessonList}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              numColumns={1}
              renderItem={undefined}
              onEndReached={handleOnLoadMore}
              onEndReachedThreshold={0.1}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListFooterComponent={flatListFooter}
            />
            {menuModal()}
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
          {selectShareMode()}
        </BaseView>
      );
    }
  }
);
