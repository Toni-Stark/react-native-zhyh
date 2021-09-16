import * as React from 'react';
import { NavigatorComponentProps } from '../../index';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { tw } from 'react-native-tailwindcss';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { t, throttle } from '../../../common/tools';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../../store';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import BaseView from '../../../component/BaseView';
import { homeworkListType } from '../../../store/HomeworkFormStore';
type ScreenRouteProp = RouteProp<ScreensParamList, 'HomeworkList'>;
type Props = {
  route: ScreenRouteProp;
};
export const HomeworkList: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const { userStore, homeworkFormStore, userRolesStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const baseView = useRef<any>(undefined);
    const isTeacher = userStore.userInfoDetail.id === userRolesStore.isTeacherId;
    const isStudent = userRolesStore.isStudentId.filter((item) => item === userStore.userInfoDetail.id).length > 0;
    useEffect(() => {
      (async () => {
        await homeworkFormStore.getLectureList(route.params.id, route.params.lessonType, false);
      })();
    }, [homeworkFormStore, route.params.id, route.params.lessonType]);

    const loadAddData = async () => {
      await homeworkFormStore.getLectureList(route.params.id, route.params.lessonType, true);
    };

    const onRefresh = async () => {
      await setRefreshing(true);
      setTimeout(async () => {
        await homeworkFormStore.getLectureList(route.params.id, route.params.lessonType, false);
        await setRefreshing(false);
      }, 1500);
    };

    const renderClassItem = ({ item, index }: { item: homeworkListType; index: number }) => {
      return (
        <TouchableOpacity
          style={[tw.mY2, tw.mX3]}
          onPress={async () => {
            navigation.navigate('Main', {
              screen: 'HomeworkInteraction',
              params: { infoId: item.id, lectureId: route.params.id }
            });
          }}
          key={index}
        >
          <View style={[]}>
            <View
              style={[
                tw.p3,
                tw.pB2,
                {
                  borderColor: colors.lightHint,
                  borderBottomColor: colors.lightHint,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  borderWidth: 0.5,
                  backgroundColor: colors.surface
                }
              ]}
            >
              <View style={[tw.flexRow, tw.justifyBetween]}>
                <Text numberOfLines={2} style={[{ color: colors.accent, fontSize: 17, lineHeight: 20, fontWeight: 'bold' }]}>
                  {item.title}
                </Text>
                <Text numberOfLines={2} style={[tw.selfStart, { fontSize: 14, color: colors.accent }]}>
                  {item.createdBy}
                </Text>
              </View>
              <View style={[tw.itemsCenter, tw.pY1]}>
                <Text numberOfLines={2} style={[tw.selfStart, { fontSize: 13, color: colors.placeholder }]}>
                  {t('homework.publishedOn')} {moment(item.createdTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </View>

              <View style={[tw.flexRow, tw.justifyBetween, { height: 20, marginTop: 10 }]}>
                <Text numberOfLines={2} style={[tw.flex1, tw.itemsCenter, { fontSize: 13, color: colors.placeholder }]}>
                  详情：<Text>{item.content}</Text>
                </Text>
              </View>
            </View>
            <View
              style={[
                tw.p3,
                tw.pT2,
                tw.flexRow,
                tw.justifyBetween,
                {
                  borderColor: colors.lightHint,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  borderWidth: 0.5,
                  borderTopWidth: 0,
                  backgroundColor: colors.surface,
                  height: 35
                }
              ]}
            >
              <Text style={[{ color: isStudent ? colors.accent : colors.text, fontSize: 12 }]}>未完成：（{item.notSubmitCount}）</Text>
              <Text style={[{ color: isTeacher ? colors.accent : colors.text, fontSize: 12 }]}>待批改：（{item.submitCount}）</Text>
              <Text
                style={[{ color: item.retreatCount === 0 && item.notSubmitCount === 0 && item.reviewCount === 0 ? colors.accent : colors.text, fontSize: 12 }]}
              >
                已完成：（{item.reviewCount}）
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    const flatListFooter = () => {
      if (homeworkFormStore.homeworkList.length === 0) {
        return <Text style={[tw.selfCenter, { marginTop: 10, marginBottom: 40 }]}>{t('lessonList.noWork')}</Text>;
      } else {
        return <Text style={[tw.selfCenter, { marginTop: 10, marginBottom: 40 }]}>{t('lessonList.bottomLine')}</Text>;
      }
    };

    const renderContent = () => {
      return (
        <FlatList
          style={[tw.flex1, tw.pY3, { backgroundColor: colors.background }]}
          scrollEnabled={true}
          data={homeworkFormStore.homeworkList.slice()}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          numColumns={1}
          renderItem={renderClassItem}
          onEndReached={throttle(loadAddData)}
          onEndReachedThreshold={0.2}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={flatListFooter}
        />
      );
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title="作业列表" />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
