import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper';
import { Dimensions, FlatList, Linking, Platform, RefreshControl, TouchableWithoutFeedback, View } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { getStatusBarHeight, requestCameraPermission, throttle } from '../common/tools';
import CarouselView from '../component/home/CarouselView';
import SearchBarView from '../component/home/SearchBarView';
import CategoryView from '../component/home/CategoryView';
import { tw } from 'react-native-tailwindcss';
import FilterModalView from '../component/home/FilterModalView';
import FastImage from 'react-native-fast-image';
import { HomePlaceholder } from '../component/skeleton/HomePlaceholder';
import AvatarView from '../component/AvatarView';
import { Api } from '../common/api';
import { observer } from 'mobx-react-lite';
import { UserStore } from '../store/UserStore';
import { t } from '../common/tools';
import { CheckUpdateView } from '../component/home/CheckUpdateView';
import { CoursesDetail } from '../store/LessonDetailStore';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE, LESSON_TYPE_NEED_PAY, LESSON_TYPE_PRIVATE } from '../common/status-module';
import DeviceInfo from 'react-native-device-info';

export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { settingStore, homeStore, userStore, checkUpdateStore, lessonDetailStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const baseView = useRef<any>(undefined);
    const isIos = Platform.OS === 'ios';
    const [windowWidth] = useState(Dimensions.get('window').width);
    const [windowHeight] = useState(Dimensions.get('window').height);
    const widthThanHeight = Dimensions.get('window').width > Dimensions.get('window').height;
    const isOldAndroid = DeviceInfo.getApiLevelSync() < 26;
    const isWidthScreen =
      Dimensions.get('window').width / Dimensions.get('window').height > 0.65 && Dimensions.get('window').width / Dimensions.get('window').height < 1;

    const handleOpenFromLink = useCallback(
      (event) => {
        const navToLessonLive = (lessonId: string) => {
          lessonDetailStore
            .getLessonLiveDetail(lessonId)
            .then((_res) => {
              navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId } });
            })
            .catch((_err) => {
              baseView.current.showToast({ text: '课程不存在', delay: 1.5 });
            });
        };

        const navToLessonVod = (lessonId: string) => {
          lessonDetailStore
            .getLessonVodDetail(lessonId)
            .then((_res) => {
              navigation.navigate('Main', { screen: 'LessonVodDetail', params: { lessonId } });
            })
            .catch((_err) => {
              baseView.current.showToast({ text: '课程不存在', delay: 1.5 });
            });
        };

        const navToHomeworkLesson = (homeworkId: string) => {
          console.log('homeworkId:', homeworkId);
          console.log('placeholder for homework-lesson navigation');
        };

        const navToHomeworkGroup = (homeworkId: string) => {
          console.log('homeworkId:', homeworkId);
          console.log('placeholder for homework-group navigation');
        };

        let urlString: string = '';
        if (typeof event === 'string') {
          urlString = event as string;
        } else if (event && typeof event.url === 'string') {
          urlString = event.url as string;
        }
        if (urlString.startsWith('xueyue://lesson-live/') || urlString.includes('lesson-live-id')) {
          const lessonId = urlString.replace(/.*lesson-live\/|.*lesson-live-id=/g, '');
          if (lessonId) {
            if (userStore.login) {
              navToLessonLive(lessonId);
            } else {
              baseView.current.showToast({ text: '登录后可查看', delay: 2 });
            }
          }
        } else if (urlString.startsWith('xueyue://lesson-vod/') || urlString.includes('lesson-vod-id')) {
          const lessonId = urlString.replace(/.*lesson-vod\/|.*lesson-vod-id=/g, '');
          if (lessonId) {
            if (userStore.login) {
              navToLessonVod(lessonId);
            } else {
              baseView.current.showToast({ text: '登录后可查看', delay: 2 });
            }
          }
        } else if (urlString.startsWith('xueyue://homework-lesson/') || urlString.includes('homework-lesson-id')) {
          const homeworkId = urlString.replace(/.*homework-lesson\/|.*homework-lesson-id=/g, '');
          if (homeworkId) {
            if (userStore.login) {
              navToHomeworkLesson(homeworkId);
            } else {
              baseView.current.showToast({ text: '登录后可查看', delay: 2 });
            }
          }
        } else if (urlString.startsWith('xueyue://homework-group/') || urlString.includes('homework-group-id')) {
          const homeworkId = urlString.replace(/.*homework-group\/|.*homework-group-id=/g, '');
          if (homeworkId) {
            if (userStore.login) {
              navToHomeworkGroup(homeworkId);
            } else {
              baseView.current.showToast({ text: '登录后可查看', delay: 2 });
            }
          }
        }
      },
      [lessonDetailStore, navigation, userStore.login]
    );

    const onReceiveURL = useCallback(async () => {
      settingStore.canJump = true;
      await Linking.getInitialURL().then((res) => {
        if (res) {
          settingStore.initURL = res;
          handleOpenFromLink(res);
        }
      });
    }, [handleOpenFromLink, settingStore]);

    useEffect(() => {
      (async () => {
        await onReceiveURL();
      })();
      Linking.addEventListener('url', onReceiveURL);
      return Linking.removeEventListener('url', onReceiveURL);
    }, [onReceiveURL]);

    useEffect(() => {
      Linking.addEventListener('url', handleOpenFromLink);
      return () => {
        Linking.removeEventListener('url', handleOpenFromLink);
      };
    }, [handleOpenFromLink, navigation]);

    useEffect(() => {
      Api.getInstance.setUpNavigation(navigation);
    }, [navigation]);

    useEffect(() => {
      (async () => {
        const res = await checkUpdateStore.checkUpdate(baseView, false);
        if (res) {
          baseView.current?.showMessage({ text: res, delay: 3 });
        }
      })();
    }, [checkUpdateStore]);

    useEffect(() => {
      UserStore.isLogin().then((res) => {
        if (!res) {
          homeStore.dataFilter = [];
          homeStore.dataBanner = [];
          homeStore.dataLessonLive = [];
          homeStore.dataLessonDemand = [];
          homeStore.dataTeacher = [];
          homeStore.allSearchBigClass = [];
          homeStore.allSearchSmallClass = [];
          homeStore.allSearchLiveClass = [];
          homeStore.allSearchDeMandClass = [];
          navigation.navigate('LoginByPhone');
        }
      });
    }, [homeStore, navigation, userStore.login]);

    const getInfo = useCallback(async () => {
      if (userStore.login) {
        homeStore.refreshLoading = true;
        await homeStore.getBanners().then(() => {
          homeStore.refreshLoading = false;
        });
        if (userStore.userInfoDetail.business?.id) {
          await homeStore.getSubjectList(userStore.userInfoDetail.business.id);
        }
        await homeStore.getLiveLessons();
        await homeStore.getDemandLessons();
        // await homeStore.getTeacherList();
        // if (userStore.userInfo.userType === 3) {
        //   await lessonDetailStore.getUserLesson({
        //     lessonTypeArrayString: `${LESSON_TYPE_BIG},${LESSON_TYPE_SMALL},${LESSON_TYPE_GROUP}`,
        //     statsArrayString: LESSON_STATUS_PUBLISHED,
        //     actions: true
        //   });
        //   await lessonDetailStore.getUserLesson({
        //     statsArrayString: `${LESSON_STATUS_FINISHED},${LESSON_STATUS_CANCELED}`,
        //     actions: true
        //   });
        //   await lessonDetailStore.getUserLesson({ lessonTypeArrayString: `${LESSON_TYPE_VOD}`, statsArrayString: LESSON_STATUS_PUBLISHED, actions: true });
        // }
      }
    }, [homeStore, userStore.login, userStore.userInfoDetail.business?.id]);

    useEffect(() => {
      (async () => {
        await getInfo();
      })();
    }, [getInfo]);

    const onRefresh = () => {
      setRefreshing(true);
      setTimeout(async () => {
        await getInfo();
        setRefreshing(false);
      }, 1000);
    };

    const handleSelectFilter = () => {
      setFilterModalVisible(true);
    };

    const handleSearch = () => {
      navigation.navigate('Main', { screen: 'Search', options: { animationEnabled: false } });
    };

    const handleQRCodeScan = () => {
      requestCameraPermission()
        .then((res) => {
          if (res) {
            navigation.navigate('Main', { screen: 'CodeScan', options: { animationEnabled: false } });
          }
        })
        .catch((e) => baseView.current?.showMessage(e));
    };

    const handleFilterSelected = (text: string) => {
      console.log(text, '这是需要找到的位置');
    };

    const getLesson = async (id, types) => {
      switch (types) {
        case LESSON_TYPE_LIVE:
          navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId: id } });
          break;
        case LESSON_TYPE_DEMAND:
          navigation.navigate('Main', { screen: 'LessonVodDetail', params: { lessonId: id } });
          break;
      }
    };

    const RenderItem = ({ item, index, isType }: { item: CoursesDetail; index: number; isType: number }) => {
      const paddingLeft = index % 2 === 0 ? 10 : 5;
      const paddingRight = index % 2 === 0 ? 5 : 10;
      const HOMEWORK_IMAGE_SIZE = 60;
      return (
        <View style={{ width: windowWidth > windowHeight ? '25%' : '50%', paddingBottom: 10, paddingLeft, paddingRight }}>
          <Card
            onPress={throttle(async () => {
              switch (isType) {
                case LESSON_TYPE_LIVE:
                  await getLesson(item.id, LESSON_TYPE_LIVE);
                  break;
                case LESSON_TYPE_DEMAND:
                  await getLesson(item.id, LESSON_TYPE_DEMAND);
                  break;
              }
            })}
          >
            <FastImage
              style={{
                height: windowWidth > windowHeight ? Math.ceil((windowWidth / 4) * 0.63) : Math.ceil((windowWidth / 2) * 0.63),
                backgroundColor: colors.background,
                borderTopLeftRadius: HOMEWORK_IMAGE_SIZE / 10,
                borderTopRightRadius: HOMEWORK_IMAGE_SIZE / 10
              }}
              source={item.imageCover ? { uri: item.imageCover?.url } : require('../assets/placeholder.jpg')}
              resizeMode={item.imageCover ? FastImage.resizeMode.cover : FastImage.resizeMode.contain}
            />
            <View
              style={[
                tw.flexCol,
                tw.justifyBetween,
                isWidthScreen ? tw.p5 : tw.p2,
                { height: windowWidth > windowHeight ? Math.ceil(windowWidth / 12) : Math.ceil(windowWidth / 4.5) }
              ]}
            >
              <Text numberOfLines={2} style={[tw.flex1, { fontSize: isWidthScreen ? 22 : isIos ? 15 : 14 }]}>
                {item.name}
              </Text>
              <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween]}>
                {item.authType === LESSON_TYPE_NEED_PAY || item.authType === LESSON_TYPE_PRIVATE ? (
                  <View style={[tw.flex1, tw.itemsStart]}>
                    <Text style={[{ color: colors.placeholder, fontSize: isWidthScreen ? 16 : isIos ? 13 : 12 }]} numberOfLines={1}>
                      {t('home.totalSession')}：{item.scheduleCount}
                    </Text>
                    <Text style={[isIos ? tw.mT2 : tw.mT0, { color: colors.placeholder, fontSize: isWidthScreen ? 16 : isIos ? 13 : 12 }]} numberOfLines={1}>
                      {t('home.numberApps')}：{item.studentCount}
                    </Text>
                  </View>
                ) : (
                  <View style={[tw.flex1, tw.itemsStart]}>
                    <Text style={[{ color: colors.placeholder, fontSize: isWidthScreen ? 16 : isIos ? 13 : 12 }]} numberOfLines={1}>
                      {t('home.totalSession')}：{item.scheduleCount}
                    </Text>
                    {homeStore.categories?.filter((e) => e.id === item.category?.id).length > 0 ? (
                      <Text style={[isIos ? tw.mT2 : tw.mT0, { color: colors.placeholder, fontSize: isWidthScreen ? 16 : isIos ? 13 : 12 }]} numberOfLines={1}>
                        分类：{homeStore.categories?.filter((e) => e.id === item.category?.id)[0].name}
                      </Text>
                    ) : null}
                  </View>
                )}

                <View style={[tw.itemsCenter]}>
                  <AvatarView
                    avatar={item.primaryTeacher?.avatar?.url ? item.primaryTeacher.avatar.url : ''}
                    size={isWidthScreen ? 40 : isIos ? 26 : 20}
                    name={item.primaryTeacher?.realName || item.primaryTeacher?.nickName || item.primaryTeacher?.username || ''}
                  />
                  <Text style={[isIos ? tw.mT1 : tw.mT0, { fontSize: isWidthScreen ? 16 : isIos ? 13 : 11, color: colors.accent }]}>
                    {item.primaryTeacher?.realName || item.primaryTeacher?.nickName || item.primaryTeacher?.username}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      );
    };

    // const teacherCard = (data) => {
    //   const coverHeight = 140;
    //   const coverWidth = 110;
    //   return (
    //     <View style={[tw.p2]}>
    //       <Card onPress={throttle(() => {})} style={[tw.p2]}>
    //         <Card.Cover style={{ height: coverHeight, width: coverWidth }} source={{ uri: getSafeAvatar(data.item.avatar).uri }} />
    //         <Paragraph style={[tw.selfCenter]} ellipsizeMode="middle" numberOfLines={1}>
    //           {data.item.nickName}
    //         </Paragraph>
    //       </Card>
    //     </View>
    //   );
    // };

    const naviGo = () => {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            await getAllData();
          }}
        >
          <Text style={[tw.selfCenter]}>{t('home.moreCourses')}</Text>
        </TouchableWithoutFeedback>
      );
    };

    const getAllData = async () => {
      // navigation.navigate('Main', { screen: 'AllCourses', params: { address: 'SmallCourses' }, options: { animationEnabled: false } });
      navigation.navigate('Main', {
        screen: 'Barner',
        params: {
          data: {
            id: undefined,
            name: '全部课程'
          }
        }
      });
    };

    const getLiveLessons = () => {
      if (homeStore.dataLessonLive?.slice().length > 0) {
        return (
          <View style={[Platform.OS === 'ios' ? tw.mB6 : !isOldAndroid ? tw.mB3 : homeStore.dataLessonDemand.slice().length > 0 ? tw.mB3 : tw.mB10]}>
            <Text style={[{ color: colors.placeholder, fontSize: 18, fontWeight: 'bold', margin: 20 }]}>直播课</Text>
            <View style={[tw.flexRow, tw.flexWrap]}>
              {homeStore.dataLessonLive?.map((item, index) => {
                return <RenderItem item={item} index={index} key={index} isType={LESSON_TYPE_LIVE} />;
              })}
            </View>
            {naviGo()}
          </View>
        );
      } else return null;
    };

    const getDemandLessons = () => {
      if (homeStore.dataLessonDemand.slice().length > 0) {
        return (
          <View style={[Platform.OS === 'ios' ? tw.mB20 : !isOldAndroid ? tw.mB10 : { marginBottom: 70 }]}>
            <Text style={[{ color: colors.placeholder, fontSize: 18, fontWeight: 'bold', margin: 20 }]}>点播课</Text>
            <View style={[tw.flexRow, tw.flexWrap]}>
              {homeStore.dataLessonDemand.slice().map((item, index) => {
                return <RenderItem item={item} index={index} key={index} isType={LESSON_TYPE_DEMAND} />;
              })}
            </View>
            {naviGo()}
          </View>
        );
      } else return null;
    };

    const renderContent = () => {
      if (homeStore.refreshLoading) {
        return <HomePlaceholder />;
      } else {
        if (userStore.login) {
          return (
            <View style={[tw.flex1]}>
              <SearchBarView filterCallback={handleSelectFilter} searchCallback={handleSearch} qrScanCallback={handleQRCodeScan} />
              <Divider />
              <FlatList
                style={[{ marginBottom: Platform.OS === 'ios' ? 0 : getStatusBarHeight(false) }]}
                data={undefined}
                keyExtractor={(item) => `lesson-item-${item.id}`}
                numColumns={2}
                renderItem={null}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListHeaderComponent={
                  <View style={[Dimensions.get('window').width > 900 ? tw.mX2 : tw.mX0, tw.pT2, widthThanHeight ? tw.pB5 : tw.pB0]}>
                    <CarouselView
                      navi={(e) => {
                        // navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId: e.id } });
                        console.log(e);
                      }}
                      data={homeStore.dataBanner}
                    />
                    <CategoryView
                      navigate={(navi) => {
                        homeStore.barDataList = [];
                        if (navi) {
                          navigation.navigate('Main', { screen: 'Barner', params: { data: navi } });
                        } else {
                          navigation.navigate('Main', {
                            screen: 'Barner',
                            params: {
                              data: {
                                id: undefined,
                                name: '全部课程'
                              }
                            }
                          });
                          // navigation.navigate('Main', { screen: 'AllCourses', options: { animationEnabled: false } });
                        }
                      }}
                    />

                    {getLiveLessons()}
                    {getDemandLessons()}
                  </View>
                }
                // ListFooterComponent={<View style={{ marginBottom: 60 }}>{getTeacher()}</View>}
              />

              <FilterModalView
                data={homeStore.dataFilter}
                visible={filterModalVisible}
                onDismiss={() => setFilterModalVisible(false)}
                onSelected={handleFilterSelected}
              />
            </View>
          );
        } else if (!homeStore.refreshLoading && !userStore.login) {
          return (
            <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}>
              <Button
                onPress={() => {
                  navigation.navigate('LoginByPhone');
                }}
                mode="contained"
              >
                {t('home.logIn')}
              </Button>
            </View>
          );
        }
      }
    };

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        {renderContent()}
        {CheckUpdateView()}
      </BaseView>
    );
  }
);
