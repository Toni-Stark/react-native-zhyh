import React, { useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ScreenComponent } from '../index';
import { observer } from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { tw } from 'react-native-tailwindcss';
import { deviceInfo, throttle } from '../../common/tools';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, Portal, RadioButton, TextInput, useTheme } from 'react-native-paper';
import BaseView from '../../component/BaseView';
import { useStore } from '../../store';
import { t } from '../../common/tools';

export const Register: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const isAndroid: boolean = Platform.OS === 'android';
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const TITLE_SIZE: number = isAndroid ? 22 : UI_SIZE ? 26 : 18;
    const BTN_INPUT_SIZE: number = UI_SIZE ? 16 : 12;
    const BTN_LOGIN_SIZE: number = isAndroid ? 17 : UI_SIZE ? 18 : 13;
    const BTN_HREF_SIZE: number = UI_SIZE ? 14 : 12;
    const { colors } = useTheme();
    const { userStore } = useStore();
    const [recharge] = useState<string[]>([t('register.student'), t('register.teacher')]);
    const { control, handleSubmit, errors } = useForm();
    const [useVerifyCode, setUseVerifyCode] = useState(true);
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(recharge[0]);

    const handleRegister = async (data) => {
      console.log(data);
      await userStore.doRegister({ smsCode: data.verifyCode, deviceType: deviceInfo, phone: data.phone, businessCode: data.recommended }).then((resInfo) => {
        if (typeof resInfo === 'boolean') {
          userStore.queryUserInfo().then((res) => {
            if (res) {
              navigation.navigate('Main', { screen: 'Home' });
            }
          });
        } else {
          baseView.current.showMessage({ text: resInfo, delay: 3 });
        }
      });
    };
    const handleQuerySmsCode = async () => {
      if (!userStore.canRegisterBind) {
        await setUseVerifyCode(false);
        await handleSubmit(async (data) => {
          await userStore.downRegisterTime();
          baseView.current?.showLoading({ text: t('register.getting') });
          const res = await userStore.sendSms(data.phone, 0);
          baseView.current?.hideLoading();
          if (typeof res !== 'string') {
            baseView.current.showMessage({ text: t('register.sentSuccessfully'), delay: 1.5 });
          } else {
            userStore.timer = undefined;
            userStore.canRegisterBind = false;
            userStore.canRegisterBind = baseView.current.showMessage({ text: res, delay: 1.5 });
          }
        })();
        await setUseVerifyCode(true);
      }
    };

    const hideModal = () => {
      setVisible(false);
    };

    const showModal = () => {
      return (
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={[tw.mX8, tw.pY4, { borderRadius: 6, backgroundColor: colors.background }]}>
            <View style={[tw.pB4, tw.pL3, { borderColor: colors.deepBackground, borderBottomWidth: 2 }]}>
              <Text numberOfLines={1} style={{ color: colors.text }}>
                {t('register.chooseRole')}
              </Text>
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
                  <Text style={{ color: colors.text }} numberOfLines={1}>
                    {item}
                  </Text>
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

    const navi = (num: number) => {
      console.log(num);
      switch (num) {
        case 1:
          navigation.navigate('UserAgreement');
          break;
        case 2:
          navigation.navigate('PrivacyAgreement');
          break;
      }
    };
    const getRed = (name: string, num: number) => {
      return (
        <Text
          onPress={() => {
            navi(num);
          }}
          style={[tw.textXs, { color: colors.notification }]}
        >
          {name}
        </Text>
      );
    };

    const renderContent = () => {
      return (
        <View style={[tw.hFull, tw.justifyBetween, tw.pT5, tw.pB10]}>
          <View>
            <Icon
              name="chevron-left"
              size={45}
              suppressHighlighting={true}
              color={colors.placeholder}
              style={[tw.mL2]}
              onPress={throttle(() => navigation.goBack())}
            />
            <View style={[tw.pX10, tw.itemsCenter, tw.mT10]}>
              <Text numberOfLines={1} style={[tw.mY4, { fontSize: TITLE_SIZE, color: colors.primary }]}>
                {t('register.newUser')}
              </Text>
              <Controller
                control={control}
                name="recommended"
                rules={useVerifyCode ? { required: { value: true, message: t('register.codeError') }, pattern: /^([A-Z0-9]){4}$/i } : {}}
                defaultValue=""
                render={({ onChange, onBlur, value }) => (
                  <TextInput
                    label={t('register.codeRequired')}
                    placeholder={t('register.code')}
                    maxLength={6}
                    keyboardType="default"
                    style={[tw.wFull, { fontSize: BTN_INPUT_SIZE, backgroundColor: colors.background }]}
                    left={<TextInput.Icon size={20} name="numeric" color={colors.placeholder} />}
                    onBlur={onBlur}
                    onChangeText={(recommended) => onChange(recommended)}
                    value={value.trim()}
                    error={errors.recommended}
                  />
                )}
              />
              <Controller
                control={control}
                name="phone"
                rules={{ required: { value: true, message: t('register.mobileRequired') }, pattern: /^1\d{10}$/ }}
                defaultValue=""
                render={({ onChange, onBlur, value }) => (
                  <TextInput
                    label={t('register.phoneNumber')}
                    placeholder={t('register.phoneNumber')}
                    maxLength={11}
                    keyboardType="default"
                    style={[tw.wFull, { fontSize: BTN_INPUT_SIZE, backgroundColor: colors.background }]}
                    left={<TextInput.Icon size={20} name="phone" color={colors.placeholder} />}
                    onBlur={onBlur}
                    onChangeText={(phone) => onChange(phone)}
                    value={value.trim()}
                    error={errors.phone}
                  />
                )}
              />

              <View style={[tw.wFull]}>
                <Controller
                  control={control}
                  name="verifyCode"
                  rules={useVerifyCode ? { required: true, pattern: /^\d{4}$/ } : {}}
                  defaultValue=""
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      label={t('register.SMSCode')}
                      placeholder={t('register.SMSTip')}
                      maxLength={6}
                      keyboardType="number-pad"
                      style={[tw.wFull, { fontSize: BTN_INPUT_SIZE, backgroundColor: colors.background }]}
                      left={<TextInput.Icon name="numeric" color={colors.placeholder} />}
                      onBlur={onBlur}
                      onChangeText={(verifyCode) => {
                        onChange(verifyCode);
                      }}
                      value={value.trim()}
                      error={errors.verifyCode}
                    />
                  )}
                />
                <View
                  style={[
                    tw.justifyCenter,
                    tw.itemsCenter,
                    tw.absolute,
                    { right: 0, width: 90, height: '100%', opacity: userStore.canRegisterBind ? 0.2 : 0.9 }
                  ]}
                >
                  <TouchableOpacity onPress={throttle(handleQuerySmsCode)} style={[tw.p1, { borderRadius: 6, backgroundColor: colors.surface }]}>
                    <Text style={[{ fontSize: 11 }]}>获取短信验证码</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[tw.wFull, tw.p2, tw.itemsEnd]}>
                <TouchableOpacity
                  onPress={throttle(() => {
                    navigation.navigate('noPhoneRegister');
                  })}
                >
                  <Text style={[{ fontSize: 12, color: colors.accent }]}>没有手机号？</Text>
                </TouchableOpacity>
              </View>
              <Button
                contentStyle={[tw.pY1]}
                labelStyle={[{ fontSize: BTN_LOGIN_SIZE }]}
                style={[tw.mT5, tw.wFull]}
                mode="contained"
                onPress={handleSubmit(handleRegister)}
              >
                {t('register.registerNow')}
              </Button>
              {/*<ShengWangView />*/}
            </View>
          </View>
          <View
            style={[tw.flexRow, tw.selfCenter, StatusBar.currentHeight && StatusBar.currentHeight > 30 ? tw.mT10 : Platform.OS === 'ios' ? tw.mT8 : tw.mT2]}
          >
            <Text style={[tw.mX1, tw.textCenter, { fontSize: BTN_HREF_SIZE, color: colors.placeholder }]}>
              <Icon style={[tw.selfCenter]} name="copyright" size={12} color={colors.placeholder} />
              请阅读
              {getRed(t('loginByName.loginThree'), 1)}
              {t('loginByName.and')}
              {getRed(t('loginByName.loginTwo'), 2)}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={Platform.OS === 'ios'} ref={baseView} style={[tw.flex1]}>
        <ScrollView contentContainerStyle={[tw.flex1]}>{renderContent()}</ScrollView>
        {showModal()}
      </BaseView>
    );
  }
);
