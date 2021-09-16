import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import RNQRGenerator from 'rn-qr-generator';
import { Appbar, useTheme, Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { t } from '../../../common/tools';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';

type Props = {};

export const MyQRDetail: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { userStore } = useStore();
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const codeWidth = 200;
    const codeHeight = 200;
    const [codeImage, setCodeImage] = useState<string>('');

    useEffect(() => {
      RNQRGenerator.generate({
        value: 'XUEYUE_CONNECTION@' + userStore.userInfo.id,
        width: codeWidth,
        height: codeHeight
      })
        .then((QRRes) => {
          const { uri } = QRRes;
          setCodeImage(uri);
        })
        .catch((e) => console.log(e));
    }, [userStore.userInfo]);

    const renderQRCode = () => {
      if (codeImage !== null) {
        return (
          <FastImage source={{ uri: codeImage }} style={{ marginTop: 15, width: codeWidth, height: codeHeight }} resizeMode={FastImage.resizeMode.stretch} />
        );
      } else {
        return null;
      }
    };

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('myQRDetail.userAgree')} />
          </Appbar.Header>
          <View style={[tw.m10, tw.selfCenter, tw.itemsCenter]}>
            <Text style={[tw.mB3]}>{t('myQRDetail.explain')}</Text>
            <Text>{t('myQRDetail.position')}</Text>
            <View>{renderQRCode()}</View>
          </View>
        </View>
      );
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
