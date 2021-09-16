import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { NavigatorComponentProps } from '../../../index';
import BaseView from '../../../../component/BaseView';
import { useTheme, Appbar, TextInput, Button } from 'react-native-paper';
import { tw } from 'react-native-tailwindcss';
import { t, throttle } from '../../../../common/tools';
import { useStore } from '../../../../store';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { RSA } from 'react-native-rsa-native';

export type Props = {};

export const ChangeInfoSys: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { userStore } = useStore();
    const { colors } = useTheme();
    const { control, handleSubmit, errors } = useForm();
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const [useVerifyCode, setUseVerifyCode] = useState(true);
    const [passwordInvisible, setPasswordInvisible] = useState(false);
    const [phoneState, setPhoneState] = useState('');
    const [sysCode, setSysCode] = useState('');
    const BTN_INPUT_SIZE: number = UI_SIZE ? 16 : 12;
    const BTN_SMS_SIZE: number = UI_SIZE ? 14 : 12;

    useEffect(() => {
      console.log(userStore.userInfo);
    }, [userStore.userInfo]);

    const changePassword = (data) => {
      console.log(data.phone, data.password, data.verifyCode);
      userStore.getPublicKey().then((result) => {
        if (result) {
          RSA.encrypt(data.password, result).then((resPass) => {
            console.log(resPass);
            userStore.changePassword({ passwordNew: resPass, smsCode: data.verifyCode }).then((res) => {
              baseView.current.hideLoading();
              if (typeof res !== 'string') {
                baseView.current.showMessage({ text: '修改成功', delay: 2 });
                navigation.navigate('LoginByPhone');
              } else {
                baseView.current.showMessage({ text: res, delay: 2 });
              }
            });
          });
        }
      });
    };

    const handleQuerySmsCode = async () => {
      await setUseVerifyCode(false);
      await handleSubmit(async (data) => {
        await userStore.downLoginTime();
        baseView.current?.showLoading({ text: t('loginByPhone.getting') });
        const res = await userStore.sendSms(data.phone, 3);
        baseView.current?.hideLoading();
        if (typeof res !== 'string') {
          baseView.current.showMessage({ text: t('loginByPhone.sendSuccess'), delay: 1.5 });
        } else {
          userStore.timerLogin = undefined;
          userStore.canLoginBind = false;
          baseView.current.showMessage({ text: res, delay: 1.5 });
        }
      })();
      await setUseVerifyCode(true);
    };

    const inputPassword = () => {
      return (
        <View style={[tw.itemsCenter, tw.mB2]}>
          <Controller
            control={control}
            name="phone"
            rules={{ required: { value: true, message: t('loginByPhone.mobileMust') }, pattern: /^1\d{10}$/ }}
            defaultValue=""
            render={({ onChange, onBlur }) => (
              <TextInput
                label={t('loginByPhone.phoneNum')}
                placeholder={t('loginByPhone.pleaseInput')}
                maxLength={11}
                keyboardType="phone-pad"
                style={[UI_SIZE ? tw.mT5 : tw.mT1, tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                left={<TextInput.Icon size={20} name="cellphone" color={colors.placeholder} />}
                onBlur={onBlur}
                onChangeText={(phone) => {
                  onChange(phone);
                  setPhoneState(phone);
                }}
                value={phoneState.trim()}
                error={errors.phone}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: { value: true, message: t('changeInfo.must') + t('changeInfo.newPW') }, pattern: /^.{6,30}$/ }}
            defaultValue=""
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="新密码"
                placeholder={'请输入新密码'}
                maxLength={30}
                secureTextEntry={passwordInvisible}
                style={[tw.wFull, { backgroundColor: colors.background }]}
                onChangeText={(oldPassword) => {
                  onChange(oldPassword);
                }}
                left={<TextInput.Icon size={20} name="lock-question" color={colors.placeholder} />}
                value={value.trim()}
                onBlur={onBlur}
                error={errors.password}
                right={
                  <TextInput.Icon
                    name={passwordInvisible ? 'eye-off' : 'eye'}
                    color={colors.placeholder}
                    onPress={throttle(() => {
                      setPasswordInvisible(!passwordInvisible);
                    })}
                  />
                }
              />
            )}
          />
          <View style={[tw.flexRow, tw.itemsEnd]}>
            <Controller
              control={control}
              name="verifyCode"
              rules={useVerifyCode ? { required: true, pattern: /^\d{4}$/ } : {}}
              defaultValue=""
              render={({ onChange, onBlur }) => (
                <TextInput
                  label={t('loginByPhone.SMSCode')}
                  placeholder={t('loginByPhone.pleaseSMS')}
                  maxLength={6}
                  keyboardType="number-pad"
                  style={[tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                  left={<TextInput.Icon size={20} name="numeric" color={colors.placeholder} />}
                  onBlur={onBlur}
                  onChangeText={(verifyCode) => {
                    onChange(verifyCode);
                    setSysCode(verifyCode);
                  }}
                  value={sysCode}
                  error={errors.verifyCode}
                />
              )}
            />
          </View>
          <View style={[tw.wFull, tw.itemsEnd, tw.mT2, { opacity: userStore.canLoginBind ? 0.2 : 0.9 }]}>
            <Button mode="outlined" compact labelStyle={[{ fontSize: BTN_SMS_SIZE }]} onPress={throttle(handleQuerySmsCode)}>
              {t('loginByPhone.getSMS')}
            </Button>
          </View>
        </View>
      );
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={'短信验证'} />
          </Appbar.Header>
          <View style={[tw.pX5]}>
            {inputPassword()}
            <Button mode="contained" style={[tw.p1]} onPress={handleSubmit(changePassword)}>
              确定
            </Button>
          </View>
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
