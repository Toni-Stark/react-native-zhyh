import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NavigatorComponentProps } from '../../../index';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Text, TextInput, Button } from 'react-native-paper';
import { t } from '../../../../common/tools';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../store';

type Props = {};

export const ProblemFeedback: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { settingStore } = useStore();
    const [text, setText] = useState('');

    const updateInput = () => {
      settingStore.updateInput(text).then((res) => {
        if (res) {
          baseView.current?.showMessage({ text: '发布成功', delay: 1.5 });
        }
      });
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('problemFeedback.fbTitle')} />
          </Appbar.Header>
          <View style={[tw.p6]}>
            <Text style={[tw.mB3]}>{t('problemFeedback.feedback')}</Text>
            <TextInput
              style={[tw.flex1, tw.mY3, { backgroundColor: colors.background }]}
              multiline
              mode="outlined"
              placeholder={t('homeworkCreated.homeworkContent')}
              placeholderTextColor={colors.placeholder}
              numberOfLines={4}
              onChangeText={(name) => {
                setText(name);
              }}
              value={text}
              editable
            />
            <Button
              mode={'contained'}
              contentStyle={[tw.p1]}
              onPress={() => {
                updateInput();
              }}
            >
              {t('homeworkRevision.submit')}
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
