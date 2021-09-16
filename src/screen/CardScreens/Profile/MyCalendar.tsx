import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../../../store';
import moment from 'moment';
import { requestAudioAndVideoPermission, t } from '../../../common/tools';
import { Agenda } from 'react-native-calendars';
import _ from 'lodash';
import { NavigatorComponentProps } from '../../index';
import { MyCalendarPlaceholder } from '../../../component/skeleton/MyCalendarPlaceholder';
import { observer } from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';

interface AgendaItem {
  courseName: string;
  categoryName: string;
  startTime: string;
  endTime: string;
  date: string;
}

type ScreenRouteProp = RouteProp<ScreensParamList, 'MyCalendar'>;
type Props = {
  route: ScreenRouteProp;
  message?: string;
};

export const MyCalendar: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { agendaLessonStore, userStore } = useStore();
    const [list, setList] = useState<any>({});
    const [latestDay, setLatestDay] = useState<string>();
    const [maxDay, setMaxDay] = useState<string>('');
    const [minDay, setMinDay] = useState<string>('');
    const { colors } = useTheme();

    useEffect(() => {
      if (route.params?.message) {
        baseView.current?.showMessage({ text: route.params.message, delay: 2 });
      }
    }, [route.params?.message]);

    useEffect(() => {
      agendaLessonStore.loading = true;
      agendaLessonStore
        .getMyScheduleThisMonth()
        .then((res) => {
          const res1 = res.map((item) => {
            return {
              teacherCardName: item.lesson.createdBy,
              teacherLoginName: item.lesson.createdBy,
              scheduleId: item.id,
              courseName: item.lesson.name,
              lectureName: item.name,
              categoryName: item.lesson.category.name,
              startTime: moment(item.planningStartTime).format('YYYY-MM-DD HH:mm'),
              endTime: moment(item.planningEndTime).format('YYYY-MM-DD HH:mm'),
              date: moment(item.planningStartTime).format('YYYY-MM-DD'),
              coverImage: item.lesson.imageCover
            };
          });
          const res2 = res1.sort((a, b) => Number(b.date) - Number(a.date));
          const result = _.groupBy(res2, (item) => item.date);
          setList(result);
          //获取当月最近的有课日期
          const now = moment();
          const minItem: AgendaItem = _.minBy(res2, (item: AgendaItem) => Math.abs(now.dayOfYear() - moment(item.date).dayOfYear()));
          setLatestDay(minItem !== undefined ? (minItem.date === undefined ? '' : minItem.date) : '');
          //获取本月最小日期和最大日期
          const maxDate: AgendaItem = _.maxBy(res2, (item: AgendaItem) => moment(item.date).dayOfYear());
          const minDate: AgendaItem = _.minBy(res2, (item: AgendaItem) => moment(item.date).dayOfYear());
          setMinDay(minDate !== undefined ? minDate.date : '');
          setMaxDay(maxDate !== undefined ? maxDate.date : '');
          agendaLessonStore.loading = false;
        })
        .catch(() => baseView.current.showMessage({ text: 'what!!!', delay: 2 }));
    }, [agendaLessonStore]);

    /**
     * 上课页面跳转
     */
    const clickDoing = (item: any) => {
      requestAudioAndVideoPermission()
        .then(() => {
          navigation.navigate('OnlineClassRoom', { roomId: item.scheduleId, pathName: route.name });
        })
        .catch((e) => baseView.current?.showMessage(e));
    };

    const renderContent = () => {
      if (agendaLessonStore.loading) {
        return (
          <View style={[tw.flex1]}>
            <MyCalendarPlaceholder />
          </View>
        );
      } else {
        return (
          <Agenda
            items={list}
            selected={latestDay}
            minDate={minDay}
            maxDate={maxDay}
            pastScrollRange={1}
            futureScrollRange={1}
            renderItem={(item, index) => {
              return (
                <TouchableOpacity
                  style={[tw.mB5]}
                  activeOpacity={0.7}
                  key={index}
                  onPress={() => {
                    clickDoing(item);
                  }}
                >
                  <View style={[tw.mY3, tw.p5, tw.mR10, { backgroundColor: colors.surface, overflow: 'hidden', borderRadius: 8 }]}>
                    <View style={[tw.flexRow, tw.overflowHidden, tw.mB2]}>
                      <Text style={[{ color: colors.accent, fontSize: 16 }]}>课名: </Text>
                      <Text style={[{ color: colors.accent, fontSize: 16, fontWeight: 'bold' }]}> {item.lectureName}</Text>
                    </View>
                    <View style={[tw.flexRow, tw.overflowHidden, tw.mB2]}>
                      <Text style={[{ color: colors.accent, fontSize: 16 }]}>时间: </Text>
                      <Text style={[{ color: colors.primary, fontSize: 18 }]}>
                        {moment(item.startTime).format('HH:mm')} - {moment(item.endTime).format('HH:mm')}
                      </Text>
                    </View>
                    <View style={[tw.flexRow]}>
                      <View>
                        <FastImage
                          source={{ uri: item.coverImage.url }}
                          style={{ width: 60, height: 60, borderRadius: 8 }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </View>
                      <View style={[tw.justifyBetween, tw.mL2]}>
                        <View style={[tw.flexRow, tw.overflowHidden]}>
                          <Text style={[{ color: colors.disabled, fontSize: 13 }]}>课程名：</Text>
                          <Text style={[{ color: colors.accent, fontSize: 13 }]}> {item.courseName}</Text>
                        </View>
                        <View style={[tw.flexRow, tw.itemsCenter]}>
                          <Text style={[{ color: colors.disabled }]}>{t('myCalendar.aSubject')}：</Text>
                          <View style={[tw.itemsCenter, tw.justifyCenter, { backgroundColor: colors.lightHint, width: 40, height: 16, borderRadius: 5 }]}>
                            <Text style={[{ fontSize: 10, color: colors.accent }]}>{item.categoryName}</Text>
                          </View>
                        </View>
                        <View style={[]}>
                          <Text style={[{ color: colors.disabled }]}>
                            {userStore.getUserTypeName}：
                            <Text style={[{ color: colors.accent, fontSize: 13 }]}>
                              {item.teacherCardName === '' ? item.teacherLoginName : item.teacherCardName}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            renderEmptyData={() => {
              return (
                <View style={[tw.itemsCenter, { marginTop: 220 }]}>
                  <Text style={[tw.selfCenter, { fontSize: 20, color: colors.placeholder }]}>-{t('myCalendar.noCourses')}-</Text>
                </View>
              );
            }}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.accent,
              dotColor: colors.lightHint,
              agendaDayTextColor: colors.disabled,
              agendaDayNumColor: colors.disabled,
              agendaTodayColor: colors.primary,
              agendaKnobColor: colors.disabled
            }}
          />
        );
      }
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('myCalendar.myHeader')} />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
