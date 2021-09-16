import React, { useEffect, useRef } from 'react';
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
import { USER_MODE_TEACHER } from '../../../common/status-module';

type ScreenRouteProp = RouteProp<ScreensParamList, 'ViewSummary'>;
type Props = {
  route: ScreenRouteProp;
};

export const ViewSummary: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { lessonDetailStore, userStore } = useStore();

    useEffect(() => {
      if (route.params.id) {
        (async () => {
          await lessonDetailStore.getInput(route.params.id);
        })();
      }
    }, [lessonDetailStore, route.params.id]);

    const updateInput = () => {
      console.log(userStore.userInfo.id && lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.id);
      if (userStore.userInfo.id && lessonDetailStore.lessonDetail && lessonDetailStore.lessonDetail.id) {
        lessonDetailStore
          .updateInput(lessonDetailStore.summaryContent?.content, userStore.userInfo.id, lessonDetailStore.lessonDetail.id, route.params.id)
          .then((res) => {
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
      if (userStore.userInfo.userType !== USER_MODE_TEACHER) {
        return (
          <View style={[tw.flex1]}>
            <Appbar.Header style={{ backgroundColor: colors.background }}>
              <Appbar.BackAction onPress={navigation.goBack} />
              <Appbar.Content title={t('viewSummary.summary')} />
            </Appbar.Header>
            <View style={[tw.p6]}>
              <Text style={[{ color: colors.disabled }]}>
                {t('viewSummary.last')}：{lessonDetailStore.summaryContent.updateTime}
              </Text>

              <Text style={[tw.mT5]}>{lessonDetailStore.summaryContent.content}</Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={[tw.flex1]}>
            <Appbar.Header style={{ backgroundColor: colors.background }}>
              <Appbar.BackAction onPress={navigation.goBack} />
              <Appbar.Content title={t('classSum.header')} />
            </Appbar.Header>
            <View style={[tw.p6]}>
              <Text style={[{ color: colors.disabled }]}>
                {t('viewSummary.last')}：{lessonDetailStore.summaryContent.updateTime}
              </Text>
              <TextInput
                style={[tw.flex1, tw.mY3, { backgroundColor: colors.background }]}
                multiline
                mode="outlined"
                placeholder={t('classSum.homeworkContent')}
                placeholderTextColor={colors.placeholder}
                numberOfLines={4}
                onChangeText={(name) => {
                  if (lessonDetailStore.summaryContent?.content) {
                    lessonDetailStore.summaryContent.content = name;
                  }
                }}
                value={lessonDetailStore.summaryContent?.content}
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
      }
    };

    return (
      <BaseView useSafeArea={false} scroll={true} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
