import React, { useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Appbar, Divider, Text, useTheme } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';

export const LessonPlanList: React.FC<NavigatorComponentProps> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { lessonDetailStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const baseView = useRef<any>();

    const handleOnLoadMore = () => {
      setLoading(true);
      setLoading(false);
    };
    const onRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 100);
    };

    const lessonItem = ({ item, index }) => {
      return (
        <View key={index} style={[tw.mX4, tw.pY3, tw.flexRow, tw.itemsCenter, { borderBottomWidth: 0.5, borderBottomColor: colors.disabled }]}>
          <View style={[tw.w16]}>
            <Text numberOfLines={1} style={[{ color: colors.placeholder }]}>
              第{index + 1}节
            </Text>
          </View>
          <View style={[tw.mL2, tw.flex1]}>
            <Text numberOfLines={1}>{item.name}</Text>
            <Text numberOfLines={1} style={[tw.mT1, { color: colors.placeholder, fontSize: 11 }]}>
              {item.planningStartTime.trim().split(' ')[0]} - {item.planningStartTime.trim().split(' ')[1] + '至' + item.planningEndTime.trim().split(' ')[1]}
            </Text>
          </View>
          <Divider />
        </View>
      );
    };

    const renderContent = () => {
      return (
        <FlatList
          style={[tw.flex1]}
          scrollEnabled={true}
          data={lessonDetailStore.lessonDetail?.schedules}
          keyExtractor={(item) => `lesson-items-${item.id}`}
          numColumns={1}
          renderItem={lessonItem}
          onEndReached={handleOnLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={
            <View style={[tw.selfCenter, tw.pT3, tw.pB5]}>
              <Text>{loading ? '正在加載中' : '我也是有底线的~'}</Text>
            </View>
          }
        />
      );
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[{ backgroundColor: colors.background }]}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title="课程大纲" />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
