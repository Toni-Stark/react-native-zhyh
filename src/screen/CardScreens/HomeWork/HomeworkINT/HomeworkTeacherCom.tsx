import React, { useEffect, useRef, useState } from 'react';
import { Appbar, useTheme, Text, Button, Portal, Modal, Avatar, Card } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Platform, ScrollView, TouchableOpacity, View, Dimensions, TextInput, Linking } from 'react-native';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../../index';
import { useStore } from '../../../../store';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFileSize, getRandomStringByTime, requestSaveImagePermission } from '../../../../common/tools';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import ImageView from 'react-native-image-viewing';
import { t } from '../../../../common/tools';
import { UselessTextInput } from '../../../../component/UselessTextInput';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../../index';
import {
  AUDIO,
  EXCEL_DOCUMENT,
  HOMEWORK_STATUS_CORRECTION,
  HOMEWORK_STATUS_CREATED,
  HOMEWORK_STATUS_REVIEW,
  HOMEWORK_STATUS_SUBMIT,
  OTHER,
  PDF_DOCUMENT,
  PICTURE,
  PPT_DOCUMENT,
  VIDEO,
  WORD_DOCUMENT
} from '../../../../common/status-module';
import { ProfilePlaceholder } from '../../../../component/skeleton/ProfilePlaceholder';

export type AudioListType = {
  url: string;
};

type ScreenRouteProp = RouteProp<ScreensParamList, 'HomeworkTeacherCom'>;

type Props = {
  route: ScreenRouteProp;
};

