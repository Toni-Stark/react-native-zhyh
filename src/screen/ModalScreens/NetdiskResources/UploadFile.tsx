import React, { useCallback, useEffect, useRef } from 'react';
import { Appbar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../index';
import { ScrollView, View } from 'react-native';
import { useStore } from '../../../store';
import { TempFileType } from './UploadFilesStore';
import FastImage from 'react-native-fast-image';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {};

export const UploadFile: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { uploadFilesStore, cloudSeaDiskStore } = useStore();

    const uploadPicker = useCallback(() => {
      uploadFilesStore.parentId = cloudSeaDiskStore.parentId;
      uploadFilesStore.getAsyncOssConfig().then((res) => {
        if (res) {
          uploadFilesStore.uploadProgress = [];
          for (let i = 0; i < uploadFilesStore.temDocuments.length; i++) {
            uploadFilesStore.uploadProgress.push(0);
          }
          if (uploadFilesStore.temDocuments.length > 0) {
            uploadFilesStore.doUploadJob(0, uploadFilesStore.temDocuments, false, true).then((result) => {
              if (typeof result !== 'boolean') {
                if (result.isOver) {
                  console.log(result.message);
                }
              } else {
                // console.log('上传成功');
                // console.log(uploadFilesStore.uploadProgress);
              }
            });
          }
        }
      });
    }, [cloudSeaDiskStore.parentId, uploadFilesStore]);

    useEffect(() => {
      if (uploadFilesStore.temDocuments.length > 0) {
        (async () => {
          await uploadPicker();
        })();
      }
      return () => {
        uploadFilesStore.temDocuments = [];
        uploadFilesStore.currentUpload = 0;
        cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((res) => {
          console.log(res);
        });
      };
    }, [cloudSeaDiskStore, uploadFilesStore, uploadPicker]);

    useEffect(() => {
      baseView.current?.hideLoading();
      switch (uploadFilesStore.uploadError) {
        case '0':
          baseView.current.showMessage({ text: '文件上传失败', delay: 3 });
          break;
        case '1':
          baseView.current.showMessage({ text: '检测到有重名文件，请勿重复上传', delay: 3 });
          break;
        case '2':
          baseView.current.showMessage({ text: '上传成功', delay: 2 });
          break;
      }
    }, [uploadFilesStore.uploadError]);
    useEffect(() => {
      return () => {
        uploadFilesStore.uploadError = null;
      };
    }, [uploadFilesStore]);
    const selectIcon = (data): string => {
      switch (data.type) {
        case 1:
          return 'live-tv';
        case 2:
          return 'radio';
        case 3:
          return 'text-snippet';
        default:
          return 'folder';
      }
    };

    const renderUploading = (data: TempFileType[], progress: number[]) => {
      return (
        <View>
          <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.pX2, { height: 40 }]}>
            <Text style={[{ color: colors.disabled, fontSize: 13 }]}>正在上传（{data.length}）</Text>
            {/*<Button*/}
            {/*  mode="contained"*/}
            {/*  onPress={() => {*/}
            {/*    console.log('全部继续');*/}
            {/*  }}*/}
            {/*  contentStyle={[{ height: 22 }]}*/}
            {/*  labelStyle={[{ fontSize: 12, color: colors.accent }]}*/}
            {/*  style={[tw.bgBlue100, tw.itemsCenter, tw.justifyCenter, { height: 25, borderRadius: 20 }]}*/}
            {/*>*/}
            {/*  全部继续*/}
            {/*</Button>*/}
          </View>
          <View>
            {data?.map((item, index) => {
              return (
                <View style={[tw.flexRow, tw.itemsCenter, tw.p2]} key={index}>
                  <View style={[tw.itemsCenter, tw.justifyCenter, { width: 50, height: 50 }]}>
                    {item.type === 3 || item.type === 1 ? (
                      <FastImage
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: colors.disabled,
                          borderRadius: 4
                        }}
                        source={{ uri: item.path }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <Icon name={selectIcon(item)} color={colors.accent} size={30} />
                    )}
                  </View>

                  <View style={[tw.flex1, tw.justifyBetween]}>
                    <View style={[tw.mX3]}>
                      <Text numberOfLines={1} ellipsizeMode="middle" style={[{ color: colors.text, fontSize: 13 }]}>
                        {item.fileName}
                      </Text>
                    </View>
                    <View style={[tw.flex1]}>
                      <Slider
                        disabled={false}
                        style={[tw.flex1, { borderRadius: 4 }]}
                        value={progress.length > index ? progress[index] : 0}
                        minimumTrackTintColor={colors.accent}
                        maximumTrackTintColor={colors.disabled}
                        thumbTintColor={colors.background}
                      />
                    </View>
                    <View style={[tw.flexRow, tw.justifyBetween, tw.mX3]}>
                      {item.totalSize ? (
                        <Text style={[{ color: colors.disabled, fontSize: 10 }]}>
                          {Number(item.totalSize) > 900000
                            ? (Number(item.totalSize) * 0.000001).toFixed(2) + 'MB'
                            : (Number(item.totalSize) * 0.001).toFixed(2) + 'kb'}
                        </Text>
                      ) : null}
                      {item?.timerOne ? (
                        <Text style={[{ color: colors.disabled, fontSize: 10 }]}>正在上传</Text>
                      ) : (
                        <Text style={[{ color: colors.disabled, fontSize: 10 }]}>上传完成</Text>
                      )}
                    </View>
                  </View>
                  <View>
                    {/*<Icon*/}
                    {/*  style={[tw.bgBlue100, tw.p1, tw.textCenter, { width: 30, height: 30, borderRadius: 20 }]}*/}
                    {/*  name="live-tv"*/}
                    {/*  color={colors.accent}*/}
                    {/*  size={17}*/}
                    {/*/>*/}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <View style={[tw.pL3, tw.pY3, tw.borderGray400, { borderBottomWidth: 0.3 }]}>
            <Text style={[{ color: colors.disabled }]}>上传列表</Text>
          </View>
          <ScrollView style={[tw.flex1, tw.p1]}>{renderUploading(uploadFilesStore.temDocuments.slice(), uploadFilesStore.uploadProgress)}</ScrollView>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[tw.mX3, { backgroundColor: colors.background }]}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Text style={[{ fontSize: 17, fontWeight: 'bold', color: colors.text }]}>传输列表</Text>
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
