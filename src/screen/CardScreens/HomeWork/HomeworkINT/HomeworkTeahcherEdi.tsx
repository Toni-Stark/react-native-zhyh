import React, { useEffect, useRef, useState } from 'react';
import { Appbar, useTheme, Text, Portal, Modal, Button, ProgressBar, Chip } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Dimensions, Platform, ScrollView, TouchableOpacity, View, TouchableWithoutFeedback, Linking, TextInput } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../store';
import FastImage from 'react-native-fast-image';
import { AttachmentType } from '../../../../store/LessonDetailStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFileSize, getRandomStringByTime, requestSaveImagePermission } from '../../../../common/tools';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import RNPhotoEditor from 'react-native-photo-editor/index';
import moment from 'moment';
import ImagePicker, { Image, Options } from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import { t } from '../../../../common/tools';
import { RNVoiceRecorder } from 'react-native-voice-recorder';
import { Player } from '@react-native-community/audio-toolkit';
import Slider from '@react-native-community/slider';
import { UselessTextInput } from '../../../../component/UselessTextInput';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../../index';
import { NavigatorComponentProps } from '../../../index';
import { AUDIO, EXCEL_DOCUMENT, OTHER, PDF_DOCUMENT, PICTURE, PPT_DOCUMENT, VIDEO, WORD_DOCUMENT } from '../../../../common/status-module';

export type AudioListType = {
  url: string;
};

const playbackOptions = {
  autoDestroy: false,
  continuesToPlayInBackground: false,
  mixWithOthers: false
};

type ScreenRouteProp = RouteProp<ScreensParamList, 'HomeworkTeacherEdi'>;

type Props = {
  route: ScreenRouteProp;
};

