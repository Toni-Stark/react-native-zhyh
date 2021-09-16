import React, { useEffect } from 'react';
import { NavigatorComponentProps } from '../index';
import { WebView } from 'react-native-webview';
import BaseView from '../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme } from 'react-native-paper';
import { t } from '../../common/tools';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';

type Props = {};

export const UserAgreement: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { settingStore } = useStore();
    useEffect(() => {
      return () => {
        settingStore.userAgreeModal = true;
        settingStore.userIsAgree = false;
      };
    }, [settingStore]);

    return (
      <BaseView useSafeArea={false} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('userFeedback.userAgree')} />
        </Appbar.Header>
        <WebView source={{ uri: 'http://www.icst-edu.com/?xueyue/37.html' }} />
      </BaseView>
    );
  }
);