export const HomeworkTeacherCom: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { homeworkFormStore, homeworkInterStore, userStore, lessonDetailStore, userRolesStore } = useStore();
    const [imageIndex, setImageIndex] = useState(0);
    const [visibleShow, setVisibleShow] = useState(false);
    const HOMEWORK_IMAGE_SIZE = 50;
    const [visible, setVisible] = useState(false);
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const TITLE_SIZE: number = UI_SIZE ? 18 : 16;
    const BTN_TIP_SIZE: number = UI_SIZE ? 14 : 12;
    const [showModal, setShowModal] = useState(false);
    const [retreatModal, setRetreatModal] = useState(false);
    const [retreatText, setRetreatText] = useState('');

    useEffect(() => {
      if (route.params?.infoId) {
        (async () => {
          await homeworkInterStore.getHomeworkInfoDetail({ infoId: route.params.infoId }).then(() => {});
        })();
      }
      return () => {
        console.log(3423);
        homeworkInterStore.getHomeworkInfo({ infoId: homeworkInterStore.homeworkInfo.id }).then((res) => {
          if (res) {
            homeworkInterStore.homeworkInfoDetail = {};
          }
        });
      };
    }, [homeworkInterStore, route.params.infoId, userRolesStore.isStudentId, userStore.userInfoDetail.id]);

    const handleSaveImage = async (fileUrl?: string, download: boolean = true) => {
      const result = await requestSaveImagePermission();
      if (result) {
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
                  .then((res) => {
                    console.log(res);
                    setVisible(false);
                    baseView.current.showLoading({ text: '保存成功', delay: 1 });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            CameraRoll.save('file://' + fileUrl, { type: 'photo' })
              .then((res) => {
                console.log(res);
                setVisible(false);
                baseView.current.showLoading({ text: '保存成功', delay: 1 });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
        if (Platform.OS === 'ios' && fileUrl) {
          CameraRoll.save(fileUrl, { type: 'photo' })
            .then((res) => {
              console.log(res);
              setVisible(false);
              baseView.current.showLoading({ text: '保存成功', delay: 1 });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        setVisibleShow(false);
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

    const renderImagePreview = () => {
      return (
        <ImageView
          images={homeworkInterStore.getImages}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setVisible(false)}
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
              </View>
            );
          }}
        />
      );
    };

    const delSelfHomework = async () => {
      const res = await homeworkInterStore.delSelfHomework(homeworkInterStore.homeworkInfo.id);
      setShowModal(false);
      if (typeof res !== 'boolean') {
        baseView.current.showMessage({ text: res, delay: 2 });
      } else {
        baseView.current.showMessage({ text: '删除成功', delay: 2 });
        if (route.params.lectureId) {
          const result = await homeworkFormStore.getLectureList(route.params.lectureId, route.params.lessonType, false);
          if (result) {
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        }
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
              homeworkInterStore.asyncImageForm = [];
              homeworkInterStore.asyncImageForm.push({ url: image });
              setImageIndex(0);
              setVisible(true);
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

    const renderContent = () => {
      return (
        <View style={[tw.m3, tw.pB3, { borderRadius: 5, backgroundColor: colors.background }]}>
          {homeworkInterStore.homeworkInfoDetail?.retreatDiscription ? (
            <Card style={[tw.m2, { borderRadius: 8, backgroundColor: colors.background }]}>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <View style={[tw.bgRed100, tw.pY2, tw.pL2, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}>
                  <Text style={[tw.textRed400, { fontWeight: 'bold' }]}>退回作业原因：</Text>
                </View>
                <View style={[tw.flex1, tw.wFull, tw.pL2]}>
                  <Text>{homeworkInterStore.homeworkInfoDetail?.retreatDiscription}</Text>
                </View>
              </View>
            </Card>
          ) : null}
          <View style={[tw.pX3]}>
            <View style={[tw.flexRow, tw.itemsCenter, { borderBottomWidth: 1, borderBottomColor: colors.deepBackground }]}>
              <Text style={[tw.pY4, { fontSize: TITLE_SIZE, color: colors.placeholder }]}>
                题目：<Text style={[{ color: colors.text }]}>{homeworkInterStore.homeworkInfo.title}</Text>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.background
              }}
            >
              <View style={[tw.borderGray200, { borderBottomWidth: 1 }]}>
                <UselessTextInput
                  placeholder="作业内容"
                  multiline
                  editable={false}
                  numberOfLines={6}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                  onChangeText={(text) => (homeworkFormStore.context = text)}
                  value={homeworkInterStore.homeworkInfo.content}
                />
              </View>

              <Text style={[tw.mT2, { fontSize: 16, color: colors.placeholder }]}>附件：</Text>
              <View style={[{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }]}>
                {homeworkInterStore.getFiles.slice().map((item, index) => {
                  return renderFileView({ item, index });
                })}
              </View>
            </View>
          </View>
        </View>
      );
    };
    const renderStudentContent = () => {
      return (
        <View style={[tw.m3, tw.pB3, { borderRadius: 5, backgroundColor: colors.background }]}>
          <View style={[tw.pX3]}>
            <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                {homeworkInterStore.homeworkInfoDetail.student?.avatar ? (
                  <Avatar.Image size={25} source={{ uri: homeworkInterStore.homeworkInfoDetail.student.avatar.url }} />
                ) : (
                  <Icon name="face" size={25} color={colors.primary} />
                )}
                <Text style={[tw.pY3, tw.mL2, { fontSize: 14, color: colors.accent }]}>
                  <Text style={[{ fontSize: 16, color: colors.text }]}>{homeworkInterStore.homeworkInfoDetail.student?.username}</Text> 的作业
                </Text>
              </View>
              <Text style={[tw.pY3, tw.mL2, { fontSize: 14, color: colors.accent }]}>{renderStatusTag(homeworkInterStore.homeworkInfoDetail)}</Text>
            </View>

            <View
              style={{
                backgroundColor: colors.background
              }}
            >
              <View style={[tw.borderGray200, tw.pY4, tw.pX1, { borderBottomWidth: 1 }]}>
                <Text>内容：{homeworkInterStore.homeworkInfoDetail.content || '空内容'}</Text>
              </View>

              <Text style={[tw.mT2, { fontSize: 16, color: colors.placeholder }]}>附件：</Text>
              <View style={[{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }]}>
                {homeworkInterStore.getStudentFiles.slice().map((item, index) => {
                  return renderFileView({ item, index });
                })}
              </View>
            </View>
          </View>
        </View>
      );
    };
    const renderTeacherContent = () => {
      if (homeworkInterStore.homeworkInfoDetail.status && homeworkInterStore.homeworkInfoDetail.status >= HOMEWORK_STATUS_REVIEW) {
        return (
          <View style={[tw.m3, tw.pB3, { borderRadius: 5, backgroundColor: colors.background }]}>
            <View style={[tw.pX3]}>
              <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderBottomWidth: 1, borderBottomColor: colors.deepBackground }]}>
                <View style={[tw.flexRow, tw.itemsCenter]}>
                  {homeworkInterStore.homeworkInfoDetail.teacher?.avatar ? (
                    <Avatar.Image size={25} source={{ uri: homeworkInterStore.homeworkInfoDetail.teacher.avatar.url }} />
                  ) : (
                    <Icon name="face" size={25} color={colors.primary} />
                  )}
                  <Text style={[tw.pY3, tw.mL2, { fontSize: 14, color: colors.accent }]}>
                    <Text style={[{ fontSize: 16, color: colors.text }]}>{homeworkInterStore.homeworkInfoDetail.teacher?.username}</Text> 批改作业
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.background
                }}
              >
                <View style={[tw.borderGray200, tw.pY4, tw.pX1, { borderBottomWidth: 1 }]}>
                  <Text>内容：{homeworkInterStore.homeworkInfoDetail.reviewContent || '通过'}</Text>
                </View>

                <Text style={[tw.mT2, { fontSize: 16, color: colors.placeholder }]}>附件：</Text>
                <View style={[{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }]}>
                  {homeworkInterStore.getTeacherReviewFiles.slice().map((item, index) => {
                    return renderFileView({ item, index });
                  })}
                </View>
              </View>
            </View>
          </View>
        );
      }
    };

    const renderStatusTag = (data) => {
      switch (data.status) {
        case HOMEWORK_STATUS_CREATED:
        case HOMEWORK_STATUS_REVIEW:
          return '未完成';
        case HOMEWORK_STATUS_SUBMIT:
          return '待批改';
        case HOMEWORK_STATUS_CORRECTION:
          return '已批阅';
        default:
          return;
      }
    };

    const renderShowSetting = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.m10, { borderRadius: 7, backgroundColor: colors.background }]}
            visible={showModal}
            onDismiss={() => {
              setShowModal(false);
            }}
          >
            <View style={[{ borderRadius: 20, backgroundColor: colors.background }]}>
              <Text style={[tw.mY3, tw.selfCenter, { fontSize: 17, fontWeight: 'bold', color: colors.placeholder }]}>修改或删除</Text>
              <View style={[tw.itemsCenter, tw.mB2]}>
                <Text style={[{ color: colors.accent }]}>选择修改作业《{homeworkInterStore.homeworkInfo.title}》</Text>
              </View>
              <View style={[tw.flexRow, tw.borderGray200, { height: 45, borderTopWidth: 0.5 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.justifyCenter, tw.itemsCenter, tw.borderGray200, { borderRightWidth: 0.5 }]}
                  onPress={() => {
                    setShowModal(false);
                    navigation.navigate('Main', { screen: 'HomeworkTeacherEdi', params: { lectureId: route.params.lectureId } });
                  }}
                >
                  <Text style={[{ color: colors.accent }]}>订正</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}
                  onPress={async () => {
                    await delSelfHomework();
                  }}
                >
                  <Text style={[{ color: colors.notification }]}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderRetreatModal = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.m10, { borderRadius: 7, backgroundColor: colors.background }]}
            visible={retreatModal}
            onDismiss={() => {
              setRetreatModal(false);
            }}
          >
            <View style={[{ borderRadius: 20, backgroundColor: colors.background }]}>
              <Text style={[tw.mY3, tw.selfCenter, { fontSize: 17, fontWeight: 'bold', color: colors.placeholder }]}>请学生重做</Text>
              <TextInput
                placeholder="新建文件夹"
                style={[tw.mB3, tw.mX3, tw.bgGray200, tw.borderGray200, { height: 40, borderWidth: 0.5, borderRadius: 5 }]}
                value={retreatText}
                onChangeText={(e) => {
                  setRetreatText(e);
                }}
              />
              <View style={[tw.flexRow, tw.borderGray200, { height: 45, borderTopWidth: 0.5 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.justifyCenter, tw.itemsCenter, tw.borderGray200, { borderRightWidth: 0.5 }]}
                  onPress={() => {
                    setRetreatModal(false);
                    setRetreatText('');
                  }}
                >
                  <Text style={[{ color: colors.placeholder }]}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}
                  onPress={async () => {
                    homeworkInterStore.retreatHomework({ id: homeworkInterStore.homeworkInfoDetail.id, retreatDescription: retreatText }).then((res) => {
                      if (typeof res === 'boolean') {
                        setRetreatModal(false);
                        setRetreatText('');
                        homeworkInterStore.getHomeworkInfoDetail({ infoId: route.params.infoId }).then((result) => {
                          console.log(homeworkInterStore.homeworkInfoDetail, result, '作业详情');
                        });
                      } else {
                        setRetreatModal(false);
                        setRetreatText('');
                        baseView.current.showMessage({ text: res, delay: 2 });
                      }
                    });
                  }}
                >
                  <Text style={[{ color: colors.accent }]}>退回</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    if (homeworkInterStore.loading) {
      return (
        <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Appbar.Content title="完成情况" />
          </Appbar.Header>

          <ScrollView style={[{ marginBottom: 60, backgroundColor: colors.surface }]}>
            {renderContent()}
            {renderStudentContent()}
            {renderTeacherContent()}
            {renderPreview()}
            {renderImagePreview()}
            {renderShowSetting()}
          </ScrollView>
          <View style={[tw.absolute, tw.flexRow, tw.pB3, { bottom: 0, width: '100%', backgroundColor: colors.background }]}>
            <Button
              mode="outlined"
              contentStyle={[tw.p1]}
              labelStyle={[{ fontSize: BTN_TIP_SIZE, color: colors.notification }]}
              style={[tw.m3]}
              onPress={() => {
                if (homeworkInterStore.homeworkInfoDetail.status === HOMEWORK_STATUS_SUBMIT) {
                  setRetreatModal(true);
                } else if (
                  homeworkInterStore.homeworkInfoDetail.status === HOMEWORK_STATUS_CREATED ||
                  homeworkInterStore.homeworkInfoDetail.status === HOMEWORK_STATUS_REVIEW
                ) {
                  baseView.current.showMessage({ text: '学生作业还未提交', delay: 2 });
                } else {
                  baseView.current.showMessage({ text: '学生作业已经批改', delay: 2 });
                }
              }}
            >
              退回
            </Button>
            <Button
              mode={'contained'}
              contentStyle={[tw.p1]}
              labelStyle={[{ fontSize: BTN_TIP_SIZE }]}
              style={[tw.m3]}
              onPress={async () => {
                if (homeworkInterStore.homeworkInfoDetail.status === HOMEWORK_STATUS_CREATED) {
                  baseView.current.showMessage({ text: '学生作业还未提交', delay: 2 });
                } else {
                  navigation.navigate('Main', { screen: 'HomeworkTeacherCor', params: { lectureId: homeworkInterStore.homeworkInfoDetail.id } });
                }
              }}
            >
              批改
            </Button>
          </View>
          {renderRetreatModal()}
          <View style={[tw.pB3, { bottom: 0, width: '100%', backgroundColor: colors.background }]}>
            {homeworkInterStore.homeworkInfo.teacher?.id === userStore.userInfoDetail.id ||
              (lessonDetailStore.lessonDetail &&
              lessonDetailStore.lessonDetail.secondaryTeachers &&
              lessonDetailStore.lessonDetail.secondaryTeachers.filter((item) => item.id === userStore.userInfoDetail.id).length > 0 ? null : (
                <Button
                  mode={'contained'}
                  contentStyle={[tw.p1]}
                  labelStyle={[{ fontSize: BTN_TIP_SIZE }]}
                  style={[tw.m3]}
                  onPress={async () => {
                    navigation.navigate('Main', {
                      screen: 'HomeworkStudentCom',
                      params: { lectureId: homeworkInterStore.homeworkInfo.id }
                    });
                  }}
                >
                  {homeworkInterStore.homeworkInfoDetail.status !== HOMEWORK_STATUS_CREATED ? '重新提交' : '去完成'}
                </Button>
              ))}
          </View>
        </BaseView>
      );
    } else {
      return <ProfilePlaceholder />;
    }
  }
);
