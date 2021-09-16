import React, { useRef } from 'react';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { t } from '../../../common/tools';
import { ScreenComponent } from '../../index';
import { Platform, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Text, Avatar, Button } from 'react-native-paper';
import { observer } from 'mobx-react-lite';

export const BalanceDetail: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { userStore } = useStore();
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const renderContent = () => {
      return (
        <View style={[tw.mT16, tw.mB16, tw.flexCol]}>
          <View style={[tw.itemsCenter]}>
            <Avatar.Image size={48} style={[{ backgroundColor: colors.background }]} source={require('../../../assets/balance.png')} />
            <Text style={[tw.mT8, { fontSize: 16 }]}>{t('balanceDetail.XYCoin')}</Text>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <Text style={[tw.mT3, { fontSize: 25, fontWeight: 'bold' }]}>￥</Text>
              <Text style={[tw.mT3, { fontSize: 35, fontWeight: 'bold' }]}>{userStore.userInfo.balance ? userStore.userInfo.balance : '0.00'}</Text>
            </View>
            <View style={[tw.flexRow, tw.mT2]}>
              <Text style={[{ color: colors.notification }]}>{t('balanceDetail.frozenBalance')}: </Text>
              <Text style={[{ color: colors.notification, fontWeight: 'bold' }]}>
                {userStore.userInfo.frozenBalance ? userStore.userInfo.frozenBalance : '0.00'}
              </Text>
            </View>
          </View>
          <View style={[tw.itemsCenter, tw.mT32]}>
            <Button
              mode="contained"
              contentStyle={[{ width: 150 }]}
              style={[tw.mB3]}
              onPress={() => {
                if (Platform.OS === 'android') {
                  navigation.navigate('Main', { screen: 'Recharge', options: { animationEnabled: false } });
                } else {
                  navigation.navigate('Main', { screen: 'BalanceRechargeIOS', params: { message: '充值' }, options: { animationEnabled: false } });
                }
              }}
            >
              {t('balanceDetail.recharge')}
            </Button>
            {/*<Button*/}
            {/*  mode="outlined"*/}
            {/*  contentStyle={[{ width: 150 }]}*/}
            {/*  onPress={() => {*/}
            {/*    navigation.navigate('Main', { screen: 'Withdrawal', options: { animationEnabled: false } });*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {t('balanceDetail.withdrawal')}*/}
            {/*</Button>*/}
          </View>
        </View>
      );
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('balanceDetail.myHeader')} />
          <Text
            style={[tw.mR3, { color: colors.primary }]}
            onPress={() => {
              navigation.navigate('Main', { screen: 'FlowDetail', options: { animationEnabled: false } });
            }}
          >
            {t('balanceDetail.balanceDetails')}
          </Text>
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
