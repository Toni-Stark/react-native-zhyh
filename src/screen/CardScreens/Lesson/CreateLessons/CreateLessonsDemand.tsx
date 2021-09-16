import React, { useEffect, useRef, useState } from 'react';
import { Appbar, Button, Chip, Dialog, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../../index';
import { getRandomStringByTime, requestSaveImagePermission, t } from '../../../../common/tools';
import { Platform, TouchableOpacity, View } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { FirstStep } from '../../../../component/lesson/CreateLessonsDemand/FirstStep';
import { SecondStep } from '../../../../component/lesson/CreateLessonsDemand/SecondStep';
import { LastStep } from '../../../../component/lesson/CreateLessonsDemand/LastStep';
import { useStore } from '../../../../store';
import { ClassTypes } from '../../../../store/LessonCreateStore';
import ImageView from 'react-native-image-viewing';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import { AttachmentType } from '../../../../store/LessonDetailStore';
import ImagePicker, { Image, Options } from 'react-native-image-crop-picker';
import RNPhotoEditor from 'react-native-photo-editor/index';
import moment from 'moment';
import { RSA } from 'react-native-rsa-native';
import { LESSON_TYPE_LIVE, LESSON_TYPE_PASSWORD } from '../../../../common/status-module';

const reg = new RegExp(/^(0|((0|([1-9])\d{0,9})(\.\d{1,2})?))$/);

type Props = {};

export const CreateLessonsDemand: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>(undefined);
    const [isValid, setIsValid] = useState(false);
    const [isPassed, setIsPassed] = useState(false);
    const [errors, setErrors] = useState(false);
    const [errorsTwo, setErrorsTwo] = useState(false);
    const { lessonCreateStore, userStore, lessonDetailStore, createVodStore, cloudSeaDiskStore } = useStore();
    const [modeData, setModeData] = useState<any[]>([]);
    const [selectMode, setSelectMode] = useState(0);
    const [classType] = useState<ClassTypes[]>([
      { type: 1, name: '开放模式' },
      { type: 2, name: '密码模式' },
      { type: 3, name: '支付模式' },
      { type: 4, name: '管理模式' }
    ]);

    const [visibleShow, setVisibleShow] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [visibleImage, setVisibleImage] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [visBGImage, setVisBGImage] = useState(false);

    const [isErrorNow, setIsErrorNow] = useState<boolean>(false);

    const MAX_UPLOAD_PICTURE = 6;

    useEffect(() => {
      (async () => {
        if (userStore.userInfoDetail.business?.id) {
          await lessonCreateStore.getCategories(userStore.userInfoDetail.business?.id);
        }
      })();
      (async () => {
        // await lessonCreateStore.getGradeList();
      })();
    }, [lessonCreateStore, userStore.userInfoDetail.business?.id]);

    useEffect(() => {
      console.log(lessonCreateStore.classNames.length);
      if (lessonCreateStore.classNames.trim().length > 0) {
        if (lessonCreateStore.classPrice.trim().length > 0) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
    }, [lessonCreateStore.classNames, lessonCreateStore.classPrice]);

    useEffect(() => {
      if (lessonCreateStore.classSizes > 0) {
        if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
          if (lessonCreateStore.scheduleList.length > 0) {
            if (lessonCreateStore.selectArray[0] === 1 && lessonCreateStore.classSizes > 10) {
              setIsPassed(false);
              return;
            }
            setIsPassed(true);
          } else {
            setIsPassed(false);
            return;
          }
        } else {
          if (createVodStore.sectionVodInfo.length > 0) {
            if (lessonCreateStore.selectArray[0] === 1 && lessonCreateStore.classSizes > 10) {
              setIsPassed(false);
              return;
            }
            setIsPassed(true);
          } else {
            setIsPassed(false);
            return;
          }
        }
      } else {
        setIsPassed(false);
      }
    }, [
      createVodStore.sectionVodInfo,
      createVodStore.sectionVodInfo.length,
      lessonCreateStore.classSizes,
      lessonCreateStore.scheduleList.length,
      lessonCreateStore.selectArray,
      lessonDetailStore.typeNum
    ]);

    useEffect(() => {
      if (createVodStore.sectionName.length === 0) {
        setIsErrorNow(true);
      } else {
        setIsErrorNow(false);
      }
    }, [createVodStore.sectionName]);

    const onNextStep = () => {
      console.log(isValid, 'isValid', lessonCreateStore.classPrice.trim().length === 0, classType[lessonCreateStore.selectArray[0]].type === 3);
      if (!isValid) {
        if (lessonCreateStore.classNames.trim().length === 0) {
          setErrors(true);
          baseView.current.showMessage({ text: t('createLessons.courseNameMustBe'), delay: 3 });
        } else if (classType[lessonCreateStore.selectArray[0]].type === 3) {
          if (lessonCreateStore.classPrice.trim().length === 0) {
            baseView.current.showMessage({ text: t('createLessons.courseFeeMustBe'), delay: 3 });
            setErrors(true);
          } else if (reg.exec(lessonCreateStore.classPrice) === null) {
            baseView.current.showMessage({ text: t('createLessons.courseFeeFormat'), delay: 3 });
            setErrors(true);
          } else {
            setErrors(false);
          }
        } else if (classType[lessonCreateStore.selectArray[0]].type === 2) {
          if (lessonCreateStore.password.trim().length <= 0) {
            baseView.current.showMessage({ text: '请在密码访问类型中，设置密码', delay: 3 });
            setErrors(true);
          } else {
            setErrors(false);
          }
        }
      } else {
        setErrors(false);
      }
    };

    const onNextStepTwo = () => {
      console.log('[log]-----[log]');
      console.log(lessonCreateStore.scheduleList.length, lessonCreateStore.classSizes, isPassed, lessonCreateStore.createLessonType, errorsTwo);
      console.log('[log]-----[log]');
      if (!isPassed) {
        if (lessonCreateStore.createLessonType !== LESSON_TYPE_LIVE) {
          if (createVodStore.sectionVodInfo.length > 0) {
            setErrorsTwo(false);
          } else {
            baseView.current.showMessage({ text: '请补充点播课资源。', delay: 3 });
            setErrorsTwo(true);
          }
        }
      } else {
        setErrorsTwo(false);
      }
    };

    const renderMode = () => {
      return (
        <Portal>
          <Modal
            visible={lessonCreateStore.visible}
            onDismiss={() => (lessonCreateStore.visible = false)}
            contentContainerStyle={[tw.mX6, tw.pY5, tw.flexRow, tw.flexWrap, { borderRadius: 12, backgroundColor: colors.background }]}
          >
            {modeData.map((item, index) => (
              <Chip
                style={[
                  tw.m1,
                  {
                    backgroundColor: (
                      selectMode === 0
                        ? index === lessonCreateStore.selectArray[0]
                        : selectMode === 1
                        ? index === lessonCreateStore.selectArray[1]
                        : selectMode === 2
                        ? index === lessonCreateStore.selectArray[2]
                        : false
                    )
                      ? colors.accent
                      : colors.surface,
                    borderRadius: 5
                  }
                ]}
                textStyle={[
                  {
                    fontSize: 12,
                    color: (
                      selectMode === 0
                        ? index === lessonCreateStore.selectArray[0]
                        : selectMode === 1
                        ? index === lessonCreateStore.selectArray[1]
                        : selectMode === 2
                        ? index === lessonCreateStore.selectArray[2]
                        : false
                    )
                      ? colors.background
                      : colors.text
                  }
                ]}
                key={index}
                onPress={() => {
                  lessonCreateStore.selectArray.splice(selectMode, 1, index);
                  lessonCreateStore.visible = false;
                }}
              >
                {item.name}
              </Chip>
            ))}
          </Modal>
        </Portal>
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

    const handleEditImage = async (attachment: AttachmentType | null, image?: Image) => {
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

    const hideModal = () => {
      setShowActionSheet(false);
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

    const clearStore = () => {
      lessonCreateStore.selectArray = [0, 0, 0];
      lessonCreateStore.classNames = '';
      lessonCreateStore.classPrice = '';
      lessonCreateStore.classSizes = 0;
      lessonCreateStore.description = '';
      lessonCreateStore.scheduleList = [];
      createVodStore.sectionVodInfo = [];
      lessonCreateStore.attachments = [];
      lessonCreateStore.attachments = [];
      lessonCreateStore.selectedImages = [];
      lessonCreateStore.originAttachmentImages = [];
    };
    let imageUrlList: string[] = [];
    const updateLesson = async () => {
      // console.log({
      //   authPassword: 'string',
      //   password: lessonCreateStore.password,
      //   authType: classType[lessonCreateStore.selectArray[0]].type,
      //   categoryId: lessonCreateStore.categories?.slice()[lessonCreateStore.selectArray[2]].id,
      //   coverImageId: lessonCreateStore.backgroundImage?.id,
      //   description: lessonCreateStore.description,
      //   detailImageIds: imageUrlList,
      //   name: lessonCreateStore.classNames,
      //   presetStudentCount: lessonCreateStore.classSizes,
      //   price: lessonCreateStore.classPrice,
      //   pricePrevious: lessonCreateStore.previousPrice,
      //   primaryTeacherId: userStore.userInfoDetail.id,
      //   schedules: lessonCreateStore.scheduleList,
      //   secondaryTeacherIds: [0]
      // });
      lessonDetailStore.typeNum = 1;
      lessonDetailStore.statusNum = 0;
      if (classType[lessonCreateStore.selectArray[0]].type === LESSON_TYPE_PASSWORD) {
        if (lessonCreateStore.password.length > 0) {
          userStore.getPublicKey().then((result) => {
            if (result) {
              RSA.encrypt(lessonCreateStore.password, result).then(async (resPass) => {
                baseView.current.showLoading({ text: t('createLessons.selecting') });
                await lessonCreateStore.startUploadAllImages().then((res) => {
                  imageUrlList = [];
                  for (let i = 0; i < lessonCreateStore.attachments.length; i++) {
                    console.log(lessonCreateStore.attachments[i]);
                    imageUrlList.push(lessonCreateStore.attachments[i].id);
                  }
                  if (res) {
                    baseView.current?.hideLoading();
                    if (userStore.userInfoDetail.id) {
                      baseView.current.showLoading({ text: t('createLessons.resources') });
                      lessonCreateStore
                        .createLessons(imageUrlList, resPass, classType, userStore.userInfoDetail.id, lessonCreateStore.selectArray)
                        .then((createRes) => {
                          baseView.current?.hideLoading();
                          if (typeof createRes === 'string') {
                            baseView.current.showMessage({ text: createRes, delay: 2 });
                          } else if (createRes) {
                            baseView.current.showMessage({ text: t('createLessons.createdSuc') });
                            (async () => {
                              await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                              clearStore();
                              baseView.current.showLoading({ text: t('createLessons.return') });
                              setTimeout(() => {
                                baseView.current?.hideLoading();
                                navigation.navigate('Lesson');
                              }, 1500);
                            })();
                          } else {
                            baseView.current?.hideLoading();
                            baseView.current.showMessage({ text: t('createLessons.improveInfo'), delay: 2 });
                          }
                        });
                    }
                  } else {
                    baseView.current?.hideLoading();
                  }
                });
              });
            } else {
              baseView.current.showMessage({ text: '密码格式不符', delay: 2 });
            }
          });
        }
      } else {
        await lessonCreateStore.startUploadAllImages().then((res) => {
          imageUrlList = [];
          for (let i = 0; i < lessonCreateStore.attachments.length; i++) {
            console.log(lessonCreateStore.attachments[i]);
            imageUrlList.push(lessonCreateStore.attachments[i].id);
          }
          if (res) {
            baseView.current?.hideLoading();
            if (userStore.userInfoDetail.id) {
              baseView.current.showLoading({ text: t('createLessons.resources') });
              lessonCreateStore.createLessons(imageUrlList, '', classType, userStore.userInfoDetail.id, lessonCreateStore.selectArray).then((createRes) => {
                baseView.current?.hideLoading();
                if (typeof createRes === 'string') {
                  baseView.current.showMessage({ text: createRes, delay: 2 });
                } else if (createRes) {
                  baseView.current.showMessage({ text: t('createLessons.createdSuc') });
                  (async () => {
                    await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                    clearStore();
                    baseView.current.showLoading({ text: t('createLessons.return') });
                    setTimeout(() => {
                      baseView.current?.hideLoading();
                      navigation.navigate('Lesson');
                    }, 1500);
                  })();
                } else {
                  baseView.current?.hideLoading();
                  baseView.current.showMessage({ text: t('createLessons.improveInfo'), delay: 2 });
                }
              });
            }
          } else {
            baseView.current?.hideLoading();
          }
        });
      }
    };

    const updateVodLesson = async () => {
      lessonDetailStore.typeNum = 1;
      lessonDetailStore.statusNum = 0;
      if (classType[lessonCreateStore.selectArray[0]].type === LESSON_TYPE_PASSWORD) {
        if (lessonCreateStore.password.length > 0) {
          userStore.getPublicKey().then((result) => {
            if (result) {
              RSA.encrypt(lessonCreateStore.password, result).then(async (resPass) => {
                await lessonCreateStore.startUploadAllImages().then(async () => {
                  imageUrlList = [];
                  for (let i = 0; i < lessonCreateStore.attachments.length; i++) {
                    console.log(lessonCreateStore.attachments[i]);
                    imageUrlList.push(lessonCreateStore.attachments[i].id);
                  }
                  let dataList: any[] = [];
                  createVodStore.sectionVodInfo.map((item, index) => {
                    createVodStore.sectionVodInfo[index].weight = index;
                    dataList.push(createVodStore.sectionVodInfo[index]);
                  });
                  createVodStore
                    .updateVodLessons({
                      authPassword: resPass,
                      authType: classType[lessonCreateStore.selectArray[0]].type,
                      businessId: userStore.userInfoDetail.business?.id,
                      categoryId: lessonCreateStore.categories?.slice()[lessonCreateStore.selectArray[2]].id,
                      coverImageId: lessonCreateStore.backgroundImage?.id,
                      description: lessonCreateStore.description,
                      detailImageIds: imageUrlList,
                      name: lessonCreateStore.classNames,
                      price: lessonCreateStore.classPrice,
                      pricePrevious: lessonCreateStore.previousPrice,
                      primaryTeacherId: userStore.userInfoDetail.id,
                      schedules: dataList
                    })
                    .then((vodRes) => {
                      if (typeof vodRes === 'boolean') {
                        (async () => {
                          await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                          clearStore();
                          baseView.current.showToast({ text: t('createVod.createSuc'), delay: 1.5 });
                          setTimeout(() => {
                            navigation.navigate('Lesson');
                          }, 300);
                        })();
                      } else {
                        baseView.current.showMessage({ text: vodRes, delay: 2 });
                      }
                    });
                });
              });
            }
          });
        }
      } else {
        await lessonCreateStore.startUploadAllImages().then(async () => {
          imageUrlList = [];
          for (let i = 0; i < lessonCreateStore.attachments.length; i++) {
            console.log(lessonCreateStore.attachments[i]);
            imageUrlList.push(lessonCreateStore.attachments[i].id);
          }

          let dataList: any[] = [];
          createVodStore.sectionVodInfo.map((item, index) => {
            createVodStore.sectionVodInfo[index].weight = index;
            dataList.push(createVodStore.sectionVodInfo[index]);
          });
          createVodStore
            .updateVodLessons({
              authType: classType[lessonCreateStore.selectArray[0]].type,
              businessId: userStore.userInfoDetail.business?.id,
              categoryId: lessonCreateStore.categories?.slice()[lessonCreateStore.selectArray[2]].id,
              coverImageId: lessonCreateStore.backgroundImage?.id,
              description: lessonCreateStore.description,
              detailImageIds: imageUrlList,
              name: lessonCreateStore.classNames,
              price: lessonCreateStore.classPrice,
              pricePrevious: lessonCreateStore.previousPrice,
              primaryTeacherId: userStore.userInfoDetail.id,
              schedules: dataList
            })
            .then((vodRes) => {
              if (typeof vodRes === 'boolean') {
                (async () => {
                  await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                  clearStore();
                  baseView.current.showToast({ text: t('createVod.createSuc'), delay: 1.5 });
                  navigation.navigate('Lesson');
                })();
              } else {
                baseView.current.showMessage({ text: vodRes, delay: 2 });
              }
            });
        });
      }
    };

    const openFile = async () => {
      createVodStore.addClassVisible = true;
    };

    const renderCreateClass = () => {
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
                  keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
                  defaultValue={createVodStore.sectionName}
                  style={[tw.flex1, { backgroundColor: colors.background }]}
                  onChangeText={(className) => {
                    createVodStore.sectionName = className;
                  }}
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

    const addVodFile = () => {
      if (!isErrorNow) {
        createVodStore.jumpFromDraft = false;
        createVodStore.addClassVisible = false;
        cloudSeaDiskStore.isEditVoidInfo = false;
        // navigation.navigate('Main', { screen: 'SelectVodPage', params: { name: createVodStore.sectionName } });
        cloudSeaDiskStore.demandName = createVodStore.sectionName;
        navigation.navigate('CloudSeaDisk');
      } else {
        baseView.current.showToast({ text: t('createLessons.inputName'), delay: 1.5 });
      }
    };

    const onSubmit = async () => {
      if (lessonCreateStore.createLessonType === LESSON_TYPE_LIVE) {
        await updateLesson();
      } else {
        await updateVodLesson();
        console.log(createVodStore.sectionVodInfo);
        console.log({
          authPassword: 'string',
          authType: lessonCreateStore.createLessonType,
          businessId: userStore.userInfoDetail.business?.id,
          categoryId: lessonCreateStore.categories?.slice()[lessonCreateStore.selectArray[2]].id,
          coverImageId: lessonCreateStore.backgroundImage?.id,
          description: lessonCreateStore.description,
          detailImageIds: imageUrlList,
          name: lessonCreateStore.classNames,
          price: lessonCreateStore.classPrice,
          pricePrevious: lessonCreateStore.previousPrice,
          primaryTeacherId: userStore.userInfoDetail.id,
          schedules: createVodStore.sectionVodInfo
        });
      }
    };

    const renderContent = () => {
      return (
        <View style={{ flex: 1 }}>
          <ProgressSteps
            borderWidth={3}
            activeStepIconBorderColor={colors.accent}
            activeStepIconColor="#ffffff"
            activeLabelColor={colors.accent}
            completedLabelColor={colors.accent}
            completedCheckColor={colors.background}
            completedProgressBarColor={colors.accent}
            completedStepIconColor={colors.accent}
          >
            <ProgressStep label={t('createLessons.firstStep')} nextBtnText={t('createLessons.nextPage')} onNext={onNextStep} errors={errors}>
              <View style={[tw.mX10]}>
                <FirstStep
                  classType={classType}
                  grade={lessonCreateStore.grade}
                  subject={lessonCreateStore.subject}
                  categories={lessonCreateStore.categories}
                  changeSelectMode={(e) => {
                    setSelectMode(e);
                    switch (e) {
                      case 0:
                        setModeData(classType);
                        break;
                      case 1:
                        if (lessonCreateStore.grade) {
                          setModeData(lessonCreateStore.grade);
                        }
                        break;
                      case 2:
                        if (lessonCreateStore.categories) {
                          setModeData(lessonCreateStore.categories);
                        }
                        break;
                    }
                    lessonCreateStore.visible = true;
                  }}
                  selectArray={lessonCreateStore.selectArray}
                  changePassword={(e) => {
                    lessonCreateStore.password = e;
                  }}
                  password={lessonCreateStore.password}
                  className={lessonCreateStore.classNames}
                  changeClassName={(e) => {
                    lessonCreateStore.classNames = e;
                  }}
                  content={lessonCreateStore.description}
                  setContent={(e) => {
                    lessonCreateStore.description = e;
                  }}
                  classPrice={lessonCreateStore.classPrice}
                  changeClassPrice={(e) => (lessonCreateStore.classPrice = e)}
                  previousPrice={lessonCreateStore.previousPrice}
                  setPreviousPrice={(e) => (lessonCreateStore.previousPrice = e)}
                  changeIsAutoRecord={(e: boolean) => console.log(e)}
                  vodOrDemand={lessonCreateStore.createLessonType}
                />
              </View>
            </ProgressStep>
            <ProgressStep
              previousBtnText={t('createLessons.previousPage')}
              nextBtnText={t('createLessons.nextPage')}
              label={t('createLessons.stepTwo')}
              onNext={onNextStepTwo}
              errors={errorsTwo}
            >
              <View style={[tw.mX10]}>
                <SecondStep
                  baseView={baseView}
                  openFile={openFile}
                  searchInfo={(num) => {
                    cloudSeaDiskStore.isEditVoidInfo = true;
                    cloudSeaDiskStore.selectSessionIndex = num;
                    cloudSeaDiskStore.isEditPage = false;
                    navigation.navigate('Main', { screen: 'SectionInfo', options: { animationEnabled: false } });
                  }}
                  sectionVodInfo={createVodStore.sectionVodInfo.slice()}
                  vodOrDemand={lessonCreateStore.createLessonType}
                  scheduleList={lessonCreateStore.scheduleList.slice()}
                  changeScheduleList={(e) => {
                    lessonCreateStore.scheduleList = e;
                  }}
                  delScheduleList={(e) => {
                    lessonCreateStore.scheduleList.splice(e, 1);
                  }}
                  delScheduleVodList={(e) => {
                    createVodStore.sectionVodInfo.splice(e, 1);
                  }}
                  classSize={lessonCreateStore.classSizes}
                  changeClassSize={(e) => {
                    if (!isNaN(Number(e))) {
                      lessonCreateStore.classSizes = Number(e);
                    }
                  }}
                />
              </View>
            </ProgressStep>
            <ProgressStep
              finishBtnText={t('createLessons.success')}
              previousBtnText={t('createLessons.previousPage')}
              label={t('createLessons.thirdStep')}
              onSubmit={onSubmit}
              errors={errors}
            >
              <View style={[tw.mX10]}>
                <LastStep
                  imageUrl={lessonCreateStore.backgroundImage}
                  delImageUrl={() => {
                    lessonCreateStore.backgroundImage = undefined;
                  }}
                  changeShowActionSheet={(e) => {
                    setShowActionSheet(e);
                  }}
                  changeVisBGImage={(e) => {
                    setVisBGImage(e);
                  }}
                  changeVisibleImage={(e) => {
                    setVisibleImage(e);
                  }}
                  changeVisibleShow={(e) => {
                    setVisibleShow(e);
                  }}
                  removeImage={(num, bool) => {
                    lessonCreateStore.removeImage(num, bool);
                  }}
                  changeImageIndex={(e) => {
                    setImageIndex(e);
                  }}
                  getImages={lessonCreateStore.getImages}
                  selectedImages={lessonCreateStore.selectedImages}
                />
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      );
    };

    const uploadBGImage = async (image) => {
      baseView.current.showLoading({ text: t('createLesson.selecting') });
      lessonCreateStore.backgroundImage = await lessonCreateStore.uploadBackgroundImage(image);
      console.log(lessonCreateStore);
      baseView.current.hideLoading();
    };

    const changeBGImage = (camera: boolean) => {
      setVisBGImage(false);
      const params = {
        cropping: true,
        cropperCircleOverlay: false,
        cropperToolbarTitle: t('createLesson.selectCover'),
        cropperChooseText: t('createLesson.confirm'),
        cropperCancelText: t('createLesson.cancel')
      };
      if (camera) {
        ImagePicker.openCamera(params)
          .then(async (image) => {
            if (!Array.isArray(image)) {
              // setImageUrl(image.path);
              await uploadBGImage(image);
            }
          })
          .catch(() => {
            baseView.current.showMessage({ text: t('myProfile.cancel'), delay: 2 });
          });
      } else {
        ImagePicker.openPicker(params)
          .then(async (image) => {
            if (!Array.isArray(image)) {
              // setImageUrl(image.path);
              await uploadBGImage(image);
            }
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
                  {t('createLessons.camera')}
                </Button>
                <Button
                  onPress={() => {
                    changeBGImage(false);
                  }}
                >
                  {t('createLessons.photoAlbum')}
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      );
    };

    const renderPreview = () => {
      const renderEditButton = (props) => {
        console.log(props);
        return (
          <Button
            mode={'outlined'}
            style={[{ marginRight: 10 }]}
            onPress={async () => {
              console.assert('12345');
            }}
          >
            {t('createLesson.save')}
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

    return (
      <BaseView ref={baseView} useSafeArea={false} scroll={false} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('createLessons.createLesson')} />
        </Appbar.Header>
        {renderContent()}
        {renderMode()}
        {headerDialog()}
        {renderPreview()}
        {renderImagePreview()}
        {showModalSelect()}
        {renderCreateClass()}
      </BaseView>
    );
  }
);
