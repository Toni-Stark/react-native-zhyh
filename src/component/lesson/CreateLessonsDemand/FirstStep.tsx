import React from 'react';
import { tw } from 'react-native-tailwindcss';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Text, TextInput, useTheme, Switch } from 'react-native-paper';
import { t } from '../../../common/tools';
import { Controller, useForm } from 'react-hook-form';
import { CategoriesType, gradeType, subjectType } from '../../../store/LessonCreateStore';
import { ClassTypes } from '../../../store/LessonCreateStore';
import { UselessTextInput } from '../../UselessTextInput';
import { LESSON_TYPE_LIVE } from '../../../common/status-module';

export const FirstStep: (props: FirstStepType) => JSX.Element = (props) => {
  const { colors } = useTheme();
  const { control, errors } = useForm();

  const reuniteWithComponent = (type: number) => {
    switch (type) {
      case 1:
        return <View />;
      case 2:
        return (
          <Controller
            control={control}
            name="password"
            rules={{ required: { value: true, message: t('createLessons.titleMust') }, pattern: /^[a-zA-Z0-9]{1,600}$/ }}
            defaultValue=""
            render={({ onChange }) => (
              <TextInput
                mode="flat"
                placeholder="设置访问密码"
                maxLength={600}
                keyboardType="numeric"
                style={[tw.flex1, { height: 40, fontSize: 16 }]}
                onChangeText={(password) => {
                  onChange(password);
                  props.changePassword(password);
                }}
                value={props.password}
                error={errors.password}
              />
            )}
          />
        );
      case 3:
        return (
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <View style={[tw.flex1, tw.borderGray200, { borderRadius: 0, borderRightWidth: 0.5 }]}>
              <Controller
                control={control}
                name="priceInput"
                rules={{
                  required: { value: true, message: t('createLessons.registrationMust') },
                  pattern: /^(0|([1-9]\d*))(\.\d{1,2})?$/
                }}
                defaultValue=""
                render={({ onChange }) => (
                  <TextInput
                    label={t('createLessons.xueyueCoin')}
                    placeholder={t('createLessons.enterTheFee')}
                    maxLength={6}
                    defaultValue="0"
                    keyboardType="numeric"
                    style={[tw.flex1, { backgroundColor: colors.background }]}
                    onChangeText={(text) => {
                      onChange(text);
                      props.changeClassPrice(text);
                    }}
                    value={props.classPrice}
                    error={errors.priceInput}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="previousPrice"
              rules={{
                required: { value: true, message: t('createLessons.registrationMust') },
                pattern: /^(0|([1-9]\d*))(\.\d{1,2})?$/
              }}
              defaultValue=""
              render={({ onChange }) => (
                <TextInput
                  label="默认价格"
                  placeholder={'课程原价'}
                  maxLength={6}
                  defaultValue={'0'}
                  keyboardType="numeric"
                  style={[tw.flex1, { backgroundColor: colors.background }]}
                  onChangeText={(previousPrice) => {
                    onChange(previousPrice);
                    props.setPreviousPrice(previousPrice);
                  }}
                  value={props.previousPrice}
                  error={errors.previousPrice}
                />
              )}
            />
          </View>
        );
      case 4:
        return <View />;
    }
  };

  return (
    <View style={[tw.flex1]}>
      <View style={[tw.flexRow, tw.itemsCenter]}>
        {/*<Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>*/}
        {/*  {t('createLessons.courseTitle')}*/}
        {/*</Text>*/}
        <Controller
          control={control}
          name="titleText"
          rules={{ required: { value: true, message: t('createLessons.titleMust') }, pattern: /^.{1,600}$/ }}
          defaultValue=""
          render={({ onChange }) => (
            <TextInput
              mode="flat"
              keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
              placeholder={t('createLessons.pleaseEnter')}
              maxLength={600}
              defaultValue={props.className}
              style={[tw.flex1, { backgroundColor: colors.background }]}
              onChangeText={(className) => {
                onChange(className);
                props.changeClassName(className);
              }}
              error={errors.titleText}
            />
          )}
        />
      </View>

      {reuniteWithComponent(props.classType[props.selectArray[0]].type)}

      <UselessTextInput
        placeholder="请输入课程简介"
        textColor={colors.text}
        multiline
        editable
        numberOfLines={6}
        placeholderTextColor={colors.disabled}
        onChangeText={(text) => props.setContent(text)}
        value={props.content}
      />

      <TouchableOpacity
        style={[tw.flexRow, tw.itemsCenter, tw.pY4, tw.borderGray200, { borderTopWidth: 0.5 }]}
        onPress={async () => {
          props.changeSelectMode(0);
        }}
      >
        <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>
          {t('createLessons.classType')}
        </Text>
        <Text style={[tw.pX5, { fontSize: 18, color: colors.accent }]}>{props.classType[props.selectArray[0]].name}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[tw.flexRow, tw.itemsCenter, tw.pY4]}
        onPress={() => {
          props.changeSelectMode(2);
        }}
      >
        <Text style={{ fontSize: 17, paddingRight: 10, color: colors.placeholder, borderRightWidth: 0.5, borderRightColor: colors.disabled }}>课程类型</Text>
        <Text style={[tw.pX5, { fontSize: 18, color: colors.accent }]}>
          {props.categories && props.categories.length > props.selectArray[2] ? props.categories?.slice()[props.selectArray[2]].name : ''}
        </Text>
      </TouchableOpacity>
      {props.vodOrDemand === LESSON_TYPE_LIVE ? (
        <View style={[tw.pY2, tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
          <Text style={[{ fontSize: 17, color: colors.placeholder }]}>是否录制视频</Text>
          <Switch
            value={props.isAutoRecord}
            onValueChange={(e) => {
              props.changeIsAutoRecord(e);
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

interface FirstStepType {
  classType: ClassTypes[];
  subject?: subjectType[];
  categories?: CategoriesType[];
  grade?: gradeType[];
  vodOrDemand: number;
  content?: string;
  changePassword: (e: string) => void;
  password: string;
  setContent: (e: string) => void;
  changeSelectMode: (e: number) => void;
  selectArray: number[];
  className: string;
  changeClassName: (e: string) => void;
  classPrice: string;
  previousPrice: string;
  isAutoRecord?: boolean;
  changeClassPrice: (e: string) => void;
  setPreviousPrice: (e: string) => void;
  changeIsAutoRecord: (e: boolean) => void;
}
