import * as React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { tw } from 'react-native-tailwindcss';
import { Dimensions, FlatList, Platform, RefreshControl, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LessonClassLiveType } from '../../store/LessonDetailStore';
import { t } from '../../common/tools';

import {
  LESSON_STATUS_CANCELED,
  LESSON_STATUS_CREATED,
  LESSON_STATUS_FINISHED,
  LESSON_STATUS_PUBLISHED,
  LESSON_STATUS_SUBMIT,
  LESSON_TYPE_NEED_PAY,
  LESSON_TYPE_PASSWORD,
  LESSON_TYPE_PRIVATE,
  LESSON_TYPE_PUBLIC,
  USER_MODE_CLASS_TEACHER
} from '../../common/status-module';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import FastImage from 'react-native-fast-image';

export type Props = {
  data: LessonClassLiveType[];
  type?: string | number;
  clickFor: (item: any) => void;
  loadNewData: () => void;
  loadAddData: () => void;
  oneSubmit: (e: any) => void;
  oneDelete: (e: any) => void;
};

export const LessonList: React.FC<Props> = observer(
  (props): JSX.Element => {
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const { userStore } = useStore();
    const width = 80;
    const height = 80;
    const [screenWidth] = useState(Dimensions.get('window').width > Dimensions.get('window').height);

    const handleOnLoadMore = async () => {
      await props.loadAddData();
    };
    const onRefresh = async () => {
      await setRefreshing(true);
      setTimeout(async () => {
        await props.loadNewData();
        await setRefreshing(false);
      }, 1500);
    };

    const getStatusStrStudent = (status?: number | string): string => {
      switch (status) {
        case LESSON_STATUS_CREATED:
          return t('lessonList.creating');
        case LESSON_STATUS_SUBMIT:
          return t('lessonList.underReview');
        case LESSON_STATUS_PUBLISHED:
          return t('lessonList.waiting');
        // case LESSON_STATUS_STARTED:
        //   return t('lessonList.started');
        case LESSON_STATUS_FINISHED:
          return t('lessonList.over');
        case LESSON_STATUS_CANCELED:
          return t('lessonList.cancelled');
        default:
          return t('lessonList.cancelled');
      }
    };
    const getStatusStrTeacher = (status?: number | string): string => {
      switch (status) {
        case LESSON_STATUS_CREATED:
          // return t('lessonList.publishNow');
          return '等待发布';
        case LESSON_STATUS_SUBMIT:
          return t('lessonList.toBeReviewed');
        case LESSON_STATUS_PUBLISHED:
          return t('lessonList.published');
        // case LESSON_STATUS_STARTED:
        //   return t('lessonList.published');
        // case LESSON_STATUS_FINISHED:
        //   return t('lessonList.over');
        case LESSON_STATUS_CANCELED:
          return t('lessonList.over');
        default:
          return t('lessonList.cancelled');
      }
    };

    const getColor = (status?: number) => {
      switch (status) {
        case LESSON_STATUS_CREATED:
          return tw.bgBlue300;
        case LESSON_STATUS_SUBMIT:
          return tw.bgGreen300;
        case LESSON_STATUS_PUBLISHED:
          return tw.bgBlue500;
        case LESSON_STATUS_CANCELED:
          return tw.bgGray400;
        default:
          return tw.bgBlue400;
      }
    };
    const getAuthType = (status?: number) => {
      switch (status) {
        case LESSON_TYPE_PUBLIC:
          return '公开课';
        case LESSON_TYPE_PASSWORD:
          return '密码课';
        case LESSON_TYPE_NEED_PAY:
          return '付费课';
        case LESSON_TYPE_PRIVATE:
          return '认证课';
        default:
          return '认证课';
      }
    };

    const renderClassItem = ({ item, index }: { item: LessonClassLiveType; index: number }) => {
      console.log(item);
      return (
        <Card
          style={[tw.mX2, tw.mY1]}
          onPress={() => {
            props.clickFor(item);
          }}
          key={index}
        >
          <View style={[tw.flex1, tw.p3, { overflow: 'hidden' }]}>
            <View style={[tw.flexRow]}>
              {item.imageCover ? (
                <Card.Cover style={[{ width: width, height: height, borderRadius: 6 }]} source={{ uri: item.imageCover.url }} />
              ) : (
                <FastImage source={require('../../assets/placeholder1.jpg')} style={{ width: width, height: height }} resizeMode={FastImage.resizeMode.cover} />
              )}
              <View style={[tw.flex1, tw.flexCol, { marginLeft: 12 }]}>
                <View style={[tw.flexRow, tw.itemsCenter, { marginLeft: 3 }]}>
                  <Text numberOfLines={2} style={[{ fontSize: 16, lineHeight: 20, fontWeight: 'bold' }]}>
                    {item?.name}
                  </Text>
                </View>
                <Text numberOfLines={2} style={[tw.mT3, { fontSize: 14, color: colors.text, marginLeft: 5 }]}>
                  {item?.createdTime}
                </Text>
                <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter, { height: 30 }]}>
                  <Text
                    style={[
                      tw.selfEnd,
                      {
                        fontWeight: 'bold',
                        color: colors.accent
                      }
                    ]}
                  >
                    （{getAuthType(item.authType)}）
                  </Text>
                  {item.status === 1 ? (
                    <View style={[tw.flex1, tw.flexRow, tw.selfEnd, tw.justifyEnd]}>
                      <TouchableOpacity
                        onPress={() => {
                          props.oneSubmit(item);
                        }}
                        style={[tw.itemsCenter, tw.pY1, { borderRadius: 5, width: 50 }, tw.bgBlue400]}
                      >
                        <Text style={[tw.textWhite, { fontSize: 12 }]}>提交</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          props.oneDelete(item);
                        }}
                        style={[tw.itemsCenter, tw.pY1, tw.mL2, { borderRadius: 5, width: 50 }, tw.bgRed400]}
                      >
                        <Text style={[tw.textWhite, { fontSize: 12 }]}>删除</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text
                      style={[
                        tw.itemsCenter,
                        {
                          fontWeight: 'bold',
                          color: colors.accent
                        }
                      ]}
                    >
                      {item.primaryTeacher?.username}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={[
                tw.absolute,
                tw.itemsCenter,
                getColor(item.status),
                {
                  paddingTop: 2,
                  paddingBottom: 2,
                  right: Platform.OS === 'ios' ? -30 : -30,
                  top: Platform.OS === 'ios' ? 10 : 10,
                  width: 100,
                  transform: [{ rotate: '45deg' }]
                }
              ]}
            >
              <Text style={[{ paddingTop: 2, paddingBottom: 2, color: colors.background, fontSize: 11 }]}>
                {userStore.userInfo.userType === 3 ? getStatusStrStudent(item.status) : getStatusStrTeacher(item.status)}
              </Text>
            </View>
          </View>
        </Card>
      );
    };

    const flatListFooter = () => {
      if (props.data.length === 0) {
        if (userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER) {
          return (
            <Text style={[tw.selfCenter, { marginTop: 10, marginBottom: screenWidth ? 100 : Platform.OS ? 80 : 50 }]}>{t('lessonList.signUpTeacher')}</Text>
          );
        } else {
          return <Text style={[tw.selfCenter, { marginTop: 80, marginBottom: screenWidth ? 100 : Platform.OS ? 80 : 50 }]}>{t('lessonList.signUp')}</Text>;
        }
      } else {
        return <Text style={[tw.selfCenter, { marginTop: 10, marginBottom: screenWidth ? 100 : Platform.OS ? 80 : 50 }]}>{t('lessonList.bottomLine')}</Text>;
      }
    };

    return (
      <FlatList
        style={[tw.p3, tw.flex, { backgroundColor: colors.background }]}
        scrollEnabled={true}
        data={props.data}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        numColumns={1}
        renderItem={renderClassItem}
        onEndReached={handleOnLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={flatListFooter}
      />
    );
  }
);
