import React, { useEffect, useRef, useState } from 'react';
import { Modal, Portal, Text, useTheme } from 'react-native-paper';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { Dimensions, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { t } from '../common/tools';
import { observer } from 'mobx-react-lite';
import { LessonList } from '../component/lesson/LessonList';
import { LESSON_STATUS_CREATED, LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE, USER_MODE_CLASS_STUDENT, USER_MODE_CLASS_TEACHER } from '../common/status-module';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { throttle } from '../common/tools';

export const Lesson: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const isAndroid: boolean = Platform.OS === 'android';
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const TITLE_SIZE: number = isAndroid ? 20 : UI_SIZE ? 22 : 18;
    const BTN_INPUT_SIZE: number = UI_SIZE ? 15 : 12;
    const BTN_ICON_SIZE: number = UI_SIZE ? 18 : 16;
    const BTN_SELECT_SIZE: number = UI_SIZE ? 14 : 12;
    const { userStore, lessonDetailStore, lessonCreateStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [statusSel, setStatusSel] = useState(true);
    const [listIndex, setListIndex] = useState(0);
    const [dataList] = useState<DataListType>({
      status: [
        [
          { name: t('lesson.published'), type: 1 },
          {
            name: t('lesson.over'),
            type: 2
          }
        ],
        [
          { name: t('lesson.drafts'), type: 1 },
          { name: t('lesson.examine'), type: 2 },
          { name: t('lesson.published'), type: 3 },
          { name: t('lesson.over'), type: 4 }
        ]
      ],

      // ['直播课', '点播课', '资源课']
      type: [
        { name: '直播课', type: 1 },
        { name: '点播课', type: 2 }
      ]
    });
    const [isShow, setIShow] = useState(false);
    const [upModal, setUpModal] = useState<boolean>(false);
    const [delModal, setDelModal] = useState<boolean>(false);

    useEffect(() => {
      if (!userStore.login) {
        lessonDetailStore.lessonDetail = undefined;
        navigation.navigate('LoginByPhone');
      }
    }, [lessonDetailStore, navigation, userStore.login]);

    useEffect(() => {
      if (userStore.userInfoDetail.id && userStore.userInfoDetail.business && userStore.userInfoDetail.business?.id) {
        (async () => {
          await lessonDetailStore.getCategoriesTypes(userStore.userInfoDetail.business?.id);
        })();
      }
    }, [lessonDetailStore, userStore.userInfoDetail.business, userStore.userInfoDetail.business?.id, userStore.userInfoDetail.id]);

    useEffect(() => {
      if (userStore.userInfoDetail.id && userStore.userInfoDetail.business) {
        (async () => {
          await lessonDetailStore.getLessonDispatch({
            isAdd: true,
            businessId: userStore.userInfoDetail.business?.id,
            userType: userStore.userInfoDetail.userType
          });
        })();
      }
    }, [
      lessonDetailStore,
      lessonDetailStore.statusNum,
      lessonDetailStore.typeNum,
      userStore.userInfoDetail.id,
      userStore.userInfoDetail.business,
      userStore.userInfoDetail.userType
    ]);

    const naviJob = (num: number) => {
      switch (num) {
        case 1:
          navigation.navigate('Main', { screen: 'MyCalendar', options: { animationEnabled: false } });
          break;
        case 2:
          navigation.navigate('Main', { screen: 'AllCourses', options: { animationEnabled: false } });
          break;
        default:
          navigation.navigate('Main', { screen: 'MyCalendar', options: { animationEnabled: false } });
          break;
      }
    };

    const loadNewData = async () => {
      return await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
    };
    const loadAddData = async () => {
      if (lessonDetailStore.lessonClassOfTeacher.length % 10 === 0) {
        await lessonDetailStore.getLessonDispatch({ isAdd: false, businessId: userStore.userInfoDetail.business?.id });
      }
    };

    const navDetail = (item: any) => {
      switch (item.status) {
        case LESSON_STATUS_CREATED:
          navigation.navigate('Main', { screen: 'LessonDraftBox', params: { lessonId: item.id } });
          break;
        default:
          if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
            navigation.navigate('Main', { screen: 'LectureList', params: { lessonId: item.id } });
          } else {
            navigation.navigate('Main', { screen: 'LectureVodList', params: { lessonId: item.id } });
          }
          break;
      }
    };

    const renderHeader = () => {
      // if (userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER) {
      return (
        <ScrollView keyboardDismissMode="on-drag" horizontal showsHorizontalScrollIndicator={false} style={[{ backgroundColor: colors.deepBackground }]}>
          <View style={[tw.flexRow, tw.mX3]}>
            <TouchableOpacity
              style={[tw.p1]}
              onPress={() => {
                naviJob(1);
              }}
            >
              <View style={[tw.itemsCenter, tw.p3]}>
                <View style={[tw.bgBlue400, tw.itemsCenter, tw.justifyCenter, { width: 45, height: 45, borderRadius: 6 }]}>
                  <Icon name="event-available" size={26} color={colors.background} />
                </View>
                <Text style={[tw.mT2, { fontSize: 13 }]}>日历</Text>
              </View>
            </TouchableOpacity>
            {userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER ? (
              <TouchableOpacity
                style={[tw.p1]}
                onPress={() => {
                  if (userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER) {
                    navigation.navigate('Main', { screen: 'CreateLessonCorrect' });
                  } else {
                    baseView.current.showToast({ text: '如需创建课程，请到个人信息页面切换为教师身份！', delay: 3 });
                  }
                }}
              >
                <View style={[tw.itemsCenter, tw.p3]}>
                  <View style={[tw.bgBlue500, tw.itemsCenter, tw.justifyCenter, { width: 45, height: 45, borderRadius: 6 }]}>
                    <Icon name="loupe" size={26} color={colors.background} />
                  </View>
                  <Text style={[tw.mT2, { fontSize: 13 }]}>新课</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      );
    };

    const releaseAudit = async () => {
      if (lessonDetailStore.selectChangeLesson && lessonDetailStore.selectChangeLesson.id) {
        baseView.current.showLoading({ text: '提交审核' });
        console.log('要提交的文件状态', lessonDetailStore.typeNum);
        if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_LIVE - 1) {
          lessonCreateStore.releaseLive(lessonDetailStore.typeNum, lessonDetailStore.selectChangeLesson.id).then((res) => {
            if (res) {
              baseView.current.hideLoading();
              baseView.current.showLoading({ text: t('lessonDraft.successful'), delay: 1 });
              (async () => {
                await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                setTimeout(() => {
                  baseView.current.hideLoading();
                  lessonDetailStore.statusNum = 1;
                }, 1000);
              })();
              baseView.current.hideLoading();
            }
          });
        } else if (lessonDetailStore.typeNum === null || lessonDetailStore.typeNum === LESSON_TYPE_DEMAND - 1) {
          lessonCreateStore
            .releaseAudit(lessonDetailStore.selectChangeLesson.id)
            .then((res) => {
              if (res) {
                baseView.current.hideLoading();
                baseView.current.showLoading({ text: t('lessonDraft.successful'), delay: 1 });
                (async () => {
                  await lessonDetailStore.getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id });
                  setTimeout(() => {
                    lessonDetailStore.statusNum = 1;
                    baseView.current.hideLoading();
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

    const renderNavigateTeacher = (): JSX.Element => {
      return (
        <LessonList
          data={lessonDetailStore.lessonClassOfTeacher.slice()}
          clickFor={async (item) => {
            await navDetail(item);
          }}
          loadNewData={async (): Promise<boolean> => {
            return Promise.resolve(await loadNewData());
          }}
          loadAddData={loadAddData}
          oneDelete={(e) => {
            lessonDetailStore.selectChangeLesson = e;
            if (lessonDetailStore.selectChangeLesson) {
              setDelModal(true);
            }
          }}
          oneSubmit={(e) => {
            lessonDetailStore.selectChangeLesson = e;
            if (lessonDetailStore.selectChangeLesson) {
              setUpModal(true);
            }
          }}
        />
      );
    };

    const delLesson = async () => {
      console.log(lessonDetailStore.typeNum, '这是作业分类');
      lessonCreateStore.delLesson(lessonDetailStore.typeNum, lessonDetailStore.selectChangeLesson?.id).then((res) => {
        if (typeof res === 'string') {
          baseView.current.showMessage({ text: res, delay: 2 });
        } else {
          if (res) {
            baseView.current.showToast({ text: '删除成功' });
            lessonDetailStore
              .getLessonDispatch({ isAdd: true, businessId: userStore.userInfoDetail.business?.id })
              .then(() => {
                baseView.current.hideLoading();
              })
              .catch((err) => {
                console.log(err);
                baseView.current.hideLoading();
              });
          } else {
            baseView.current.showMessage({ text: '删除失败', delay: 2 });
          }
        }
      });
    };

    const RenderSelect = (props: { name: string; state: boolean; action: Function }): JSX.Element => {
      const { name, state } = props;
      return (
        <TouchableWithoutFeedback onPress={throttle(props.action)}>
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <Text style={{ color: state ? colors.notification : colors.text, fontSize: BTN_INPUT_SIZE }}>{name}</Text>
            <Icon
              size={BTN_ICON_SIZE}
              style={{ color: state ? colors.notification : colors.placeholder }}
              name={state ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
            />
          </View>
        </TouchableWithoutFeedback>
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
            <Text style={[tw.mT2, { color: colors.accent, fontSize: 18 }]}>《{lessonDetailStore.selectChangeLesson?.name}》</Text>
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
            <Text style={[tw.mT2, { color: colors.accent, fontSize: 18 }]}>《{lessonDetailStore.selectChangeLesson?.name}》</Text>
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

    const renderModal = () => {
      if (statusSel) {
        return (
          <ScrollView keyboardDismissMode="on-drag" horizontal showsHorizontalScrollIndicator={false} style={[tw.mX4, tw.pY1]}>
            <View style={[tw.flexRow, tw.mX2]}>
              {(listIndex ? dataList.type : userStore.userInfoDetail.userType === USER_MODE_CLASS_STUDENT ? dataList.status[0] : dataList.status[1])
                .slice()
                .map((items, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      tw.justifyCenter,
                      tw.itemsCenter,
                      tw.selfCenter,
                      tw.mX2,
                      tw.borderGray200,
                      {
                        width: 70,
                        height: 30,
                        borderWidth: 0.5,
                        borderRadius: 4,
                        backgroundColor:
                          (listIndex === 0 ? lessonDetailStore.statusNum : lessonDetailStore.typeNum) === index ? colors.background2 : colors.background
                      }
                    ]}
                    onPress={() => {
                      if (index === (listIndex === 0 ? lessonDetailStore.statusNum : lessonDetailStore.typeNum)) {
                        if (listIndex === 0) {
                          lessonDetailStore.statusNum = null;
                        } else {
                          lessonDetailStore.typeNum = null;
                        }
                      } else {
                        if (listIndex === 0) {
                          lessonDetailStore.statusNum = items?.type - 1;
                        } else {
                          lessonDetailStore.typeNum = items?.type - 1;
                        }
                      }
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: BTN_SELECT_SIZE,
                          color: (listIndex === 0 ? lessonDetailStore?.statusNum : lessonDetailStore?.typeNum) === index ? colors.accent : colors.placeholder
                        }
                      ]}
                    >
                      {items?.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        );
      }
    };

    const renderContent = (): JSX.Element => {
      return (
        <View style={[tw.flex1]}>
          <Text style={[tw.pT3, tw.pB5, tw.selfCenter, { fontSize: TITLE_SIZE, fontWeight: 'bold' }]}>{t('lesson.myClass')}</Text>
          <View style={[{ height: !isShow ? 100 : 0 }]}>{renderHeader()}</View>
          <View style={[tw.flexRow, tw.mT2, tw.mX4, tw.pY1, { borderBottomColor: colors.disabled, borderBottomWidth: 0.5 }]}>
            <View style={[tw.flexRow]}>
              {dataList.type.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    tw.pX2,
                    tw.justifyCenter,
                    {
                      height: 30
                    }
                  ]}
                  onPress={() => {
                    lessonDetailStore.typeNum = item?.type - 1;
                    console.log(lessonDetailStore.typeNum);
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: BTN_SELECT_SIZE,
                        color: lessonDetailStore?.typeNum === index ? colors.accent : colors.placeholder
                      }
                    ]}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}>
              <TouchableOpacity
                onPress={() => {
                  if (listIndex === 0) {
                    setStatusSel(!statusSel);
                  } else if (listIndex === 1) {
                    setStatusSel(true);
                  }
                  setListIndex(0);
                }}
                style={[tw.flexRow, tw.pR4, tw.itemsCenter]}
              >
                <RenderSelect
                  name={t('lesson.status')}
                  state={statusSel}
                  action={() => {
                    if (listIndex === 0) {
                      setStatusSel(!statusSel);
                    } else if (listIndex === 1) {
                      setStatusSel(true);
                    }
                    setListIndex(0);
                  }}
                />
                <Text style={[{ color: colors.accent, fontSize: BTN_INPUT_SIZE }]}>
                  {lessonDetailStore.statusNum !== null && lessonDetailStore.statusNum !== 999
                    ? (userStore.userInfoDetail.userType === USER_MODE_CLASS_STUDENT ? dataList.status[0] : dataList.status[1]).slice()[
                        userStore.userInfoDetail.userType === USER_MODE_CLASS_STUDENT && lessonDetailStore.statusNum > dataList.status[0].length
                          ? 0
                          : lessonDetailStore.statusNum
                      ].name
                    : t('lesson.all')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[tw.absolute, tw.bgBlue200, tw.p1, tw.selfCenter, { borderRadius: 28, right: 0 }]}
              onPress={() => {
                setIShow(!isShow);
              }}
            >
              <Icon name={!isShow ? 'arrow-upward' : 'arrow-downward'} size={19} color={colors.background} />
            </TouchableOpacity>
          </View>
          <View style={[{ height: statusSel ? 40 : 2 }]}>{renderModal()}</View>
          {renderNavigateTeacher()}
        </View>
      );
    };

    return (
      <BaseView useSafeArea={true} scroll={false} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
        {updateClassModal()}
        {delClassModal()}
      </BaseView>
    );
  }
);

export interface DataListType {
  status: Array<DataType[]>;
  type: DataType[];
}
export interface DataType {
  name: string;
  type: number;
}
