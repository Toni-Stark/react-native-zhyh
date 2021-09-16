import React, { useRef } from 'react';
import { Appbar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../../index';
import { t } from '../../../../common/tools';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useStore } from '../../../../store';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE } from '../../../../common/status-module';

const SelectButton = ({ name, url, onClick }: selectButtonType): JSX.Element => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={[tw.itemsCenter]}
    >
      <View style={[tw.p2, tw.mT20, { borderRadius: 50, backgroundColor: colors.surface }]}>
        <FastImage style={{ height: 80, width: 80 }} resizeMode={FastImage.resizeMode.cover} source={url} />
      </View>
      <Text style={[tw.mT1, { fontSize: 18, fontWeight: 'bold', color: colors.accent }]}>{name}</Text>
    </TouchableOpacity>
  );
};

export const CreateLessonCorrect: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { lessonCreateStore } = useStore();
    const baseView = useRef<any>();
    const data = [
      {
        name: t('createLessons.createNewLesson'),
        url: require('../../../../assets/live.png'),
        onClick: () => {
          lessonCreateStore.createLessonType = LESSON_TYPE_LIVE;
          navigation.navigate('Main', { screen: 'CreateLessonsLive' });
        }
      },
      {
        name: t('createLessons.createDemandLesson'),
        url: require('../../../../assets/demand.png'),
        onClick: () => {
          lessonCreateStore.createLessonType = LESSON_TYPE_DEMAND;
          navigation.navigate('Main', { screen: 'CreateLessonsDemand' });
        }
      }
    ];

    const renderContent = () => {
      return (
        <View style={[tw.flex1, tw.itemsCenter]}>
          {data.map((item, index) => (
            <SelectButton name={item.name} url={item.url} onClick={item.onClick} key={index} />
          ))}
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('createLessons.createLesson')} />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);

interface selectButtonType {
  name: string;
  url: any;
  onClick: () => void;
}
