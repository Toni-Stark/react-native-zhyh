import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import BaseView from '../../../../component/BaseView';
import { t } from '../../../../common/tools';
import { tw } from 'react-native-tailwindcss';
import { Appbar, Text, useTheme, TextInput, Button, Portal, Modal, RadioButton } from 'react-native-paper';
import { ScreenComponent } from '../../../index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Controller, useForm } from 'react-hook-form';
import { useStore } from '../../../../store';
import Alipay from '@uiw/react-native-alipay';
import { observer } from 'mobx-react-lite';
import * as WeChat from 'react-native-wechat-lib';
import { appConfig } from '../../../../common/app.config';

type IOSPayItem = {
  identifier: string;
  priceString: string;
  title: string;
  description: string;
};

if (Platform.OS === 'ios') {
} else if (Platform.OS === 'android') {
  WeChat.registerApp(appConfig.WX_APP_ID, 'fack universalLink');
}

export const Recharge: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { payStore, userStore } = useStore();
    const { colors } = useTheme();
    const { control, handleSubmit, errors } = useForm();
    const [recharge] = useState<string[]>([t('recharge.weChat'), t('recharge.alipay')]);
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(recharge[1]);
    const [paying, setPaying] = useState(false);

    const aliPayMoney = async (data) => {
      if (typeof userStore.userInfo.id !== 'undefined') {
        await payStore.aliPayForBalance(userStore.userInfo.id, data.balance);
        if (typeof payStore.aliPayString !== 'undefined') {
          const result = await Alipay.alipay(payStore.aliPayString);
          let { resultStatus } = result;
          switch (resultStatus) {
            case '9000':
              baseView.current?.showMessage({ text: t('waringSet.operationSuccessful') });
              await userStore.getProfile();
              navigation.navigate('Main', { screen: 'BalanceDetail', options: { animationEnabled: false } });
              break;
            case '8000':
              baseView.current?.showMessage({ text: t('waringSet.processing') });
              break;
            case '4000':
              baseView.current?.showMessage({ text: t('waringSet.operationFailed') });
              break;
            case '5000':
              baseView.current?.showMessage({ text: t('waringSet.repeatRequest') });
              break;
            case '6001':
              baseView.current?.showMessage({ text: t('waringSet.userCancelsMidway') });
              break;
            case '6002':
              baseView.current?.showMessage({ text: t('waringSet.networkConnectionError') });
              break;
            default:
              baseView.current?.showMessage({ text: t('waringSet.unknownError') });
          }
        }
      } else {
        baseView.current?.showMessage({ text: t('recharge.pleaseLogIn') });
      }
    };
    const wxPayMoney = async (data) => {
      if (userStore.userInfo.id && userStore.userInfo.userType) {
        const res = await payStore.wxPayForBalance(userStore.userInfo.userType, userStore.userInfo.id, data.balance);
        if (res) {
          console.log(payStore.wxPayInfo);
          if (payStore.wxPayInfo?.appid) {
            const wxRes = await WeChat.pay({
              partnerId: payStore.wxPayInfo.partnerid,
              prepayId: payStore.wxPayInfo.prepayid,
              nonceStr: payStore.wxPayInfo.noncestr,
              timeStamp: payStore.wxPayInfo.timestamp,
              package: payStore.wxPayInfo.tpackage,
              sign: payStore.wxPayInfo.sign
            })
              .then((payRes) => {
                return payRes;
              })
              .catch((err) => {
                console.log(1, err);
                return { errCode: 999999, errStr: t('recharge.paymentError') };
              });
            console.log(2, wxRes);
            const { errCode, errStr } = await wxRes;
            if (errCode === 0) {
              payStore.moneyOperate = 0;
              await userStore.getProfile();
              baseView.current.showMessage({ text: t('recharge.success'), delay: 2 });
              navigation.navigate('Main', { screen: 'BalanceDetail', options: { animationEnabled: false } });
            } else {
              baseView.current.showMessage({ text: errStr, delay: 2 });
            }
          } else {
            return Promise.reject(t('recharge.paymentError'));
          }
        }
      } else {
        baseView.current.showMessage({ text: t('recharge.pleaseLogIn') });
      }
    };

    const topUpBalance = async (data) => {
      if (Platform.OS === 'android') {
        if (checked === recharge[0]) {
          await wxPayMoney(data);
        } else if (checked === recharge[1]) {
          await aliPayMoney(data);
        }
      } else {
      }
    };

    const redText = (name: string) => {
      return <Text style={[{ color: colors.notification }]}>{name}</Text>;
    };
    const renderContent = () => {
      return (
        <View style={[tw.p6]}>
          <View style={[tw.pT3, tw.mR5, tw.flexRow, tw.itemsCenter]}>
            <Text style={[{ fontSize: 35, fontWeight: 'bold' }]}>￥</Text>
            <Controller
              control={control}
              name="balance"
              rules={{ required: { value: true, message: '充值金额必须填写' }, pattern: /^[1-9](\d+)?(\.\d{1,2})?$|^(0)$|^\d\.\d{1,2}?$/ }}
              defaultValue=""
              render={({ onChange, onBlur, value }) => (
                <TextInput
                  label={t('recharge.myHeader') + ' ' + t('recharge.amount')}
                  maxLength={6}
                  keyboardType="numeric"
                  style={[tw.flex1, { fontSize: 25, backgroundColor: colors.background }]}
                  onBlur={onBlur}
                  onChangeText={(balance) => onChange(balance)}
                  value={value}
                  error={errors.balance}
                />
              )}
            />
          </View>
          <TouchableOpacity
            style={[tw.mT6, tw.pX3]}
            activeOpacity={0.8}
            onPress={() => {
              setVisible(true);
            }}
          >
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.pY4, { borderColor: colors.deepBackground, borderBottomWidth: 2 }]}>
              <View style={[tw.flexRow]}>
                <Text numberOfLines={1}>{t('recharge.myHeader') + ' ' + t('recharge.mode')}</Text>
                <Text style={[tw.mL6, { color: colors.primary }]}>{checked + ' ' + t('recharge.myHeader')}</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.disabled} />
            </View>
          </TouchableOpacity>
          {/*|| selection === '' */}
          <Button style={[tw.mT16, tw.mX3]} disabled={paying} contentStyle={[tw.p1]} mode="contained" onPress={handleSubmit(topUpBalance)}>
            {t('recharge.myHeader')}
          </Button>
          <View style={[tw.mY5, tw.mX3]}>
            <Text style={[{ color: colors.placeholder, lineHeight: 20 }]}>说明</Text>
            <Text style={[{ color: colors.placeholder, lineHeight: 20 }]}>1.购买的学悦币{redText('不支持')}提现、退款。</Text>
            <Text style={[{ color: colors.placeholder, lineHeight: 20 }]}>2.学悦币{redText('仅支持')}仅支持在ios app 上购买课程。</Text>
            <Text style={[{ color: colors.placeholder, lineHeight: 20 }]}>3.学悦币购买的课程{redText('不支持')}退款。</Text>
            <Text style={[{ color: colors.placeholder, lineHeight: 20 }]}>4.若有疑问，请致电 023-68675986。</Text>
          </View>
        </View>
      );
    };

    const hideModal = () => {
      setVisible(false);
    };

    const showModal = () => {
      return (
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={[tw.mX8, tw.pY4, { borderRadius: 6, backgroundColor: colors.background }]}>
            <View style={[tw.pB4, tw.pL3, { borderColor: colors.deepBackground, borderBottomWidth: 2 }]}>
              <Text>{t('recharge.myHeader') + ' ' + t('recharge.mode')}</Text>
            </View>
            <View style={[tw.pX4]}>
              {recharge.map((item, index) => (
                <TouchableOpacity
                  style={[
                    tw.flexRow,
                    tw.itemsCenter,
                    tw.justifyBetween,
                    tw.pY2,
                    index === recharge.length ? { borderColor: colors.deepBackground, borderBottomWidth: 2 } : null
                  ]}
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => {
                    setChecked(item);
                    hideModal();
                  }}
                >
                  <Text numberOfLines={1}>{item + ' ' + t('recharge.myHeader')}</Text>
                  <RadioButton.Android
                    value={item}
                    status={checked === item ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(item);
                      hideModal();
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </Portal>
      );
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('recharge.myHeader')} />
        </Appbar.Header>
        {renderContent()}
        {showModal()}
      </BaseView>
    );
  }
);
