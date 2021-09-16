import React, { useRef } from 'react';
import BaseView from '../../../../component/BaseView';
import { t } from '../../../../common/tools';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Text } from 'react-native-paper';
import { ScreenComponent } from '../../../index';
import { observer } from 'mobx-react-lite';

export const Withdrawal: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const renderContent = () => {
      return <Text>啥也没有</Text>;
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('withdrawal.myHeader')} />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
