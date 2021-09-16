import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NavigatorComponentProps } from '../../../index';
import BaseView from '../../../../component/BaseView';
import { useTheme, Text, Appbar, TextInput, Button } from 'react-native-paper';
import { tw } from 'react-native-tailwindcss';
import { t, throttle } from '../../../../common/tools';
import { useStore } from '../../../../store';
import { Controller, useForm } from 'react-hook-form';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../../index';
import { observer } from 'mobx-react-lite';
import { RSA } from 'react-native-rsa-native';

type ScreenRouteProp = RouteProp<ScreensParamList, 'ChangeInfo'>;
export type Props = {
  route: ScreenRouteProp;
};

export const ChangeInfo: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { userStore, lessonDetailStore, homeworkStore } = useStore();
    const { colors } = useTheme();
    const { control, handleSubmit, errors } = useForm();
    const { name } = route.params;
    const [passwordInvisible, setPasswordInvisible] = useState(true);
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string | undefined>(userStore.userInfoDetail.email);
    const [realName, setRealName] = useState<string | undefined>(userStore.userInfoDetail.realName);
    const [nickName, setNickName] = useState<string | undefined>(userStore.userInfoDetail.nickName);
    const [username, setUsername] = useState<string | undefined>(userStore.userInfoDetail.username);

    useEffect(() => {
      console.log(userStore.userInfoDetail);
    }, [userStore.userInfo, userStore.userInfoDetail]);

    const inputEmail = () => {
      userStore.email = userStore.userInfoDetail.email;
      return (
        <Controller
          control={control}
          name="email"
          rules={{
            required: { value: true, message: t('changeInfo.must') + t('changeInfo.email') },
            pattern: /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/
          }}
          defaultValue=""
          render={({ onChange, onBlur }) => (
            <TextInput
              label={t('changeInfo.email')}
              mode="flat"
              maxLength={30}
              onBlur={onBlur}
              value={email?.trim()}
              error={errors.email}
              multiline={true}
              style={[{ backgroundColor: colors.background, height: 60 }]}
              onChangeText={(e) => {
                onChange(e);
                setEmail(e);
              }}
            />
          )}
        />
      );
    };

    const inputRealName = () => {
      return (
        <Controller
          control={control}
          name="realName"
          rules={{ required: { value: true, message: t('changeInfo.must') + t('changeInfo.realName') }, pattern: /^.{2,30}$/ }}
          defaultValue=""
          render={({ onChange, onBlur }) => (
            <TextInput
              label={t('changeInfo.realName')}
              mode="flat"
              maxLength={30}
              onBlur={onBlur}
              value={realName?.trim()}
              error={errors.realName}
              multiline={true}
              style={[{ backgroundColor: colors.background, height: 60 }]}
              onChangeText={(e) => {
                onChange(e);
                setRealName(e);
              }}
            />
          )}
        />
      );
    };

    const inputUserName = () => {
      return (
        <Controller
          control={control}
          name="username"
          rules={{ required: { value: true, message: t('changeInfo.must') + '用户名' }, pattern: /^.{2,30}$/ }}
          defaultValue=""
          render={({ onChange, onBlur }) => (
            <TextInput
              label="用户名"
              mode="flat"
              maxLength={30}
              onBlur={onBlur}
              value={username?.trim()}
              error={errors.username}
              multiline={true}
              style={[{ backgroundColor: colors.background, height: 60 }]}
              onChangeText={(e) => {
                onChange(e);
                setUsername(e);
              }}
            />
          )}
        />
      );
    };
    const inputNickName = () => {
      return (
        <Controller
          control={control}
          name="nickName"
          rules={{ required: { value: true, message: t('changeInfo.must') + '昵称' }, pattern: /^.{2,30}$/ }}
          defaultValue=""
          render={({ onChange, onBlur }) => (
            <TextInput
              label="昵称"
              mode="flat"
              maxLength={30}
              onBlur={onBlur}
              value={nickName?.trim()}
              error={errors.nickName}
              multiline={true}
              style={[{ backgroundColor: colors.background, height: 60 }]}
              onChangeText={(e) => {
                onChange(e);
                setNickName(e);
              }}
            />
          )}
        />
      );
    };

    const inputPassword = () => {
      return (
        <View>
          <Controller
            control={control}
            name="oldPassword"
            rules={{ required: { value: true, message: t('changeInfo.must') + t('changeInfo.newPW') }, pattern: /^.{6,30}$/ }}
            defaultValue=""
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="旧密码"
                placeholder={'请输入旧密码'}
                maxLength={30}
                secureTextEntry={passwordInvisible}
                style={[tw.wFull, { backgroundColor: colors.background }]}
                onChangeText={(oldPassword) => {
                  onChange(oldPassword);
                }}
                value={value.trim()}
                onBlur={onBlur}
                error={errors.oldPassword}
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
          <Controller
            control={control}
            name="newPassword"
            rules={{ required: { value: true, message: t('changeInfo.must') + t('changeInfo.newPW') }, pattern: /^.{6,30}$/ }}
            defaultValue=""
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label={t('changeInfo.newPW')}
                placeholder={'请输入新密码'}
                maxLength={30}
                secureTextEntry={passwordInvisible}
                style={[tw.wFull, { backgroundColor: colors.background }]}
                onChangeText={(newPassword) => {
                  setPassword(newPassword);
                  onChange(newPassword);
                }}
                value={value.trim()}
                onBlur={onBlur}
                error={errors.newPassword}
              />
            )}
          />
          <Controller
            control={control}
            name="againPassword"
            rules={{ required: { value: true, message: t('changeInfo.must') + t('changeInfo.againPW') }, pattern: new RegExp(password) }}
            defaultValue=""
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label={t('changeInfo.againPW')}
                placeholder={'请再次输入'}
                maxLength={30}
                secureTextEntry={passwordInvisible}
                style={[tw.wFull, { backgroundColor: colors.background }]}
                onChangeText={(againPassword) => onChange(againPassword)}
                value={value}
                onBlur={onBlur}
                error={errors.againPassword}
              />
            )}
          />
        </View>
      );
    };

    const logOut = () => {
      lessonDetailStore.lessonDetail = undefined;
      userStore.userInfoDetail = {};
      lessonDetailStore.lessonClassOfTeacher = [];
      homeworkStore.homeworkDetail = undefined;
      homeworkStore.completedHomeworkStudent = [];
      homeworkStore.unfinishedHomeworkStudent = [];
      homeworkStore.unfinishedHomeworkTeacher = [];
      homeworkStore.completedHomeworkTeacher = [];
    };

    const changeUserName = async (e: string) => {
      baseView.current.showLoading({ text: '正在提交' });
      const res = await userStore.changeUserName(e);
      baseView.current.hideLoading();
      if (typeof res !== 'string') {
        baseView.current.showToast({ text: '请重新登录', delay: 1 });
        setTimeout(async () => {
          userStore.login = false;
          logOut();
          navigation.navigate('Main', { screen: 'LoginByPhone', options: { animationEnabled: false }, params: { name: 'userName' } });
        }, 1000);
      } else {
        baseView.current.showMessage({ text: res, delay: 2 });
      }
    };
    const changeRealName = async (e: string) => {
      baseView.current.showLoading({ text: '正在提交' });
      const res = await userStore.changeRealName(e);
      baseView.current.hideLoading();
      if (typeof res !== 'string') {
        navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false }, params: { name: 'realName' } });
      } else {
        baseView.current.showMessage({ text: res, delay: 2 });
      }
    };
    const changeNickName = async (e: string) => {
      baseView.current.showLoading({ text: '正在提交' });
      const res = await userStore.changeNickName(e);
      baseView.current.hideLoading();
      if (typeof res !== 'string') {
        navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false }, params: { name: 'nickName' } });
      } else {
        baseView.current.showMessage({ text: res, delay: 2 });
      }
    };
    const changeEmail = async (e: string) => {
      baseView.current.showLoading({ text: '正在提交' });
      const res = await userStore.changeEmail(e);
      baseView.current.hideLoading();
      if (typeof res !== 'string') {
        navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false }, params: { name: 'realName' } });
      } else {
        baseView.current.showMessage({ text: res, delay: 2 });
      }
    };

    const changePassword = async (data: { newPassword?: string; oldPassword?: string; againPassword?: string }) => {
      console.log(data);
      if (data.newPassword !== data.againPassword) {
        baseView.current.showMessage({ text: '两次密码不一致', delay: 2 });
      } else {
        baseView.current.showLoading({ text: '正在提交' });
        userStore.getPublicKey().then((result) => {
          if (result) {
            if (data.newPassword != null) {
              RSA.encrypt(data.newPassword, result).then((newPassword) => {
                if (data.oldPassword != null) {
                  RSA.encrypt(data.oldPassword, result).then((passwordOld) => {
                    userStore.changePassword({ passwordNew: newPassword, oldPassword: passwordOld }).then((res) => {
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
            }
          }
        });
      }
    };

    const infoType = () => {
      switch (name) {
        case 'email':
          return { header: t('changeInfo.modify') + t('changeInfo.email'), component: inputEmail, tip: '' };
        case 'password':
          return { header: t('changeInfo.modify') + t('changeInfo.password'), component: inputPassword, tip: t('changeInfo.passwordTip') };
        case 'realName':
          return { header: t('changeInfo.modify') + t('changeInfo.realName'), component: inputRealName, tip: t('changeInfo.userNameTip') };
        case 'username':
          return { header: t('changeInfo.modify') + '账号', component: inputUserName, tip: t('changeInfo.userNameTip') };
        case 'nickName':
          return { header: t('changeInfo.modify') + '昵称', component: inputNickName, tip: t('changeInfo.userNameTip') };
        default:
          return { header: t('changeInfo.modify') + t('changeInfo.realName'), component: inputRealName };
      }
    };
    const handleQuerySmsCode = async () => {
      await handleSubmit(async (data) => {
        switch (name) {
          case 'realName':
            await changeRealName(data.realName);
            return;
          case 'email':
            await changeEmail(data.email);
            return;
          case 'password':
            await changePassword(data);
            return;
          case 'nickName':
            await changeNickName(data.nickName);
            return;
          case 'username':
            await changeUserName(data.username);
            return;
          default:
            baseView.current.showMessage({ text: '没有匹配到要修改的数据', delay: 2 });
        }
      })();
    };

    const naviPhoneSys = () => {
      navigation.navigate('Main', { screen: 'ChangeInfoSys' });
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={infoType().header} />
          </Appbar.Header>
          <View style={[tw.pY3, tw.pX5]}>
            {infoType().component()}
            <View style={[tw.flexRow, tw.justifyBetween]}>
              <Text style={[tw.m3, { fontSize: 12 }]}>{infoType().tip}</Text>
              {name === 'password' ? (
                <TouchableOpacity onPress={naviPhoneSys}>
                  <Text style={[tw.m3, { fontSize: 13, color: colors.accent }]} onPress={naviPhoneSys}>
                    {'手机号验证 ->'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Button mode="contained" style={[tw.p1]} onPress={throttle(handleQuerySmsCode)}>
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
