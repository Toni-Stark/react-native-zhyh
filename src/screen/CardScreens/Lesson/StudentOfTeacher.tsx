import React, { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Appbar, Text, useTheme, Avatar } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';
import { studentType } from '../../../store/LessonDetailStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {};

export const StudentOfTeacher: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { lessonDetailStore, userStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const baseView = useRef<any>();

    useEffect(() => {
      (async () => {
        await lessonDetailStore.getStudentOfTeacher(userStore.userInfo.id);
      })();
    }, [userStore.userInfo.id, lessonDetailStore]);

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

    const lessonItem = ({ item, index }: { item: studentType; index: number }) => {
      return (
        <View key={index} style={[tw.mX4, tw.pY3, tw.flexRow, tw.itemsCenter, { borderBottomWidth: 0.5, borderBottomColor: colors.disabled }]}>
          {item.avatar.url.length > 0 ? (
            <Avatar.Image source={{ uri: item.avatar.url }} style={{ width: 45, height: 45, backgroundColor: colors.accent }} />
          ) : (
            <Icon name="face" size={45} />
          )}
          <View style={[tw.mL4]}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>昵称: {item.username}</Text>
            <Text>姓名: {item.realname}</Text>
            <Text>生日: {item.birthday ? item.birthday : '未设置'}</Text>
          </View>
        </View>
      );
    };

    const renderContent = () => {
      return (
        <FlatList
          style={[tw.flex1]}
          scrollEnabled={true}
          data={lessonDetailStore.studentOfTeacher}
          keyExtractor={(item) => `lesson-items-${item.id}`}
          numColumns={1}
          renderItem={lessonItem}
          onEndReached={handleOnLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={
            <View style={[tw.selfCenter, tw.pT3, tw.pB5]}>
              <Text>{loading ? '正在加載中' : '我也是有底線的'}</Text>
            </View>
          }
        />
      );
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title="我的学生" />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
