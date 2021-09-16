import React, { useEffect, useRef, useState } from 'react';
import { Appbar, useTheme, Text, Button, Portal, Modal, Avatar, Card } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Platform, ScrollView, TouchableOpacity, View, Dimensions, Linking } from 'react-native';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../../index';
import { useStore } from '../../../../store';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFileSize, getRandomStringByTime, getStr, requestSaveImagePermission } from '../../../../common/tools';
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
import moment from 'moment';
import AvatarView from '../../../../component/AvatarView';

export type AudioListType = {
  url: string;
};

type ScreenRouteProp = RouteProp<ScreensParamList, 'HomeworkInteraction'>;

type Props = {
  route: ScreenRouteProp;
};

export const HomeworkInteraction: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { homeworkFormStore, homeworkInterStore, userStore, homeworkCreateStore, userRolesStore } = useStore();
    const [imageIndex, setImageIndex] = useState(0);
    const [visibleShow, setVisibleShow] = useState(false);
    const HOMEWORK_IMAGE_SIZE = 50;
    const [visible, setVisible] = useState(false);
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const TITLE_SIZE: number = UI_SIZE ? 18 : 16;
    const BTN_TIP_SIZE: number = UI_SIZE ? 14 : 12;
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      if (route.params?.infoId) {
        (async () => {
          const res = await homeworkInterStore.getHomeworkInfo({ infoId: route.params.infoId });
          if (typeof res === 'boolean') {
            if (userRolesStore.isStudentId.filter((item) => item === userStore.userInfoDetail.id).length > 0) {
              console.log(
                homeworkInterStore.homeworkInfo,
                homeworkInterStore.homeworkInfo.id,
                homeworkInterStore.homeworkInfo.homeworkLessonStudentList?.filter((item) => item.student?.id === userStore.userInfoDetail.id)[0].id,
                '学生作业id'
              );
              const result = await homeworkInterStore.getHomeworkInfoDetail({
                infoId: homeworkInterStore.homeworkInfo.homeworkLessonStudentList?.filter((item) => item.student?.id === userStore.userInfoDetail.id)[0].id
              });
              if (typeof result !== 'boolean') {
                baseView.current.showMessage({ text: res, delay: 2 });
              }
            }
          }
        })();
      }
      return (() => {
        homeworkInterStore.loading = false;
        homeworkInterStore.homeworkInfo = {};
        homeworkCreateStore.allFileList = [];
        homeworkInterStore.homeworkInfoDetail = {};
      })();
    }, [homeworkCreateStore, homeworkInterStore, route.params.infoId, userRolesStore.isStudentId, userStore.userInfoDetail.id]);

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
        if (route.params?.lectureId) {
          const result = await homeworkFormStore.getLectureList(route.params.lectureId, route.params.lessonType, false);
          if (result) {
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        }
      }
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
          {userRolesStore.isStudentId.filter((item) => item === userStore.userInfoDetail.id).length > 0 &&
          homeworkInterStore.homeworkInfoDetail.status !== HOMEWORK_STATUS_CREATED &&
          homeworkInterStore.homeworkInfoDetail?.retreatDiscription ? (
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
      if (userRolesStore.isStudentId.find((item) => item === userStore.userInfoDetail.id)) {
        return (
          <View style={[tw.m3, tw.pB3, { borderRadius: 5, backgroundColor: colors.background }]}>
            <View style={[tw.pX3]}>
              <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderBottomWidth: 1, borderBottomColor: colors.deepBackground }]}>
                <View style={[tw.flexRow, tw.itemsCenter]}>
                  {homeworkInterStore.homeworkInfoDetail.student?.avatar ? (
                    <Avatar.Image size={25} source={{ uri: homeworkInterStore.homeworkInfoDetail.student.avatar.url }} />
                  ) : (
                    <Icon name="face" size={70} color={colors.primary} />
                  )}
                  <Text style={[tw.pY3, tw.mL2, { fontSize: 14, color: colors.accent }]}>
                    <Text style={[{ fontSize: 16, color: colors.text }]}>{homeworkInterStore.homeworkInfoDetail.student?.username}</Text> 提交作业
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.background
                }}
              >
                <View style={[tw.borderGray200, tw.pY4, tw.pX1, { borderBottomWidth: 1 }]}>
                  <Text>内容：{homeworkInterStore.homeworkInfoDetail.content}</Text>
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
      }
    };
    const renderTeacherContent = () => {
      if (
        userRolesStore.isStudentId.find((item) => item === userStore.userInfoDetail.id) &&
        homeworkInterStore.homeworkInfoDetail.status &&
        homeworkInterStore.homeworkInfoDetail.status >= HOMEWORK_STATUS_REVIEW
      ) {
        return (
          <View style={[tw.m3, tw.pB3, { borderRadius: 5, backgroundColor: colors.background }]}>
            <View style={[tw.pX3]}>
              <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderBottomWidth: 1, borderBottomColor: colors.deepBackground }]}>
                <View style={[tw.flexRow, tw.itemsCenter]}>
                  {homeworkInterStore.homeworkInfoDetail.teacher?.avatar ? (
                    <Avatar.Image size={25} source={{ uri: homeworkInterStore.homeworkInfoDetail.teacher.avatar.url }} />
                  ) : (
                    <Icon name="face" size={70} color={colors.primary} />
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
                  {homeworkInterStore.getTeacherFiles.slice().map((item, index) => {
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
                    navigation.navigate('Main', { screen: 'HomeworkTeacherEdi', params: { lectureId: route.params?.lectureId } });
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

    const renderFunction = () => {
      let isTeacher =
        userRolesStore.isTeacherId === userStore.userInfoDetail.id ||
        userRolesStore.isSecTeacherId.filter((item) => item === userStore.userInfoDetail.id).length > 0;
      if (isTeacher) {
        return (
          <View>
            <View
              style={[
                tw.pX3,
                tw.mX3,
                tw.flexRow,
                tw.itemsCenter,
                tw.justifyBetween,
                {
                  borderRadius: 6,
                  backgroundColor: colors.background,
                  height: 35
                }
              ]}
            >
              {homeworkInterStore.selectList.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[tw.flex1, tw.justifyCenter]}
                    onPress={() => {
                      homeworkInterStore.selectStatus = index + 1;
                    }}
                  >
                    <View
                      style={[tw.mY2, tw.itemsCenter, tw.borderGray300, { borderRightWidth: index !== homeworkInterStore.selectList.length - 1 ? 0.5 : 0 }]}
                    >
                      <Text
                        style={[
                          {
                            fontWeight: homeworkInterStore.selectStatus === index + 1 ? 'bold' : '400',
                            color: homeworkInterStore.selectStatus === index + 1 ? colors.text : colors.placeholder,
                            fontSize: 12
                          }
                        ]}
                      >
                        {item.name}：
                        <Text style={[{ color: colors.accent }]}>
                          （
                          {index + 1 === HOMEWORK_STATUS_CREATED
                            ? homeworkInterStore.homeworkInfo.notSubmitCount
                            : index + 1 === HOMEWORK_STATUS_SUBMIT
                            ? homeworkInterStore.homeworkInfo.submitCount
                            : index + 1 === HOMEWORK_STATUS_REVIEW
                            ? homeworkInterStore.homeworkInfo.reviewCount
                            : ''}
                          ）
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[tw.mT2]}>
              {homeworkInterStore.getStudentList.slice().map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.2}
                    onPress={() => {
                      homeworkInterStore.loading = false;
                      navigation.navigate('Main', {
                        screen: 'HomeworkTeacherCom',
                        params: { infoId: item.id, lectureId: homeworkInterStore.homeworkInfo.id }
                      });
                    }}
                    key={index}
                    style={[tw.mX3]}
                  >
                    <View
                      style={[
                        tw.flexRow,
                        tw.justifyBetween,
                        tw.p3,
                        {
                          borderTopRightRadius: index === 0 ? 8 : 0,
                          borderTopLeftRadius: index === 0 ? 8 : 0,
                          borderBottomRightRadius: index === homeworkInterStore.getStudentList.length - 1 ? 8 : 0,
                          borderBottomLeftRadius: index === homeworkInterStore.getStudentList.length - 1 ? 8 : 0,
                          backgroundColor: colors.background
                        }
                      ]}
                    >
                      <View style={[tw.flexRow, tw.itemsCenter]}>
                        <AvatarView
                          name={getStr(item.student?.username ? item.student.username : '')}
                          avatar={item.student?.avatar && item.student.avatar.url ? item.student.avatar.url : ''}
                          size={40}
                        />
                        <View style={[tw.mL2]}>
                          <Text style={[{ fontSize: 16 }]}>{item.student?.username}</Text>
                          <Text style={[tw.mT2, { color: colors.placeholder, fontSize: 12 }]}>
                            {moment(item.student?.createdTime ? item.student.createdTime : item.student?.updatedTime).format('YYYY-MM-DD HH:mm')}
                          </Text>
                        </View>
                      </View>

                      <View style={[tw.flexRow, tw.itemsCenter]}>
                        <Text style={[tw.selfCenter, { fontSize: 13 }]}>{renderStatusTag(item)}</Text>
                        <Icon name="navigate-next" size={25} color={colors.placeholder} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      } else {
        return null;
      }
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
            <Appbar.Content title="作业详情" />
            {homeworkInterStore.homeworkInfo.teacher?.id === userStore.userInfoDetail.id ? (
              <TouchableOpacity
                onPress={() => {
                  setShowModal(true);
                }}
              >
                <Icon style={[tw.mR2]} name="more-vert" color={colors.placeholder} size={22} />
              </TouchableOpacity>
            ) : null}
          </Appbar.Header>

          <ScrollView style={[{ backgroundColor: colors.surface }]}>
            {renderContent()}
            {renderStudentContent()}
            {renderTeacherContent()}
            {renderFunction()}
            {renderPreview()}
            {renderImagePreview()}
            {renderShowSetting()}
          </ScrollView>
          <View style={[tw.pB3, { bottom: 0, width: '100%', backgroundColor: colors.background }]}>
            {userRolesStore.isTeacherId === userStore.userInfoDetail.id ||
              (userRolesStore.isSecTeacherId.filter((item) => item === userStore.userInfoDetail.id).length > 0 ? null : (
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
