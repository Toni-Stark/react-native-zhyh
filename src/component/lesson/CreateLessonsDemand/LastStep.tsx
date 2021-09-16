import React from 'react';
import { tw } from 'react-native-tailwindcss';
import { TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-image-crop-picker';
import { Text, useTheme } from 'react-native-paper';
import { t } from '../../../common/tools';
import FastImage from 'react-native-fast-image';
import { CERTIFICATION_IMAGE_SIZE, MAX_UPLOAD_IMAGE } from '../../../store/LessonDetailStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImageType } from '../../../store/HomeworkStore';
import { ImageList } from '../../../store/LessonCreateStore';

export const LastStep: (props: LastStepType) => JSX.Element = (props) => {
  const { colors } = useTheme();
  const HOMEWORK_IMAGE_SIZE = 60;

  const renderSelectedImages = () => {
    const output: JSX.Element[] = [];
    props.getImages.forEach((image, index) => {
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
            props.changeImageIndex(index);
            if (props.selectedImages.length > 0) {
              props.changeVisibleImage(true);
            } else {
              props.changeVisibleShow(true);
            }
          }}
          onLongPress={() => props.removeImage(index, true)}
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
              props.changeShowActionSheet(true);
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

  const renderBGImages = () => {
    if (props.imageUrl && props.imageUrl?.url.length > 0) {
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
            props.changeVisBGImage(true);
          }}
          onLongPress={() => props.delImageUrl()}
        >
          <FastImage
            style={{
              width: 260,
              height: 153.6,
              borderRadius: HOMEWORK_IMAGE_SIZE / 10
            }}
            source={{ uri: props.imageUrl?.url }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          key={666666}
          activeOpacity={0.6}
          style={[
            tw.selfCenter,
            tw.itemsCenter,
            tw.justifyCenter,
            {
              margin: 5,
              width: 260,
              height: 153.6,
              borderWidth: 1,
              borderRadius: 10,
              borderStyle: 'dashed',
              borderColor: colors.disabled
            }
          ]}
          onPress={() => {
            props.changeVisBGImage(true);
          }}
        >
          <Icon name="add-circle-outline" size={30} color={colors.disabled} />
          <Text style={[tw.mT3, { color: colors.disabled }]}>{t('createLessons.uploadImage')}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[tw.flex1]}>
      <Text style={[tw.mT3, { fontSize: 17, color: colors.placeholder }]}>{t('createLessons.uploadPicture')}</Text>
      {renderSelectedImages()}
      <Text style={[tw.mB3, { fontSize: 14, color: colors.disabled }]}>{t('createLessons.tipOne')}</Text>
      {renderBGImages()}
      <Text style={[tw.mB3, { fontSize: 14, color: colors.disabled }]}>{t('createLessons.tipTwo')}</Text>
    </View>
  );
};

interface LastStepType {
  getImages: ImageType[];
  selectedImages: Array<Image>;
  changeImageIndex: (e: number) => void;
  changeVisibleImage: (e: boolean) => void;
  changeVisibleShow: (e: boolean) => void;
  changeShowActionSheet: (e: boolean) => void;
  changeVisBGImage: (e: boolean) => void;
  removeImage: (num: number, bool: boolean) => void;
  imageUrl?: ImageList;
  delImageUrl: () => void;
}
