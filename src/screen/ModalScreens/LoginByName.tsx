import React, { useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import { Dimensions, Image, Platform, ScrollView, View } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import { NavigatorComponentProps } from '../index';
import BaseView from '../../component/BaseView';
import FastImage from 'react-native-fast-image';
import { tw } from 'react-native-tailwindcss';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { throttle } from '../../common/tools';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Controller, useForm } from 'react-hook-form';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import { t } from '../../common/tools';
import { RSA } from 'react-native-rsa-native';
import { TouchableOpacity } from 'react-native';

type Props = {};
export const LoginByName: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const isAndroid: boolean = Platform.OS === 'android';
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const LOGO_SIZE = isAndroid ? 100 : UI_SIZE ? 110 : 80;
    const TITLE_SIZE: number = isAndroid ? 22 : UI_SIZE ? 26 : 18;
    const widthThanHeight = Dimensions.get('window').width > Dimensions.get('window').height;
    const aspectRatio = Dimensions.get('window').width / Dimensions.get('window').height;
    console.log(Dimensions.get('window').width / Dimensions.get('window').height, '宽高比例');
    const BTN_INPUT_SIZE: number = UI_SIZE ? 16 : 12;
    const { colors } = useTheme();
    const { control, handleSubmit, errors } = useForm();
    const loading = useRef<any>();
    const { userStore } = useStore();
    const [passwordInvisible, setPasswordInvisible] = useState(true);

    // const base64Image =
    //   'data:image/png;base64,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';

    const handleQuerySmsCode = useCallback(
      (showLoading: boolean = true) => {
        if (showLoading) {
          loading.current.showLoading(t('loginByName.refreshCaptcha'));
        }
        userStore
          .handleSmsCode()
          .then(() => {
            userStore.loginVerifyLoading = false;
            loading.current.hideLoading();
          })
          .finally(() => {
            loading.current.hideLoading();
          });
      },
      [userStore]
    );

    useEffect(() => {
      console.log(Dimensions.get('window').width, Dimensions.get('window').height, '屏幕宽和高');
    }, []);

    useLayoutEffect(() => {
      handleQuerySmsCode(false);
    }, [handleQuerySmsCode]);

    useLayoutEffect(() => {
      navigation.setOptions({
        ...TransitionPresets.SlideFromRightIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true
      });
    }, [navigation]);

    const handleLogin = (data) => {
      console.log('login1');
      loading.current?.showLoading({ text: t('loginByName.landing') });
      userStore
        .getPublicKey()
        .then((result) => {
          if (result) {
            RSA.encrypt(data.password, result).then((resPass) => {
              userStore.loginByUserName(data, resPass).then((res) => {
                loading.current?.hideLoading();
                if (typeof res !== 'string') {
                  userStore.queryUserInfo().then((resInfo) => {
                    console.log(resInfo, 'getUserInfo');
                    navigation.navigate('BottomTabs');
                  });
                } else {
                  handleQuerySmsCode(false);
                  loading.current?.showMessage({ text: res });
                }
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
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

    return (
      <BaseView useSafeArea={Platform.OS === 'ios'} ref={loading}>
        <ScrollView style={[tw.hFull, tw.flexCol]} contentContainerStyle={[tw.justifyBetween, tw.flex1, tw.pB10, tw.pT2]}>
          <View>
            <Icon
              name="chevron-left"
              size={45}
              suppressHighlighting={true}
              color={colors.placeholder}
              style={[tw.mL2]}
              onPress={throttle(() => navigation.goBack())}
            />

            <View style={[tw.itemsCenter, UI_SIZE ? tw.mT2 : tw.mT0]}>
              <FastImage source={require('./../../assets/logo.png')} style={{ width: LOGO_SIZE, height: LOGO_SIZE }} resizeMode={FastImage.resizeMode.cover} />
            </View>
            <View style={[tw.pX10, tw.itemsCenter]}>
              <Text style={[tw.mT4, UI_SIZE ? tw.mB2 : tw.mB0, tw.fontMono, { fontSize: TITLE_SIZE, color: colors.primary }]}>{t('loginByName.myHeader')}</Text>
              <Controller
                control={control}
                name="userName"
                rules={{ required: { value: true, message: t('loginByName.requiredUserName') }, pattern: /^.{1,30}$/ }}
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
                rules={{ required: { value: true, message: t('loginByName.requiredPassword') }, pattern: /^.{6,30}$/ }}
                defaultValue=""
                render={({ onChange, onBlur, value }) => (
                  <TextInput
                    label={t('loginByName.password')}
                    placeholder={t('loginByName.enterPassword')}
                    maxLength={30}
                    secureTextEntry={passwordInvisible}
                    style={[tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                    left={<TextInput.Icon size={20} name="lock-question" color={colors.placeholder} />}
                    onChangeText={(password) => onChange(password)}
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
                  rules={{ required: { value: true, message: t('loginByName.requiredCaptcha') }, pattern: /^\d{4}$/ }}
                  defaultValue=""
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      label={t('loginByName.captcha')}
                      placeholder={t('loginByName.enterCaptcha')}
                      maxLength={4}
                      keyboardType="default"
                      style={[tw.wFull, { backgroundColor: colors.background, width: '70%', fontSize: BTN_INPUT_SIZE }]}
                      left={<TextInput.Icon size={20} name="numeric" color={colors.placeholder} />}
                      onBlur={onBlur}
                      onChangeText={(verifyCode) => onChange(verifyCode)}
                      value={value}
                      error={errors.verifyCode}
                    />
                  )}
                />
                <View style={[tw.selfEnd, tw.flex1, tw.pY3, tw.mB15, tw.mL3, { width: '30%', borderBottomWidth: 1, borderBottomColor: colors.disabled }]}>
                  {userStore.loginVerifyLoading ? (
                    <Icon style={[tw.selfCenter]} name="wifi-off" size={20} color={colors.text} />
                  ) : userStore.loginVerifyImage ? (
                    <TouchableOpacity onPress={throttle(handleQuerySmsCode)}>
                      <Image
                        style={[{ width: '100%', height: widthThanHeight ? 60 : aspectRatio > 0.65 ? 44 : 19 }]}
                        source={{ uri: userStore.loginVerifyImage }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              <View style={[tw.wFull, tw.itemsEnd, tw.mT2]}>
                <Button mode="outlined" style={[]} compact labelStyle={[tw.textXs]} onPress={throttle(handleQuerySmsCode)}>
                  {t('loginByName.refreshCaptcha')}
                </Button>
              </View>
              <Button mode="contained" style={[tw.wFull, tw.mT6, tw.p1]} labelStyle={[tw.textLg]} onPress={handleSubmit(handleLogin)}>
                {t('loginByName.login')}
              </Button>
            </View>
          </View>

          <View style={[tw.pT1, tw.flexRow, tw.selfCenter]}>
            <Text style={[tw.textXs, tw.mX1, tw.textCenter, { color: colors.placeholder }]}>
              <Icon style={[tw.selfCenter]} name="copyright" size={12} color={colors.placeholder} />
              {t('loginByName.loginOne')}
              {getRed(t('loginByName.loginThree'), 1)}
              {t('loginByName.and')}
              {getRed(t('loginByName.loginTwo'), 2)}
            </Text>
          </View>
        </ScrollView>
      </BaseView>
    );
  }
);
