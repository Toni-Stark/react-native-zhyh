import React, { useRef, useState } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { NavigatorComponentProps } from '../../index';
import { Props } from './MyProfile/ChangeInfo';
import { observer } from 'mobx-react-lite';
import { QRScannerRectView } from 'react-native-qrcode-scanner-view';
import { useStore } from '../../../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { t, throttle } from '../../../common/tools';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';

export const CodeScan: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { settingStore } = useStore();
    const [light, setLight] = useState(false);
    const [scanFinished, setScanFinished] = useState(false);
    const cameraRef = useRef<RNCamera | null>(null);

    const barcodeReceived = async (event) => {
      console.log(event, '扫描二维码返回值');
      const codes = event.data.split('@');
      if (codes.length > 1) {
        const logo = codes[0];
        const uuid = codes[1];
        if (logo === 'XUEYUE' && uuid !== undefined) {
          settingStore
            .loginWithUuidForDesktop(uuid)
            .then(() => {
              baseView.current.showToast({ text: t('codeScan.tipSuccess'), delay: 1.5 });
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            })
            .catch((e) => {
              baseView.current.showToast({ text: e, delay: 1.5 });
            });
          setScanFinished(true);
        } else {
          baseView.current.showToast({ text: t('codeScan.codeError'), delay: 1.5 });
        }
      } else {
        baseView.current.showToast({ text: '无法识别此二维码', delay: 1.5 });
      }
    };

    const renderLight = () => {
      const handleLightChanged = () => {
        setLight(!light);
      };
      return (
        <View style={[tw.absolute, tw.flex, tw.justifyCenter, tw.itemsCenter, { bottom: 60, width: '100%' }]}>
          <Icon name={light ? 'flash-on' : 'flash-off'} size={30} color={colors.background} onPress={throttle(handleLightChanged)} />
        </View>
      );
    };

    const renderScanner = () => {
      if (!scanFinished) {
        return (
          <RNCamera
            ref={cameraRef}
            captureAudio={false}
            onBarCodeRead={barcodeReceived}
            flashMode={light ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            type={RNCamera.Constants.Type.back}
            style={{ flex: 1 }}
          >
            <QRScannerRectView />
            {renderLight()}
          </RNCamera>
        );
      }
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('codeScan.myHeader')} />
        </Appbar.Header>
        {renderScanner()}
      </BaseView>
    );
  }
);
