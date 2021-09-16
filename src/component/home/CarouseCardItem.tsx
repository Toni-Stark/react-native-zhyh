import * as React from 'react';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { Card, Text, useTheme } from 'react-native-paper';
import AvatarView from '../AvatarView';
import moment from 'moment';
import { t } from '../../common/tools';
import { CoursesDetail } from '../../store/LessonDetailStore';
import FastImage from 'react-native-fast-image';
import { LESSON_TYPE_NEED_PAY, LESSON_TYPE_PASSWORD, LESSON_TYPE_PRIVATE, LESSON_TYPE_PUBLIC } from '../../common/status-module';
export interface Props {
  data: CoursesDetail;
  onClick: (e: string) => void;
}

export const CarouselCardItem: React.FC<Props> = (props): JSX.Element => {
  const { data } = props;
  const { colors } = useTheme();
  const width = 110;
  const height = 110;

  const getTypeText = (type) => {
    switch (type) {
      case LESSON_TYPE_NEED_PAY:
        return (
          <Text numberOfLines={1} style={[{ fontSize: 16, color: colors.notification, lineHeight: 20, fontWeight: 'bold' }]}>
            ￥{data.price ? data.price : 0}
          </Text>
        );
      case LESSON_TYPE_PUBLIC:
        return (
          <Text numberOfLines={1} style={[{ fontSize: 14, color: colors.accent, lineHeight: 20, fontWeight: 'bold' }]}>
            公开课
          </Text>
        );
      case LESSON_TYPE_PASSWORD:
        return (
          <Text numberOfLines={1} style={[{ fontSize: 14, color: colors.accent, lineHeight: 20, fontWeight: 'bold' }]}>
            密码课
          </Text>
        );
      case LESSON_TYPE_PRIVATE:
        return (
          <Text numberOfLines={1} style={[{ fontSize: 14, color: colors.accent, lineHeight: 20, fontWeight: 'bold' }]}>
            管理课
          </Text>
        );
    }
  };

  return (
    <Card
      style={[tw.m4, tw.mB0, tw.p3]}
      onPress={() => {
        if (data.id) {
          props.onClick(data.id);
        }
      }}
    >
      <View style={[tw.flexRow]}>
        <View style={[{ width: width, height: height, borderRadius: 6 }]}>
          <Card.Cover
            style={[{ width: width, height: data.imageCover ? height : height, borderRadius: 6 }]}
            source={data.imageCover ? { uri: data.imageCover?.url } : require('../../assets/placeholder1.jpg')}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View style={[tw.flex1, tw.flexCol, tw.justifyBetween, { marginLeft: 15 }]}>
          <Text numberOfLines={2} style={[{ fontSize: 16, lineHeight: 20, fontWeight: 'bold' }]}>
            {data.name ? data.name : ''}
          </Text>
          <Text numberOfLines={2} style={[{ fontSize: 14, color: colors.text }]}>
            {t('carouselCardItem.create')}：{moment(data.createdTime).format('YYYY-MM-DD')}
          </Text>
          <Text numberOfLines={2} ellipsizeMode="tail" style={[{ color: colors.placeholder, lineHeight: 18 }]}>
            详情：{data.description ? data.description : ''}
          </Text>
        </View>
      </View>
      <View style={[tw.flexRow, tw.mT3, tw.pB4, { borderBottomColor: colors.disabled, borderBottomWidth: 0.5 }]}>
        <View>
          <View style={[tw.flexRow, tw.mR3]}>
            <AvatarView
              avatar={data.primaryTeacher?.avatar ? data.primaryTeacher.avatar.url : ''}
              size={30}
              name={data.primaryTeacher?.realName ? data.primaryTeacher.realName : 'Teacher'}
            />
            <View style={[tw.justifyBetween, tw.mL1]}>
              <Text style={[tw.mL1, tw.fontLight, { color: colors.placeholder, fontSize: 12 }]} numberOfLines={1}>
                {t('carouselCardItem.teaching')}
              </Text>
              <Text style={[tw.mL1, { color: colors.text, fontSize: 13 }]} numberOfLines={1}>
                {data.primaryTeacher?.realName ? data.primaryTeacher.realName : 'Teacher'}
              </Text>
            </View>
          </View>
        </View>
        {data.secondaryTeachers?.map((item, index) => (
          <View key={index}>
            <View style={[tw.flexRow, tw.mR3]} key={index}>
              <AvatarView avatar={item.avatar ? item.avatar.url : ''} size={30} name={item.realName ? item.realName : 'Teacher'} />
              <View style={[tw.justifyBetween, tw.mL1]}>
                <Text style={[tw.mL1, tw.fontLight, { color: colors.placeholder, fontSize: 12 }]} numberOfLines={1}>
                  {t('carouselCardItem.teaching')}
                </Text>
                <Text style={[tw.mL1, { color: colors.text, fontSize: 13 }]} numberOfLines={1}>
                  {item.realName ? item.realName : 'Teacher'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={[tw.flexRow, tw.justifyBetween, tw.pT3]}>
        {data.authType === LESSON_TYPE_NEED_PAY || data.authType === LESSON_TYPE_PRIVATE ? (
          <Text numberOfLines={1} style={[{ fontSize: 14, color: colors.text, lineHeight: 20 }]}>
            {t('carouselCardItem.num')} {data.presetStudentCount ? data.studentCount : 0}
          </Text>
        ) : (
          <Text numberOfLines={1} style={[{ fontSize: 14, color: colors.text, lineHeight: 20 }]}>
            {t('home.totalSession')}：{data.scheduleCount}
          </Text>
        )}
        {getTypeText(data.authType)}
      </View>
    </Card>
  );
};
