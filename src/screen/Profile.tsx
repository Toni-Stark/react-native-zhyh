import React, { useEffect, useRef, useState } from 'react';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { getStatusBarHeight, requestCameraPermission, throttle } from '../common/tools';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingView, { SettingViewItemType } from '../component/SettingView';
import { ProfilePlaceholder } from '../component/skeleton/ProfilePlaceholder';
import { t } from '../common/tools';
import { observer } from 'mobx-react-lite';

export const Profile: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { settingStore, userStore } = useStore();
    const baseView = useRef<any>(undefined);
    const handleLogin = () => {
      navigation.navigate('LoginByPhone');
    };

    const [teachersList] = useState<SettingViewItemType[]>([
      // {
      //   icon: 'supervisor-account',
      //   title: t('profile.listOfStuAndPar'),
      //   description: t('profile.listOfStuAndPar'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: () => {
      //     navigation.navigate('Main', { screen: 'ParentsStudents', options: { animationEnabled: false } });
      //   }
      // }
    ]);

    const [studentList] = useState<SettingViewItemType[]>([
      // {
      //   icon: 'cloud-circle',
      //   title: '网盘资源',
      //   description: '进入详情',
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: async () => {
      //     if (userStore.login) {
      //       navigation.navigate('CloudSeaDisk');
      //     } else {
      //       await handleLogin();
      //     }
      //   }
      // },
      // {
      //   icon: 'qr-code-2',
      //   title: t('profile.QRCode'),
      //   description: t('profile.relatedParents'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: async () => {
      //     if (userStore.login) {
      //       navigation.navigate('Main', { screen: 'MyQRDetail', options: { animationEnabled: false } });
      //     } else {
      //       await handleLogin();
      //     }
      //   }
      // },
      // {
      //   icon: 'supervisor-account',
      //   title: t('profile.listOfStuAndPar'),
      //   description: t('profile.listOfStuAndPar'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: () => {
      //     navigation.navigate('Main', { screen: 'ParentsStudents', options: { animationEnabled: false } });
      //   }
      // },
      // {
      //   icon: 'account-balance-wallet',
      //   title: t('profile.balance'),
      //   description: t('profile.balanceRecharge'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: async () => {
      //     if (userStore.login) {
      //       navigation.navigate('Main', { screen: 'BalanceDetail', options: { animationEnabled: false } });
      //     } else {
      //       await handleLogin();
      //     }
      //   }
      // },
      // {
      //   icon: 'account-details-outline',
      //   title: t('profile.account'),
      //   description: t('profile.conInDel'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: () => {
      //     console.log('message');
      //   }
      // },
      {
        icon: 'account-circle',
        title: '个人信息',
        description: '充分展示个人信息',
        notification: false,
        iconColor: colors.primary,
        onPress: () => {
          if (userStore.login) {
            navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false } });
          } else {
            navigation.navigate('LoginByPhone');
          }
        }
      },
      {
        icon: 'qr-code-scanner',
        title: t('profile.scanCodePC'),
        description: t('profile.clickScanCode'),
        notification: false,
        iconColor: colors.primary,
        onPress: async () => {
          if (userStore.login) {
            requestCameraPermission()
              .then((res) => {
                if (res) {
                  navigation.navigate('Main', { screen: 'CodeScan' });
                }
              })
              .catch((e) => baseView.current?.showMessage(e));
          } else {
            await handleLogin();
          }
        }
      },
      {
        icon: 'handyman',
        title: t('profile.sysMan'),
        description: '查看设置',
        notification: false,
        iconColor: colors.primary,
        onPress: () => {
          navigation.navigate('Main', { screen: 'ProfileDetail', options: { animationEnabled: false } });
        }
      },

      {
        icon: 'source',
        title: t('profile.about'),
        description: t('profile.YunHaiXueYue'),
        notification: false,
        iconColor: colors.primary,
        onPress: () => {
          navigation.navigate('Main', { screen: 'AboutDetail', options: { animationEnabled: false } });
        }
      }
    ]);

    const [menuList] = useState<SettingViewItemType[]>([]);

    useEffect(() => {
      // try {
      //   let setting: SettingViewItemType[] = [];
      //   setting.splice(0, 0, ...menuList);
      //   if (userStore.userInfoDetail.userType === USER_MODE_CLASS_STUDENT) {
      //     setting.splice(3, 0, ...studentList);
      //   } else if (userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER) {
      //     setting.splice(3, 0, ...teachersList);
      //   }
      //   settingStore.updateSettings(setting);
      // } catch (err) {}
      try {
        let setting: SettingViewItemType[] = [];
        setting = studentList;
        settingStore.updateSettings(setting);
      } catch (err) {}
    }, [menuList, settingStore, studentList, teachersList, userStore.login, userStore.userInfoDetail.userType]);

    // const useHeader = () => {
    //   if (userStore.userInfo.avatar) {
    //     return <Avatar.Image size={60} source={getSafeAvatar(userStore.userInfo.avatar)} />;
    //   } else {
    //     return <Icon name="account-circle" size={60} color={colors.primary} onPress={throttle(handleLogin)} />;
    //   }
    // };

    const navigateTo = () => {
      if (userStore.login) {
        navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false } });
      } else {
        navigation.navigate('LoginByPhone');
      }
    };

    const renderBeforeLoginHeader = () => {
      if (userStore.login) {
        return (
          <TouchableOpacity onPress={throttle(navigateTo)} style={[tw.pT10, tw.pB8, tw.pX5, { borderBottomWidth: 0.5, borderColor: colors.surface }]}>
            <View style={[tw.flexRow, tw.justifyBetween]}>
              <View style={[tw.flexRow]}>
                {userStore.userInfoDetail.avatar ? (
                  // <Avatar.Image size={70} source={getSafeAvatar(userStore.userInfoDetail.avatar)} />
                  <Avatar.Image size={70} source={{ uri: userStore.userInfoDetail.avatar.url }} />
                ) : (
                  <Icon name="face" size={70} color={colors.primary} onPress={throttle(navigateTo)} />
                )}
                <View style={[tw.pL3, tw.justifyBetween]}>
                  <Text style={[{ color: colors.text, fontSize: 16, fontWeight: 'bold' }]}>
                    {userStore.userInfoDetail.nickName ||
                      userStore.userInfoDetail.realName ||
                      userStore.userInfoDetail.phone ||
                      userStore.userInfoDetail.username}
                  </Text>
                  <View style={[tw.itemsCenter, tw.selfStart, tw.justifyCenter, tw.borderPink400, tw.pX1, { height: 16, borderWidth: 1.25, borderRadius: 3 }]}>
                    <Text style={[tw.textPink400, { fontSize: 10, fontWeight: 'bold' }]}>{userStore.userInfoDetail.business?.name}</Text>
                  </View>

                  <View>
                    <Text style={[{ fontSize: 11, color: colors.placeholder }]}>身份：{userStore.getUserTypeName}</Text>
                  </View>
                </View>
              </View>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={[{ fontSize: 12, color: colors.disabled }]}>详细信息</Text>
                <Icon name="chevron-right" size={20} color={colors.disabled} />
              </View>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={throttle(navigateTo)} style={[tw.pT10, tw.pB8, tw.pX5, tw.borderGray300, { borderBottomWidth: 0.5 }]}>
            <View style={[tw.flexRow]}>
              {userStore.userInfoDetail.avatar ? (
                <Avatar.Image size={70} source={{ uri: userStore.userInfoDetail.avatar.url }} />
              ) : (
                <Icon name="face" size={70} color={colors.primary} onPress={throttle(navigateTo)} />
              )}

              <View style={[tw.mL3, tw.flexRow, tw.itemsCenter]}>
                <Text style={[{ fontSize: 18, color: colors.accent }]}>请登录</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    };

    // const renderStatistic = () => {
    //   return (
    //     <View style={[tw.flexRow, tw.p4]}>
    //       <View style={[tw.flex1, tw.itemsCenter]}>
    //         <Text style={[tw.textLg, { color: colors.notification }]}>{userStore.login ? userStore.userInfo.balance : 0}</Text>
    //         <Text style={[tw.textXs, tw.mT1]}>{t('profile.XueYueCoin')}</Text>
    //       </View>
    //       <View style={[tw.flex1, tw.itemsCenter]}>
    //         <Text style={[tw.textLg, { color: colors.notification }]}>{userStore.login ? userStore.userInfo.lessonCount : 0}</Text>
    //         <Text style={[tw.textXs, tw.mT1]}>{t('profile.numberCourses')}</Text>
    //       </View>
    //       <View style={[tw.flex1, tw.itemsCenter]}>
    //         <Text style={[tw.textLg, { color: colors.notification }]}>{userStore.login ? userStore.userInfo.frozenBalance : 0}</Text>
    //         <Text style={[tw.textXs, tw.mT1]}>{t('profile.frozenBalance')}</Text>
    //       </View>
    //     </View>
    //   );
    // };
    //
    // const navigateBar = () => {
    //   return (
    //     <View style={[tw.flexRow, tw.justifyBetween, tw.mX6, tw.pY4, tw.pX2]}>
    //       <TouchableWithoutFeedback
    //         onPress={() => {
    //           navigation.navigate('CloudSeaDisk');
    //         }}
    //       >
    //         <View style={[tw.itemsCenter]}>
    //           <FastImage source={require('../assets/cloud.png')} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.cover} />
    //           <Text style={[{ fontSize: 12 }]}>资源空间</Text>
    //         </View>
    //       </TouchableWithoutFeedback>
    //
    //       <View style={[tw.itemsCenter]}>
    //         <FastImage source={require('../assets/cloud.png')} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.cover} />
    //         <Text style={[{ fontSize: 12 }]}>我的班级</Text>
    //       </View>
    //       <View style={[tw.itemsCenter]}>
    //         <FastImage source={require('../assets/cloud.png')} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.cover} />
    //         <Text style={[{ fontSize: 12 }]}>账户余额</Text>
    //       </View>
    //     </View>
    //   );
    // };

    const renderContent = () => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      } else {
        return (
          <ScrollView
            style={[
              { paddingTop: Platform.OS === 'ios' ? getStatusBarHeight(false) : 0, marginBottom: 55 + (Platform.OS === 'ios' ? 0 : getStatusBarHeight(false)) }
            ]}
          >
            {renderBeforeLoginHeader()}

            {/*{navigateBar()}*/}
            {/*这是3个展示数据*/}
            {/*{renderStatistic()}*/}

            <View style={[tw.h3, { backgroundColor: colors.surface }]} />
            <SettingView settings={settingStore.settings} />
          </ScrollView>
        );
      }
    };

    return (
      <BaseView ref={baseView} useSafeArea={settingStore.loading} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
