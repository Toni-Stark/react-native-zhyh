import React, { useEffect, useState } from 'react';
import { tw } from 'react-native-tailwindcss';
import { Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { t } from '../../../common/tools';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { ScheduleType } from '../../../store/LessonDetailStore';
import { VodClassType } from '../../../store/CreateVodStore';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE } from '../../../common/status-module';

export const SecondStep: (props: SecondStepType) => JSX.Element = (props) => {
  const { colors } = useTheme();
  const { control, errors } = useForm();
  const [addClassVisible, setAddClassVisible] = useState(false);
  const [editClassVisible, setEditClassVisible] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [sectionDate, setSectionDate] = useState<any>('');
  const [sectionStart, setSectionStart] = useState<any>('');
  const [sectionEnd, setSectionEnd] = useState<any>('');
  const [datePickerMode, setDatePickerMode] = useState(false);
  const [dateEditMode, setDateEditMode] = useState(false);
  const [selectModal, setSelectModal] = useState(0);
  const [selectModals, setSelectModals] = useState(0);
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());
  const [sectionIndex, setSectionIndex] = useState(0);
  const [editClass, setEditClass] = useState<ScheduleType | undefined>(undefined);
  const [editDate, setEditDate] = useState<any>('');
  const [editStart, setEditStart] = useState<any>('');
  const [editEnd, setEditEnd] = useState<any>('');
  const [delModeShow, setDelModeShow] = useState<boolean>(false);
  const [inx, setInx] = useState<number>(0);

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
      setEditStart(dates);
    } else if (selectModals === 2) {
      setEditEnd(dates);
    }
  }, [selectModals, dates]);

  const clearDate = () => {
    setSectionName('');
    setSectionDate('');
    setSectionStart('');
    setSectionEnd('');
    setSelectModal(0);
    setSelectModals(0);
  };

  const addSession = () => {
    if (
      props.scheduleList.length === 0 ||
      moment(props.scheduleList[props.scheduleList.length - 1].planningEndTime).format('YYYY MM DD HH mm') < moment(sectionStart).format('YYYY MM DD HH mm')
    ) {
      if (sectionName.length > 0 && moment(sectionEnd).format('HH:mm:ss') !== 'Invalid date' && moment(sectionStart).format('HH:mm:ss') !== 'Invalid date') {
        const data: ScheduleType = {
          name: sectionName,
          planningEndTime: moment(sectionDate).format('YYYY-MM-DD') + ' ' + moment(sectionEnd).format('HH:mm:ss'),
          planningStartTime: moment(sectionDate).format('YYYY-MM-DD') + ' ' + moment(sectionStart).format('HH:mm:ss')
        };
        console.log(data);
        props.changeScheduleList(props.scheduleList.concat(data));
        setAddClassVisible(false);
      } else {
        props.baseView.current.showMessage({ text: t('createLessons.courseRequired'), delay: 1.5 });
      }
    } else {
      props.baseView.current.showMessage({ text: t('createLessons.overlappingStart'), delay: 1.5 });
    }
  };

  const delScheduleList = (num: number) => {
    props.delScheduleList(num);
  };

  const delScheduleVodList = (num: number) => {
    props.delScheduleVodList(num);
  };

  const editsScheduleList = () => {
    let data = Object.assign({}, editClass, {
      planningEndTime: editEnd,
      planningStartTime: editStart
    });
    props.scheduleList.splice(sectionIndex, 1, data);
    props.changeScheduleList(props.scheduleList);
  };

  const renderCreateClass = () => {
    return (
      <Portal>
        <Modal
          visible={addClassVisible}
          onDismiss={() => {
            setAddClassVisible(false);
          }}
          contentContainerStyle={[tw.mX4, tw.p3, tw.flexRow, tw.flexWrap, tw.justifyAround, { borderRadius: 12, backgroundColor: colors.surface }]}
        >
          <View style={[tw.flex1]}>
            <Text style={[tw.mY1, { fontSize: 16, fontWeight: 'bold' }]}>{t('createLessons.createSection')}</Text>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                {t('createLessons.sectionName')}
              </Text>
              <TextInput
                keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
                mode="flat"
                label={t('createLessons.required')}
                placeholder={t('createLessons.pleaseSection')}
                maxLength={30}
                error={errors.sectionName}
                // value={sectionName}
                style={[tw.flex1, { backgroundColor: colors.surface }]}
                onChangeText={(classChart) => setSectionName(classChart)}
              />
            </View>

            <View style={[tw.flexRow, tw.itemsCenter, tw.pY3]}>
              <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
                {t('createLessons.festivalTime')}
              </Text>
              <TouchableOpacity
                style={[tw.flex1]}
                onPress={() => {
                  setDatePickerMode(true);
                }}
              >
                <Text style={[{ fontSize: 14 }]}>{sectionDate ? moment(sectionDate).format('YYYY年MM月DD日') : ''} </Text>
                <View style={[tw.mL5]}>
                  <Text>
                    {t('createLessons.startingTime')}: {moment(sectionStart).format('HH点mm分').length <= 11 ? moment(sectionStart).format('HH点mm分') : ' '}
                  </Text>
                  <Text>
                    {t('createLessons.endTime')}: {moment(sectionEnd).format('HH点mm分').length <= 11 ? moment(sectionEnd).format('HH点mm分') : ' '}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Button
              onPress={() => {
                addSession();
              }}
            >
              {t('createLessons.sure')}
            </Button>
          </View>
        </Modal>
      </Portal>
    );
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
                keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
                label={t('createLessons.required')}
                placeholder={t('createLessons.pleaseSection')}
                maxLength={30}
                error={errors.sectionName}
                defaultValue={editClass?.name}
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
          <View style={[tw.flexRow]}>
            {selectModal === 2 ? (
              <View style={[tw.itemsCenter, tw.selfCenter]}>
                <Text style={[{ color: colors.placeholder }]}>开始时间</Text>
                <Text>{moment(sectionStart).format('HH:mm')}</Text>
              </View>
            ) : null}
            <View style={[tw.flex1, tw.itemsCenter]}>
              <Text style={[tw.mT2, { color: colors.accent, fontSize: 16 }]}>
                {selectModal === 0 ? t('createLessons.selectDate') : selectModal === 1 ? t('createLessons.startCTime') : t('createLessons.endCTime')}
              </Text>
              <DatePicker
                style={[{ marginRight: 15 }]}
                locale="zh-Hans"
                textColor={colors.lightHint}
                mode={selectModal === 0 ? 'date' : 'time'}
                date={date}
                onDateChange={setDate}
              />
              <Button
                onPress={() => {
                  if (selectModal === 0) {
                    setSelectModal(1);
                  } else if (selectModal === 1) {
                    setSelectModal(2);
                  } else if (selectModal === 2) {
                    if (
                      moment(date).format('HH:mm').slice(0, 2) > moment(sectionStart).format('HH:mm').slice(0, 2) ||
                      Number(moment(date).format('HH:mm').slice(3, 5)) - Number(moment(sectionStart).format('HH:mm').slice(3, 5)) >= 15
                    ) {
                      setSelectModal(0);
                      setDatePickerMode(false);
                    } else {
                      props.baseView.current.showMessage({ text: t('createLessons.leastMinutes'), delay: 0.75 });
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
                      moment(dates).format('HH:mm').slice(0, 2) > moment(editStart).format('HH:mm').slice(0, 2) ||
                      Number(moment(dates).format('HH:mm').slice(3, 5)) - Number(moment(editStart).format('HH:mm').slice(3, 5)) >= 15
                    ) {
                      setSelectModals(0);
                      setDateEditMode(false);
                    } else {
                      props.baseView.current.showMessage({ text: t('createLessons.leastMinutes'), delay: 0.75 });
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

  const delScheduleMode = () => {
    return (
      <Portal>
        <Modal
          visible={delModeShow}
          onDismiss={() => {
            setDelModeShow(false);
          }}
          contentContainerStyle={[tw.mX10, tw.pT3, tw.itemsCenter, { borderRadius: 8, backgroundColor: colors.background }]}
        >
          <View style={[tw.itemsCenter, tw.mT3]}>
            <Text style={[{ fontSize: 17 }]}>再次确认删除</Text>
            <Text style={[{ color: colors.accent, fontSize: 15 }, tw.mY2]}>
              《{`${props.sectionVodInfo.length > inx ? props.sectionVodInfo[inx].name : ''}`}》
            </Text>
            <View style={[tw.flexRow, tw.borderGray200, tw.mT2, { borderRadius: 8, height: 40, borderTopWidth: 0.5 }]}>
              <TouchableOpacity
                style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.bgGray200, { borderBottomLeftRadius: 8 }]}
                onPress={() => {
                  setDelModeShow(false);
                }}
              >
                <Text>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.bgBlue400, { borderBottomRightRadius: 8 }]}
                onPress={() => {
                  delScheduleVodList(inx);
                  setDelModeShow(false);
                }}
              >
                <Text>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    );
  };

  return (
    <View style={[tw.flex1]}>
      <View style={[tw.flexRow, tw.itemsCenter, tw.pT4]}>
        {props.vodOrDemand === LESSON_TYPE_DEMAND ? null : (
          <Controller
            control={control}
            name="classSize"
            rules={{ required: { value: true, message: t('createLessons.peopleFilled') }, pattern: /^\d{1,5}$/ }}
            defaultValue=""
            render={({ onChange }) => (
              <TextInput
                label={t('createLessons.maximumNumber')}
                placeholder={t('createLessons.pleaseSetNumber')}
                maxLength={6}
                defaultValue={props.classSize.toString()}
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                style={[tw.flex1, { backgroundColor: colors.background }]}
                onChangeText={(text) => {
                  onChange(text);
                  props.changeClassSize(text);
                }}
                error={errors.classSize}
              />
            )}
          />
        )}
      </View>
      {props.vodOrDemand === LESSON_TYPE_LIVE ? (
        <Text style={[tw.mB3, tw.mT1, { fontSize: 13, color: colors.placeholder }]}>直播报名人数最高为100人</Text>
      ) : null}

      {props.vodOrDemand === LESSON_TYPE_DEMAND ? (
        <TouchableWithoutFeedback
          onPress={async () => {
            await props.openFile();
          }}
        >
          <View
            style={[
              tw.selfCenter,
              tw.itemsCenter,
              tw.pY3,
              { width: '100%', borderWidth: 1, borderColor: colors.accent, borderRadius: 8, borderStyle: 'dashed' }
            ]}
          >
            <Icon color={colors.accent} name="control-point" size={26} />
            <Text style={{ color: colors.placeholder }}>{t('createLessons.newClass')}</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : props.vodOrDemand === LESSON_TYPE_LIVE ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setAddClassVisible(true);
          }}
        >
          <View
            style={[
              tw.selfCenter,
              tw.itemsCenter,
              tw.pY3,
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
      ) : null}
      {props.vodOrDemand === LESSON_TYPE_DEMAND
        ? props.sectionVodInfo.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                if (props.searchInfo) {
                  props.searchInfo(index);
                }
              }}
              key={index}
            >
              <View style={[tw.mY2, tw.p2, tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderColor: colors.disabled, borderBottomWidth: 0.5 }]}>
                <View>
                  <Text numberOfLines={1} style={[tw.overflowHidden, { color: colors.placeholder }]}>
                    （{index + 1}）{t('createLessons.courseName')}: <Text style={[{ fontSize: 14, color: colors.accent }]}> {item.name}</Text>
                  </Text>
                  <Text ellipsizeMode="middle" numberOfLines={1} style={[{ marginTop: 5, marginLeft: 7, fontSize: 13, color: colors.accent }]}>
                    共{item.resourceFiles?.length}个文件
                  </Text>
                </View>
                <Icon
                  size={26}
                  color={colors.disabled}
                  onPress={() => {
                    setDelModeShow(true);
                    setInx(index);
                  }}
                  name="remove-circle"
                />
              </View>
            </TouchableOpacity>
          ))
        : props.vodOrDemand === LESSON_TYPE_LIVE
        ? props.scheduleList.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSectionIndex(index);
                setEditClass(props.scheduleList[index]);
                setEditDate(props.scheduleList[index]?.planningStartTime);
                setEditStart(props.scheduleList[index]?.planningStartTime);
                setEditEnd(props.scheduleList[index]?.planningEndTime);
                setEditClassVisible(true);
              }}
              key={index}
            >
              <View style={[tw.m2, tw.p2, tw.flexRow, tw.itemsCenter, tw.justifyBetween, { borderColor: colors.disabled, borderBottomWidth: 0.5 }]}>
                <Text>{index + 1} .</Text>
                <View>
                  <Text numberOfLines={1} style={[tw.overflowHidden]}>
                    {t('createLessons.courseName')}: {item.name}
                  </Text>
                  <Text style={[tw.mT2]}>
                    {moment(item.planningStartTime).format('YYYY-MM-DD HH:mm') + ' - ' + moment(item.planningEndTime).format('HH:mm')}
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

      {renderCreateClass()}

      {renderDatePicker()}

      {renderEditClass()}

      {renderEditPicker()}

      {delScheduleMode()}
    </View>
  );
};

interface SecondStepType {
  scheduleList: Array<ScheduleType>;
  changeScheduleList: (e: ScheduleType[]) => void;
  delScheduleList: (e: number) => void;
  delScheduleVodList: (e: number) => void;
  baseView: any;
  searchInfo?: (e: number) => void;
  openFile: () => void;
  classSize: number;
  changeClassSize: (e: string) => void;
  vodOrDemand: number;
  sectionVodInfo: VodClassType[];
}
