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
import { RSA } from 'react-native-rsa-native';

export const noPhoneRegister: ScreenComponent = observer(
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
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(recharge[0]);
    const [passwordReg, setPasswordReg] = useState('');
    const [passwordInTwo, setPasswordInTwo] = useState(true);

    const handleRegisterNoPhone = async (data) => {
      console.log(data);
      userStore.getPublicKey().then((result) => {
        if (result) {
          RSA.encrypt(data.password, result).then(async (resPass) => {
            await userStore
              .doRegisterNoPhone({ businessCode: data.recommended, deviceType: deviceInfo, password: resPass, username: data.userName })
              .then((res) => {
                if (typeof res === 'boolean') {
                  userStore.queryUserInfo().then((resInfo) => {
                    if (resInfo) {
                      navigation.navigate('Main', { screen: 'Home' });
                    }
                  });
                } else {
                  baseView.current.showMessage({ text: res, delay: 1.5 });
                }
              });
          });
        }
      });
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
        <View style={[tw.justifyBetween, tw.flex1, tw.pT5, tw.pB10]}>
          <View>
            <Icon
              name="chevron-left"
              size={45}
              color={colors.placeholder}
              suppressHighlighting={true}
              style={[tw.mL2]}
              onPress={throttle(() => navigation.goBack())}
            />
            <View style={[tw.pX10, tw.itemsCenter]}>
              <Text numberOfLines={1} style={[tw.mY4, { fontSize: TITLE_SIZE, color: colors.primary }]}>
                {t('register.newUser')}
              </Text>
              <Controller
                control={control}
                name="recommended"
                rules={{ required: { value: true, message: t('register.codeError') }, pattern: /^\w{4}$/i }}
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
                name="userName"
                rules={{ required: { value: true, message: t('loginByName.requiredUserName') }, pattern: /^.{2,20}$/ }}
                defaultValue=""
                render={({ onChange, onBlur, value }) => (
                  <TextInput
                    label={t('loginByName.userName')}
                    placeholder={t('loginByName.enterUserName')}
                    maxLength={30}
                    keyboardType="default"
                    style={[tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                    left={<TextInput.Icon size={20} name="account" color={colors.placeholder} />}
                    onBlur={onBlur}
                    onChangeText={(userName) => onChange(userName)}
                    value={value.trim()}
                    error={errors.userName}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                rules={{ required: { value: true, message: t('loginByName.requiredPassword') }, pattern: /^.{6,16}$/ }}
                defaultValue=""
                render={({ onChange, onBlur, value }) => (
                  <TextInput
                    label={t('loginByName.password')}
                    placeholder={t('loginByName.enterPassword')}
                    maxLength={30}
                    secureTextEntry={passwordInTwo}
                    style={[tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                    left={<TextInput.Icon size={20} name="lock-question" color={colors.placeholder} />}
                    onChangeText={(password) => {
                      onChange(password);
                      setPasswordReg(password);
                    }}
                    value={value.trim()}
                    onBlur={onBlur}
                    error={errors.password}
                  />
                )}
              />
              <Controller
                control={control}
                name="passwordAgain"
                rules={{
                  required: { value: true, message: t('loginByName.requiredPasswordAgain') },
                  validate: (data) => {
                    console.log(data, passwordReg === data);
                    return passwordReg === data;
                  }
                }}
                defaultValue=""
                render={({ onChange, onBlur, value }) => (
                  <TextInput
                    label={'确认密码'}
                    placeholder={t('loginByName.enterPassword')}
                    maxLength={30}
                    secureTextEntry={passwordInTwo}
                    style={[tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                    left={<TextInput.Icon size={20} name="lock-question" color={colors.placeholder} />}
                    onChangeText={(password) => onChange(password)}
                    value={value.trim()}
                    onBlur={onBlur}
                    error={errors.passwordAgain}
                    right={
                      <TextInput.Icon
                        name={passwordInTwo ? 'eye-off' : 'eye'}
                        color={colors.placeholder}
                        onPress={throttle(() => {
                          setPasswordInTwo(!passwordInTwo);
                        })}
                      />
                    }
                  />
                )}
              />
              <Button
                contentStyle={[tw.pY1]}
                labelStyle={[{ fontSize: BTN_LOGIN_SIZE }]}
                style={[tw.mT5, tw.wFull]}
                mode="contained"
                onPress={handleSubmit(handleRegisterNoPhone)}
              >
                {t('register.registerNow')}
              </Button>
            </View>
          </View>

          <View
            style={[tw.flexRow, tw.selfCenter, StatusBar.currentHeight && StatusBar.currentHeight > 30 ? tw.mT10 : Platform.OS === 'ios' ? tw.mT8 : tw.mT2]}
          >
            <Text style={[tw.mX1, tw.textCenter, { fontSize: BTN_HREF_SIZE, color: colors.placeholder }]}>
              <Icon style={[tw.selfCenter]} name="copyright" size={12} color={colors.placeholder} />
              {t('loginByName.loginOne')}
              {getRed(t('loginByName.loginThree'), 1)}
              {t('loginByName.and')}
              {getRed(t('loginByName.loginTwo'), 2)}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={Platform.OS === 'ios'} ref={baseView}>
        <ScrollView contentContainerStyle={[tw.flex1]}>{renderContent()}</ScrollView>

        {showModal()}
      </BaseView>
    );
  }
);
