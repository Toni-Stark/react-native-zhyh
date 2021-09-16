import React, { useRef } from 'react';
import { View } from 'react-native';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme } from 'react-native-paper';
import { t } from '../../../common/tools';
import { observer } from 'mobx-react-lite';

type Props = {};

export const MyScheduleDetail: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('mySchedule.scheduleView')} />
          </Appbar.Header>
          <View style={[tw.m10, tw.selfCenter, tw.itemsCenter]} />
        </View>
      );
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