export const HomeworkTeacherEdi: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const isAndroid = Platform.OS === 'android';
    const BTN_TIP_SIZE: number = UI_SIZE ? 14 : 12;
    const { homeworkFormStore, userStore, homeworkCreateStore, homeworkInterStore } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showSelectVideo, setShowSelectVideo] = useState(false);
    const MAX_UPLOAD_PICTURE = 6;
    const [imageIndex, setImageIndex] = useState(0);
    const HOMEWORK_IMAGE_SIZE = 50;
    const [visibleShow, setVisibleShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [visible, setVisible] = useState(false);
    const [audioList, setAudioList] = useState<AudioListType[]>([]);
    const [audioURL, setAudioURL] = useState('');
    const audioInterval = useRef<any>(null);
    const [playerDemo, setPlayerDemo] = useState<Player[]>([]);
    const [progressAudio, setProgressAudio] = useState<number[]>([]);
    const TITLE_SIZE: number = UI_SIZE ? 16 : 14;
    const [nowIndex, setNowIndex] = useState<number>(0);
    const [isPlay, setIsPlay] = useState(false);
    const [content, setContent] = useState('');
    const timeInter = useRef<any>(undefined);
    const [currentVisible, setCurrentVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      homeworkCreateStore.videoList = [];
      homeworkCreateStore.fileList = [];
      homeworkCreateStore.audioList = [];
      homeworkCreateStore.allFileList = [];
      homeworkFormStore.originAttachmentImages = [];
      homeworkFormStore.selectedImages = [];
      homeworkCreateStore.uploadList = [];
    }, [homeworkCreateStore, homeworkFormStore, homeworkInterStore.homeworkInfo]);

    useEffect(() => {
      if (route.params?.lectureId) {
        homeworkInterStore.getHomeworkInfo({ infoId: homeworkInterStore.homeworkInfo.id }).then(() => {
          if (homeworkInterStore.homeworkInfo.content) {
            setContent(homeworkInterStore.homeworkInfo.content);
          }
        });
      }
      return () => {
        homeworkInterStore
          .getHomeworkInfo({
            infoId: homeworkInterStore.homeworkInfo.id
          })
          .then((res) => {
            console.log('退出页面的回调', res);
          });
      };
    }, [homeworkInterStore, route.params.lectureId, userStore.userInfoDetail.id]);

    useEffect(() => {
      baseView.current.hideLoading();
      if (homeworkCreateStore.isUploadCom) {
        baseView.current.showMessage({ text: '订正成功', delay: 3 });
        homeworkCreateStore.isUploadCom = false;
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    }, [homeworkCreateStore, homeworkCreateStore.isUploadCom, homeworkCreateStore.uploadText, navigation]);
    useEffect(() => {
      if (homeworkCreateStore.fileUploadFalse) {
        baseView.current.hideLoading();
        baseView.current.showMessage({ text: '文件上传失败', delay: 3 });
        homeworkCreateStore.fileUploadFalse = false;
        setTimeout(() => {
          homeworkCreateStore.videoList = [];
          homeworkCreateStore.fileList = [];
          homeworkCreateStore.audioList = [];
          homeworkCreateStore.allFileList = [];
          homeworkCreateStore.uploadList = [];
          homeworkCreateStore.uploadProgress = [];
          navigation.goBack();
        }, 200);
      }
    }, [homeworkCreateStore, navigation]);
    useEffect(() => {
      if (Platform.OS === 'ios') {
        let delPath = RNFS.DocumentDirectoryPath + '/xueyue-profile';
        //执行删除
        RNFS.unlink(delPath)
          .then(() => {
            console.log('FILE DELETED');
            //如果文件不存在，会抛出异常
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        let delPath = RNFS.ExternalStorageDirectoryPath + '/xueyue-audio';
        let delVideoPath = RNFS.ExternalStorageDirectoryPath + '/xueyue-video';

        //执行删除
        RNFS.unlink(delPath)
          .then(() => {
            console.log('FILE AUDIO DELETED');
            //如果文件不存在，会抛出异常
          })
          .catch((err) => {
            console.log(err.message);
          });
        RNFS.unlink(delVideoPath)
          .then(() => {
            console.log('FILE VIDEO DELETED');
            //如果文件不存在，会抛出异常
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }, []);

    const clearInter = () => {
      clearInterval(audioInterval.current);
    };

    const selectClassModal = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.m10, tw.p3, { borderRadius: 7, backgroundColor: colors.background }]}
            visible={showModal}
            onDismiss={() => {
              setShowModal(false);
            }}
          >
            <Text style={[tw.selfCenter, { fontSize: 18 }]}>{t('homeworkCreated.selected')}</Text>
            {homeworkFormStore.homeworkGroup.map((item, index) => {
              if (item.studentCount > 0) {
                return (
                  <Button
                    style={[{ marginTop: 3 }]}
                    onPress={() => {
                      setShowModal(false);
                    }}
                    key={index}
                  >
                    {item.name}
                  </Button>
                );
              }
            })}
          </Modal>
        </Portal>
      );
    };

    const handleSaveImage = async (fileUrl?: string, download: boolean = true) => {
      const result = await requestSaveImagePermission();
      if (result) {
        setSaving(true);
        if (Platform.OS === 'android') {
          const newFileName = getRandomStringByTime();
          const newFile = `${RNFS.DocumentDirectoryPath}/${newFileName}.jpg`;
          if (download && fileUrl) {
            const downloadResult = await RNFS.downloadFile({
              fromUrl: fileUrl,
              toFile: newFile,
              background: true
            });
            downloadResult.promise
              .then(async () => {
                CameraRoll.save('file://' + newFile, { type: 'photo' })
                  .then(() => {
                    setSaving(false);
                    console.log(saving);
                  })
                  .catch(() => {
                    setSaving(false);
                  });
              })
              .catch(() => {
                setSaving(false);
              });
          } else {
            CameraRoll.save('file://' + fileUrl, { type: 'photo' })
              .then(() => {
                setSaving(false);
              })
              .catch(() => {
                setSaving(false);
              });
          }
        }
        if (Platform.OS === 'ios' && fileUrl) {
          CameraRoll.save(fileUrl, { type: 'photo' })
            .then(() => {
              setSaving(false);
              baseView.current.showLoading({ text: t('homework.successful') });
            })
            .catch(() => {
              setSaving(false);
            });
        }
        baseView.current.hideLoading();
      } else {
        setVisibleShow(false);
        setVisible(false);
        baseView.current.showLoading({ text: t('homework.operation'), delay: 1.5 });
      }
    };

    const hideModal = () => {
      setShowActionSheet(false);
      setShowSelectVideo(false);
    };

    const handleEditImage = async (attachment: AttachmentType | null, image?: Image) => {
      console.log(attachment, image, '这是要修改的图片， 以及图片的信息');
      setVisible(false);
      setCurrentVisible(false);
      baseView.current.showLoading();
      setTimeout(
        async () => {
          const newFileName = getRandomStringByTime();
          const newFile = `${RNFS.DocumentDirectoryPath}/${newFileName}.jpg`;
          const showEditPhoto = () => {
            RNPhotoEditor.Edit({
              path: newFile,
              hiddenControls: ['save', 'share', 'sticker'],
              onCancel: () => {
                RNFS.unlink(newFile);
              },
              onDone: () => {
                homeworkFormStore.addImage(
                  [
                    {
                      path: 'file://' + newFile,
                      creationDate: moment().format('YYYY-MM-DD hh:mm:ss'),
                      cropRect: null,
                      data: null,
                      exif: null,
                      filename: newFileName,
                      height: 0,
                      mime: 'image/jpeg',
                      size: 0,
                      width: 0
                    }
                  ],
                  true
                );
              }
            });
            baseView.current.hideLoading();
          };
          if (attachment && attachment.url) {
            const ret = await RNFS.downloadFile({
              fromUrl: attachment.url,
              toFile: newFile,
              background: true
            });
            ret.promise
              .then(() => {
                showEditPhoto();
              })
              .catch(() => {
                baseView.current.hideLoading();
                baseView.current?.showToast({ text: t('homework.error'), delay: 2 });
              });
          } else {
            if (image?.path) {
              await RNFS.copyFile(image?.path, newFile);
            }
            showEditPhoto();
          }
        },
        attachment === null ? 1000 : 500 // hack
      );
      baseView.current.hideLoading();
    };

    const uploadPicture = (camera: boolean) => {
      const params: Options = {
        cropping: true,
        compressImageQuality: 0.9,
        compressImageMaxWidth: 1920,
        compressImageMaxHeight: 1920,
        multiple: true,
        mediaType: 'photo',
        forceJpg: true,
        maxFiles: MAX_UPLOAD_PICTURE
      };
      if (camera) {
        ImagePicker.openCamera(params)
          .then((image) => {
            const images: Image[] = Array.isArray(image) ? image : [image];
            homeworkFormStore.addImage(images, false);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        ImagePicker.openPicker(params)
          .then((image) => {
            const images: Image[] = Array.isArray(image) ? image : [image];
            homeworkFormStore.addImage(images, false);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    const renderPreview = () => {
      const renderEditButton = (props) => {
        return (
          <Button
            mode={'outlined'}
            style={[{ marginRight: 10 }]}
            onPress={async () => {
              if (homeworkFormStore.homeworkDetail?.attachments) {
                if (props.imageIndex < homeworkFormStore.homeworkDetail.attachments.length) {
                  await handleSaveImage(homeworkFormStore.homeworkDetail.attachments[props.imageIndex].url);
                } else {
                  await handleSaveImage(
                    homeworkFormStore.homeworkDetail.attachments.length[props.imageIndex - homeworkFormStore.homeworkDetail.attachments.length].path,
                    false
                  );
                }
              }
            }}
          >
            {t('homeworkRevision.preservation')}
          </Button>
        );
      };
      return (
        <ImageView
          images={homeworkFormStore.getImagesAsync}
          imageIndex={imageIndex}
          visible={visibleShow}
          onRequestClose={() => setVisibleShow(false)}
          FooterComponent={(props) => {
            return (
              <View style={[tw.flexRow, tw.mB10, tw.mX10]}>
                <View style={[tw.flexGrow]}>
                  <Text style={{ color: colors.background }}>
                    {props.imageIndex + 1} / {homeworkFormStore.getImagesAsync.length}
                  </Text>
                </View>
                {renderEditButton(props)}
              </View>
            );
          }}
        />
      );
    };

    const renderSelectedImages = () => {
      console.log(homeworkFormStore.getImages, '查看图片资源文件');
      const output: JSX.Element[] = [];
      const renderProgress = (pro: number) => {
        if (pro) {
          return (
            <View style={[tw.justifyCenter, { width: HOMEWORK_IMAGE_SIZE, height: HOMEWORK_IMAGE_SIZE, position: 'absolute', left: 0, top: 0 }]}>
              <ProgressBar color={colors.accent} progress={pro} />
            </View>
          );
        } else {
          return null;
        }
      };
      homeworkFormStore.getImages.forEach((image, index) => {
        const progressNum = homeworkFormStore.uploadProgress[index];
        output.push(
          <View key={index}>
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[
                {
                  margin: 10
                }
              ]}
              onPress={() => {
                setImageIndex(index);
                if (homeworkFormStore.selectedImages.length > 0) {
                  setVisible(true);
                } else {
                  setVisibleShow(true);
                }
              }}
              onLongPress={() => homeworkFormStore.removeImage(index, true)}
            >
              <FastImage
                key={index}
                style={{
                  width: HOMEWORK_IMAGE_SIZE,
                  height: HOMEWORK_IMAGE_SIZE,
                  backgroundColor: colors.disabled,
                  borderRadius: HOMEWORK_IMAGE_SIZE / 10,
                  opacity: progressNum === undefined ? 1 : 0.5
                }}
                source={{ uri: image.uri }}
                resizeMode={FastImage.resizeMode.cover}
              />

              {renderProgress(progressNum)}
            </TouchableOpacity>
            <Icon
              name="clear"
              size={12}
              color={colors.text}
              style={[
                tw.itemsCenter,
                tw.absolute,
                { top: 2.5, right: 2.5, width: 15, height: 15, padding: 1.5, borderRadius: 50, backgroundColor: colors.disabled }
              ]}
              onPress={() => {
                homeworkFormStore.removeImage(index, true);
              }}
            />
          </View>
        );
      });
      return (
        <View padding-10 style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {output}
        </View>
      );
    };

    const renderImagePreview = () => {
      const renderEditButton = (props) => {
        return (
          <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter]}>
            <TouchableWithoutFeedback
              onPress={async () => {
                if (props.imageIndex < homeworkFormStore.originAttachmentImages.length) {
                  await handleSaveImage(homeworkFormStore.originAttachmentImages[props.imageIndex].url);
                } else {
                  await handleSaveImage(homeworkFormStore.selectedImages[props.imageIndex - homeworkFormStore.originAttachmentImages.length].path, false);
                }
              }}
            >
              <FastImage
                source={require('../../../../assets/download.png')}
                style={[{ marginRight: 15, width: 25, height: 25 }]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={async () => {
                if (props.imageIndex < homeworkFormStore.originAttachmentImages.length) {
                  await handleEditImage(homeworkFormStore.originAttachmentImages[props.imageIndex], undefined);
                } else {
                  await handleEditImage(null, homeworkFormStore.selectedImages[props.imageIndex - homeworkFormStore.originAttachmentImages.length]);
                }
              }}
            >
              <FastImage source={require('../../../../assets/edit.png')} style={[{ width: 30, height: 30 }]} resizeMode={FastImage.resizeMode.cover} />
            </TouchableWithoutFeedback>
          </View>
        );
      };
      return (
        <ImageView
          images={homeworkFormStore.getImages}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setVisible(false)}
          FooterComponent={(props) => {
            return (
              <View style={[tw.flexRow, tw.mB10, tw.mX10, tw.itemsCenter]}>
                <View style={[tw.flexGrow]}>
                  <Text style={{ color: colors.background }}>
                    {props.imageIndex + 1} / {homeworkFormStore.getImages.length}
                  </Text>
                </View>
                {renderEditButton(props)}
              </View>
            );
          }}
        />
      );
    };

    const showModalSelect = () => {
      return (
        <Portal>
          <Modal visible={showActionSheet} onDismiss={hideModal} contentContainerStyle={[tw.mX10, { borderRadius: 12, backgroundColor: colors.background }]}>
            <Text style={[tw.mT4, tw.mB3, tw.selfCenter, { color: colors.placeholder }]}>{t('homeworkRevision.selectImg')}</Text>
            <Button
              contentStyle={[tw.mB1]}
              onPress={() => {
                uploadPicture(false);
                hideModal();
              }}
            >
              {t('homeworkRevision.selectAlbum')}
            </Button>
            <Button
              contentStyle={[tw.mB2]}
              onPress={() => {
                uploadPicture(true);
                hideModal();
              }}
            >
              {t('homeworkRevision.photograph')}
            </Button>
          </Modal>
        </Portal>
      );
    };

    const showVideoSelect = () => {
      return (
        <Portal>
          <Modal visible={showSelectVideo} onDismiss={hideModal} contentContainerStyle={[tw.mX10, { borderRadius: 12, backgroundColor: colors.background }]}>
            <Text style={[tw.mT4, tw.mB3, tw.selfCenter, { color: colors.placeholder }]}>{t('homeworkRevision.selectImg')}</Text>
            <Button
              contentStyle={[tw.mB1]}
              onPress={() => {
                uploadVideo(false);
                hideModal();
              }}
            >
              选择视频
            </Button>
            <Button
              contentStyle={[tw.mB2]}
              onPress={() => {
                uploadVideo(true);
                hideModal();
              }}
            >
              拍视频
            </Button>
          </Modal>
        </Portal>
      );
    };

    const updateHomework = async () => {
      let fileList: string[] = [];
      console.log(homeworkCreateStore.videoList, audioList, homeworkCreateStore.fileList, '文件');
      if (userStore.userInfoDetail?.id !== undefined && userStore.userInfoDetail.business?.id !== undefined) {
        if (content && content.length <= 0) {
          baseView.current.showMessage({ text: '请填写作业内容', delay: 2 });
          return;
        } else {
          console.log(audioList, '这是音频文件');
          homeworkFormStore.getImages.map((item) => {
            if (item.uri) {
              fileList.push(item.uri);
            } else {
              baseView.current.showMessage({ text: '图片文件出错', delay: 2 });
              return;
            }
          });
          homeworkCreateStore.videoList.map((item) => {
            if (item) {
              fileList.push(item);
            } else {
              baseView.current.showMessage({ text: '视频文件出错', delay: 2 });
              return;
            }
          });
          homeworkCreateStore.fileList.map((item) => {
            if (item) {
              fileList.push(item);
            } else {
              baseView.current.showMessage({ text: '文档文件出错', delay: 2 });
              return;
            }
          });
          audioList.map((item) => {
            if (item.url) {
              fileList.push(item.url);
            } else {
              baseView.current.showMessage({ text: '音频文件出错', delay: 2 });
              return;
            }
          });
          baseView.current.showLoading({ text: '正在上传', delay: 7 });
          homeworkCreateStore.allFileList = fileList;
          homeworkCreateStore.isDoing = 3;
          let fileIds: string[] = [];
          console.log(homeworkInterStore.homeworkInfo.homeworkFiles?.length, homeworkCreateStore.allFileList.length, '这是所有的旧文件');
          homeworkInterStore.homeworkInfo.homeworkFiles?.map((item) => {
            if (item.id) {
              fileIds.push(item.id);
            }
          });
          homeworkCreateStore.fileIds = fileIds;
          if (homeworkCreateStore.allFileList.length > 0) {
            const res = await homeworkCreateStore.uploadForAliOSS({
              name: homeworkInterStore.homeworkInfo.title,
              lessonType: homeworkInterStore.homeworkInfo.lessonType,
              content: content,
              lectureId: homeworkInterStore.homeworkInfo.id,
              userId: userStore.userInfoDetail.id,
              businessId: userStore.userInfoDetail.business?.id
            });
            console.log(res, '按钮回调');
          } else {
            homeworkCreateStore
              .editHomework({
                name: homeworkInterStore.homeworkInfo.title,
                lessonType: homeworkInterStore.homeworkInfo.lessonType,
                content: content,
                lectureId: homeworkInterStore.homeworkInfo.id,
                userId: userStore.userInfoDetail.id,
                businessId: userStore.userInfoDetail.business?.id
              })
              .then((subRes) => {
                console.log(subRes, '按钮回调');
                homeworkInterStore
                  .getHomeworkInfoDetail({
                    infoId: homeworkInterStore.homeworkInfo.id
                  })
                  .then(() => {
                    navigation.goBack();
                  });
              });
          }
        }
      }
    };

    const addAudioList = (props) => {
      const { path, nowTime } = props;
      if (Platform.OS === 'ios') {
        console.log('[path1]', path);
        console.log('[path2]', RNFS.DocumentDirectoryPath);
        RNFS.readDir('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile')
          .then(() => {
            console.log('yes,read success');
            RNFS.moveFile(path, 'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a')
              .then(() => {
                console.log('move1 success');
                RNFS.readDir('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile').then((res) => {
                  console.log(res, '---');
                });
                setAudioURL('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a');
                setPlayerDemo([
                  new Player('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a', playbackOptions).prepare((err) => {
                    console.log('err1', err);
                  }),
                  ...playerDemo
                ]);
                setAudioList([{ url: 'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a' }, ...audioList]);
                homeworkCreateStore.audioList = [
                  'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a',
                  ...homeworkCreateStore.audioList
                ];
                console.log("Now it hasn't changed", 'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a');
              })
              .catch((errs) => {
                console.log('last', errs);
              });
          })
          .catch((err) => {
            console.log('no,read error', err);
            RNFS.mkdir('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile').then(() => {
              console.log('mkdir success');
              RNFS.moveFile(path, 'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a').then(() => {
                console.log('move2 success');
                RNFS.readDir('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile').then((res) => {
                  console.log(res, '===');
                });
                setAudioURL('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a');
                setPlayerDemo([
                  new Player('file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a', playbackOptions).prepare((err2) => {
                    console.log('err2', err2);
                  }),
                  ...playerDemo
                ]);
                setAudioList([{ url: 'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a' }, ...audioList]);
                homeworkCreateStore.audioList = [
                  'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a',
                  ...homeworkCreateStore.audioList
                ];
                setProgressAudio([0, ...progressAudio]);
                console.log("Now it hasn't changed", 'file://' + RNFS.DocumentDirectoryPath + '/xueyue-profile/' + nowTime + '.m4a');
                // setNameMode(true);
              });
            });
          });
        console.log(path, nowTime);
      } else {
        RNFS.readFileAssets(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio')
          .then((res) => {
            console.log('success', res);
            console.log('It will changing to this', path, RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3');
            RNFS.moveFile(path, RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3')
              .then(() => {
                console.log('move success');
                RNFS.readdir(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio').then((result) => {
                  setAudioURL('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3');
                  if (DeviceInfo.getApiLevelSync() < 26) {
                    setPlayerDemo([new Player(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', playbackOptions), ...playerDemo]);
                  } else {
                    setPlayerDemo([
                      new Player(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', playbackOptions).prepare(),
                      ...playerDemo
                    ]);
                  }
                  console.log(audioURL, '这是实时的url1');
                  setAudioList([{ url: audioURL }, ...audioList]);
                  homeworkCreateStore.audioList = [RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', ...homeworkCreateStore.audioList];
                  setProgressAudio([0, ...progressAudio]);

                  setProgressAudio([0, ...progressAudio]);
                  console.log(result, RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', playerDemo.length);
                });
              })
              .catch((errs) => {
                console.log('last', errs);
              });
          })
          .catch((err) => {
            console.log('false', err);
            RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio').then(() => {
              console.log('create success');
              RNFS.moveFile(path, RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3')
                .then(() => {
                  console.log('move success');
                  RNFS.readdir(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio').then((res) => {
                    setAudioURL('file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3');
                    if (DeviceInfo.getApiLevelSync() < 26) {
                      setPlayerDemo([new Player(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', playbackOptions), ...playerDemo]);
                    } else {
                      setPlayerDemo([
                        new Player(RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', playbackOptions).prepare(),
                        ...playerDemo
                      ]);
                    }
                    console.log(audioURL, '这是实时的url2');
                    setAudioList([{ url: 'file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3' }, ...audioList]);
                    homeworkCreateStore.audioList = [
                      'file://' + RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3',
                      ...homeworkCreateStore.audioList
                    ];
                    setProgressAudio([0, ...progressAudio]);
                    console.log(res, RNFS.ExternalStorageDirectoryPath + '/xueyue-audio/' + nowTime + '.mp3', playerDemo.length);
                  });
                })
                .catch((errs) => {
                  console.log('last', errs);
                });
            });
          });
      }
    };

    const onRecord = () => {
      RNVoiceRecorder.Record({
        format: 'mp3',
        onDone: (path: string) => {
          const nowTime = new Date().getTime();
          addAudioList({ path: path, nowTime: nowTime });
        },
        onCancel: () => {
          console.log('on cancel');
        }
      });
    };

    // 音频播放方案一 RNVoiceRecorder
    // const onPlay = (url: string) => {
    //   RNVoiceRecorder.Play({
    //     path: url,
    //     format: 'wav',
    //     onDone: (path) => {
    //       console.log('play done: ' + path);
    //       console.log(audioList);
    //     },
    //     onCancel: () => {
    //       console.log('play cancelled');
    //     }
    //   });
    // };

    // 音频播放方案二 react native sound
    // const openPlayUrl = (url: string) => {
    //   const whoosh = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
    //     if (error) {
    //       console.log('failed to load the sound', error);
    //       return;
    //     }
    //     console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels:' + whoosh.getNumberOfChannels());
    //     whoosh.play((success) => {
    //       if (success) {
    //         console.log('successfully finished playing');
    //       } else {
    //         console.log('fails');
    //       }
    //     });
    //   });
    // };

    //音频播放方案三： new Player
    let count: number = 0;
    const onNewPlayer = (num: number) => {
      if (!isAndroid) {
        if (!isPlay) {
          console.log(556);
          playerDemo[num].play((err) => {
            console.log('ios', err, playerDemo[num].duration, playerDemo[num].currentTime);
            setIsPlay(true);
          });
        } else {
          console.log(557);
          playerDemo[num].pause();
          setIsPlay(false);
        }

        audioInterval.current = setInterval(() => {
          let currentProgress = Math.max(0, playerDemo[num].currentTime) / playerDemo[num].duration;
          progressAudio.splice(num, 1, currentProgress);
          setProgressAudio([...progressAudio]);
          setNowIndex(num);
          console.log(playerDemo[num].currentTime, '++++++', playerDemo[num].duration);
          console.log(
            'progressAudio[num]',
            progressAudio[num],
            'count',
            count,
            'playerDemo[num].currentTime',
            playerDemo[num].currentTime,
            'playerDemo[num].duration',
            playerDemo[num].duration,
            'isPlay',
            isPlay
          );

          if (playerDemo[num].currentTime === -1 || (playerDemo[num].currentTime === 0 && playerDemo[num].currentTime < count)) {
            setIsPlay(false);
            clearInter();
          }
          count = currentProgress;
        }, 200);
      } else {
        console.log(1, num);
        if (Platform.OS === 'android') {
          playerDemo[num].speed = 0.0;
        }
        if (nowIndex !== num) {
          console.log(2, 'there');
          progressAudio.splice(nowIndex, 1, 0);
          setProgressAudio([...progressAudio]);
          playerDemo[nowIndex].stop();
          clearInter();
        }
        if (!isPlay) {
          console.log(3, 'sure play');
          playerDemo[num].play((err) => {
            console.log(111, err);
            setIsPlay(true);
          });
        } else {
          if (nowIndex !== num) {
            console.log(4, 'what');
            clearInter();

            setIsPlay(true);
            playerDemo[num].play((err) => {
              console.log(222, err);
            });
          } else {
            console.log(5, 'how', num);
            playerDemo[num].pause();
            setIsPlay(!isPlay);
            clearInter();

            return;
          }
        }
        clearInter();

        audioInterval.current = setInterval(() => {
          let currentProgress = Math.max(0, playerDemo[num].currentTime) / playerDemo[num].duration;
          progressAudio.splice(num, 1, currentProgress);
          setProgressAudio([...progressAudio]);
          setNowIndex(num);
          console.log(playerDemo[num].currentTime, '++++++', playerDemo[num].duration);
          console.log(
            'progressAudio[num]',
            progressAudio[num],
            'count',
            count,
            'playerDemo[num].currentTime',
            playerDemo[num].currentTime,
            'playerDemo[num].duration',
            playerDemo[num].duration,
            'isPlay',
            isPlay
          );

          if (playerDemo[num].currentTime === -1 || (playerDemo[num].currentTime === 0 && playerDemo[num].currentTime < count)) {
            setIsPlay(false);
            clearInter();
          }
          count = currentProgress;
        }, 200);
      }
    };

    const _seek = (percentage, num) => {
      if (!playerDemo[num]) {
        return;
      }
      let position = percentage * playerDemo[num].duration;
      if (nowIndex !== num) {
        progressAudio.splice(nowIndex, 1, 0);
        setProgressAudio([...progressAudio]);
        playerDemo[nowIndex].stop();
        clearInter();
      }
      if (Platform.OS === 'android') {
        playerDemo[num].speed = 0.0;
      }
      playerDemo[num].play((errs) => {
        console.log(333, errs);
        playerDemo[num].seek(position, () => {
          playerDemo[num].play((err) => {
            console.log(444, err);
            setIsPlay(true);
          });
        });
      });

      clearInter();

      audioInterval.current = setInterval(() => {
        let currentProgress = Math.max(0, playerDemo[num].currentTime) / playerDemo[num].duration;
        progressAudio.splice(num, 1, currentProgress);
        setProgressAudio([...progressAudio]);
        setNowIndex(num);
        console.log(
          'progressAudio[num]',
          progressAudio[num],
          'count',
          count,
          'playerDemo[num].currentTime',
          playerDemo[num].currentTime,
          'playerDemo[num].duration',
          playerDemo[num].duration,
          'isPlay',
          isPlay
        );

        if (playerDemo[num].currentTime === -1 || (playerDemo[num].currentTime === 0 && playerDemo[num].currentTime < count)) {
          setIsPlay(false);
          clearInter();
        }
        count = currentProgress;
      }, 200);
    };
    const RenderVideoList = ({ item, index }: { item: string; index: number }) => {
      return (
        <TouchableOpacity
          key={index}
          style={[{ margin: 10 }]}
          onPress={async () => {
            console.log(homeworkCreateStore.videoList);
            navigation.navigate('Main', { screen: 'HomeworkVideoPlayback', params: { url: item, back: 'HomeworkCreated' } });
          }}
        >
          <FastImage
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.disabled,
              borderRadius: 4
            }}
            source={{ uri: item }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Icon
            name="play-circle-outline"
            color={colors.background}
            style={[tw.itemsCenter, tw.absolute, { top: 12, left: 12, padding: 1.5, borderRadius: 50 }]}
            size={25}
          />
          <Icon
            name="clear"
            size={12}
            color={colors.background}
            style={[tw.itemsCenter, tw.absolute, tw.bgGray700, { top: -3.5, right: -3.5, width: 15, height: 15, padding: 1.5, borderRadius: 50 }]}
            onPress={() => {
              homeworkCreateStore.videoList.splice(index, 1);
            }}
          />
        </TouchableOpacity>
      );
    };

    const RenderFileList = ({ item, index }: { item: any; index: number }) => {
      return (
        <TouchableOpacity
          key={index}
          style={[{ margin: 10 }]}
          onPress={async () => {
            console.log(item, '打印item');
            // open(item);
          }}
        >
          <View style={[tw.bgGreen400, { width: 50, height: 50, borderRadius: 4 }]}>
            <Icon
              name="file-download"
              color={colors.background}
              style={[tw.itemsCenter, tw.absolute, { top: 12, left: 12, padding: 1.5, borderRadius: 50 }]}
              size={25}
            />
          </View>

          <Icon
            name="clear"
            size={12}
            color={colors.background}
            style={[tw.itemsCenter, tw.absolute, tw.bgGray700, { top: -3.5, right: -3.5, width: 15, height: 15, padding: 1.5, borderRadius: 50 }]}
            onPress={() => {
              homeworkCreateStore.fileList.splice(index, 1);
            }}
          />
        </TouchableOpacity>
      );
    };

    const uploadVideo = (camera: boolean) => {
      const params: Options = {
        mediaType: 'video'
      };
      if (camera) {
        ImagePicker.openCamera(params)
          .then((video) => {
            homeworkCreateStore.videoList.push(video.path);
            console.log('video1', video);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        ImagePicker.openPicker(params)
          .then((video) => {
            homeworkCreateStore.videoList.push(video.path);
            console.log('video2', video);
          })
          .catch((e) => {
            console.log(e);
          });
      }
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
                console.log(filePath, '-', destPath, '-', name, '--', '在这里创建新文档文件');
                homeworkCreateStore.fileList.push(filePath);
              }
            }
          });
        });
      });
    };

    const openDocFile = async () => {
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
          console.log(fileName, urlFile, 'urlFile');
          RNFS.readDir(urlFile)
            .then((resBoy) => {
              const data = resBoy.filter((item) => {
                return item.name === filterName + exeName;
              })[0];
              if (userStore.userInfoDetail.business?.id && userStore.userInfoDetail.id) {
                console.log(data.path, '文件真实目录');
                homeworkCreateStore.fileList.push(data.path);
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

    const VideoCard = (item) => {
      return (
        <TouchableOpacity
          key={item.index}
          style={[{ margin: 10 }]}
          onPress={async () => {
            const image = await homeworkInterStore.getHomeworkFileUrl(item.data.id);
            if (image) {
              navigation.navigate('Main', { screen: 'HomeworkVideoPlayback', params: { url: image, back: 'HomeworkCreated' } });
            } else {
              baseView.current.showMessage({ text: '服务器连接错误,请稍后再试', delay: 2 });
            }
          }}
        >
          <View
            style={[
              tw.itemsCenter,
              tw.justifyCenter,
              {
                width: 50,
                height: 50,
                backgroundColor: colors.accent,
                borderRadius: 8
              }
            ]}
          >
            <Icon name="play-circle-outline" color={colors.background} style={[tw.itemsCenter, { padding: 1.5, borderRadius: 50 }]} size={25} />
            <Text style={[tw.selfCenter, tw.textWhite, { fontSize: 10 }]}>{getFileSize(item.data.fileSize)}</Text>
          </View>
          <Icon
            name="clear"
            size={12}
            color={colors.text}
            style={[
              tw.itemsCenter,
              tw.absolute,
              { top: -7.5, right: -7.5, width: 15, height: 15, padding: 1.5, borderRadius: 50, backgroundColor: colors.disabled }
            ]}
            onPress={() => {
              homeworkInterStore.homeworkInfo.homeworkFiles = homeworkInterStore.homeworkInfo.homeworkFiles?.filter((data) => item.data.id !== data.id);
              console.log(item, '视频资源删除', homeworkInterStore.homeworkInfo.homeworkFiles?.length);
            }}
          />
        </TouchableOpacity>
      );
    };
    const PictureCard = (item, index) => {
      return (
        <View key={item.index}>
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={[
              {
                margin: 10
              }
            ]}
            onPress={async () => {
              const image = await homeworkInterStore.getHomeworkFileUrl(item.data.id);
              if (image) {
                homeworkInterStore.asyncImageForm = [];
                homeworkInterStore.asyncImageForm.push({ url: image });
                setCurrentImageIndex(0);
                setCurrentVisible(true);
              }
            }}
          >
            <FastImage
              key={index}
              style={{
                width: HOMEWORK_IMAGE_SIZE,
                height: HOMEWORK_IMAGE_SIZE,
                backgroundColor: colors.disabled,
                borderRadius: HOMEWORK_IMAGE_SIZE / 10
              }}
              source={{ uri: item.data.pictureThumbnailUrl }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <Icon
            name="clear"
            size={12}
            color={colors.text}
            style={[
              tw.itemsCenter,
              tw.absolute,
              { top: 2.5, right: 2.5, width: 15, height: 15, padding: 1.5, borderRadius: 50, backgroundColor: colors.disabled }
            ]}
            onPress={() => {
              homeworkInterStore.homeworkInfo.homeworkFiles = homeworkInterStore.homeworkInfo.homeworkFiles?.filter((data) => item.data.id !== data.id);
              console.log(item, '图片资源删除', homeworkInterStore.homeworkInfo.homeworkFiles?.length);
            }}
          />
        </View>
      );
    };
    const DocumentCard = (item) => {
      return (
        <TouchableOpacity
          key={item.index}
          style={[{ margin: 10 }]}
          onPress={async () => {
            console.log(item, '打印item');
            const document = await homeworkInterStore.getHomeworkFileUrl(item.data.id);
            if (document) {
              Linking.openURL(document).catch((err) => console.error('An error occurred', err));
            } else {
              baseView.current.showMessage({ text: '服务器连接错误,请稍后再试', delay: 2 });
            }
          }}
        >
          <View style={[tw.bgGreen400, tw.itemsCenter, tw.justifyCenter, { width: 50, height: 50, borderRadius: 4 }]}>
            <Icon name="description" color={colors.background} style={[tw.itemsCenter, { padding: 1.5, borderRadius: 50 }]} size={25} />
            <Text style={[tw.selfCenter, tw.textWhite, { fontSize: 10 }]}>{getFileSize(item.data.fileSize)}</Text>
          </View>
          <Icon
            name="clear"
            size={12}
            color={colors.text}
            style={[
              tw.itemsCenter,
              tw.absolute,
              { top: -7.5, right: -7.5, width: 15, height: 15, padding: 1.5, borderRadius: 50, backgroundColor: colors.disabled }
            ]}
            onPress={() => {
              homeworkInterStore.homeworkInfo.homeworkFiles = homeworkInterStore.homeworkInfo.homeworkFiles?.filter((data) => item.data.id !== data.id);
              console.log(item, '文档资源删除', homeworkInterStore.homeworkInfo.homeworkFiles?.length);
            }}
          />
        </TouchableOpacity>
      );
    };

    const AudioCard = (item) => {
      return (
        <TouchableOpacity
          key={item.index}
          style={[{ margin: 10 }]}
          onPress={async () => {
            const res = await homeworkInterStore.getHomeworkFileUrl(item.data.id);
            if (res) {
              navigation.navigate('Main', { screen: 'AudioPlayer', params: { name: item.name, url: res } });
            } else {
              baseView.current.showMessage({ text: '服务器连接错误,请稍后再试', delay: 2 });
            }
          }}
        >
          <View
            style={[
              tw.itemsCenter,
              tw.justifyCenter,
              tw.bgBlue300,
              {
                width: 50,
                height: 50,
                borderRadius: 8
              }
            ]}
          >
            <Icon name="campaign" color={colors.background} style={[tw.itemsCenter, { padding: 1.5, borderRadius: 50 }]} size={25} />
            <Text style={[tw.selfCenter, tw.textWhite, { fontSize: 10 }]}>{getFileSize(item.data.fileSize)}</Text>
          </View>
          <View style={[tw.absolute, { top: -7.5, right: -7.5 }]}>
            <TouchableOpacity
              style={[tw.bgRed500]}
              onPress={() => {
                homeworkInterStore.homeworkInfo.homeworkFiles = homeworkInterStore.homeworkInfo.homeworkFiles?.filter((data) => item.data.id !== data.id);
              }}
            >
              <Icon
                name="clear"
                size={12}
                color={colors.text}
                style={[tw.itemsCenter, { width: 15, height: 15, padding: 1.5, borderRadius: 50, backgroundColor: colors.disabled }]}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };

    const renderFileView = ({ item, index }) => {
      //"0:文件夹,1:图片,2:音频,3:视频,4:pdf文档,5:word文档,6:excel文档,7:ppt文档,99:其他",
      switch (item.type) {
        case PICTURE:
          return <PictureCard key={index} data={item} index={index} />;
        case VIDEO:
          return <VideoCard key={index} data={item} index={index} />;
        case AUDIO:
          return <AudioCard key={index} data={item} index={index} />;
        case PDF_DOCUMENT:
        case WORD_DOCUMENT:
        case EXCEL_DOCUMENT:
        case PPT_DOCUMENT:
        case OTHER:
          return <DocumentCard key={index} data={item} index={index} />;
      }
    };

    const renderCurrentImagePreview = () => {
      return (
        <ImageView
          images={homeworkInterStore.getImages}
          imageIndex={currentImageIndex}
          visible={currentVisible}
          onRequestClose={() => setCurrentVisible(false)}
          FooterComponent={(props) => {
            return (
              <View style={[tw.flexRow, tw.mB10, tw.mX10, tw.itemsCenter]}>
                <View style={[tw.flexGrow]}>
                  <Text style={{ color: colors.background }}>
                    {props.imageIndex + 1} / {homeworkInterStore.getImages.length}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    if (homeworkInterStore.getImages.length > 0) {
                      await handleSaveImage(homeworkInterStore.getImages[0].uri);
                    }
                  }}
                >
                  <View style={[tw.selfEnd]}>
                    <Text style={{ color: colors.background }}>保存</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (homeworkInterStore.getImages.length > 0 && homeworkInterStore.getImages[0].uri) {
                      console.log(homeworkInterStore.getImages[0].uri);
                      let imageData: AttachmentType = {
                        url: homeworkInterStore.getImages[0].uri
                      };
                      await handleEditImage(imageData, undefined);
                    }
                  }}
                >
                  <View style={[tw.selfEnd]}>
                    <Text style={{ color: colors.background }}>修改</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      );
    };
    const AudioCardFile = (item) => {
      return (
        <TouchableOpacity
          key={item.index}
          style={[{ margin: 10 }]}
          onPress={() => {
            navigation.navigate('Main', { screen: 'AudioPlayer', params: { name: '录音' + (item.index + 1), url: item.item.url } });
          }}
        >
          <View
            style={[
              tw.itemsCenter,
              tw.justifyCenter,
              tw.bgBlue300,
              {
                width: 50,
                height: 50,
                borderRadius: 8
              }
            ]}
          >
            <Icon name="campaign" color={colors.background} style={[tw.itemsCenter, { padding: 1.5, borderRadius: 50 }]} size={25} />
            <Text style={[tw.selfCenter, tw.textWhite, { fontSize: 10 }]}>录音{item.index + 1}</Text>
          </View>
          <Icon
            name="clear"
            size={12}
            color={colors.text}
            style={[
              tw.itemsCenter,
              tw.absolute,
              { top: -7.5, right: -7.5, width: 15, height: 15, padding: 1.5, borderRadius: 50, backgroundColor: colors.disabled }
            ]}
            onPress={() => {
              audioList.splice(item.item.index, 1);
              setAudioList([...audioList]);
            }}
          />
        </TouchableOpacity>
      );
    };

    const renderContent = () => {
      return (
        <View style={[]}>
          <View style={[tw.flexRow, tw.itemsCenter, { borderBottomWidth: 1, borderBottomColor: colors.deepBackground }]}>
            <TextInput
              placeholder={t('homeworkCreated.pleaseName')}
              maxLength={40}
              placeholderTextColor={colors.disabled}
              keyboardType="default"
              style={[tw.p4, tw.wFull, { backgroundColor: colors.background, fontSize: TITLE_SIZE, color: colors.text }]}
              onChangeText={(className) => (homeworkInterStore.homeworkInfo.title = className)}
              value={homeworkInterStore.homeworkInfo.title}
            />
          </View>
          <View style={[tw.pX3, { backgroundColor: colors.background }]}>
            <View
              style={{
                backgroundColor: colors.background
              }}
            >
              <UselessTextInput
                placeholder={t('homeworkCreated.homeworkContent')}
                multiline
                numberOfLines={6}
                placeholderTextColor={colors.disabled}
                onChangeText={(text) => setContent(text)}
                value={content}
              />
              <View>
                <Text style={[{ color: colors.placeholder }]}>历史文件：</Text>
                <View>
                  <View style={[{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }]}>
                    {homeworkInterStore.getFiles.slice().map((item, index) => {
                      // if (item.type !== AUDIO) {
                      return renderFileView({ item, index });
                      // }
                    })}
                  </View>
                  {/*<View>*/}
                  {/*  {homeworkInterStore.getAudioFiles.slice().map((item, index) => {*/}
                  {/*    return renderAudio({ item, index });*/}
                  {/*  })}*/}
                  {/*</View>*/}
                </View>
              </View>
              <View>{renderSelectedImages()}</View>
              <View style={[{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }]}>
                {homeworkCreateStore.videoList.slice().map((item, index) => {
                  return <RenderVideoList key={index} index={index} item={item} />;
                })}
                {homeworkCreateStore.fileList.slice().map((item, index) => {
                  return <RenderFileList key={index} index={index} item={item} />;
                })}
                {audioList.slice().map((item, index) => {
                  return <AudioCardFile key={index} index={index} item={item} />;
                })}
              </View>
              <View>
                {audioList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[tw.mY1, tw.mX1, tw.p2, tw.flexRow, tw.justifyBetween, tw.itemsCenter, tw.bgGray100, { borderRadius: 8 }]}
                    >
                      <Icon
                        name={isPlay && index === nowIndex ? 'pause' : 'play-circle-outline'}
                        onPress={() => {
                          onNewPlayer(index);
                        }}
                        size={25}
                        color={colors.accent}
                      />
                      <Text numberOfLines={1} style={[tw.mX1, { fontSize: 12 }]} ellipsizeMode={'middle'}>
                        {moment((progressAudio[index]?.toFixed(4) ? Number(progressAudio[index].toFixed(4)) : 0) * playerDemo[index].duration).format('mm:ss')}
                      </Text>

                      <Slider
                        style={[tw.flex1]}
                        step={0.0001}
                        onValueChange={(percentage) => {
                          clearInterval(timeInter.current);
                          timeInter.current = setInterval(() => {
                            _seek(percentage, index);
                            clearInterval(timeInter.current);
                          }, 200);
                        }}
                        value={progressAudio[index]}
                      />
                      <Text numberOfLines={1} style={[tw.mX1, { fontSize: 12 }]} ellipsizeMode={'middle'}>
                        {playerDemo[index].duration > 0 ? moment(playerDemo[index].duration).format('mm:ss') : '00:00'}
                      </Text>
                      <Icon
                        name="clear"
                        size={12}
                        color={colors.text}
                        style={[tw.itemsCenter, tw.absolute, tw.bgGray200, { top: -7.5, right: -2.5, width: 15, height: 15, padding: 1.5, borderRadius: 50 }]}
                        onPress={() => {
                          audioList.splice(index, 1);
                          setAudioList([...audioList]);
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={[tw.flexRow, tw.mY3, tw.justifyAround]}>
                <Chip
                  textStyle={[{ height: 20 }]}
                  style={[tw.itemsCenter, { height: 30 }]}
                  mode="outlined"
                  icon="image"
                  onPress={() => {
                    setShowActionSheet(true);
                  }}
                >
                  相册
                </Chip>
                <Chip
                  textStyle={[{ height: 20 }]}
                  style={[tw.itemsCenter, { height: 30 }]}
                  mode="outlined"
                  icon="camera"
                  onPress={() => {
                    console.log('Pressed');
                    setShowSelectVideo(true);
                    // navigation.navigate('Main', { screen: 'HomeworkCamera', options: { animationEnabled: false } });
                  }}
                >
                  拍摄
                </Chip>
                <Chip
                  textStyle={[{ height: 20 }]}
                  style={[tw.itemsCenter, { height: 30 }]}
                  mode="outlined"
                  icon="information"
                  onPress={() => {
                    onRecord();
                  }}
                >
                  录音
                </Chip>
                <Chip
                  textStyle={[{ height: 20 }]}
                  style={[tw.itemsCenter, { height: 30 }]}
                  mode="outlined"
                  icon="cloud"
                  onPress={async () => {
                    await openDocFile();
                  }}
                >
                  文档
                </Chip>
              </View>
            </View>
          </View>
          <View style={[{ backgroundColor: colors.background }]}>
            <Button
              mode={'contained'}
              contentStyle={[tw.p1]}
              labelStyle={[{ fontSize: BTN_TIP_SIZE }]}
              style={[tw.m3]}
              onPress={async () => {
                await updateHomework();
              }}
            >
              {t('homeworkRevision.submit')}
            </Button>
          </View>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="订正作业内容" />
        </Appbar.Header>
        <ScrollView style={[{ backgroundColor: colors.surface }]}>
          {renderContent()}
          {selectClassModal()}
          {renderPreview()}
          {showModalSelect()}
          {renderImagePreview()}
          {renderCurrentImagePreview()}
          {showVideoSelect()}
          {/*{renderAudioMode()}*/}
        </ScrollView>
      </BaseView>
    );
  }
);
