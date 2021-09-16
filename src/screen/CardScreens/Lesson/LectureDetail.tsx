import React, { useEffect, useRef, useState } from 'react';
import { Appbar, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../../../store';

import { observer } from 'mobx-react-lite';
import { AUDIO, EXCEL_DOCUMENT, FOLDER, OTHER, PDF_DOCUMENT, PICTURE, PPT_DOCUMENT, VIDEO, WORD_DOCUMENT } from '../../../common/status-module';
import { Linking, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GetIconOfFiles } from '../../../component/GetIconOfFiles';
import { ResourceFilesType } from '../../../store/CreateVodStore';
import ImageView from 'react-native-image-viewing';
import { RSA } from 'react-native-rsa-native';

type ScreenRouteProp = RouteProp<ScreensParamList, 'LectureDetail'>;
type Props = {
  route: ScreenRouteProp;
};

export const LectureDetail: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { lessonDetailStore, getOssFilesStore, userStore, userRolesStore } = useStore();
    const [imageVisible, setImageVisible] = useState<boolean>(false);
    const [imagePath, setImagePath] = useState<any>([]);
    const [inputPass, setInputPass] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [currentFile, setCurrentFile] = useState<ResourceFilesType | undefined>(undefined);

    useEffect(() => {
      (async () => {
        const res = await lessonDetailStore.getLectureDetail(route.params.lectureId);
        if (res) {
          console.log(lessonDetailStore.lectureDetail);
        }
      })();
    }, [lessonDetailStore, route.params.lectureId]);

    const getFileType = (type?: number): string => {
      switch (type) {
        case FOLDER:
          return '文件夹';
        case PICTURE:
          return '图片';
        case AUDIO:
          return '音频';
        case VIDEO:
          return '视频';
        case PDF_DOCUMENT:
          return 'PDF文档';
        case WORD_DOCUMENT:
          return 'WORD文档';
        case EXCEL_DOCUMENT:
          return 'EXCEL文档';
        case PPT_DOCUMENT:
          return 'PPT文件';
        case OTHER:
          return '未知文件';
        default:
          return '未知文件';
      }
    };

    const seeFile = (item) => {
      switch (item.resourceType) {
        case FOLDER:
          break;
        case PICTURE:
          setImagePath([{ uri: getOssFilesStore.fileAddress }]);
          setImageVisible(true);
          break;
        case AUDIO:
          console.log(item, '返回的数据');
          navigation.navigate('Main', { screen: 'AudioPlayer', params: { name: item.name, url: getOssFilesStore.fileAddress, back: 'LectureDetail' } });
          break;
        case VIDEO:
          console.log(item, getOssFilesStore.fileAddress);
          navigation.navigate('Main', { screen: 'LessonVideoView', params: { name: item.name, url: getOssFilesStore.fileAddress, back: 'LectureDetail' } });
          break;
        case PDF_DOCUMENT:
        case WORD_DOCUMENT:
        case EXCEL_DOCUMENT:
        case PPT_DOCUMENT:
        case OTHER:
          if (getOssFilesStore.fileAddress) {
            Linking.openURL(getOssFilesStore.fileAddress)
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });
          }
          break;
        default:
          break;
      }
    };

    const renderImagePreview = () => {
      return <ImageView images={imagePath} imageIndex={0} visible={imageVisible} onRequestClose={() => setImageVisible(false)} />;
    };

    const openFile = async (item?: ResourceFilesType, pass?: string) => {
      if (item?.resourceId) {
        const res = await getOssFilesStore.getDemandFileUrl({ password: pass, scheduleId: route.params.lectureId, resourceId: item.resourceId });
        if (typeof res !== 'boolean') {
          baseView.current.showMessage({ text: res, delay: 2 });
        } else {
          seeFile(item);
        }
      }
    };

    const planningOpenFile = async (info?: ResourceFilesType, passwordMsg?: string) => {
      if (info) {
        await openFile(info, passwordMsg);
      } else {
        baseView.current?.showMessage({ text: '未知内容', delay: 2 });
      }
    };

    const inputPassModal = () => {
      return (
        <Portal>
          <Modal visible={inputPass} dismissable={false} contentContainerStyle={[tw.mX10, { borderRadius: 12, backgroundColor: colors.background }]}>
            <Text style={[tw.mT3, tw.mB2, tw.selfCenter, { fontSize: 15, color: colors.placeholder }]}>请输入本节课程的密码</Text>
            <TextInput
              placeholder="输入课程密码"
              style={[tw.mY3, tw.mX3, tw.bgGray200, tw.borderGray200, { height: 40, borderWidth: 0.5, borderRadius: 5 }]}
              value={password}
              onChangeText={(e) => {
                setPassword(e);
              }}
            />
            <View style={[tw.flexRow, tw.justifyBetween, tw.borderGray200, { borderTopWidth: 0.5 }]}>
              <TouchableOpacity
                style={[tw.itemsCenter, tw.flex1, tw.pY3]}
                onPress={() => {
                  setInputPass(false);
                }}
              >
                <Text>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[tw.itemsCenter, tw.flex1, tw.pY3, tw.borderGray200, { borderRightWidth: 0.5 }]}
                onPress={async () => {
                  userStore.getPublicKey().then((result) => {
                    if (result) {
                      RSA.encrypt(password, result).then((resPass) => {
                        planningOpenFile(currentFile, resPass);
                        setInputPass(false);
                      });
                    }
                  });
                }}
              >
                <Text>确认</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderContent = () => {
      return (
        <ScrollView style={[tw.bgGray100]}>
          {lessonDetailStore.lectureDetail?.resourceFiles?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[tw.m1]}
                onPress={async () => {
                  if (lessonDetailStore.lectureDetail?.lesson?.authType === 2) {
                    if (
                      userRolesStore.isTeacherId === userStore.userInfoDetail.id ||
                      userRolesStore.isSecTeacherId.filter((items) => items === userStore.userInfoDetail.id).length > 0
                    ) {
                      const res = await getOssFilesStore.getDemandFileUrl({ scheduleId: route.params.lectureId, resourceId: item.resourceId });
                      if (typeof res !== 'boolean') {
                        baseView.current.showMessage({ text: res, delay: 2 });
                      } else {
                        seeFile(item);
                      }
                    } else {
                      setCurrentFile(item);
                      setInputPass(true);
                    }
                  } else {
                    const res = await getOssFilesStore.getDemandFileUrl({ scheduleId: route.params.lectureId, resourceId: item.resourceId });
                    if (typeof res !== 'boolean') {
                      baseView.current.showMessage({ text: res, delay: 2 });
                    } else {
                      seeFile(item);
                    }
                  }
                }}
              >
                <View
                  style={[tw.flexRow, tw.itemsCenter, tw.pX3, { height: 80, width: '100%', borderRadius: 9, backgroundColor: colors.background }]}
                  key={index}
                >
                  <View style={[tw.bgGray100, tw.itemsCenter, tw.justifyCenter, { height: 60, width: 60, borderRadius: 5 }]}>
                    <GetIconOfFiles type={item.resourceType} size={40} />
                  </View>
                  <View style={[tw.mL2, tw.flex1, tw.justifyBetween, { height: 60 }]}>
                    <View style={[tw.flexRow, tw.justifyBetween]}>
                      <Text style={[tw.justifyCenter, { fontSize: 13, color: colors.placeholder }]}>
                        （{index + 1}）<Text style={[tw.mB2, { fontSize: 14, color: colors.accent }]}>{item?.name}</Text>
                      </Text>
                      {lessonDetailStore.lectureDetail?.lesson?.authType === 2 ? <Icon name="lock" size={18} color={colors.accent} /> : null}
                    </View>
                    <Text style={[tw.mL3, { color: colors.placeholder, fontSize: 12 }]}>-{getFileType(item.resourceType)}-</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <Text style={[tw.selfCenter, tw.mY1, { fontSize: 13, color: colors.placeholder }]}>
            - 共{lessonDetailStore.lectureDetail?.resourceFiles?.length}个文件 -
          </Text>
        </ScrollView>
      );
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title="节次详情" />
        </Appbar.Header>
        {renderContent()}
        {renderImagePreview()}
        {inputPassModal()}
      </BaseView>
    );
  }
);
