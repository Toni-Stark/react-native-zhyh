import React, { useEffect, useRef, useState } from 'react';
import { Appbar, TextInput, useTheme, Card, Text, Button, Modal, Portal, Chip, Dialog, Switch } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Platform, SafeAreaView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../index';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { AttachmentType, CERTIFICATION_IMAGE_SIZE, MAX_UPLOAD_IMAGE, SchedulesType } from '../../../store/LessonDetailStore';
import { getRandomStringByTime, requestSaveImagePermission, t } from '../../../common/tools';
import ImagePicker, { Image, Options } from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import RNFS from 'react-native-fs';
import RNPhotoEditor from 'react-native-photo-editor/index';
import CameraRoll from '@react-native-community/cameraroll';
import { LessonCreateStore } from '../../../store/LessonCreateStore';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE, LESSON_TYPE_NEED_PAY, LESSON_TYPE_PASSWORD } from '../../../common/status-module';
import { useStore } from '../../../store';
import { UselessTextInput } from '../../../component/UselessTextInput';
import { RSA } from 'react-native-rsa-native';

export type ClassTypes = {
  type: number;
  name: string;
};

export type ScheduleType = {
  id?: string;
  name?: string;
  planningStartTime?: string;
  planningEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  weight?: 1;
};

type ScreenRouteProp = RouteProp<ScreensParamList, 'LessonDraftBox'>;
type Props = {
  route: ScreenRouteProp;
};
export const LessonDraftBox: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { createVodStore, lessonDetailStore, userStore, cloudSeaDiskStore } = useStore();
    const { control, errors } = useForm();
    const [lessonCreateStore] = useState(() => new LessonCreateStore());
    const [visible, setVisible] = useState(false);
    const [addClassVisible, setAddClassVisible] = useState(false);
    const [showModal, setShowModal] = useState([0, 0, 0]);
    const [selectMode, setSelectMode] = useState(0);
    const [visibleShow, setVisibleShow] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [modalSelectImage, setModalSelectImage] = useState(false);
    const [modeData, setModeData] = useState<any[]>([]);
    const [sectionName, setSectionName] = useState('');
    const [sectionDate, setSectionDate] = useState<any>('');
    const [sectionStart, setSectionStart] = useState<any>('');
    const [sectionEnd, setSectionEnd] = useState<any>('');
    const [datePickerMode, setDatePickerMode] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectModal, setSelectModal] = useState(0);
    const [visibleImage, setVisibleImage] = useState(false);
    const [visBGImage, setVisBGImage] = useState(false);
    const [delModal, setDelModal] = useState<boolean>(false);
    const [upModal, setUpModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [editClassVisible, setEditClassVisible] = useState(false);
    const [editClass, setEditClass] = useState<ScheduleType | undefined>(undefined);
    const [dateEditMode, setDateEditMode] = useState(false);
    const [editDate, setEditDate] = useState<any>('');
    const [editStart, setEditStart] = useState<any>('');
    const [editEnd, setEditEnd] = useState<any>('');
    const [selectModals, setSelectModals] = useState(0);
    const [dates, setDates] = useState(new Date());
    const [isShow, setIsShow] = useState(false);
    const [isErrorNow, setIsErrorNow] = useState<boolean>(false);
    const HOMEWORK_IMAGE_SIZE = 60;
    const MAX_UPLOAD_PICTURE = 6;

    useEffect(() => {
      if (selectModal === 0) {
        setSectionDate(date);
      } else if (selectModal === 1) {
        setSectionStart(date);
      } else if (selectModal === 2) {
        setSectionEnd(date);
      }
    }, [selectModal, date]);

    useEffect(() => {
      if (createVodStore.sectionName.length === 0) {
        setIsErrorNow(true);
      } else {
        setIsErrorNow(false);
      }
    }, [createVodStore.sectionName]);

    useEffect(() => {
      lessonCreateStore.getLessonDetail(route.params.lessonId, lessonDetailStore.typeNum).then((res) => {
        if (res) {
          if (res && lessonDetailStore.selectObj && lessonCreateStore.lessonDetail) {
            console.log(lessonCreateStore.lessonDetail, '===========');
            if (lessonDetailStore.typeNum === LESSON_TYPE_DEMAND - 1) {
              createVodStore.lessonDetails = lessonCreateStore.lessonDetail;
            }
            lessonDetailStore.selects = [];
            if (lessonCreateStore.lessonDetail.secondaryTeachers) {
              lessonDetailStore.selectObj = lessonCreateStore.lessonDetail.secondaryTeachers;
            }
            if (lessonCreateStore.lessonDetail.secondaryTeachers) {
              for (let i = 0; i < lessonCreateStore.lessonDetail.secondaryTeachers.length; i++) {
                if (lessonDetailStore.selects.indexOf(lessonCreateStore?.lessonDetail?.secondaryTeachers[i]?.id) === -1) {
                  lessonDetailStore.selects.push(lessonCreateStore.lessonDetail.secondaryTeachers[i].id);
                }
              }
            }
          }
        }
      });
      (async () => {
        if (userStore.userInfoDetail.business?.id) {
          await lessonCreateStore.getCategories(userStore.userInfoDetail.business?.id);
        }
      })();

      // (async () => {
      //   await lessonCreateStore.getSubjectList();
      // })();
      // (async () => {
      //   await lessonCreateStore.getGradeList();
      // })();
    }, [createVodStore, route.params.lessonId, lessonCreateStore, userStore.userInfoDetail.business?.id, lessonDetailStore]);

    useEffect(() => {
      if (selectModal === 0) {
        setSectionDate(date);
      } else if (selectModal === 1) {
        setSectionStart(date);
      } else if (selectModal === 2) {
        setSectionEnd(date);
      }
    }, [selectModal, date]);

    useEffect(() => {
      if (selectModals === 0) {
        setEditDate(dates);
      } else if (selectModals === 1) {
        console.log(dates, moment(dates).format('HH:mm'));
        setEditStart(dates);
      } else if (selectModals === 2) {
        setEditEnd(dates);
      }
    }, [selectModals, dates]);

    const addSession = () => {
      if (
        lessonCreateStore.lessonDetail?.schedules?.length === 0 ||
        (lessonCreateStore.lessonDetail?.schedules &&
          moment(lessonCreateStore.lessonDetail?.schedules[lessonCreateStore.lessonDetail?.schedules.length - 1].planningEndTime).format('YYYY MM DD HH mm') <
            moment(sectionStart).format('YYYY MM DD HH mm'))
      ) {
        if (sectionName.length > 0 && moment(sectionEnd).format('HH:mm:ss') !== 'Invalid date' && moment(sectionStart).format('HH:mm:ss') !== 'Invalid date') {
          const data: SchedulesType = {
            name: sectionName,
            planningEndTime: moment(sectionDate).format('YYYY-MM-DD') + ' ' + moment(sectionEnd).format('HH:mm:ss'),
            planningStartTime: moment(sectionDate).format('YYYY-MM-DD') + ' ' + moment(sectionStart).format('HH:mm:ss')
          };
          if (lessonCreateStore.lessonDetail) {
            lessonCreateStore.lessonDetail.schedules = lessonCreateStore.lessonDetail.schedules.concat(data);
            setAddClassVisible(false);
          }
        } else {
          baseView.current.showToast({ text: t('lessonDraft.nameAndTime'), delay: 1.5 });
        }
      } else {
        baseView.current.showToast({ text: t('lessonDraft.startTimes'), delay: 1.5 });
      }
    };

    const uploadPicture = (camera: boolean) => {
      const params: Options = {
        cropping: true,
        compressImageQuality: 0.9,
        compressImageMaxWidth: 1920,
        compressImageMaxHeight: 1080,
        multiple: true,
        mediaType: 'photo',
        forceJpg: true,
        maxFiles: MAX_UPLOAD_PICTURE
      };
      if (camera) {
        ImagePicker.openCamera(params)
          .then((image) => {
            const images: Image[] = Array.isArray(image) ? image : [image];
            lessonCreateStore.addImage(images, false);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        ImagePicker.openPicker(params)
          .then((image) => {
            const images: Image[] = Array.isArray(image) ? image : [image];
            lessonCreateStore.addImage(images, false);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    const uploadBGImage = async (image) => {
      baseView.current.showLoading({ text: t('lessonDraft.selecting') });
      if (lessonCreateStore.lessonDetail) {
        lessonCreateStore.lessonDetail.imageCover = await lessonCreateStore.uploadBackgroundImage(image);
      }
      baseView.current.hideLoading();
    };

    const changeBGImage = (camera: boolean) => {
      setVisBGImage(false);
      const params = {
        cropping: true,
        cropperCircleOverlay: false,
        cropperToolbarTitle: t('lessonDraft.selectCover'),
        cropperChooseText: t('myProfile.confirm'),
        cropperCancelText: t('myProfile.cancel')
      };
      if (camera) {
        ImagePicker.openCamera(params)
          .then(async (image) => {
            await uploadBGImage(image);
          })
          .catch(() => {
            baseView.current.showMessage({ text: t('myProfile.cancel'), delay: 2 });
          });
      } else {
        ImagePicker.openPicker(params)
          .then(async (image) => {
            await uploadBGImage(image);
          })
          .catch((err) => {
            if (err.toString() === 'Error: Cannot find image data') {
              baseView.current.showMessage({ text: t('myProfile.formatError'), delay: 2 });
            } else {
              baseView.current.showMessage({ text: t('myProfile.cancel'), delay: 2 });
            }
          });
      }
    };

    const updateLessons = async () => {
      baseView.current.showLoading({ text: t('lessonDraft.uploading'), delay: 1.5 });
      console.log(lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1, lessonDetailStore.typeNum === LESSON_TYPE_DEMAND - 1, '当前状态');

      if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
        if (lessonCreateStore.lessonDetail && lessonCreateStore.lessonDetail.presetStudentCount && lessonCreateStore.lessonDetail.presetStudentCount > 0) {
          await lessonCreateStore.startUploadAllImages().then((res) => {
            if (res) {
              baseView.current.hideLoading();
              if (lessonCreateStore.lessonDetail) {
                baseView.current.showLoading({ text: t('lessonDraft.sending'), delay: 1.5 });
                let list: string[] = [];
                let teacherIds: string[] = [];
                lessonCreateStore.attachments.map((item) => {
                  lessonCreateStore.lessonDetail?.imageDetailList?.push(item);
                });
                lessonCreateStore.lessonDetail.imageDetailList?.map((item) => {
                  list.push(item.id);
                });
                lessonCreateStore.lessonDetail.secondaryTeachers?.map((item) => {
                  teacherIds.push(item.id);
                });

                console.log({
                  authPassword: lessonCreateStore.password,
                  authType: lessonCreateStore.lessonDetail.authType,
                  categoryId: lessonCreateStore.lessonDetail.category?.id,
                  coverImageId: lessonCreateStore.lessonDetail.imageCover?.id,
                  description: lessonCreateStore.description,
                  detailImageIds: list,
                  name: lessonCreateStore.lessonDetail.name,
                  presetStudentCount: lessonCreateStore.lessonDetail.presetStudentCount,
                  price: lessonCreateStore.lessonDetail.price,
                  pricePrevious: lessonCreateStore.lessonDetail.pricePrevious,
                  primaryTeacherId: userStore.userInfoDetail.id,
                  schedules: lessonCreateStore.lessonDetail.schedules,
                  secondaryTeacherIds: teacherIds
                });

                if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PASSWORD) {
                  if (lessonCreateStore.password.length > 0) {
                    userStore.getPublicKey().then(async (result) => {
                      if (result) {
                        let resPass = await RSA.encrypt(lessonCreateStore.password, result);
                        lessonCreateStore
                          .updateLesson({
                            id: userStore.userInfoDetail.id,
                            teacherIds,
                            lessonId: lessonCreateStore.lessonDetail?.id,
                            imageList: list,
                            editPass: resPass
                          })
                          .then((createRes) => {
                            baseView.current.hideLoading();
                            console.log(createRes);
                            if (typeof createRes === 'boolean' && createRes) {
                              baseView.current.showMessage({ text: t('lessonDraft.modified') });
                              lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id }).then(() => {
                                setTimeout(() => {
                                  navigation.goBack();
                                }, 1500);
                              });
                            } else {
                              baseView.current.showMessage({ text: createRes, delay: 4 });
                            }
                          })
                          .catch((err) => {
                            baseView.current.showMessage({ text: err, delay: 4 });
                          });
                      }
                    });
                  }
                } else {
                  lessonCreateStore
                    .updateLesson({
                      id: userStore.userInfoDetail.id,
                      teacherIds,
                      lessonId: lessonCreateStore.lessonDetail?.id,
                      imageList: list
                    })
                    .then((createRes) => {
                      baseView.current.hideLoading();
                      console.log(createRes);
                      if (typeof createRes === 'boolean' && createRes) {
                        baseView.current.showMessage({ text: t('lessonDraft.modified') });
                        lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id }).then(() => {
                          setTimeout(() => {
                            navigation.goBack();
                          }, 1500);
                        });
                      } else {
                        baseView.current.showMessage({ text: createRes, delay: 4 });
                      }
                    })
                    .catch((err) => {
                      baseView.current.showMessage({ text: err, delay: 4 });
                    });
                }
              } else {
                console.log(5);
              }
            } else {
              console.log(6);
            }
          });
        } else {
          baseView.current.hideLoading();
          baseView.current.showMessage({ text: '学生上限范围是1~100', delay: 3 });
        }
      } else {
        if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_DEMAND - 1) {
          await lessonCreateStore.startUploadAllImages().then((res) => {
            let imageList: string[] = [];
            // let schedulesList: any[] = [];
            if (res) {
              lessonCreateStore.attachments.map((item) => {
                lessonCreateStore.lessonDetail?.imageDetailList?.push(item);
              });
              lessonCreateStore.lessonDetail?.imageDetailList?.map((item) => {
                imageList.push(item.id);
              });
              // createVodStore.lessonDetails?.schedules?.map((item, index) => {
              //   schedulesList.push({
              //     name: item.name,
              //     weight: index,
              //     resourceFiles: item.resourceFiles
              //   });
              // });
              console.log('[log]---------------------------------------------------------[log]');
              console.log({
                authPassword: lessonCreateStore.password,
                authType: createVodStore.lessonDetails?.authType,
                categoryId: lessonCreateStore.lessonDetail?.category?.id,
                coverImageId: lessonCreateStore.lessonDetail?.imageCover?.id,
                description: lessonCreateStore.description,
                detailImageIds: imageList,
                name: lessonCreateStore.lessonDetail?.name,
                presetStudentCount: lessonCreateStore.lessonDetail?.presetStudentCount,
                price: lessonCreateStore.lessonDetail?.price,
                pricePrevious: lessonCreateStore.lessonDetail?.pricePrevious,
                primaryTeacherId: userStore.userInfoDetail.id,
                schedules: createVodStore.lessonDetails?.schedules
              });
              console.log(createVodStore.lessonDetails?.schedules);
              console.log('[log]---------------------------------------------------------[log]');

              if (lessonDetailStore.lessonDetail?.authType === LESSON_TYPE_PASSWORD) {
                if (lessonCreateStore.password.length > 0) {
                  userStore.getPublicKey().then(async (result) => {
                    if (result) {
                      let resPass = await RSA.encrypt(lessonCreateStore.password, result);
                      lessonCreateStore
                        .updateVodLesson({
                          lessonId: lessonCreateStore.lessonDetail?.id,
                          authPassword: resPass,
                          authType: createVodStore.lessonDetails?.authType,
                          categoryId: lessonCreateStore.lessonDetail?.category?.id,
                          coverImageId: lessonCreateStore.lessonDetail?.imageCover?.id,
                          description: lessonCreateStore.description,
                          detailImageIds: imageList,
                          name: lessonCreateStore.lessonDetail?.name,
                          presetStudentCount: lessonCreateStore.lessonDetail?.presetStudentCount,
                          price: lessonCreateStore.lessonDetail?.price,
                          pricePrevious: lessonCreateStore.lessonDetail?.pricePrevious,
                          primaryTeacherId: userStore.userInfoDetail.id,
                          schedules: createVodStore.lessonDetails?.schedules
                        })
                        .then((createRes) => {
                          baseView.current.hideLoading();
                          console.log(createRes);
                          if (typeof createRes === 'boolean' && createRes) {
                            baseView.current.showMessage({ text: t('lessonDraft.modified') });
                            lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id }).then(() => {
                              setTimeout(() => {
                                navigation.goBack();
                              }, 1500);
                            });
                          } else {
                            baseView.current.showMessage({ text: t('lessonDraft.improveInfo'), delay: 4 });
                          }
                        })
                        .catch((err) => {
                          baseView.current.showMessage({ text: err, delay: 4 });
                        });
                    }
                  });
                }
              } else {
                lessonCreateStore
                  .updateVodLesson({
                    lessonId: lessonCreateStore.lessonDetail?.id,
                    authType: createVodStore.lessonDetails?.authType,
                    categoryId: lessonCreateStore.lessonDetail?.category?.id,
                    coverImageId: lessonCreateStore.lessonDetail?.imageCover?.id,
                    description: lessonCreateStore.description,
                    detailImageIds: imageList,
                    name: lessonCreateStore.lessonDetail?.name,
                    presetStudentCount: lessonCreateStore.lessonDetail?.presetStudentCount,
                    price: lessonCreateStore.lessonDetail?.price,
                    pricePrevious: lessonCreateStore.lessonDetail?.pricePrevious,
                    primaryTeacherId: userStore.userInfoDetail.id,
                    schedules: createVodStore.lessonDetails?.schedules
                  })
                  .then((createRes) => {
                    baseView.current.hideLoading();
                    console.log(createRes);
                    if (typeof createRes === 'boolean' && createRes) {
                      baseView.current.showMessage({ text: t('lessonDraft.modified') });
                      lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id }).then(() => {
                        setTimeout(() => {
                          navigation.goBack();
                        }, 1500);
                      });
                    } else {
                      baseView.current.showMessage({ text: t('lessonDraft.improveInfo'), delay: 4 });
                    }
                  })
                  .catch((err) => {
                    baseView.current.showMessage({ text: err, delay: 4 });
                  });
              }
            }
          });
        }
      }
    };

    const delScheduleList = (num: number) => {
      lessonCreateStore.lessonDetail?.schedules?.splice(num, 1);
    };

    const releaseAudit = async () => {
      if (lessonCreateStore.lessonDetail && lessonCreateStore.lessonDetail.id) {
        baseView.current.showLoading({ text: '提交审核' });
        console.log('要提交的文件状态', lessonDetailStore.typeNum);
        if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
          lessonCreateStore.releaseLive(lessonDetailStore.typeNum, lessonCreateStore.lessonDetail.id).then((res) => {
            if (res) {
              baseView.current.hideLoading();
              baseView.current.showLoading({ text: t('lessonDraft.successful'), delay: 1 });
              (async () => {
                await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                setTimeout(() => {
                  lessonDetailStore.statusNum = 1;
                  baseView.current.hideLoading();
                  navigation.goBack();
                }, 1000);
              })();
              baseView.current.hideLoading();
            }
          });
        } else if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_DEMAND - 1) {
          lessonCreateStore
            .releaseAudit(lessonCreateStore.lessonDetail.id)
            .then((res) => {
              if (res) {
                baseView.current.hideLoading();
                baseView.current.showLoading({ text: t('lessonDraft.successful'), delay: 1 });
                (async () => {
                  await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                  setTimeout(() => {
                    lessonDetailStore.statusNum = 1;
                    baseView.current.hideLoading();
                    navigation.goBack();
                  }, 1000);
                })();
              }
            })
            .catch((err) => {
              console.log(err);
            });
          baseView.current.hideLoading();
        }
      }
    };

    const changeChip = (num: number) => {
      showModal.splice(selectMode, 1, num);
      setShowModal([...showModal]);
      setVisible(false);
    };

    const handleEditImage = async (attachment: AttachmentType | null, image?: Image) => {
      setVisible(false);
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
                lessonCreateStore.addImage(
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
    };

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
                CameraRoll.save('file://' + newFile, { type: 'photo' }).then(() => {});
              })
              .catch(() => {});
          } else {
            CameraRoll.save('file://' + fileUrl, { type: 'photo' }).then(() => {});
          }
        }
        if (Platform.OS === 'ios' && fileUrl) {
          CameraRoll.save(fileUrl, { type: 'photo' })
            .then(() => {
              baseView.current.showLoading({ text: t('homework.successful') });
            })
            .catch(() => {});
        }
        baseView.current.hideLoading();
      } else {
        setVisibleShow(false);
        setVisibleImage(false);
        baseView.current.showLoading({ text: t('homework.operation'), delay: 1.5 });
      }
    };

    const openFile = async () => {
      createVodStore.addClassVisible = true;
    };

    const clearDate = () => {
      setSectionName('');
      setSectionDate('');
      setSectionStart('');
      setSectionEnd('');
      setSelectModal(0);
    };

    const delLesson = async () => {
      console.log(lessonDetailStore.typeNum, '这是作业分类');
      lessonCreateStore.delLesson(lessonDetailStore.typeNum, lessonCreateStore.lessonDetail?.id).then((res) => {
        if (typeof res === 'string') {
          baseView.current.showMessage({ text: res, delay: 2 });
        } else {
          if (res) {
            baseView.current.showToast({ text: '删除成功' });
            lessonDetailStore
              .getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id })
              .then((resList) => {
                if (resList) {
                  navigation.navigate('Lesson');
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            baseView.current.showMessage({ text: '删除失败', delay: 2 });
          }
        }
      });
    };

    const addVodFile = () => {
      if (!isErrorNow) {
        createVodStore.jumpFromDraft = true;
        createVodStore.addClassVisible = false;
        cloudSeaDiskStore.isEditVoidInfo = false;
        // navigation.navigate('Main', { screen: 'SelectVodPage', params: { name: createVodStore.sectionName } });
        cloudSeaDiskStore.demandName = createVodStore.sectionName;
        // cloudSeaDiskStore.types = ['mp3', 'wma', 'wav', 'mpeg-2'];
        navigation.navigate('CloudSeaDisk');
      } else {
        baseView.current.showToast({ text: t('createLessons.inputName'), delay: 1.5 });
      }
    };

    const renderPreview = () => {
      const renderEditButton = (props) => {
        return (
          <Button
            mode={'outlined'}
            style={[{ marginRight: 10 }]}
            onPress={async () => {
              if (imageIndex < lessonCreateStore.originAttachmentImages.length) {
                await handleSaveImage(lessonCreateStore.originAttachmentImages[props.imageIndex].url);
              } else {
                await handleSaveImage(lessonCreateStore.selectedImages[props.imageIndex - lessonCreateStore.originAttachmentImages.length].path, false);
              }
            }}
          >
            {t('lessonDraft.save')}
          </Button>
        );
      };
      return (
        <ImageView
          images={lessonCreateStore.getImages}
          imageIndex={imageIndex}
          visible={visibleShow}
          onRequestClose={() => setVisibleShow(false)}
          FooterComponent={(props) => {
            return (
              <View style={[tw.flexRow, tw.mB10, tw.mX10]}>
                <View style={[tw.flexGrow]}>
                  <Text style={{ color: colors.background }}>
                    {props.imageIndex + 1} / {lessonCreateStore.getImages.length}
                  </Text>
                </View>
                {renderEditButton(props)}
              </View>
            );
          }}
        />
      );
    };

    const selectClassModal = () => {
      return (
        <Portal>
          <Modal
            contentContainerStyle={[tw.m10, tw.p3, { borderRadius: 7, backgroundColor: colors.background }]}
            visible={modalSelectImage}
            onDismiss={() => {
              setModalSelectImage(false);
            }}
          >
            <Text style={[tw.selfCenter, { fontSize: 18 }]}>{t('homeworkCreated.selected')}</Text>
            {lessonCreateStore.homeworkGroup.map((item, index) => {
              if (item.studentCount > 0) {
                return (
                  <Button
                    style={[{ marginTop: 3 }]}
                    onPress={() => {
                      setModalSelectImage(false);
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

    const hideModal = () => {
      setShowActionSheet(false);
    };

    const renderCreateVodClass = () => {
      return (
        <Portal>
          <Modal
            visible={createVodStore.addClassVisible}
            onDismiss={() => {
              createVodStore.addClassVisible = false;
            }}
            contentContainerStyle={[tw.mX4, tw.p3, tw.flexRow, tw.flexWrap, tw.justifyAround, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <View style={[tw.flex1]}>
              <Text style={[tw.mY1, { fontSize: 16, fontWeight: 'bold' }]}>{t('createLessons.createSection')}</Text>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('createLessons.sectionName')}
                </Text>
                <TextInput
                  mode="flat"
                  placeholder={t('createLessons.pleaseSection')}
                  maxLength={600}
                  keyboardType="default"
                  style={[tw.flex1, { backgroundColor: colors.background }]}
                  onChangeText={(className) => {
                    createVodStore.sectionName = className;
                  }}
                  value={createVodStore.sectionName}
                  error={false}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[tw.flexRow, tw.itemsCenter, tw.pY3, tw.mT3]}
                onPress={() => {
                  addVodFile();
                }}
              >
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('createLessons.selectVideo')}
                </Text>
                <Text style={[tw.pL2, { color: colors.accent, fontSize: 17 }]}>{t('createLessons.clickVideo')}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
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

    const renderSelectedImages = () => {
      const output: JSX.Element[] = [];
      lessonCreateStore.getImages.forEach((image, index) => {
        output.push(
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={[
              {
                margin: 5
              }
            ]}
            onPress={() => {
              setImageIndex(index);
              if (lessonCreateStore.selectedImages.length > 0) {
                setVisibleImage(true);
              } else {
                setVisibleShow(true);
              }
            }}
            onLongPress={() => lessonCreateStore.removeImage(index, true)}
          >
            <FastImage
              key={index}
              style={{
                width: HOMEWORK_IMAGE_SIZE,
                height: HOMEWORK_IMAGE_SIZE,
                backgroundColor: colors.disabled,
                borderRadius: HOMEWORK_IMAGE_SIZE / 10
              }}
              source={{ uri: image.uri }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        );
      });
      const renderAddImages = () => {
        if (output.length < MAX_UPLOAD_IMAGE) {
          return (
            <TouchableOpacity
              key={666666}
              activeOpacity={0.6}
              style={[
                tw.itemsCenter,
                tw.justifyCenter,
                {
                  margin: 5,
                  width: CERTIFICATION_IMAGE_SIZE,
                  height: CERTIFICATION_IMAGE_SIZE,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderStyle: 'dashed',
                  borderColor: colors.disabled
                }
              ]}
              onPress={() => {
                setShowActionSheet(true);
              }}
            >
              <Icon name="add-circle-outline" size={30} color={colors.disabled} />
            </TouchableOpacity>
          );
        } else {
          return null;
        }
      };
      return (
        <View style={[tw.pY2, { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }]}>
          {output}
          {renderAddImages()}
        </View>
      );
    };

    const renderImagePreview = () => {
      const renderEditButton = (props) => {
        return (
          <View style={[tw.flexRow]}>
            <Button
              mode={'outlined'}
              style={[{ marginRight: 10 }]}
              onPress={async () => {
                if (props.imageIndex < lessonCreateStore.originAttachmentImages.length) {
                  await handleSaveImage(lessonCreateStore.originAttachmentImages[props.imageIndex].url);
                } else {
                  await handleSaveImage(lessonCreateStore.selectedImages[props.imageIndex - lessonCreateStore.originAttachmentImages.length].path, false);
                }
              }}
            >
              {t('homeworkRevision.preservation')}
            </Button>
            <Button
              mode={'outlined'}
              style={[{ marginRight: 10 }]}
              onPress={async () => {
                if (props.imageIndex < lessonCreateStore.originAttachmentImages.length) {
                  await handleEditImage(lessonCreateStore.originAttachmentImages[props.imageIndex], undefined);
                } else {
                  await handleEditImage(null, lessonCreateStore.selectedImages[props.imageIndex - lessonCreateStore.originAttachmentImages.length]);
                }
              }}
            >
              {t('homeworkRevision.modify')}
            </Button>
          </View>
        );
      };
      return (
        <ImageView
          images={lessonCreateStore.getImages}
          imageIndex={imageIndex}
          visible={visibleImage}
          onRequestClose={() => setVisibleImage(false)}
          FooterComponent={(props) => {
            return (
              <View style={[tw.flexRow, tw.mB10, tw.mX10]}>
                <View style={[tw.flexGrow]}>
                  <Text style={{ color: colors.background }}>
                    {props.imageIndex + 1} / {lessonCreateStore.getImages.length}
                  </Text>
                </View>
                {renderEditButton(props)}
              </View>
            );
          }}
        />
      );
    };

    const renderMode = () => {
      return (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            contentContainerStyle={[tw.mX4, tw.p3, tw.flexRow, tw.flexWrap, tw.justifyAround, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            {modeData.map((item, index) => (
              <Chip
                style={[tw.m1, { backgroundColor: showModal[selectMode] === index ? colors.accent : colors.lightHint }]}
                textStyle={[{ fontSize: 12 }]}
                key={index}
                onPress={() => {
                  if (lessonCreateStore.lessonDetail) {
                    switch (selectMode) {
                      // case 0:
                      //   lessonCreateStore.lessonDetail.type = item.type;
                      //   break;
                      // case 1:
                      //   lessonCreateStore.lessonDetail.gradeId = item.id;
                      //   break;
                      case 2:
                        console.log(item);
                        if (lessonCreateStore.lessonDetail.category?.id) {
                          lessonCreateStore.lessonDetail.category.id = item.id;
                        }
                        break;
                    }
                    changeChip(index);
                  }
                }}
              >
                {item.name}
              </Chip>
            ))}
          </Modal>
        </Portal>
      );
    };

    const renderCreateClass = () => {
      return (
        <Portal>
          <Modal
            visible={addClassVisible}
            onDismiss={() => {
              setAddClassVisible(false);
            }}
            contentContainerStyle={[tw.mX4, tw.p3, tw.flexRow, tw.flexWrap, tw.justifyAround, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <View style={[tw.flex1]}>
              <Text style={[tw.mY1, { fontSize: 16, fontWeight: 'bold' }]}>{t('lessonDraft.section')}</Text>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('lessonDraft.sectionName')}
                </Text>
                <TextInput
                  mode="flat"
                  label={t('lessonDraft.required')}
                  placeholder={t('lessonDraft.pleaseSection')}
                  maxLength={30}
                  keyboardType="default"
                  error={errors.sectionName}
                  value={sectionName}
                  style={[tw.flex1, { backgroundColor: colors.background }]}
                  onChangeText={(classChart) => setSectionName(classChart)}
                />
              </View>

              <View style={[tw.flexRow, tw.itemsCenter, tw.pY3]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('lessonDraft.festivalTime')}
                </Text>
                <TouchableOpacity
                  style={[tw.flex1]}
                  onPress={() => {
                    setDatePickerMode(true);
                  }}
                >
                  <Text style={[{ fontSize: 14 }]}>{moment(sectionDate).format('YYYY-MM-DD')} </Text>
                  <View style={[tw.mL5]}>
                    <Text>
                      {t('lessonDraft.starting')}: {moment(sectionStart).format('HH:mm:ss').length <= 11 ? moment(sectionStart).format('HH点mm分') : ' '}
                    </Text>
                    <Text>
                      {t('lessonDraft.end')}: {moment(sectionEnd).format('HH:mm:ss').length <= 11 ? moment(sectionEnd).format('HH点mm分') : ' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Button
                onPress={() => {
                  addSession();
                }}
              >
                {t('lessonDraft.sure')}
              </Button>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderDatePicker = () => {
      return (
        <Portal>
          <Modal
            visible={datePickerMode}
            onDismiss={() => {
              setAddClassVisible(false);
              setDatePickerMode(false);
              clearDate();
            }}
            contentContainerStyle={[tw.mX4, tw.p3, tw.itemsCenter, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <Text style={[tw.mT2, { color: colors.accent, fontSize: 18 }]}>
              {selectModal === 0 ? t('lessonDraft.selectDate') : selectModal === 1 ? t('lessonDraft.chooseStartTime') : t('lessonDraft.chooseEndTime')}
            </Text>
            <DatePicker locale="zh-Hans" mode={selectModal === 0 ? 'date' : 'time'} date={date} onDateChange={setDate} />
            <Button
              onPress={() => {
                if (selectModal === 0) {
                  setSelectModal(1);
                } else if (selectModal === 1) {
                  setSelectModal(2);
                } else if (selectModal === 2) {
                  if (
                    moment(date).format('HH:mm:ss').slice(0, 2) > moment(sectionStart).format('HH:mm:ss').slice(0, 2) ||
                    Number(moment(date).format('HH:mm:ss').slice(3, 5)) - Number(moment(sectionStart).format('HH:mm:ss').slice(3, 5)) >= 15
                  ) {
                    setSelectModal(0);
                    setDatePickerMode(false);
                  } else {
                    baseView.current.showToast({ text: t('lessonDraft.timeTip'), delay: 0.75 });
                  }
                }
              }}
            >
              {t('lessonDraft.sure')}
            </Button>
          </Modal>
        </Portal>
      );
    };

    const headerDialog = () => {
      return (
        <Portal>
          <Dialog
            style={[tw.mX16]}
            visible={visBGImage}
            onDismiss={() => {
              setVisBGImage(false);
            }}
          >
            <Dialog.Actions>
              <View style={[tw.flexCol, { width: '100%' }]}>
                <Button
                  onPress={() => {
                    changeBGImage(true);
                  }}
                >
                  {t('lessonDraft.camera')}
                </Button>
                <Button
                  onPress={() => {
                    changeBGImage(false);
                  }}
                >
                  {t('lessonDraft.photoAlbum')}
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      );
    };

    const renderBGImages = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            tw.selfCenter,
            tw.itemsCenter,
            tw.justifyCenter,
            {
              margin: 10,
              width: 260,
              height: 153.6,
              borderWidth: 1,
              borderRadius: 10,
              borderStyle: 'dashed'
            }
          ]}
          onPress={() => {
            setVisBGImage(true);
          }}
          onLongPress={() => {
            if (lessonCreateStore.lessonDetail) {
              lessonCreateStore.lessonDetail.imageCover = undefined;
            }
          }}
        >
          {lessonCreateStore.lessonDetail?.imageCover ? (
            <FastImage
              style={{
                width: 260,
                height: 153.6,
                backgroundColor: colors.disabled,
                borderRadius: HOMEWORK_IMAGE_SIZE / 10
              }}
              source={{ uri: lessonCreateStore.lessonDetail?.imageCover.url }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Icon name="add-circle-outline" size={30} color={colors.disabled} />
          )}
        </TouchableOpacity>
      );
    };

    // const getType = (item) => {
    //   return item.type === lessonCreateStore.lessonDetail?.type;
    // };
    // const getGradeId = (item) => {
    //   return item.id === lessonCreateStore.lessonDetail?.gradeId;
    // };
    const getCategoryId = (item) => {
      return item.id === lessonCreateStore.lessonDetail?.category?.id;
    };

    const delClassModal = () => {
      return (
        <Portal>
          <Modal
            visible={delModal}
            onDismiss={() => {
              setDelModal(false);
            }}
            contentContainerStyle={[tw.mX10, tw.pT2, tw.itemsCenter, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <Text style={[tw.mT2, { color: colors.text, fontSize: 16 }]}>{t('createLessons.again')}</Text>
            <Text style={[tw.mT2, { color: colors.accent, fontSize: 18 }]}>《{lessonCreateStore.lessonDetail?.name}》</Text>
            <View style={[tw.flexRow, tw.mT5, tw.borderGray200, { height: 40, borderBottomRadius: 12, borderTopWidth: 0.5 }]}>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={() => {
                  setDelModal(false);
                }}
              >
                <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.borderGray200, { borderRightWidth: 0.5 }]}>
                  <Text style={[{ color: colors.disabled }]}>{t('lessonDraft.cancel')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={async () => {
                  await delLesson();
                  setDelModal(false);
                }}
              >
                <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, { borderBottomLeftRadius: 12 }]}>
                  <Text style={[{ color: colors.accent }]}> {t('lessonDraft.sure')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };
    const updateClassModal = () => {
      return (
        <Portal>
          <Modal
            visible={upModal}
            onDismiss={() => {
              setUpModal(false);
            }}
            contentContainerStyle={[tw.mX10, tw.pT3, tw.itemsCenter, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <Text style={[tw.mT2, { color: colors.text, fontSize: 16 }]}>确认提交课程</Text>
            <Text style={[tw.mT2, { color: colors.accent, fontSize: 18 }]}>《{lessonCreateStore.lessonDetail?.name}》</Text>
            <Text style={[tw.mT5, { color: colors.disabled, fontSize: 10 }]}>提交课程前，请再次确认修改的内容，</Text>
            <Text style={[{ color: colors.disabled, fontSize: 10 }]}>提交课程后需要待管理人员审核，审核通过之后即可开始上课。</Text>
            <View style={[tw.flexRow, tw.borderGray200, { height: 40, borderBottomRadius: 12, borderTopWidth: 0.5 }]}>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={() => {
                  setUpModal(false);
                }}
              >
                <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.borderGray200, { borderRightWidth: 0.5 }]}>
                  <Text style={[{ color: colors.disabled }]}>{t('lessonDraft.cancel')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={async () => {
                  await releaseAudit();
                  setUpModal(false);
                }}
              >
                <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, { borderBottomLeftRadius: 12 }]}>
                  <Text style={[{ color: colors.accent }]}> {t('lessonDraft.sure')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };
    const editClassModal = () => {
      return (
        <Portal>
          <Modal
            visible={editModal}
            onDismiss={() => {
              setEditModal(false);
            }}
            contentContainerStyle={[tw.mX10, tw.pT3, tw.itemsCenter, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <Text style={[tw.mT2, { color: colors.text, fontSize: 16 }]}>请确认要修改课程内容</Text>
            <Text style={[tw.mT2, { color: colors.accent, fontSize: 18 }]}>《{lessonCreateStore.lessonDetail?.name}》</Text>
            <View style={[tw.flexRow, tw.mT5, tw.borderGray200, { height: 40, borderBottomRadius: 12, borderTopWidth: 0.5 }]}>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={() => {
                  setEditModal(false);
                }}
              >
                <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.borderGray200, { borderRightWidth: 0.5 }]}>
                  <Text style={[{ color: colors.disabled }]}>{t('lessonDraft.cancel')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={async () => {
                  await updateLessons();
                  setEditModal(false);
                }}
              >
                <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, { borderBottomLeftRadius: 12 }]}>
                  <Text style={[{ color: colors.accent }]}> {t('lessonDraft.sure')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      );
    };

    const editsScheduleList = () => {
      let data = Object.assign({}, editClass, {
        planningEndTime: moment(editEnd).format('YYYY-MM-DD HH:mm:ss'),
        planningStartTime: moment(editStart).format('YYYY-MM-DD HH:mm:ss')
      });
      console.log(data, '这是当前修改的时间');
      lessonCreateStore.lessonDetail?.schedules?.splice(sectionIndex, 1, data);
      // props.changeScheduleList(props.scheduleList);
      if (lessonCreateStore.lessonDetail?.schedules) {
        lessonCreateStore.scheduleList = lessonCreateStore.lessonDetail.schedules;
      }
    };

    const renderEditClass = () => {
      return (
        <Portal>
          <Modal
            visible={editClassVisible}
            onDismiss={() => {
              setEditClassVisible(false);
            }}
            contentContainerStyle={[tw.mX4, tw.p3, tw.flexRow, tw.flexWrap, tw.justifyAround, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <View style={[tw.flex1]}>
              <Text style={[tw.mY1, { fontSize: 16, fontWeight: 'bold' }]}>修改节次信息</Text>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('createLessons.sectionName')}
                </Text>
                <TextInput
                  mode="flat"
                  label={t('createLessons.required')}
                  placeholder={t('createLessons.pleaseSection')}
                  maxLength={30}
                  error={errors.sectionName}
                  value={editClass?.name}
                  style={[tw.flex1, { backgroundColor: colors.background }]}
                  onChangeText={(classChart) => {
                    let data = Object.assign({}, editClass, { name: classChart });
                    setEditClass(data);
                  }}
                />
              </View>

              <View style={[tw.flexRow, tw.itemsCenter, tw.pY3]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('createLessons.festivalTime')}
                </Text>
                <TouchableOpacity
                  style={[tw.flex1]}
                  onPress={() => {
                    setDateEditMode(true);
                  }}
                >
                  <Text style={[{ fontSize: 14 }]}>{moment(editDate).format('YYYY年MM月DD日')} </Text>
                  <View style={[tw.mL5]}>
                    <Text>
                      {t('createLessons.startingTime')}: {moment(editStart).format('HH:mm')}
                    </Text>
                    <Text>
                      {t('createLessons.endTime')}: {moment(editEnd).format('HH:mm')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Button
                onPress={() => {
                  editsScheduleList();
                  setEditClassVisible(false);
                }}
              >
                {t('createLessons.sure')}
              </Button>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderEditPicker = () => {
      return (
        <Portal>
          <Modal
            visible={dateEditMode}
            onDismiss={() => {
              setEditClassVisible(false);
              setDateEditMode(false);
            }}
            contentContainerStyle={[tw.mX4, tw.p3, tw.itemsCenter, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            <View style={[tw.flexRow]}>
              {selectModals === 2 ? (
                <View style={[tw.itemsCenter, tw.selfCenter]}>
                  <Text style={[{ color: colors.placeholder }]}>{t('createLessons.startingTime')}</Text>
                  <Text>{moment(editStart).format('HH:mm')}</Text>
                </View>
              ) : null}
              <View style={[tw.flex1, tw.itemsCenter]}>
                <Text style={[tw.mT2, { color: colors.accent, fontSize: 16 }]}>
                  {selectModals === 0 ? t('createLessons.selectDate') : selectModals === 1 ? t('createLessons.startCTime') : t('createLessons.endCTime')}
                </Text>
                <DatePicker style={[{ marginRight: 15 }]} locale="zh-Hans" mode={selectModals === 0 ? 'date' : 'time'} date={dates} onDateChange={setDates} />
                <Button
                  onPress={() => {
                    if (selectModals === 0) {
                      setSelectModals(1);
                    } else if (selectModals === 1) {
                      setSelectModals(2);
                    } else if (selectModals === 2) {
                      if (
                        moment(dates).format('HH:mm:ss').slice(0, 2) > moment(editStart).format('HH:mm:ss').slice(0, 2) ||
                        Number(moment(dates).format('HH:mm:ss').slice(3, 5)) - Number(moment(editStart).format('HH:mm:ss').slice(3, 5)) >= 15
                      ) {
                        setSelectModals(0);
                        setDateEditMode(false);
                      } else {
                        baseView.current.showMessage({ text: t('createLessons.leastMinutes'), delay: 0.75 });
                      }
                    }
                  }}
                >
                  {t('createLessons.sure')}
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const controlModal = () => {
      return (
        <View
          style={[
            tw.wFull,
            tw.justifyCenter,
            tw.p3,
            tw.flexRow,
            tw.justifyAround,
            { backgroundColor: colors.surface, paddingBottom: Platform.OS === 'ios' ? 50 : 30, borderRadius: 30 }
          ]}
        >
          <TouchableOpacity
            onPress={async () => {
              await updateLessons();
            }}
            style={[tw.itemsCenter, tw.justifyCenter]}
          >
            <View style={[tw.itemsCenter, tw.justifyCenter, tw.bgWhite, { width: 50, height: 50, borderRadius: 10 }]}>
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: HOMEWORK_IMAGE_SIZE / 10
                }}
                source={require('../../../assets/edit-cute.png')}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={[tw.mT1, { color: colors.accent, fontSize: 10 }]}>更新草稿</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              setUpModal(true);
            }}
            style={[tw.itemsCenter, tw.justifyCenter]}
          >
            <View style={[tw.itemsCenter, tw.justifyCenter, tw.bgWhite, { width: 50, height: 50, borderRadius: 10 }]}>
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: HOMEWORK_IMAGE_SIZE / 10
                }}
                source={require('../../../assets/update-cute.png')}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={[tw.mT1, { color: colors.accent, fontSize: 10 }]}>提交课程</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              setDelModal(true);
            }}
          >
            <View style={[tw.itemsCenter, tw.bgWhite, tw.justifyCenter, { width: 50, height: 50, borderRadius: 10 }]}>
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: HOMEWORK_IMAGE_SIZE / 10
                }}
                source={require('../../../assets/delete-cute.png')}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text
                onPress={async () => {
                  setDelModal(true);
                  // menuMoreSheet.current.snapTo(0);
                }}
                style={[tw.mT1, { color: colors.accent, fontSize: 10 }]}
              >
                删除草稿
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    const renderContent = () => {
      return (
        <View style={[tw.p3, { marginBottom: 30 }]}>
          {lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 ? (
            <View style={[tw.pT2, tw.mX6, tw.flexRow, tw.justifyBetween]}>
              <Text style={[{ color: colors.disabled }]}>教师</Text>
              <Text style={[{ color: colors.disabled }]}>{lessonDetailStore.selects.length + 1}人</Text>
            </View>
          ) : null}
          {lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 ? (
            <SafeAreaView style={[tw.borderGray200, { height: isShow ? 70 : 10, borderBottomWidth: 0.75 }]}>
              <ScrollView keyboardDismissMode="on-drag" horizontal showsHorizontalScrollIndicator={false}>
                <View style={[tw.flexRow, tw.pX6, tw.itemsCenter, tw.pY2, { height: 70 }]}>
                  <View style={[tw.bgOrange400, tw.itemsCenter, tw.justifyCenter, tw.mX1, { borderRadius: 8, width: 45, height: 45 }]}>
                    <Text style={[{ fontSize: 12, color: colors.background }]}>{userStore.userInfoDetail.username?.slice(0, 10)}</Text>
                  </View>
                  {lessonDetailStore.selects.map((id, index) => {
                    if (lessonDetailStore.selectObj) {
                      return lessonDetailStore.selectObj.filter((item) => item.id === id).length > 0 ? (
                        <View key={index} style={[tw.bgBlue500, tw.itemsCenter, tw.justifyCenter, tw.mX1, { borderRadius: 8, width: 45, height: 45 }]}>
                          <Text style={[{ fontSize: 12, color: colors.background }]}>
                            {lessonDetailStore.selectObj?.filter((sel) => sel.id === id)[0].username?.slice(0, 10)}
                          </Text>
                        </View>
                      ) : null;
                    }
                  })}
                  <View style={[tw.itemsCenter, tw.justifyCenter, tw.mX2, tw.borderGray300, { borderWidth: 0.75, borderRadius: 50, width: 35, height: 35 }]}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        navigation.navigate('Main', { screen: 'SelectTeacherList' });
                      }}
                    >
                      <Icon style={[tw.selfCenter]} name="add" size={33} color={colors.disabled} />
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          ) : null}

          <View style={[tw.pX3, { backgroundColor: colors.background }]}>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <Controller
                control={control}
                name="titleText"
                rules={{ required: { value: false, message: t('lessonDraft.titleMust') }, pattern: /^.{1,600}$/ }}
                defaultValue=""
                render={({ onChange }) => (
                  <TextInput
                    mode="flat"
                    placeholder={t('lessonDraft.pleaseTitle')}
                    maxLength={600}
                    keyboardType="default"
                    style={[tw.flex1, { backgroundColor: colors.background }]}
                    onChangeText={(className) => {
                      onChange(className);
                      if (lessonCreateStore.lessonDetail) {
                        lessonCreateStore.lessonDetail.name = className;
                      }
                    }}
                    value={lessonCreateStore.lessonDetail?.name}
                    error={errors.titleText}
                  />
                )}
              />
            </View>
            {lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 ? (
              <View style={[tw.bgGray300, tw.itemsCenter, tw.justifyCenter, tw.absolute, { right: 10, top: 16, borderRadius: 50, width: 30, height: 30 }]}>
                <TouchableOpacity style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}>
                  <Icon
                    name={isShow ? 'arrow-upward' : 'arrow-downward'}
                    size={18}
                    color={colors.disabled}
                    onPress={() => {
                      setIsShow(!isShow);
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 ? (
              <View style={[tw.pY2, tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
                <Text style={[{ fontSize: 17, color: colors.placeholder }]}>是否录制视频</Text>
                <Switch
                  value={lessonCreateStore.lessonDetail?.autoRecord}
                  onValueChange={(e) => {
                    if (typeof lessonCreateStore.lessonDetail !== 'undefined') {
                      lessonCreateStore.lessonDetail.autoRecord = e;
                    }
                  }}
                />
              </View>
            ) : null}

            {lessonCreateStore.lessonDetail?.authType === LESSON_TYPE_NEED_PAY ? (
              <View style={[tw.flexRow, tw.itemsCenter]}>
                {/*<Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>*/}
                {/*  {t('lessonDraft.registration')}*/}
                {/*</Text>*/}
                <Controller
                  control={control}
                  name="priceInput"
                  rules={{
                    required: { value: false, message: t('lessonDraft.RegistrationFilled') },
                    pattern: /^(0|([1-9]\d*))(\.\d{1,2})?$/
                  }}
                  defaultValue=""
                  render={({ onChange }) => (
                    <TextInput
                      label={t('lessonDraft.xueyue')}
                      placeholder={t('lessonDraft.enterTheFee')}
                      maxLength={6}
                      keyboardType="number-pad"
                      style={[tw.flex1, tw.borderGray300, { backgroundColor: colors.background, borderRightWidth: 0.5 }]}
                      onChangeText={(text) => {
                        onChange(text);
                        if (lessonCreateStore.lessonDetail) {
                          lessonCreateStore.lessonDetail.price = text;
                        }
                      }}
                      value={lessonCreateStore.lessonDetail?.price?.toString()}
                      error={errors.priceInput}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="pricePrevious"
                  pricePrevious
                  rules={{
                    required: { value: false, message: t('lessonDraft.RegistrationFilled') },
                    pattern: /^(0|([1-9]\d*))(\.\d{1,2})?$/
                  }}
                  defaultValue=""
                  render={({ onChange }) => (
                    <TextInput
                      label="（原价）"
                      placeholder="初始报名价"
                      maxLength={6}
                      keyboardType="number-pad"
                      style={[tw.flex1, { backgroundColor: colors.background }]}
                      onChangeText={(pricePrevious) => {
                        onChange(pricePrevious);
                        if (lessonCreateStore.lessonDetail) {
                          lessonCreateStore.lessonDetail.pricePrevious = pricePrevious;
                        }
                      }}
                      value={lessonCreateStore.lessonDetail?.pricePrevious?.toString()}
                      error={errors.pricePrevious}
                    />
                  )}
                />
              </View>
            ) : lessonCreateStore.lessonDetail?.authType === LESSON_TYPE_PASSWORD ? (
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  修改密码
                </Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: { value: true, message: t('createLessons.titleMust') }, pattern: /^[a-zA-Z0-9]{1,600}$/ }}
                  defaultValue=""
                  render={({ onChange }) => (
                    <TextInput
                      mode="flat"
                      placeholder="默认不修改"
                      maxLength={600}
                      keyboardType={'numeric'}
                      style={[tw.flex1, { height: 40, fontSize: 16, backgroundColor: colors.background }]}
                      onChangeText={(password) => {
                        onChange(password);
                        lessonCreateStore.password = password;
                      }}
                      value={lessonCreateStore.password}
                      error={errors.password}
                    />
                  )}
                />
              </View>
            ) : null}
            <TouchableOpacity
              style={[tw.flexRow, tw.itemsCenter, tw.pY4, tw.borderGray200, { borderBottomWidth: 0.5 }]}
              onPress={() => {
                setSelectMode(2);
                // if (lessonCreateStore.grade) {
                //   setModeData(lessonCreateStore.grade);
                // }
                if (lessonCreateStore.categories) {
                  setModeData(lessonCreateStore.categories);
                }
                setVisible(true);
              }}
            >
              <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                所属类型
              </Text>
              <Text style={[tw.pX5, { fontSize: 18, color: colors.accent }]}>{lessonCreateStore.categories?.filter(getCategoryId)[0]?.name}</Text>
            </TouchableOpacity>
            <UselessTextInput
              placeholder="请输入课程简介"
              multiline
              numberOfLines={6}
              placeholderTextColor={colors.disabled}
              onChangeText={(text) => {
                console.log(text);
                lessonCreateStore.description = text;
              }}
              value={lessonCreateStore.description}
            />
            {lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 || lessonDetailStore.typeNum === null ? (
              <View style={[tw.flexRow, tw.itemsCenter, tw.borderGray200, { borderTopWidth: 0.5 }]}>
                <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                  {t('lessonDraft.numberPeople')}
                </Text>
                <Controller
                  control={control}
                  name="classSize"
                  rules={{ required: { value: false, message: '' }, pattern: /^\d{1,5}$/ }}
                  defaultValue=""
                  render={({ onChange }) => (
                    <TextInput
                      placeholder={t('lessonDraft.maxNumber')}
                      maxLength={5}
                      keyboardType="numeric"
                      style={[tw.flex1, { backgroundColor: colors.background }]}
                      onChangeText={(text) => {
                        onChange(text);
                        if (lessonCreateStore.lessonDetail) {
                          lessonCreateStore.lessonDetail.presetStudentCount = text;
                        }
                      }}
                      value={lessonCreateStore.lessonDetail?.presetStudentCount?.toString()}
                      error={errors.classSize}
                    />
                  )}
                />
              </View>
            ) : null}

            {/*<TouchableWithoutFeedback*/}
            {/*  onPress={async () => {*/}
            {/*    if (lessonCreateStore.lessonDetail?.type === LESSON_TYPE_VOD) {*/}
            {/*      await openFile();*/}
            {/*    } else {*/}
            {/*      setAddClassVisible(true);*/}
            {/*    }*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <View*/}
            {/*    style={[*/}
            {/*      tw.selfCenter,*/}
            {/*      tw.itemsCenter,*/}
            {/*      tw.pY3,*/}
            {/*      tw.mT3,*/}
            {/*      { width: '70%', borderWidth: 1, borderColor: colors.accent, borderRadius: 8, borderStyle: 'dashed' }*/}
            {/*    ]}*/}
            {/*  >*/}
            {/*    <Icon color={colors.accent} name="control-point" size={26} />*/}
            {/*    <Text style={{ color: colors.placeholder }}>{t('lessonDraft.newClass')}</Text>*/}
            {/*  </View>*/}
            {/*</TouchableWithoutFeedback>*/}
            <TouchableWithoutFeedback
              onPress={async () => {
                if (lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 || lessonDetailStore.typeNum === null) {
                  setAddClassVisible(true);
                } else {
                  await openFile();
                }
              }}
            >
              <View
                style={[
                  tw.selfCenter,
                  tw.itemsCenter,
                  tw.pY3,
                  tw.mY3,
                  {
                    width: '100%',
                    borderWidth: 1,
                    borderColor: colors.accent,
                    borderRadius: 8,
                    borderStyle: 'dashed'
                  }
                ]}
              >
                <Icon color={colors.accent} name="control-point" size={26} />
                <Text style={{ color: colors.placeholder }}>{t('createLessons.newClass')}</Text>
              </View>
            </TouchableWithoutFeedback>
            {lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1 || lessonDetailStore.typeNum === null
              ? lessonCreateStore.lessonDetail?.schedules?.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSectionIndex(index);
                      if (lessonCreateStore.lessonDetail?.schedules) {
                        setEditClass(lessonCreateStore.lessonDetail.schedules[index]);
                        setEditDate(lessonCreateStore.lessonDetail.schedules[index]?.planningStartTime);
                        setEditStart(lessonCreateStore.lessonDetail.schedules[index]?.planningStartTime);
                        setEditEnd(lessonCreateStore.lessonDetail.schedules[index]?.planningEndTime);
                      }
                      setEditClassVisible(true);
                    }}
                    key={index}
                  >
                    <View style={[tw.m2, tw.p2, tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderColor: colors.disabled, borderBottomWidth: 0.5 }]}>
                      <View>
                        <Text numberOfLines={1} style={[tw.overflowHidden]}>
                          课程（{index + 1}）: <Text style={[{ color: colors.accent, fontSize: 16 }]}>{item.name}</Text>
                        </Text>
                        <Text style={[tw.mT2]}>
                          {moment(item.planningStartTime).format('YYYY-MM-DD HH:mm') + ' - ' + moment(item.planningEndTime).format('HH:mm')}
                        </Text>
                      </View>
                      <Icon
                        size={26}
                        color={colors.disabled}
                        onPress={() => {
                          delScheduleList(index);
                        }}
                        name="remove-circle"
                      />
                    </View>
                  </TouchableOpacity>
                ))
              : null}
            {lessonDetailStore.typeNum === LESSON_TYPE_DEMAND - 1
              ? createVodStore.lessonDetails?.schedules?.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      createVodStore.jumpFromDraft = true;
                      cloudSeaDiskStore.isEditVoidInfo = false;
                      cloudSeaDiskStore.isEditPage = true;
                      cloudSeaDiskStore.selectSessionIndex = index;
                      if (createVodStore.lessonDetails?.schedules && createVodStore.lessonDetails.schedules[index].resourceFiles) {
                        createVodStore.draftVodInfo = createVodStore.lessonDetails.schedules[index].resourceFiles || [];
                      }
                      console.log('展示列表数据', createVodStore.draftVodInfo);
                      navigation.navigate('Main', { screen: 'SectionInfo', options: { animationEnabled: false } });
                    }}
                    key={index}
                  >
                    <View style={[tw.m2, tw.p2, tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderColor: colors.disabled, borderBottomWidth: 0.5 }]}>
                      <View>
                        <Text numberOfLines={1} style={[tw.overflowHidden]}>
                          {t('createLessons.courseName')}（{index + 1}）: <Text style={[{ fontSize: 14, color: colors.accent }]}>{item.name}</Text>
                        </Text>
                        <Text ellipsizeMode="middle" numberOfLines={1} style={[{ width: 180, marginTop: 5, fontSize: 13, color: colors.accent }]}>
                          共{item.resourceFiles?.length}个资源
                        </Text>
                      </View>
                      <Icon
                        size={26}
                        color={colors.notification}
                        onPress={() => {
                          delScheduleList(index);
                        }}
                        name="remove-circle"
                      />
                    </View>
                  </TouchableOpacity>
                ))
              : null}
            <Text style={[tw.mT3, { fontSize: 15, color: colors.disabled }]}>{t('lessonDraft.uploadPicture')}</Text>
            {renderSelectedImages()}
            <Text style={[tw.mB3, { fontSize: 14, color: colors.disabled }]}>{t('createLessons.tipOne')}</Text>
            <Text style={[tw.mT3, { color: colors.disabled }]}>{t('lessonDraft.uploadImage')}</Text>
            {renderBGImages()}
            <Text style={[tw.mB3, { fontSize: 15, color: colors.disabled }]}>{t('createLessons.tipTwo')}</Text>
          </View>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[{ backgroundColor: colors.background }]}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('lessonDraft.publishingCourses')} />
          <TouchableOpacity
            style={[tw.pX2]}
            onPress={async () => {
              await updateLessons();
            }}
          >
            <Text style={[tw.mR3, tw.p2, { color: colors.accent }]}>保存</Text>
          </TouchableOpacity>
        </Appbar.Header>
        {lessonCreateStore.lessonDetail?.retreatDescription ? (
          <Card style={[tw.m2, { borderRadius: 8, backgroundColor: colors.background }]}>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <View style={[tw.bgRed100, tw.pY2, tw.pL2, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}>
                <Text style={[tw.textRed400, { fontWeight: 'bold' }]}>驳回审批理由：</Text>
              </View>
              <View style={[tw.flex1, tw.wFull, tw.pL2]}>
                <Text>{lessonCreateStore.lessonDetail.retreatDescription}</Text>
              </View>
            </View>
          </Card>
        ) : null}
        <ScrollView style={[tw.flex1]}>
          {renderContent()}
          {renderMode()}
          {renderPreview()}
          {headerDialog()}
          {selectClassModal()}
          {delClassModal()}
          {updateClassModal()}
          {editClassModal()}
          {renderCreateClass()}
          {renderDatePicker()}
          {renderImagePreview()}
          {renderCreateVodClass()}
          {showModalSelect()}
          {renderEditClass()}
          {renderEditPicker()}
        </ScrollView>
        {/*{controlModal()}*/}
        {/*{floatDelButton()}*/}
        {/*{floatUpButton()}*/}
        {/*{floatEditButton()}*/}
        {/*{menuMore()}*/}
      </BaseView>
    );
  }
);
