import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import { NavigatorComponentProps } from '../index';
import BaseView from '../../component/BaseView';
import FastImage from 'react-native-fast-image';
import { tw } from 'react-native-tailwindcss';
import { Button, Text, TextInput, useTheme, Modal, Portal } from 'react-native-paper';
import { t, throttle } from '../../common/tools';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Controller, useForm } from 'react-hook-form';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../CardScreens';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';

type ScreenRouteProp = RouteProp<ScreensParamList, 'Login'>;
type Props = {
  route: ScreenRouteProp;
  message?: string;
};

export const LoginByPhone: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const isAndroid: boolean = Platform.OS === 'android';
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const LOGO_SIZE: number = isAndroid ? 90 : UI_SIZE ? 120 : 80;
    const TITLE_SIZE: number = isAndroid ? 22 : UI_SIZE ? 26 : 18;
    const BTN_INPUT_SIZE: number = UI_SIZE ? 16 : 12;
    const BTN_SMS_SIZE: number = UI_SIZE ? 14 : 12;
    const BTN_LOGIN_SIZE: number = isAndroid ? 17 : UI_SIZE ? 18 : 13;
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { control, handleSubmit, errors } = useForm();
    const { homeworkStore, userStore, lessonDetailStore, settingStore, lessonCreateStore, cloudSeaDiskStore, createVodStore } = useStore();
    const [useVerifyCode, setUseVerifyCode] = useState(true);
    const [phoneState, setPhoneState] = useState('');
    const [sysCode, setSysCode] = useState('');
    const [agreeVisible, setAgreeVisible] = useState(false);

    const clearStore = useCallback(() => {
      lessonCreateStore.selectArray = [0, 0, 0];
      lessonCreateStore.classNames = '';
      lessonCreateStore.classPrice = '';
      lessonCreateStore.classSizes = 0;
      lessonCreateStore.scheduleList = [];
      createVodStore.sectionVodInfo = [];
      lessonDetailStore.lessonClassOfTeacher = [];
      lessonCreateStore.attachments = [];
      lessonCreateStore.selectedImages = [];
      lessonCreateStore.originAttachmentImages = [];
      homeworkStore.homeworkDetail = undefined;
      homeworkStore.homeworkTeacher = undefined;
      homeworkStore.completedHomeworkStudent = [];
      homeworkStore.unfinishedHomeworkStudent = [];
      homeworkStore.unfinishedHomeworkTeacher = [];
      homeworkStore.completedHomeworkTeacher = [];
      cloudSeaDiskStore.allResourcesAllList = [];
      cloudSeaDiskStore.allResourcesList = [];
      cloudSeaDiskStore.allResourcesInfo = undefined;
      cloudSeaDiskStore.selects = [];
      cloudSeaDiskStore.parentId = '0';
    }, [cloudSeaDiskStore, createVodStore, homeworkStore, lessonCreateStore, lessonDetailStore]);
    useEffect(() => {
      clearStore();
    }, [clearStore, route?.params?.message, userStore]);

    useLayoutEffect(() => {
      navigation.setOptions({
        ...TransitionPresets.ModalTransition,
        cardOverlayEnabled: true,
        gestureEnabled: true
      });
    }, [navigation]);

    useEffect(() => {
      if (!settingStore.userAgreeModal) {
        settingStore.userAgreeModal = true;
      }
    }, [settingStore]);

    const handleLogin = async (data) => {
      await userStore.downLoginTime();
      baseView.current?.showLoading({ text: t('loginByPhone.landing') });
      userStore.loginByPhone(data).then((res) => {
        baseView.current?.hideLoading();
        if (typeof res !== 'string') {
          userStore.queryUserInfo().then((resInfo) => {
            if (resInfo) {
              setPhoneState('');
              setSysCode('');
              navigation.navigate('Main', { screen: 'Home' });
            }
          });
        } else {
          baseView.current?.showMessage({ text: res });
        }
      });
    };

    const handleQuerySmsCode = async () => {
      await setUseVerifyCode(false);
      await handleSubmit(async (data) => {
        await userStore.downLoginTime();
        baseView.current?.showLoading({ text: t('loginByPhone.getting') });
        const res = await userStore.sendSms(data.phone, 1);
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

    const showToastModal = () => {
      return (
        <Portal>
          <Modal
            visible={agreeVisible}
            dismissable={false}
            onDismiss={() => {
              setAgreeVisible(false);
            }}
            contentContainerStyle={[tw.flexRow, tw.mX6]}
          >
            <View style={[tw.p3, { borderRadius: 2, backgroundColor: colors.background }]}>
              <Text style={[{ fontSize: 14, color: colors.text }]}>您确定要拒绝云海学悦用户协议和隐私保护指引吗？拒绝后将直接退出app客户端。</Text>
              <View style={[tw.pT2, tw.pX3]}>
                <View style={[tw.flexRow, tw.justifyEnd]}>
                  <Button
                    onPress={() => {
                      setAgreeVisible(false);
                      settingStore.userAgreeModal = true;
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    onPress={() => {
                      setAgreeVisible(false);
                      BackHandler.exitApp();
                      BackHandler.exitApp();
                      BackHandler.exitApp();
                      BackHandler.exitApp();
                    }}
                  >
                    确定
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const showAgreeModal = () => {
      return (
        <Portal>
          <Modal
            visible={settingStore.userAgreeModal}
            dismissable={false}
            onDismiss={() => {
              settingStore.userAgreeModal = false;
            }}
            contentContainerStyle={[tw.flexRow, tw.mX6]}
          >
            <View style={[tw.pY3, { borderRadius: 2, backgroundColor: colors.background }]}>
              <Text style={[tw.selfCenter, { fontSize: 15, color: colors.text }]}>云海学悦用户协议及隐私保护指引</Text>
              <View style={[tw.pT2, tw.pX3]}>
                <Text style={[{ fontSize: 12 }]}>
                  在您使用云海学悦app前，请您务必审慎阅读、充分理解用户协议、隐私保护指引的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方案和司法管辖的条款。如您已详细阅读并同意云海学悦用户协议、隐私保护指引，请点击"同意"
                </Text>
                <Text style={[tw.selfCenter, tw.mY1, { fontSize: 11 }]}>开始使用我们的服务。如您拒绝，将无法进入程序。</Text>
                <Text style={[tw.selfCenter, tw.mY1, { fontSize: 12 }]}>
                  点击查看云海学悦
                  <Text
                    style={[{ color: colors.accent }]}
                    onPress={() => {
                      settingStore.userAgreeModal = false;
                      navi(1);
                    }}
                  >
                    用户协议
                  </Text>
                  ，
                  <Text
                    style={[{ color: colors.accent }]}
                    onPress={() => {
                      settingStore.userAgreeModal = false;
                      navi(2);
                    }}
                  >
                    隐私保护指引
                  </Text>
                  。
                </Text>
                <View style={[tw.flexRow, tw.justifyEnd]}>
                  <Button
                    onPress={() => {
                      settingStore.userAgreeModal = false;
                      setAgreeVisible(true);
                    }}
                  >
                    拒绝
                  </Button>
                  <Button
                    onPress={() => {
                      settingStore.userAgreeModal = false;
                      settingStore.userIsAgree = true;
                    }}
                  >
                    同意
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    return (
      <BaseView useSafeArea={Platform.OS === 'ios'} ref={baseView}>
        {/*<Icon name="chevron-left" size={45} color={colors.placeholder} style={[tw.mL2]} onPress={throttle(() => navigation.goBack())} />*/}
        <KeyboardAvoidingView style={[tw.flex]} behavior="padding" keyboardVerticalOffset={30}>
          <ScrollView style={[tw.hFull]} contentContainerStyle={[tw.justifyBetween, tw.flex1, tw.pY10]}>
            <View>
              <View style={[tw.itemsCenter, tw.mT3]}>
                <FastImage
                  source={require('./../../assets/logo.png')}
                  style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              <View style={[tw.mX10, tw.itemsCenter]}>
                <Text style={[tw.mT4, tw.fontMono, { fontSize: TITLE_SIZE, color: colors.primary }]}>{t('loginByPhone.welcome')}</Text>
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
                <View style={[tw.wFull, tw.itemsEnd, tw.mT2, { opacity: userStore.canLoginBind ? 0.2 : 0.9 }]}>
                  <Button mode="outlined" compact labelStyle={[{ fontSize: BTN_SMS_SIZE }]} onPress={throttle(handleQuerySmsCode)}>
                    {t('loginByPhone.getSMS')}
                  </Button>
                </View>
                <Button
                  mode="contained"
                  style={[tw.wFull, StatusBar.currentHeight && StatusBar.currentHeight > 30 ? tw.mT6 : tw.mT2, tw.p1]}
                  labelStyle={[{ fontSize: BTN_LOGIN_SIZE }]}
                  onPress={handleSubmit(handleLogin)}
                >
                  {t('loginByName.login')}
                </Button>

                <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, UI_SIZE ? tw.mT4 : tw.mT2]}>
                  <TouchableOpacity
                    onPress={throttle(() => {
                      navigation.navigate('LoginByName');
                    })}
                  >
                    <Text style={[{ fontSize: 14, color: colors.placeholder }]}>{t('loginByPhone.userLogin')}</Text>
                  </TouchableOpacity>
                  <View style={[tw.mX2, { borderRightWidth: 1, borderRightColor: colors.disabled, height: '100%' }]} />
                  <TouchableOpacity
                    onPress={throttle(() => {
                      navigation.navigate('Register');
                    })}
                  >
                    <Text style={[{ fontSize: 14, color: colors.placeholder }]}>立即注册</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[tw.mX5, tw.flexRow, tw.selfCenter, tw.alignCenter]}>
              <Text style={[tw.textXs, tw.mX1, tw.textCenter, { color: colors.placeholder }]}>
                <Icon style={[tw.selfCenter]} name="copyright" size={12} color={colors.placeholder} />
                {t('loginByName.loginOne')}
                {getRed(t('loginByName.loginThree'), 1)}
                {t('loginByName.and')}
                {getRed(t('loginByName.loginTwo'), 2)}
              </Text>
            </View>
            {/*<ShengWangView />*/}
          </ScrollView>
        </KeyboardAvoidingView>
        {/*{showAgreeModal()}*/}
        {/*{showToastModal()}*/}
      </BaseView>
    );
  }
);
