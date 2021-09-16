/**
 * 课程总结页面
 */
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Text, TextInput, Button } from 'react-native-paper';
import { t } from '../../../common/tools';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';

type ScreenRouteProp = RouteProp<ScreensParamList, 'ClassSummary'>;
type Props = {
  route: ScreenRouteProp;
};

export const ClassSummary: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { lessonDetailStore, userStore } = useStore();
    const [text, setText] = useState('');

    const updateInput = () => {
      console.log(userStore.userInfo.id && lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.id);
      if (userStore.userInfo.id && lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.id) {
        lessonDetailStore.updateInput(text, userStore.userInfo.id, lessonDetailStore.lessonDetail.id, route.params.id).then((res) => {
          if (typeof res === 'string') {
            baseView.current.showMessage({ text: res, delay: 1.5 });
          } else {
            if (res && lessonDetailStore.lessonDetail?.id) {
              lessonDetailStore.getLessonLiveDetail(lessonDetailStore.lessonDetail.id).then(() => {
                baseView.current.showMessage({ text: t('viewSummary.success'), delay: 1.5 });
                navigation.goBack();
              });
            }
          }
        });
      }
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('classSum.header')} />
          </Appbar.Header>
          <View style={[tw.p6]}>
            <TextInput
              style={[tw.flex1, tw.mY3, { backgroundColor: colors.background }]}
              multiline
              mode="outlined"
              placeholder={t('classSum.homeworkContent')}
              placeholderTextColor={colors.placeholder}
              numberOfLines={4}
              onChangeText={(name) => {
                setText(name);
              }}
              value={text}
              editable
            />
            <Text style={[tw.mB3, { color: colors.disabled }]}>{t('classSum.feedback')}</Text>

            <Button
              mode={'contained'}
              contentStyle={[tw.p1]}
              onPress={() => {
                updateInput();
              }}
            >
              {t('classSum.submit')}
            </Button>
          </View>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={true} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
