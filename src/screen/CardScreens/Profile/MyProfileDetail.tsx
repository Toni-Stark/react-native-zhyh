import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Button, Dialog, Portal, Modal, Text } from 'react-native-paper';
import { getUserGender, t } from '../../../common/tools';
import SettingView from '../../../component/SettingView';
import { useStore } from '../../../store';
import ImagePicker from 'react-native-image-crop-picker';
import { userInfoDetailType } from '../../../store/UserStore';
import { observer } from 'mobx-react-lite';
import { USER_MODE_CLASS_STUDENT, USER_MODE_CLASS_TEACHER } from '../../../common/status-module';
import FastImage from 'react-native-fast-image';
const { ActionSheetIOS } = require('react-native');

export const AVATAR_CHANGE_SIZE = 300;

export const MyProfileDetail: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { userStore, homeworkStore, lessonDetailStore } = useStore();
    const [visHeader, setVisHeader] = useState<boolean>(false);
    const [visGender, setVisGender] = useState<boolean>(false);
    const [changeSelfVisible, setChangeSelfVisible] = useState<boolean>(false);
    const [modalHeader, setModalHeader] = useState<boolean>(false);
    const [heightWidth, setHeightWidth] = useState<number>(0);
    const [widthHeight, setWidthHeight] = useState<number>(0);
    const [changeUserName, setChangeUserName] = useState<boolean>(false);
    const [widthThanHeight] = useState<boolean>(Dimensions.get('window').width > Dimensions.get('window').height);
    const [logOutVisible, setLogOutVisible] = useState<boolean>(false);
    useEffect(() => {
      (async () => {
        await userStore.queryUserInfo();
      })();
    }, [userStore]);

    const changeSex = async (selected: boolean) => {
      if (userStore.userInfoDetail.id) {
        if (selected) {
          const res = await userStore.editSex(1);
          setVisGender(false);
          if (res) {
            baseView.current?.showToast({ text: '修改成功', delay: 1.5 });
          }
        } else {
          const res = await userStore.editSex(2);
          setVisGender(false);
          if (res) {
            baseView.current?.showToast({ text: '修改成功', delay: 1.5 });
          }
        }
      }
    };

    const changeAvatar = (camera: boolean) => {
      setVisHeader(false);
      const params = {
        width: AVATAR_CHANGE_SIZE,
        height: AVATAR_CHANGE_SIZE,
        cropping: true,
        cropperCircleOverlay: false,
        cropperToolbarTitle: t('myProfile.chooseYourAvatar'),
        cropperChooseText: t('myProfile.confirm'),
        cropperCancelText: t('myProfile.cancel')
      };
      if (camera) {
        ImagePicker.openCamera(params)
          .then(async (image) => {
            console.log(image, '等待中');
            await uploadAvatar(image);
          })
          .catch(() => {
            baseView.current?.showMessage({ text: t('myProfile.cancel'), delay: 2 });
          });
      } else {
        ImagePicker.openPicker(params)
          .then(async (image) => {
            console.log(image, '等待中');
            await uploadAvatar(image);
          })
          .catch((err) => {
            if (err.toString() === 'Error: Cannot find image data') {
              baseView.current?.showMessage({ text: t('myProfile.formatError'), delay: 2 });
            } else {
              baseView.current?.showMessage({ text: t('myProfile.cancel'), delay: 2 });
            }
          });
      }
    };

    const uploadAvatar = async (image) => {
      baseView.current?.showLoading({ text: t('myProfile.longBiography') });
      console.log(image, '头像图片');
      const res = await userStore.uploadAvatar(image);
      baseView.current?.hideLoading();
      if (typeof res !== 'string') {
        baseView.current?.showLoading({ text: t('myProfile.longTermSuccess'), delay: 1 });
      } else {
        baseView.current?.showMessage({ text: res, delay: 2 });
      }
    };

    const headerDialog = () => {
      return (
        <Portal>
          <Dialog
            style={[tw.mX16]}
            visible={visHeader}
            onDismiss={() => {
              setVisHeader(false);
            }}
          >
            <Dialog.Actions>
              <View style={[tw.flexCol, { width: '100%' }]}>
                <Button
                  onPress={() => {
                    changeAvatar(true);
                  }}
                >
                  {t('photo.photograph')}
                </Button>
                <Button
                  onPress={() => {
                    changeAvatar(false);
                  }}
                >
                  {t('photo.selectAlbum')}
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      );
    };

    const genderDialog = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[{ padding: 30 }]}
            visible={visGender}
            onDismiss={() => {
              setVisGender(false);
            }}
          >
            <View style={[tw.mX5, { borderRadius: 8, backgroundColor: colors.background }]}>
              <View style={[tw.itemsCenter, tw.pY3, tw.borderGray600, { borderBottomWidth: 0.25 }]}>
                <Text style={[{ fontSize: 16 }]}>性别选择</Text>
              </View>
              <View style={[tw.itemsCenter, tw.pY3, tw.flexRow, tw.justifyAround]}>
                <TouchableOpacity
                  onPress={async () => {
                    await changeSex(true);
                  }}
                >
                  <View
                    style={[
                      userStore.userInfoDetail.sex === 1 ? tw.bgBlue300 : tw.bgGray300,
                      tw.itemsCenter,
                      tw.justifyCenter,
                      { borderRadius: 50, width: 50, height: 50 }
                    ]}
                  >
                    <Text style={[{ color: colors.background }]}>男生</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await changeSex(false);
                  }}
                >
                  <View
                    style={[
                      userStore.userInfoDetail.sex === 2 ? tw.bgPink300 : tw.bgGray300,
                      tw.itemsCenter,
                      tw.justifyCenter,
                      { borderRadius: 50, width: 50, height: 50 }
                    ]}
                  >
                    <Text style={[{ color: colors.background }]}>女生</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setVisGender(false);
                }}
              >
                <View style={[tw.itemsCenter, tw.pY3, tw.borderGray600, { borderTopWidth: 0.25 }]}>
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };

    const logOut = () => {
      userStore.logOut().finally(() => {
        lessonDetailStore.lessonDetail = undefined;
        userStore.userInfoDetail = {};
        lessonDetailStore.lessonClassOfTeacher = [];
        homeworkStore.homeworkDetail = undefined;
        homeworkStore.completedHomeworkStudent = [];
        homeworkStore.unfinishedHomeworkStudent = [];
        homeworkStore.unfinishedHomeworkTeacher = [];
        homeworkStore.completedHomeworkTeacher = [];
      });
      navigation.navigate('LoginByPhone');
    };

    const renderLogout = () => {
      if (userStore.login) {
        return (
          <Button
            style={[tw.m10, tw.mB20]}
            contentStyle={[{ height: 40 }]}
            mode="contained"
            onPress={() => {
              setLogOutVisible(true);
            }}
          >
            {t('myProfile.loginOut')}
          </Button>
        );
      } else {
        return null;
      }
    };

    const renderSetting = (userInfo: userInfoDetailType) => {
      const menu = [
        {
          title: t('myProfile.header'),
          colorType: false,
          useAvatar: true,
          needRIcon: false,
          avatarImg: userInfo.avatar ? { uri: userInfo.avatar.url } : { uri: undefined },
          onPress: () => {
            setModalHeader(true);
          }
        },
        {
          title: t('myProfile.userName'),
          description: userInfo.username || t('myProfile.notSet'),
          colorType: false,
          useAvatar: false,
          needRIcon: false,
          onPress: () => {
            setChangeUserName(true);
          }
        },
        {
          title: t('myProfile.phone'),
          description: userInfo.phone || t('myProfile.notSet'),
          colorType: true,
          useAvatar: false,
          needRIcon: false,
          onPress: () => {}
        },
        {
          title: t('myProfile.realName'),
          colorType: true,
          useAvatar: false,
          description: userInfo.realName || '未实名',
          onPress: () => {
            navigation.navigate('Main', { screen: 'ChangeInfo', options: { animationEnabled: false }, params: { name: 'realName' } });
          }
        },
        {
          title: '昵称',
          colorType: true,
          useAvatar: false,
          description: userInfo.nickName || '无',
          onPress: () => {
            navigation.navigate('Main', { screen: 'ChangeInfo', options: { animationEnabled: false }, params: { name: 'nickName' } });
          }
        },
        {
          title: t('myProfile.email'),
          description: userStore.getUserInfoEmail || t('myProfile.notSet'),
          colorType: true,
          useAvatar: false,
          onPress: () => {
            navigation.navigate('Main', { screen: 'ChangeInfo', options: { animationEnabled: false }, params: { name: 'email' } });
          }
        },
        {
          title: t('myProfile.gender'),
          description: getUserGender(userInfo.sex),
          colorType: false,
          useAvatar: false,
          onPress: () => {
            if (Platform.OS !== 'ios') {
              setVisGender(true);
            } else {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['取消', '男', '女'],
                  destructiveButtonIndex: 2,
                  cancelButtonIndex: 0
                },
                (buttonIndex) => {
                  if (userStore.userInfoDetail.id && buttonIndex !== 0) {
                    userStore
                      .editSex(buttonIndex)
                      .then((e) => {
                        console.log(e);
                      })
                      .catch((e) => baseView.current.showMessage({ text: e }));
                  }
                }
              );
            }
          }
        },
        {
          title: t('myProfile.resetPW'),
          description: t('myProfile.resetLogPW'),
          colorType: false,
          useAvatar: false,
          onPress: () => {
            navigation.navigate('Main', { screen: 'ChangeInfo', options: { animationEnabled: false }, params: { name: 'password' } });
          }
        },
        {
          title: '账号类型',
          description: userStore.getUserTypeName,
          colorType: false,
          useAvatar: false,
          onPress: () => {
            setChangeSelfVisible(true);
          }
        }
      ];
      return <SettingView settings={menu} />;
    };

    const changeSelfIds = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.mX10]}
            visible={changeSelfVisible}
            onDismiss={() => {
              setChangeSelfVisible(false);
            }}
          >
            <View style={[tw.flex, tw.pT5, { backgroundColor: colors.background, borderRadius: 15 }]}>
              <Text style={[tw.selfCenter, tw.mB2, { fontSize: 17, fontWeight: 'bold' }]}>温馨提示</Text>
              <Text style={[tw.mX8, tw.textCenter, tw.mB2, { fontSize: 16, color: colors.placeholder }]}>
                {userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER
                  ? '教师身份包含学生身份，无需更改哦~'
                  : userStore.userInfoDetail.userType === USER_MODE_CLASS_STUDENT
                  ? '学生身份改为教师身份后无法再次回到学生身份，请确认要改为教师身份~'
                  : '未获取到身份信息!'}
              </Text>
              <View style={[tw.flexRow]}>
                <View style={[tw.borderGray400, tw.flex1, { height: 40, borderTopWidth: 0.25, borderRightWidth: 0.25 }]}>
                  <TouchableOpacity
                    style={[tw.flex1]}
                    onPress={() => {
                      setChangeSelfVisible(false);
                    }}
                  >
                    <View style={[tw.itemsCenter, tw.justifyCenter, tw.flex1]}>
                      <Text style={[{ color: colors.placeholder }]}>取消</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[tw.borderGray400, tw.flex1, { borderTopWidth: 0.25 }]}>
                  <TouchableOpacity
                    style={[tw.flex1]}
                    onPress={async () => {
                      if (userStore.userInfoDetail.userType === USER_MODE_CLASS_STUDENT) {
                        lessonDetailStore.lessonDetail = undefined;
                        userStore.userInfoDetail = {};
                        lessonDetailStore.lessonClassOfTeacher = [];
                        homeworkStore.homeworkDetail = undefined;
                        homeworkStore.completedHomeworkStudent = [];
                        homeworkStore.unfinishedHomeworkStudent = [];
                        homeworkStore.unfinishedHomeworkTeacher = [];
                        homeworkStore.completedHomeworkTeacher = [];
                        await userStore.changeOfIdentity();
                      }
                      setChangeSelfVisible(false);
                    }}
                  >
                    <View style={[tw.itemsCenter, tw.justifyCenter, tw.flex1]}>
                      <Text style={[{ color: colors.accent }]}>确定</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const logOutModal = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.mX10]}
            visible={logOutVisible}
            onDismiss={() => {
              setLogOutVisible(false);
            }}
          >
            <View style={[tw.flex, tw.pT5, { backgroundColor: colors.background, borderRadius: 15 }]}>
              <Text style={[tw.mX8, tw.textCenter, tw.mY4, { fontSize: 16, color: colors.placeholder }]}>
                退出后不会删除任何历史数据，下次登录依然可以使用本账号。
              </Text>
              <View style={[tw.flexRow]}>
                <View style={[tw.borderGray400, tw.flex1, { height: 40, borderTopWidth: 0.25, borderRightWidth: 0.25 }]}>
                  <TouchableOpacity
                    style={[tw.flex1]}
                    onPress={() => {
                      setLogOutVisible(false);
                    }}
                  >
                    <View style={[tw.itemsCenter, tw.justifyCenter, tw.flex1]}>
                      <Text style={[{ color: colors.placeholder }]}>取消</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[tw.borderGray400, tw.flex1, { borderTopWidth: 0.25 }]}>
                  <TouchableOpacity
                    style={[tw.flex1]}
                    onPress={async () => {
                      setLogOutVisible(false);
                      logOut();
                    }}
                  >
                    <View style={[tw.itemsCenter, tw.justifyCenter, tw.flex1]}>
                      <Text style={[{ color: colors.accent }]}>确定</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const changeSelfName = () => {
      return (
        <Portal>
          {/*<Modal contentContainerStyle={[tw.mX10]} visible={changeUserName} dismissable={false}>*/}
          {/*  <View style={[tw.flex, tw.pT5, { backgroundColor: colors.background, borderRadius: 15 }]}>*/}
          {/*    <Text style={[tw.selfCenter, tw.mB2, { fontSize: 17, fontWeight: 'bold' }]}>温馨提示</Text>*/}
          {/*    <Text style={[tw.mX8, tw.textCenter, tw.mB2, { fontSize: 16, color: colors.placeholder }]}>修改用户名之后一年之内不能再次修改，</Text>*/}
          {/*    <TouchableOpacity*/}
          {/*      style={[tw.wFull, tw.itemsCenter, tw.justifyCenter, tw.pB2, { borderBottomLeftRadius: 15, borderBottomRightRadius: 15, height: 40 }]}*/}
          {/*      onPress={async () => {*/}
          {/*        console.log('牛逼');*/}
          {/*        setChangeUserName(false);*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <Text style={[{ color: colors.accent }]}>确定</Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*  </View>*/}
          {/*</Modal>*/}
          <Modal
            contentContainerStyle={[{ padding: 30 }]}
            visible={changeUserName}
            onDismiss={() => {
              setChangeUserName(false);
            }}
          >
            <View style={[tw.mX5, { borderRadius: 8, backgroundColor: colors.background }]}>
              <View style={[tw.itemsCenter, tw.pY3, tw.borderGray400, { borderBottomWidth: 0.25 }]}>
                <Text style={[{ fontSize: 17, color: colors.notification }]}>注意</Text>
              </View>
              <View style={[tw.itemsCenter, tw.pY3, tw.flexRow, tw.justifyAround]}>
                <Text style={[tw.mX8, tw.textCenter, tw.mB2, { fontSize: 15, color: colors.placeholder }]}>
                  修改用户名之后<Text style={[{ color: colors.notification }]}>一年之内</Text>不能再次修改
                </Text>
              </View>
              <View style={[tw.flexRow]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.borderGray400, { borderRightWidth: 0.25 }]}
                  onPress={() => {
                    setChangeUserName(false);
                  }}
                >
                  <View style={[tw.flex, tw.itemsCenter, tw.pY3, tw.borderGray400, { borderTopWidth: 0.25 }]}>
                    <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[tw.flex1]}
                  onPress={() => {
                    setChangeUserName(false);
                    navigation.navigate('Main', { screen: 'ChangeInfo', options: { animationEnabled: false }, params: { name: 'username' } });
                  }}
                >
                  <View style={[tw.flex, tw.itemsCenter, tw.pY3, tw.borderGray400, { borderTopWidth: 0.25 }]}>
                    <Text style={[{ fontSize: 16, color: colors.accent }]}>确定</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const headerShowModal = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.bgBlack, { height: '100%', opacity: 0.9 }]}
            visible={modalHeader}
            onDismiss={() => {
              console.log(555);
              setModalHeader(false);
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                console.log(555);
                setModalHeader(false);
              }}
            >
              <View style={[tw.itemsCenter, tw.justifyCenter, tw.flex1]}>
                <View style={[tw.itemsCenter]}>
                  <FastImage
                    onLoad={(e) => {
                      console.log(e.nativeEvent);
                      if (widthThanHeight) {
                        if (e.nativeEvent.width && e.nativeEvent.height) {
                          setHeightWidth((Dimensions.get('window').height / 2 / e.nativeEvent.height) * e.nativeEvent.width);
                        }
                      } else {
                        if (e.nativeEvent.width && e.nativeEvent.height) {
                          setWidthHeight((Dimensions.get('window').width / e.nativeEvent.width) * e.nativeEvent.height);
                        }
                      }
                    }}
                    source={{ uri: userStore.userInfoDetail.avatar?.url }}
                    style={{
                      width: widthThanHeight ? heightWidth : Dimensions.get('window').width,
                      height: widthThanHeight ? Dimensions.get('window').height / 2 : widthHeight
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      changeAvatar(false);
                    }}
                  >
                    <View style={[tw.p2, tw.mT4, tw.bgGray700, { borderRadius: 3, width: 270 }]}>
                      <Text style={[tw.textGray200]}>从图库选择</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      changeAvatar(true);
                    }}
                  >
                    <View style={[tw.p2, tw.mT4, tw.bgGray700, { borderRadius: 3, width: 270 }]}>
                      <Text style={[tw.textGray200]}>打开相机</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </Portal>
      );
    };

    const renderContent = () => {
      return renderSetting(userStore.userInfoDetail);
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[{ backgroundColor: colors.background }]}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content
            onPress={() => {
              navigation.navigate('Main', { screen: 'UserInfoDetail' });
            }}
            title={t('myProfile.myInfo')}
          />
        </Appbar.Header>
        <ScrollView style={[tw.flex1]}>
          {renderContent()}
          {renderLogout()}
        </ScrollView>
        {/*<View style={[tw.selfCenter, tw.flexRow, tw.pY2]}>*/}
        {/*  <Text style={[{ fontSize: 15, color: colors.placeholder, fontWeight: 'bold' }]}>{t('myProfile.code')}: </Text>*/}
        {/*  <Text selectable={true} style={[{ fontSize: 15, color: colors.accent, fontWeight: 'bold' }]}>*/}
        {/*    {userStore.login ? userStore.userInfo.workNo : t('myProfile.login')}*/}
        {/*  </Text>*/}
        {/*</View>*/}
        {headerDialog()}
        {headerShowModal()}
        {changeSelfName()}
        {genderDialog()}
        {changeSelfIds()}
        {logOutModal()}
      </BaseView>
    );
  }
);
