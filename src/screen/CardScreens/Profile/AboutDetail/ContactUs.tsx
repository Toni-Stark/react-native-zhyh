import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { NavigatorComponentProps } from '../../../index';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Text } from 'react-native-paper';
import { t } from '../../../../common/tools';
import { observer } from 'mobx-react-lite';

type Props = {};

export const ContactUs: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.surface }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('contactUs.delInfo')} />
          </Appbar.Header>
          <ScrollView>
            <View style={[tw.p6]}>
              <Text style={[tw.mT6]}>{t('contactUs.officeNumber')}：023-68675986</Text>
              <Text style={[tw.mT6]}>
                {t('contactUs.address')}：{t('contactUs.addressDetail')}
              </Text>
            </View>
          </ScrollView>
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
