import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Appbar, Modal, Portal, Text, useTheme } from 'react-native-paper';
import BaseView from '../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from './index';
import {
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../store';
import { t } from '../common/tools';
import { DiskFolder } from './ModalScreens/NetdiskResources/DiskFolder';
import BottomSheet from 'reanimated-bottom-sheet';
import { AllResourcesAllListType } from './ModalScreens/NetdiskResources/CloudSeaDiskStore';
import FastImage from 'react-native-fast-image';
import ImagePicker, { Options } from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
type Props = {};

export type ClassTypes = {
  type: number;
  name: string;
};

export type CloudDiskType = {
  id: string;
  name: string;
  type: number;
  url?: string;
  size?: string;
};

export const CloudDisk: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const menuSheet = useRef<any>();
    const menuMoreSheet = useRef<any>();
    const [refreshing, setRefreshing] = useState(false);
    const { cloudSeaDiskStore, uploadFilesStore, userStore } = useStore();
    const [select, setSelect] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [folderListAll, setFolderListAll] = useState<AllResourcesAllListType[]>([]);

    const fadeAnim = useRef(new Animated.Value(1));
    const fadeTypeAnim = useRef(new Animated.Value(0));
    const fadeOrderAnim = useRef(new Animated.Value(0));
    const translateValue = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
    const [isWave, setIsWave] = useState(false);
    const widthThanHeight = Dimensions.get('window').width > Dimensions.get('window').height;
    const [eventSize, setEventSize] = useState(0);
    const [delModalVisible, setDelModalVisible] = useState(false);
    const [editFolderVisible, setEditFolderVisible] = useState(false);
    const [reName, setReName] = useState('');
    const [publicVisible, setPublicVisible] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const [imagePath, setImagePath] = useState<ImageSource[]>([]);
    const [checkPublic, setCheckPublic] = useState<boolean>(false);
    const [orderPublic, setOrderPublic] = useState<boolean>(false);
    const isIos = Platform.OS === 'ios';
    const [currentInput, setCurrentInput] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [modalHeight, setModalHeight] = useState<number>(400);

    const fadeIn = () => {
      Animated.timing(fadeAnim.current, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    };

    const fadeOut = () => {
      Animated.timing(fadeAnim.current, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    };

    const fadeInAll = () => {
      Animated.spring(translateValue.current, { toValue: { x: 0, y: 0 }, velocity: 4, tension: 10, friction: 2, useNativeDriver: true }).start();
    };

    const fadeOutAll = useCallback(() => {
      Animated.spring(translateValue.current, {
        toValue: { x: 0, y: isIos ? 150 : 135 },
        velocity: 4,
        tension: 10,
        friction: 2,
        useNativeDriver: true
      }).start();
    }, [isIos]);

    useEffect(() => {
      if (eventSize > 20) {
        fadeOut();
      } else {
        fadeIn();
      }
    }, [eventSize]);
    useEffect(() => {
      if (select.length > 0) {
        setIsWave(true);
        fadeInAll();
      } else {
        setIsWave(false);
        fadeOutAll();
      }
    }, [fadeOutAll, select.length]);

    useEffect(() => {
      cloudSeaDiskStore.allResourcesAllList = [];
      (async () => {
        await cloudSeaDiskStore.accessToPublicResources({ current: 1 }).then((res) => {
          if (typeof res === 'boolean') {
            console.log('更新视图');
          }
        });
      })();
    }, [cloudSeaDiskStore]);

    const doEnyThings = (id, name, type) => {
      if (type === 0) {
        cloudSeaDiskStore.parentId = id;
        cloudSeaDiskStore.allResourcesAllList.push({ name: name, id: id, list: cloudSeaDiskStore.allResourcesList });
        setFolderListAll(cloudSeaDiskStore.allResourcesAllList);
        cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: id }).then((res) => {
          if (typeof res === 'boolean') {
            console.log(res, '做了些操作');
          }
        });
      }
      switch (type) {
        case 1:
          setImageVisible(true);
          uploadFilesStore.getPublicFilePath(id).then((res) => {
            if (res) {
              setImagePath([{ uri: res }, ...imagePath]);
            }
          });
          break;
        case 2:
          console.log('000000');
          // 音频播放方案一 RNVoiceRecorder
          uploadFilesStore.getPublicFilePath(id).then((res) => {
            navigation.navigate('Main', { screen: 'AudioPlayer', params: { name: name, url: res } });
          });
          break;
        case 3:
          uploadFilesStore.getPublicFilePath(id).then((res) => {
            navigation.navigate('Main', { screen: 'LessonVideoView', params: { name: name, url: res } });
          });
          break;
        case 4:
        case 5:
        case 6:
        case 7:
          uploadFilesStore.getPublicFilePath(id).then((res) => {
            if (res) {
              Linking.openURL(res)
                .then((result) => {
                  console.log(result);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
          break;
      }
    };
    const MAX_UPLOAD_PICTURE = 6;

    const paramsPicker: Options = {
      cropping: true,
      compressImageQuality: 0.9,
      compressImageMaxWidth: 1920,
      compressImageMaxHeight: 1920,
      multiple: true,
      mediaType: 'photo',
      forceJpg: true,
      maxFiles: MAX_UPLOAD_PICTURE
    };
    const paramsVideo: Options = {
      mediaType: 'video'
    };

    const selectPickerOpen = () => {
      ImagePicker.openPicker(paramsPicker)
        .then((res) => {
          if (res) {
            console.log('图片选择上传ios', res);
            if (userStore.userInfoDetail.business?.id && userStore.userInfoDetail.id) {
              uploadFilesStore.addPublicFile(res, userStore.userInfoDetail.business.id, userStore.userInfoDetail.id);
              navigation.navigate('UploadFile');
            }
          }
        })
        .catch(() => {
          baseView.current?.showToast({ text: '取消图片选择', delay: 2 });
        });
    };

    const selectVideoOpen = () => {
      ImagePicker.openPicker(paramsVideo)
        .then((res) => {
          if (res) {
            if (userStore.userInfoDetail.business?.id && userStore.userInfoDetail.id) {
              uploadFilesStore.addPublicFile(res, userStore.userInfoDetail.business.id, userStore.userInfoDetail.id);
              navigation.navigate('UploadFile');
            }
          }
        })
        .catch(() => {
          baseView.current?.showToast({ text: '取消图片选择', delay: 2 });
        });
    };

    const createFiler = (url, destPath, name) => {
      const makeDir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalStorageDirectoryPath;
      RNFS.mkdir(makeDir + '/xueyue-temp-file').then(() => {
        console.log('create success');
        RNFS.copyFile(url, destPath).then(() => {
          RNFS.stat(destPath).then((fileResult) => {
            const filePath = fileResult.path;
            if (filePath) {
              if (userStore.userInfoDetail.business?.id && userStore.userInfoDetail.id) {
                uploadFilesStore.addPublicFile(filePath, userStore.userInfoDetail.business.id, userStore.userInfoDetail.id, name);
                navigation.navigate('UploadFile');
              }
            }
          });
        });
      });
    };

    const selectAudioOpen = async () => {
      if (Platform.OS === 'ios') {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.audio]
          });
          console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
          );
          console.log(res.uri, 1);
          let appName = res.uri.split('/').pop();
          let filterName: string = appName ? decodeURI(appName?.split('.')[0]) : '';
          const exeName = '.' + res.name?.split('.').pop();
          const fileName = `${new Date().getTime()}.${res.name?.split('.').pop()}`;
          let urlFile = res.uri.substring(0, res.uri.lastIndexOf('/'));
          RNFS.readDir(urlFile)
            .then((resBoy) => {
              const data = resBoy.filter((item) => {
                return item.name === filterName + exeName;
              })[0];
              if (userStore.userInfoDetail.business?.id && userStore.userInfoDetail.id) {
                uploadFilesStore.addPublicFile(data.path, userStore.userInfoDetail.business.id, userStore.userInfoDetail.id, fileName);
                navigation.navigate('UploadFile');
              }
            })
            .catch((err) => {
              console.log(err, 3);
            });
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
      } else {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.audio]
          });
          console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
          );
          // content://media/external/audio/media/227165 audio/mpeg Sevenn Vitas - 7th Element (Sevenn Remix).mp3 10403895
          // content://com.android.providers.media.documents/document/audio%3A351814 audio/mpeg 有一种爱叫做放手 10555756
          console.log(res.name?.split('.').length, '名字长度');
          const destPath = `file://${RNFS.ExternalStorageDirectoryPath}/xueyue-temp-file/${
            res.name?.split('.').length > 1 ? new Date().getTime() + '.' + res.name.split('.').pop() : res.name + '.mp3'
          }`;
          RNFS.readFileAssets('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file')
            .then((tempRes) => {
              console.log(tempRes, '有这个文件夹');
              createFiler(res.uri, destPath, res.name);
            })
            .catch((tempErr) => {
              console.log(tempErr, '没有这个文件夹');
              createFiler(res.uri, destPath, res.name);
            });
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
      }
    };

    const selectWordOpen = async () => {
      if (Platform.OS === 'ios') {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pptx, DocumentPicker.types.ppt, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.pdf]
          });
          console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
          );
          console.log(res.uri, 1);
          let appName = res.uri.split('/').pop();
          let filterName: string = appName ? decodeURI(appName?.split('.')[0]) : '';
          const exeName = '.' + res.name?.split('.').pop();
          const fileName = `${new Date().getTime()}.${res.name?.split('.').pop()}`;
          let urlFile = res.uri.substring(0, res.uri.lastIndexOf('/'));
          RNFS.readDir(urlFile)
            .then((resBoy) => {
              const data = resBoy.filter((item) => {
                return item.name === filterName + exeName;
              })[0];
              if (userStore.userInfoDetail.business?.id && userStore.userInfoDetail.id) {
                uploadFilesStore.addPublicFile(data.path, userStore.userInfoDetail.business.id, userStore.userInfoDetail.id, fileName);
                navigation.navigate('UploadFile');
              }
            })
            .catch((err) => {
              console.log(err, 3);
            });
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
      } else {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pptx, DocumentPicker.types.ppt, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.pdf]
          });
          console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
          );
          const destPath = `file://${RNFS.ExternalStorageDirectoryPath}/xueyue-temp-file/${new Date().getTime()}.${res.name?.split('.').pop()}`;
          RNFS.readFileAssets('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-temp-file')
            .then((tempRes) => {
              console.log(tempRes, '有这个文件夹');
              createFiler(res.uri, destPath, res.name);
            })
            .catch((tempErr) => {
              console.log(tempErr, '没有这个文件夹');
              createFiler(res.uri, destPath, res.name);
            });
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
        console.log('android文档上传');
      }
    };

    const doThings = async (num: number) => {
      switch (num) {
        case 1:
          setModalVisible(true);
          break;
        case 2:
          menuSheet.current.snapTo(0);
          await selectVideoOpen();
          console.log(num);
          break;
        case 3:
          console.log(num);
          menuSheet.current.snapTo(0);
          await selectAudioOpen();
          break;
        case 4:
          menuSheet.current.snapTo(0);
          await selectWordOpen();
          console.log(num);
          break;
        case 5:
          menuSheet.current.snapTo(0);
          await selectPickerOpen();
          console.log(num);
          break;
        case 6:
          console.log(num);
          break;
        case 7:
          if (select.length > 0) {
            setDelModalVisible(true);
          }
          console.log(num, '准备删除');
          break;
        case 8:
          if (select.length === 1 && cloudSeaDiskStore.allResourcesList.filter((item) => item.id === select[0]).length > 0) {
            setReName(cloudSeaDiskStore.allResourcesList.filter((item) => item.id === select[0])[0].name.split('.')[0]);
            setEditFolderVisible(true);
          } else {
            baseView.current.showToast({ text: '无法同时重命名多个文件', delay: '2' });
          }
          break;
        case 9:
          if (select.length > 0) {
            menuMoreSheet.current.snapTo(1);
          }
          break;
      }
    };
    // https://www.frun.xyz/s/eDx7S
    const createNewFolder = () => {
      cloudSeaDiskStore
        .createNewFolder({ isFolder: true, name: text, parentId: cloudSeaDiskStore.parentId })
        .then(() => {
          cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then(() => {
            setModalVisible(false);
            menuSheet.current.snapTo(0);
          });
        })
        .catch((err) => {
          setModalVisible(false);
          baseView.current.showToast({ text: err, delay: 2 });
        });
    };

    const createNewFile = () => {
      return (
        <Portal>
          <Modal visible={modalVisible} dismissable={true} onDismiss={() => setModalVisible(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.flex1, tw.roundedLg, tw.mX10, { backgroundColor: colors.surface }]}>
              <View style={[tw.p3]}>
                <Text style={[tw.fontLight, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>新建文件夹</Text>
                <TextInput
                  placeholder="新建文件夹"
                  style={[tw.mT3, tw.mX3, tw.bgGray200, tw.borderGray200, { height: 40, borderWidth: 0.5, borderRadius: 5 }]}
                  value={text}
                  onChangeText={(e) => {
                    setText(e);
                  }}
                />
              </View>

              <View style={[tw.mT6, tw.mX1, tw.flexRow, tw.borderGray300, { borderTopWidth: 0.5, height: 50 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                </TouchableOpacity>
                <Text style={[tw.selfCenter, tw.textGray300, { fontSize: 18 }]}>|</Text>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={() => {
                    createNewFolder();
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.accent }]}>创建</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const menuButton = () => {
      return (
        <Animated.View
          style={[
            tw.absolute,
            {
              right: 30,
              bottom: 140,
              opacity: fadeAnim.current
            }
          ]}
        >
          <TouchableOpacity
            style={[tw.bgBlue400, tw.itemsCenter, tw.justifyCenter, { width: 50, height: 50, borderRadius: 50 }]}
            onPress={() => {
              if (eventSize <= 20) {
                menuSheet.current.snapTo(1);
              } else {
                console.log('无任何操作');
              }
            }}
          >
            <Icon name="add" color={colors.background} size={30} />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    const iconButton = (item, index, size, textColor) => {
      return (
        <TouchableOpacity
          key={index}
          style={[tw.m2, tw.itemsCenter, { width: 60, height: 70 }]}
          onPress={async () => {
            await doThings(item.doing);
          }}
        >
          <FastImage source={item.url} style={{ width: size, height: size }} resizeMode={FastImage.resizeMode.contain} />
          <Text style={[tw.mT1, { color: textColor, fontSize: 11 }]}>{item.name}</Text>
        </TouchableOpacity>
      );
    };

    const renderMenuModal = () => {
      return (
        <View style={[tw.p3, { backgroundColor: colors.surface, width: '100%', height: '100%' }]}>
          {/*<Icon name="dehaze" color={colors.disabled} style={[tw.selfCenter]} size={20} />*/}
          <View style={[tw.bgGray300, tw.selfCenter, { borderRadius: 30, width: '10%', height: 7 }]} />
          <View style={[tw.pT2, tw.pB5]}>
            <Text style={[tw.pY2, { fontSize: 13, color: colors.placeholder }]}>- 文件管理 -</Text>
            <View style={[tw.flexGrow, tw.flexRow, tw.justifyBetween, { flexWrap: 'wrap' }]}>
              {[{ name: '新建文件夹', url: require('../assets/folder.png'), doing: 1 }].map((item, index) => {
                return iconButton(item, index, 35, colors.text);
              })}
            </View>
          </View>
          <View style={[]}>
            <Text style={[tw.pY2, { fontSize: 13, color: colors.placeholder }]}>- 资源上传 -</Text>
            <View style={[tw.flexGrow, tw.flexRow, tw.justifyBetween, { flexWrap: 'wrap' }]}>
              {[
                { name: '本地视频', url: require('../assets/video.png'), doing: 2 },
                { name: '本地音乐', url: require('../assets/music.png'), doing: 3 },
                { name: '本地文档', url: require('../assets/note.png'), doing: 4 },
                { name: '本地照片', url: require('../assets/picker.png'), doing: 5 }
              ].map((item, index) => {
                return iconButton(item, index, 35, colors.text);
              })}
            </View>
          </View>
        </View>
      );
    };

    const menuModal = () => {
      return <BottomSheet ref={menuSheet} snapPoints={[0, 400, 300]} borderRadius={20} renderContent={renderMenuModal} />;
    };

    const bottomMenus = () => {
      return (
        <View style={[tw.wFull, tw.flexRow, tw.justifyCenter, { paddingTop: 3, paddingBottom: 150 }, tw.bgBlue500]}>
          <View style={[tw.flexGrow, tw.flexRow, tw.justifyAround]}>
            {[
              // { name: '下载', url: require('../assets/cloudDownload.png'), doing: 6 },
              { name: '删除', url: require('../assets/delete.png'), doing: 7 },
              { name: '重命名', url: require('../assets/reloader.png'), doing: 8 },
              { name: '更多', url: require('../assets/more.png'), doing: 9 }
            ].map((item, index) => {
              return iconButton(item, index, 25, colors.background);
            })}
          </View>
        </View>
      );
    };

    const settingPublicFolder = (isPublic) => {
      setPublicVisible(false);
      menuMoreSheet.current.snapTo(0);
      if (cloudSeaDiskStore.allResourcesList.filter((item) => item.type === 0).length > 0) {
        baseView.current?.showToast({ text: '文件夹无法被设置为共享', delay: 2 });
        return;
      }
      if (select.length < 2) {
        cloudSeaDiskStore.settingOneFolder({ ids: select, isPublic: isPublic }).then((res) => {
          if (typeof res === 'boolean') {
            cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
              if (typeof result === 'boolean') {
                baseView.current.showToast({ text: '修改成功', delay: 2 });
              } else {
                baseView.current.showToast({ text: result, delay: 3 });
              }
            });
          } else {
            baseView.current.showToast({ text: res, delay: 3 });
          }
        });
      } else {
        cloudSeaDiskStore.settingMorePublicFolder({ ids: select, isPublic: isPublic }).then((res) => {
          if (typeof res === 'boolean') {
            cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
              if (typeof result === 'boolean') {
                baseView.current.showToast({ text: '修改成功', delay: 2 });
              } else {
                baseView.current.showToast({ text: result, delay: 3 });
              }
            });
          } else {
            baseView.current.showToast({ text: res, delay: 3 });
          }
        });
      }

      setPublicVisible(false);
      menuMoreSheet.current.snapTo(0);
    };

    const settingPublicModal = () => {
      return (
        <Portal>
          <Modal visible={publicVisible} dismissable={true} onDismiss={() => setPublicVisible(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.flex1, tw.roundedLg, tw.mX10, { backgroundColor: colors.surface }]}>
              <View style={[tw.p3]}>
                <Text style={[tw.fontLight, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>请确认设置文件夹</Text>
                {select.map((item, index) => {
                  if (cloudSeaDiskStore.allResourcesList.filter((tip) => tip.id === item).length > 0) {
                    return (
                      <Text key={index} style={[{ fontSize: 12, color: colors.accent }]}>
                        《{cloudSeaDiskStore.allResourcesList.filter((tip) => tip.id === item)[0].name}》{index === select.length - 1 ? null : '、'}
                      </Text>
                    );
                  }
                })}
              </View>

              <View style={[tw.mT6, tw.mX1, tw.flexRow, tw.borderGray300, { borderTopWidth: 0.5, height: 50 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={async () => {
                    await settingPublicFolder(true);
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>共享</Text>
                </TouchableOpacity>
                <Text style={[tw.selfCenter, tw.textGray300, { fontSize: 18 }]}>|</Text>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={async () => {
                    await settingPublicFolder(false);
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.accent }]}>私有</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderMenuSheetOut = () => {
      menuMoreSheet.current.snapTo(0);
    };

    const renderMenuSheet = () => {
      return (
        <View style={[tw.pY4, { backgroundColor: colors.surface, width: '100%', height: '100%' }]}>
          <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter, tw.pX6, tw.pB3, { borderBottomWidth: 0.5, height: 60 }]}>
            <View style={[tw.flexRow, tw.itemsCenter, tw.borderGray300]}>
              <Icon name="folder" color={colors.accent} size={30} style={[tw.bgGray200, tw.p1, { borderRadius: 8 }]} />
              {select.length > 0 && cloudSeaDiskStore.allResourcesList.length > 0 ? (
                cloudSeaDiskStore.allResourcesList.filter((item) => item.id === select[0]).length > 0 ? (
                  <Text style={[tw.mL4, { fontSize: 14 }]}>
                    {select.length > 1
                      ? '《' + cloudSeaDiskStore.allResourcesList.filter((item) => item.id === select[0])[0].name + '》等' + select.length + '个文件'
                      : cloudSeaDiskStore.allResourcesList.filter((item) => item.id === select[0])[0].name}
                  </Text>
                ) : null
              ) : null}
            </View>
            <TouchableOpacity
              style={[tw.itemsCenter, tw.justifyCenter, { width: 30, height: 30 }]}
              onPress={() => {
                renderMenuSheetOut();
              }}
            >
              <Icon name="close" color={colors.disabled} size={22} />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableHighlight
              underlayColor={colors.background}
              style={[{ paddingLeft: 15 }]}
              onPress={() => {
                if (select.length > 0) {
                  cloudSeaDiskStore.selects = select;
                  menuMoreSheet.current.snapTo(0);
                  setSelect([]);
                  navigation.navigate('MoveFolderSelect');
                } else {
                  baseView.current?.showToast({ text: '请选择文件夹', delay: 2 });
                }
              }}
              activeOpacity={6}
            >
              <View style={[tw.flexRow, tw.itemsCenter, { height: 70 }]}>
                <Icon name="exit-to-app" color={colors.placeholder} size={20} style={[tw.p1, { borderRadius: 8 }]} />
                <Text>移动</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={colors.background}
              style={[{ paddingLeft: 15 }]}
              onPress={() => {
                if (cloudSeaDiskStore.allResourcesList.filter((item) => item.type === 0).length > 0) {
                  baseView.current?.showToast({ text: '文件夹无法被设置为共享', delay: 2 });
                  menuMoreSheet.current.snapTo(0);
                  return;
                }
                setPublicVisible(true);
              }}
              activeOpacity={6}
            >
              <View style={[tw.flexRow, tw.itemsCenter, { height: 70 }]}>
                <Icon name="timeline" color={colors.placeholder} size={20} style={[tw.p1, { borderRadius: 8 }]} />
                <Text>设置为共享或私有</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      );
    };

    const menuMore = () => {
      return <BottomSheet ref={menuMoreSheet} snapPoints={[0, 300, 100]} borderRadius={20} renderContent={renderMenuSheet} />;
    };

    const currentCheckPublic = (bool: boolean) => {
      setOrderPublic(false);
      setCheckPublic(bool);
    };

    const currentOrderPublic = (bool: boolean) => {
      setCheckPublic(false);
      setOrderPublic(bool);
    };

    let canAdd = true;
    const loadAddData = () => {
      if (canAdd) {
        canAdd = false;
        if (cloudSeaDiskStore.allResourcesList.length % 10 === 0) {
          cloudSeaDiskStore
            .addAccessToPublicResources({
              current: cloudSeaDiskStore.allResourcesList.length,
              parentId: cloudSeaDiskStore.parentId,
              isAdd: true
            })
            .then(() => {
              canAdd = true;
            });
        }
      }
    };

    const deleteFolder = () => {
      if (select.length > 1) {
        cloudSeaDiskStore.deleteMoreFolder({ ids: select }).then((res) => {
          if (typeof res === 'boolean') {
            cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
              if (typeof result === 'boolean') {
                setSelect([]);
                baseView.current.showToast({ text: '删除成功', delay: 2 });
              } else {
                baseView.current.showToast({ text: res, delay: 3 });
              }
            });
          } else {
            baseView.current.showToast({ text: res, delay: 3 });
          }
        });
      } else {
        cloudSeaDiskStore.deleteOneFolder({ id: select[0] }).then((res) => {
          if (typeof res === 'boolean') {
            cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
              if (typeof result === 'boolean') {
                setSelect([]);
                baseView.current.showToast({ text: '删除成功', delay: 2 });
              } else {
                baseView.current.showToast({ text: res, delay: 3 });
              }
            });
          } else {
            baseView.current.showToast({ text: res, delay: 3 });
          }
        });
      }
    };

    const deleteFolderModal = () => {
      return (
        <Portal>
          <Modal visible={delModalVisible} dismissable={true} onDismiss={() => setDelModalVisible(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.flex1, tw.roundedLg, tw.mX10, { backgroundColor: colors.surface }]}>
              <View style={[tw.p3]}>
                <Text style={[tw.fontLight, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>请确认删除文件</Text>
                {select.map((item, index) => {
                  if (cloudSeaDiskStore.allResourcesList.filter((tip) => tip.id === item).length > 0) {
                    return (
                      <Text key={index} style={[{ fontSize: 12, color: colors.accent }]}>
                        《{cloudSeaDiskStore.allResourcesList.filter((tip) => tip.id === item)[0].name}》{index === select.length - 1 ? null : '、'}
                      </Text>
                    );
                  }
                })}
              </View>

              <View style={[tw.mT6, tw.mX1, tw.flexRow, tw.borderGray300, { borderTopWidth: 0.5, height: 50 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={() => {
                    setDelModalVisible(false);
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                </TouchableOpacity>
                <Text style={[tw.selfCenter, tw.textGray300, { fontSize: 18 }]}>|</Text>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={() => {
                    setDelModalVisible(false);
                    deleteFolder();
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.accent }]}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const editFolderOneName = () => {
      if (reName.trim().length > 0) {
        cloudSeaDiskStore.editFolderName({ id: select[0], name: reName }).then((res) => {
          if (typeof res === 'boolean') {
            cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
              if (typeof result === 'boolean') {
                setEditFolderVisible(false);
                baseView.current.showToast({ text: '修改成功', delay: '2' });
              }
            });
          } else {
            setEditFolderVisible(false);
            baseView.current.showToast({ text: res, delay: '2' });
          }
        });
      }
    };

    // const editFolderName = () => {
    //   return (
    //     <Portal>
    //       <Modal
    //         visible={editFolderVisible}
    //         dismissable={true}
    //         onDismiss={() => setEditFolderVisible(false)}
    //         contentContainerStyle={[tw.flexRow, tw.absolute, { bottom: 0 }]}
    //       >
    //         <View style={[tw.flex1, tw.mX0, { height: 135, backgroundColor: colors.background, borderTopRightRadiusRadius: 8 }]}>
    //           <KeyboardAccessoryView alwaysVisible={editing} style={[tw.flex1]}>
    //             <View style={[tw.mT2, tw.flexRow, tw.justifyBetween, tw.pX3, tw.itemsCenter]}>
    //               <TouchableOpacity
    //                 style={[tw.p2]}z
    //                 onPress={() => {
    //                   setEditFolderVisible(false);
    //                 }}
    //               >
    //                 <Text style={[{ fontSize: 13, color: colors.disabled }]}>取消</Text>
    //               </TouchableOpacity>
    //               <Text style={[{ fontSize: 15, color: colors.text, fontWeight: 'bold' }]}>重命名</Text>
    //               <TouchableOpacity
    //                 style={[tw.p2]}
    //                 onPress={() => {
    //                   editFolderOneName();
    //                 }}
    //               >
    //                 <Text style={[{ fontSize: 13, color: colors.accent }]}>确定</Text>
    //               </TouchableOpacity>
    //             </View>
    //             <TextInput
    //               placeholder="重命名"
    //               keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
    //               defaultValue={reName}
    //               onFocus={() => setEditing(true)}
    //               onEndEditing={() => setEditing(false)}
    //               onBlur={() => setEditing(false)}
    //               style={[tw.mT3, tw.mX4, tw.pL3, tw.bgGray200, tw.borderGray200, { height: 50, borderWidth: 0.5, borderRadius: 5 }]}
    //               onChangeText={(e) => {
    //                 setReName(e);
    //               }}
    //             />
    //           </KeyboardAccessoryView>
    //         </View>
    //         {/*  <TextInput*/}
    //         {/*    ref={(ref) => (imInputRef.current = ref)}*/}
    //         {/*    // style={[tw.mX3, tw.borderGray200, tw.bgGray200, tw.pX2, { height: 50, borderWidth: 0.5, borderRadius: 5 }]}*/}
    //         {/*    style={[tw.mT3, tw.mX4, tw.bgGray200, tw.borderGray200, { height: 50, borderWidth: 0.5, borderRadius: 5 }]}*/}
    //         {/*    returnKeyType={'send'}*/}
    //         {/*    placeholder={'说点什么吧'}*/}
    //         {/*    defaultValue={reName}*/}
    //         {/*    onFocus={() => setEditing(true)}*/}
    //         {/*    onEndEditing={() => setEditing(false)}*/}
    //         {/*    onBlur={() => setEditing(false)}*/}
    //         {/*    multiline={false}*/}
    //         {/*    numberOfLines={1}*/}
    //         {/*    maxLength={50}*/}
    //         {/*    onChangeText={(e) => {*/}
    //         {/*      setReName(e);*/}
    //         {/*    }}*/}
    //         {/*  />*/}
    //         {/*</KeyboardAccessoryView>*/}
    //       </Modal>
    //     </Portal>
    //   );
    // };

    const editFolderName = () => {
      return (
        <Portal>
          <Modal
            visible={editFolderVisible}
            dismissable={true}
            onDismiss={() => {
              setEditFolderVisible(false);
              setModalHeight(400);
            }}
            contentContainerStyle={[tw.flexRow, tw.absolute, { bottom: isIos ? modalHeight - 660 : 0 }]}
          >
            <View
              style={[
                tw.flex1,
                tw.mX0,
                tw.pY2,
                { height: isIos ? modalHeight : 140, backgroundColor: colors.surface, borderTopLeftRadius: 12, borderTopRightRadius: 12 }
              ]}
            >
              <View style={[tw.flexRow, tw.justifyBetween, tw.pX3, tw.itemsCenter]}>
                <TouchableOpacity
                  style={[tw.p2]}
                  onPress={() => {
                    setEditFolderVisible(false);
                  }}
                >
                  <Text style={[{ fontSize: 13, color: colors.disabled }]}>取消</Text>
                </TouchableOpacity>
                <Text style={[{ fontSize: 15, color: colors.text, fontWeight: 'bold' }]}>重命名</Text>
                <TouchableOpacity
                  style={[tw.p2]}
                  onPress={() => {
                    editFolderOneName();
                  }}
                >
                  <Text style={[{ fontSize: 13, color: colors.accent }]}>确定</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="重命名"
                keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
                defaultValue={reName}
                onFocus={() => {
                  if (isIos) {
                    if (Dimensions.get('window').height > 1000) {
                      setModalHeight(600);
                    } else {
                      setModalHeight(570);
                    }
                  }
                }}
                onBlur={() => {
                  if (isIos) {
                    setModalHeight(400);
                  }
                }}
                style={[tw.mT3, tw.pX2, tw.mX4, tw.bgGray200, tw.borderGray200, { height: 50, borderWidth: 0.5, borderRadius: 5 }]}
                onChangeText={(e) => {
                  setReName(e);
                }}
              />
            </View>
          </Modal>
        </Portal>
      );
    };

    const onRefresh = async () => {
      await setRefreshing(true);
      setTimeout(async () => {
        await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId });
        await setRefreshing(false);
      }, 1500);
    };

    const renderItem = ({ item, index }) => {
      return (
        <DiskFolder
          key={index}
          data={item}
          index={index}
          select={select}
          givePress={(id, name, type) => {
            doEnyThings(id, name, type);
          }}
          useSelect={true}
          changeSelect={(e: string) => {
            if (select.filter((msg) => msg === e).length > 0) {
              let changeIndex = select.indexOf(e);
              select.splice(changeIndex, 1);
              renderMenuSheetOut();
              setSelect([...select]);
            } else {
              setSelect([e, ...select]);
            }
          }}
        />
      );
    };

    const handleSearch = () => {
      setCurrentInput(true);
    };

    const handleBlur = () => {
      setCurrentInput(false);
    };

    const searchFile = async () => {
      if (search.length > 0) {
        await cloudSeaDiskStore.accessToPublicResources({ name: search, searchAllFiles: true, current: 1 }).then((res) => {
          if (typeof res === 'boolean') {
            console.log('更新视图');
          }
        });
      } else {
        await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId });
      }
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <View style={[checkPublic ? tw.p1 : tw.p0, tw.flexRow, tw.justifyBetween, { height: checkPublic ? 40 : 0, backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, { backgroundColor: colors.background, borderRadius: 3 }]}
              onPress={async () => {
                cloudSeaDiskStore.isPublic = false;
                cloudSeaDiskStore.parentId = '0';
                await cloudSeaDiskStore.accessToPublicResources({ current: 1 }).then((res) => {
                  if (typeof res === 'boolean') {
                    console.log('更新视图');
                  }
                });
              }}
            >
              <Text style={[{ fontSize: checkPublic ? 12 : 0, color: !cloudSeaDiskStore.isPublic ? colors.accent : colors.text, fontWeight: 'bold' }]}>
                个人资源
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.mL2, { backgroundColor: colors.background, borderRadius: 3 }]}
              onPress={async () => {
                cloudSeaDiskStore.isPublic = true;
                cloudSeaDiskStore.parentId = '0';
                setFolderListAll([]);
                setSelect([]);
                cloudSeaDiskStore.allResourcesAllList = [];
                cloudSeaDiskStore.allResourcesList = [];
                await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((res) => {
                  if (typeof res === 'boolean') {
                    console.log('更新视图');
                  }
                });
              }}
            >
              <Text style={[{ fontSize: checkPublic ? 12 : 0, color: cloudSeaDiskStore.isPublic ? colors.accent : colors.text, fontWeight: 'bold' }]}>
                共享资源
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[orderPublic ? tw.p1 : tw.p0, tw.flexRow, tw.justifyBetween, { height: orderPublic ? 40 : 0, backgroundColor: colors.surface }]}>
            {cloudSeaDiskStore.orderList.slice().map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[tw.flex1, tw.itemsCenter, tw.mX1, tw.justifyCenter, { backgroundColor: colors.background, borderRadius: 3 }]}
                  onPress={async () => {
                    cloudSeaDiskStore.isOrder = index;
                    await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((res) => {
                      if (typeof res === 'boolean') {
                        console.log('更新视图');
                      }
                    });
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: orderPublic ? 14 : 0,
                        color: cloudSeaDiskStore.isOrder === index ? colors.accent : colors.text,
                        fontWeight: 'bold'
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {cloudSeaDiskStore.parentId === '0' ? (
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, tw.textCenter, tw.pX2, tw.pT2]}>
              <TouchableOpacity
                style={[
                  tw.flex1,
                  tw.flexRow,
                  tw.itemsCenter,
                  tw.roundedFull,
                  tw.pX3,
                  { height: 32, backgroundColor: colors.surface, borderColor: colors.disabled }
                ]}
                onPress={handleSearch}
              >
                <Icon name="search" color={colors.placeholder} size={15} />

                {currentInput ? (
                  <TextInput
                    autoFocus
                    onBlur={() => {
                      handleBlur();
                    }}
                    defaultValue={search}
                    style={[tw.flex1, tw.mL2, tw.p0, { fontSize: 13 }]}
                    onChangeText={(e) => {
                      setSearch(e);
                    }}
                    onSubmitEditing={async () => {
                      await searchFile();
                    }}
                  />
                ) : (
                  <View style={[tw.w48, tw.mL2, tw.hFull, tw.itemsStart, tw.justifyCenter]}>
                    <Text style={[tw.textXs, { color: colors.placeholder }]} numberOfLines={1}>
                      {search ? search : '搜索云盘资源'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await searchFile();
                }}
                style={[tw.bgBlue500, tw.itemsCenter, tw.flexRow, tw.itemsCenter, tw.mX2, tw.hFull, tw.pX2, { borderRadius: 20 }]}
              >
                <View style={[]}>
                  <Text style={[tw.textWhite, { fontSize: 13 }]}>搜索</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[tw.p1, tw.flexRow, tw.justifyBetween, { height: 40, backgroundColor: colors.surface }]}>
              <ScrollView style={[]} keyboardDismissMode="on-drag" horizontal showsHorizontalScrollIndicator={false}>
                <View style={[tw.flexRow]}>
                  {cloudSeaDiskStore.fileTypes.slice().map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[tw.flex1, tw.itemsCenter, tw.mX1, tw.pX2, tw.justifyCenter, { backgroundColor: colors.background, borderRadius: 3 }]}
                        onPress={async () => {
                          cloudSeaDiskStore.isType = index;
                          console.log(cloudSeaDiskStore.isType);
                          await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((res) => {
                            if (typeof res === 'boolean') {
                              console.log('更新视图');
                            }
                          });
                        }}
                      >
                        <Text
                          style={[
                            {
                              fontSize: 14,
                              color: cloudSeaDiskStore.isType === index ? colors.accent : colors.text
                            }
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          <View style={[tw.mT2, tw.flexRow, tw.justifyBetween, tw.itemsCenter, tw.pB3, tw.pX2]}>
            <Text numberOfLines={2} style={[{ color: colors.placeholder, width: '70%' }]}>
              {t('selectVodPage.cloudFolder')}
              {folderListAll?.map((item) => {
                return `>${item.name}`;
              })}
            </Text>
            {folderListAll.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSelect([]);
                  if (cloudSeaDiskStore.allResourcesAllList.length > 1) {
                    cloudSeaDiskStore.parentId = cloudSeaDiskStore.allResourcesAllList[cloudSeaDiskStore.allResourcesAllList.length - 2].id;
                    cloudSeaDiskStore.allResourcesList = cloudSeaDiskStore.allResourcesAllList[cloudSeaDiskStore.allResourcesAllList.length - 1].list;
                  } else {
                    cloudSeaDiskStore.allResourcesList = cloudSeaDiskStore.allResourcesAllList[0].list;
                    cloudSeaDiskStore.parentId = '0';
                  }
                  if (cloudSeaDiskStore.allResourcesAllList.length > 0) {
                    cloudSeaDiskStore.allResourcesAllList.pop();
                  }
                }}
                style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter]}
              >
                <Icon name="reply" color={colors.notification7} size={18} />
                <Text style={[{ color: colors.notification7 }]}> {t('selectVodPage.return')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            style={[tw.flex1, tw.pX1]}
            scrollEnabled={true}
            data={cloudSeaDiskStore.allResourcesList}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            numColumns={1}
            onScroll={(event) => {
              setEventSize(Math.ceil(event.nativeEvent.contentOffset.y));
            }}
            renderItem={renderItem}
            onEndReached={loadAddData}
            onEndReachedThreshold={0.1}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={
              <View style={[tw.itemsCenter, { marginBottom: widthThanHeight ? 60 : 0 }]}>
                {cloudSeaDiskStore.allResourcesList.slice().length === 0 ? (
                  <Text style={[tw.mT16, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>文件夹为空</Text>
                ) : (
                  <Text style={[tw.mY3, { fontSize: 12, color: colors.disabled }]}>云海学悦保障您的数据安全</Text>
                )}
              </View>
            }
          />
          <Animated.View
            style={[
              {
                height: isIos ? 150 : 135,
                marginBottom: isWave ? 0 : -35,
                transform: [{ translateX: translateValue.current.x }, { translateY: translateValue.current.y }]
              }
            ]}
          >
            {bottomMenus()}
          </Animated.View>
        </View>
      );
    };
    const renderImagePreview = () => {
      return <ImageView images={imagePath} imageIndex={0} visible={imageVisible} onRequestClose={() => setImageVisible(false)} />;
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[tw.justifyBetween, tw.flexRow, tw.mX3, { backgroundColor: colors.background }]}>
          <View style={[tw.flexRow]}>
            <TouchableOpacity
              style={[tw.flexRow, tw.itemsCenter]}
              onPress={() => {
                if (checkPublic) {
                  currentCheckPublic(false);
                } else {
                  currentCheckPublic(true);
                }
              }}
            >
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={[tw.selfCenter, { fontSize: 18, fontWeight: 'bold', color: colors.text }]}>
                  {cloudSeaDiskStore.isPublic ? '共享文件' : '个人文件'}
                </Text>
                <Icon color={colors.text} name={checkPublic ? 'arrow-drop-down' : 'arrow-drop-up'} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[tw.flexRow, tw.itemsCenter, tw.mL2]}
              onPress={() => {
                if (orderPublic) {
                  currentOrderPublic(false);
                } else {
                  currentOrderPublic(true);
                }
              }}
            >
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={[tw.selfCenter, { fontSize: 18, fontWeight: 'bold', color: colors.text }]}>排序</Text>
                <Icon color={colors.text} name={orderPublic ? 'arrow-drop-down' : 'arrow-drop-up'} size={20} />
              </View>
            </TouchableOpacity>
          </View>

          <Portal>
            <Animated.View style={[tw.absolute, { height: checkPublic ? 100 : 0, opacity: fadeTypeAnim.current, top: isIos ? 100 : 50 }]}>
              <View style={[tw.flex1, tw.justifyBetween, checkPublic ? tw.p2 : tw.p0, { borderRadius: 3, backgroundColor: colors.surface }]}>
                <TouchableOpacity
                  style={[
                    tw.flex1,
                    tw.pX2,
                    checkPublic ? tw.pY3 : tw.pY0,
                    tw.itemsCenter,
                    tw.justifyCenter,
                    { backgroundColor: colors.background, borderRadius: 3 }
                  ]}
                  onPress={async () => {
                    cloudSeaDiskStore.isPublic = false;
                    await cloudSeaDiskStore.accessToPublicResources({ current: 1 }).then((res) => {
                      if (typeof res === 'boolean') {
                        console.log('更新视图');
                      }
                    });
                  }}
                >
                  <Text style={[{ fontSize: checkPublic ? 12 : 0, color: !cloudSeaDiskStore.isPublic ? colors.accent : colors.text, fontWeight: 'bold' }]}>
                    私有资源
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw.flex1,
                    tw.pX2,
                    checkPublic ? tw.pY3 : tw.pY0,
                    tw.itemsCenter,
                    tw.justifyCenter,
                    { backgroundColor: colors.background, borderRadius: 3 },
                    tw.mT2
                  ]}
                  onPress={async () => {
                    cloudSeaDiskStore.isPublic = true;
                    cloudSeaDiskStore.parentId = '0';
                    setFolderListAll([]);
                    setSelect([]);
                    cloudSeaDiskStore.allResourcesAllList = [];
                    cloudSeaDiskStore.allResourcesList = [];
                    await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((res) => {
                      if (typeof res === 'boolean') {
                        console.log('更新视图');
                      }
                    });
                  }}
                >
                  <Text style={[{ fontSize: checkPublic ? 12 : 0, color: cloudSeaDiskStore.isPublic ? colors.accent : colors.text, fontWeight: 'bold' }]}>
                    共享资源
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Portal>
          <Portal>
            <Animated.View style={[tw.absolute, { height: orderPublic ? 'auto' : 0, top: isIos ? 100 : 50, left: 70, opacity: fadeOrderAnim.current }]}>
              <View style={[tw.flex1, tw.justifyBetween, orderPublic ? tw.p2 : tw.p0, { borderRadius: 3, backgroundColor: colors.surface }]}>
                {cloudSeaDiskStore.orderList.slice().map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        tw.flex1,
                        orderPublic ? tw.p2 : tw.p0,
                        index === cloudSeaDiskStore.orderList.length - 1 ? tw.mB0 : tw.mB1,
                        tw.itemsCenter,
                        tw.justifyCenter,
                        { backgroundColor: colors.background, borderRadius: 3 }
                      ]}
                      onPress={async () => {
                        cloudSeaDiskStore.isOrder = index;
                        await cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((res) => {
                          if (typeof res === 'boolean') {
                            console.log('更新视图');
                          }
                        });
                      }}
                    >
                      <Text
                        style={[
                          { fontSize: orderPublic ? 12 : 0, color: cloudSeaDiskStore.isOrder === index ? colors.accent : colors.text, fontWeight: 'bold' }
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </Portal>
        </Appbar.Header>
        {renderContent()}
        {menuButton()}
        {menuMore()}
        {menuModal()}
        {createNewFile()}
        {deleteFolderModal()}
        {editFolderName()}
        {settingPublicModal()}
        {renderImagePreview()}
        {/*<Button*/}
        {/*  onPress={async () => {*/}
        {/*    await uploadFilesStore.removeOssConfig();*/}
        {/*  }}*/}
        {/*>*/}
        {/*  删除*/}
        {/*</Button>*/}
      </BaseView>
    );
  }
);
