import React, { useRef } from 'react';
import { Appbar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../store';
import { SelectSearchList } from '../../../component/SelectSearchList';

export const SelectTeacherList: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { lessonDetailStore, userStore } = useStore();

    const getTeacherList = (text: string) => {
      lessonDetailStore
        .getTeacherList(text)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1, tw.mX4, tw.pY3]}>
          <SelectSearchList
            footerText="已是所有的老师了"
            selectObj={lessonDetailStore.selectObj.slice()}
            data={lessonDetailStore.selectTeacher.slice()}
            select={lessonDetailStore.selects.slice()}
            disableId={userStore.userInfoDetail.id}
            changeSelect={(e, id) => {
              console.log(e, id, userStore.userInfoDetail.id);
              if (id !== userStore.userInfoDetail.id) {
                if (lessonDetailStore.selects.filter((item) => item === id).length === 0) {
                  lessonDetailStore.selects.push(id);
                  if (lessonDetailStore.selectTeacher.filter((objItem) => objItem.id === id).length > 0) {
                    lessonDetailStore.selectObj.push(lessonDetailStore.selectTeacher.filter((objItem) => objItem.id === id)[0]);
                  }
                } else {
                  lessonDetailStore.selects.splice(lessonDetailStore.selects.indexOf(id), 1);
                  for (let i = 0; i < lessonDetailStore.selectObj.length; i++) {
                    if (lessonDetailStore.selectObj[i].id === id) {
                      lessonDetailStore.selectObj.splice(i, 1);
                    }
                  }
                }
              }
            }}
            searchText={(e: string) => {
              if (e.trim().length > 0) {
                getTeacherList(e);
              }
            }}
          />
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[tw.itemsCenter, tw.justifyCenter, tw.flexRow, { backgroundColor: colors.background }]}>
          <Icon
            style={[tw.absolute, { left: 20 }]}
            name="arrow-back"
            size={23}
            color={colors.text}
            onPress={() => {
              navigation.goBack();
            }}
          />

          <Text
            style={[{ fontSize: 16, color: colors.text }]}
            onPress={() => {
              navigation.goBack();
            }}
          >
            选择助教老师
          </Text>
          <View style={[tw.absolute, , { right: 20 }]}>
            <Text style={[tw.selfEnd, { fontSize: 13, color: colors.accent }]}>已选择</Text>
            <Text style={[tw.selfEnd, { fontSize: 13 }]}>（{lessonDetailStore.selects.length}）人</Text>
          </View>
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
