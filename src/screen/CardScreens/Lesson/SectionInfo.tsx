import React, { useRef, useState } from 'react';
import { Appbar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../index';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { getFileSize } from '../../../common/tools';
import { useStore } from '../../../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import { RNVoiceRecorder } from 'react-native-voice-recorder';
import ImageView from 'react-native-image-viewing';

export type ClassTypes = {
  type: number;
  name: string;
};
type Props = {};

export const SectionInfo: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { createVodStore, cloudSeaDiskStore, uploadFilesStore } = useStore();
    const [imageVisible, setImageVisible] = useState(false);
    const [imagePath, setImagePath] = useState<ImageSource[]>([]);

    const selectIcon = (type?: number): string => {
      switch (type) {
        case 0:
          return 'folder';
        case 1:
          return 'radio';
        case 2:
          return 'live-tv';
        case 3:
          return 'live-tv';
        default:
          return 'text-snippet';
      }
    };

    const addVodFile = () => {
      cloudSeaDiskStore.isEditVoidInfo = true;
      navigation.navigate('CloudSeaDisk');
    };
    const renderImagePreview = () => {
      return <ImageView images={imagePath} imageIndex={0} visible={imageVisible} onRequestClose={() => setImageVisible(false)} />;
    };

    const delScheduleList = (num: number) => {
      if (cloudSeaDiskStore.selectSessionIndex !== undefined) {
        if (cloudSeaDiskStore.isEditPage) {
          createVodStore.draftVodInfo.splice(num, 1);
          createVodStore.draftVodInfo = createVodStore.draftVodInfo.slice();
          if (createVodStore.lessonDetails?.schedules) {
            createVodStore.lessonDetails.schedules[cloudSeaDiskStore.selectSessionIndex].resourceFiles = createVodStore.draftVodInfo;
          }
        } else {
          createVodStore.sectionVodInfo[cloudSeaDiskStore.selectSessionIndex].resourceFiles?.splice(num, 1);
          createVodStore.sectionVodInfo = createVodStore.sectionVodInfo.slice();
        }
      }
    };

    const doEnyThings = (id, name, type) => {
      console.log(id, name, type);
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
          // 音频播放方案一 RNVoiceRecorder
          uploadFilesStore.getPublicFilePath(id).then((res) => {
            console.log(res);
            RNVoiceRecorder.Play({
              path: res,
              format: 'wav',
              onDone: (path) => {
                console.log('play done: ' + path);
              },
              onCancel: () => {
                console.log('play cancelled');
              }
            });
          });
          break;
        case 3:
          uploadFilesStore.getPublicFilePath(id).then((res) => {
            if (res) {
              navigation.navigate('Main', { screen: 'HomeworkVideoPlayback', params: { url: res } });
            }
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

    const renderContent = () => {
      return (
        <ScrollView style={[tw.flex1, tw.pX3]}>
          {cloudSeaDiskStore.selectSessionIndex !== undefined &&
            (cloudSeaDiskStore.isEditPage
              ? createVodStore.draftVodInfo
              : createVodStore.sectionVodInfo[cloudSeaDiskStore.selectSessionIndex].resourceFiles
            )?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[tw.flexRow, tw.pY3, tw.itemsCenter, tw.justifyBetween, tw.pX4, tw.borderGray300, { borderBottomWidth: 0.5 }]}
                onPress={() => {
                  doEnyThings(item.resourceId, item.name, item.resourceType);
                }}
              >
                <View style={[tw.flexRow, tw.itemsCenter]}>
                  <View style={[tw.p2, tw.borderGray300, { borderWidth: 0.17 }]}>
                    <Icon name={selectIcon(item.type)} color={colors.accent} size={22} />
                  </View>

                  <View style={[tw.mL4]}>
                    <View style={[tw.flexRow]}>
                      <Text ellipsizeMode="middle" numberOfLines={1} style={[{ fontSize: 14, color: colors.text, width: 150 }]}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={[tw.flexRow]}>
                      {item?.fileSize ? (
                        <Text style={[tw.mT1, { fontSize: 10, color: colors.disabled }]}>{getFileSize(item?.fileSize)}</Text>
                      ) : (
                        <Text style={[tw.mT1, { fontSize: 10, color: colors.disabled }]}>{}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <Icon
                  size={26}
                  color={colors.disabled}
                  onPress={() => {
                    delScheduleList(index);
                  }}
                  name="remove-circle"
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      );
    };
    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[tw.justifyCenter, tw.flexRow, tw.mX3, { backgroundColor: colors.background }]}>
          <Text
            style={[tw.absolute, { left: 0, fontSize: 16, color: colors.placeholder }]}
            onPress={() => {
              navigation.goBack();
            }}
          >
            返回
          </Text>
          <Text style={[tw.selfCenter, { fontSize: 18, fontWeight: 'bold', color: colors.text }]}>资源详情</Text>
          <Text
            style={[tw.absolute, { right: 0, fontSize: 16, color: colors.placeholder }]}
            onPress={() => {
              addVodFile();
            }}
          >
            添加
          </Text>
        </Appbar.Header>
        {renderContent()}
        {renderImagePreview()}
      </BaseView>
    );
  }
);
