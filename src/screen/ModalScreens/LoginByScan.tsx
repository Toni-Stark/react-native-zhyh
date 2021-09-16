import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import { ScreenComponent } from '../index';
import BaseView from '../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Text, useTheme } from 'react-native-paper';
import { throttle } from '../../common/tools';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import RNQRGenerator from 'rn-qr-generator';
import { Grid } from 'react-native-animated-spinkit';
import { observer } from 'mobx-react-lite';
import { t } from '../../common/tools';

export const LoginByScan: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const QR_CODE_SIZE = 200;
    const { colors } = useTheme();
    const loading = useRef<any>();
    const [codeUri, setCodeUri] = useState();
    const [codeLoading, setCodeLoading] = useState(true);
    const [codeError, setCodeError] = useState(false);

    useLayoutEffect(() => {
      navigation.setOptions({
        ...TransitionPresets.SlideFromRightIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true
      });
    }, [navigation]);

    useEffect(() => {
      RNQRGenerator.generate({
        value: 'this is my QR code !',
        height: QR_CODE_SIZE,
        width: QR_CODE_SIZE,
        base64: false,
        backgroundColor: colors.background,
        color: colors.text
      })
        .then((response) => {
          const { uri } = response;
          setTimeout(() => {
            setCodeUri(uri);
            setCodeLoading(false);
          }, 3000);
        })
        .catch(() => {
          setCodeError(true);
          setCodeLoading(false);
        });
    }, [colors.background, colors.text]);

    const renderQRCode = () => {
      const renderDetail = () => {
        if (codeLoading) {
          return <Grid size={QR_CODE_SIZE / 4} color={colors.disabled} />;
        } else if (codeError) {
          return <Text>{t('loginByScan.errorCode')}</Text>;
        } else {
          return <FastImage source={{ uri: codeUri }} style={{ width: QR_CODE_SIZE, height: QR_CODE_SIZE }} resizeMode={FastImage.resizeMode.cover} />;
        }
      };
      return (
        <View style={[{ width: QR_CODE_SIZE, height: QR_CODE_SIZE, backgroundColor: colors.disabled }, tw.flex, tw.itemsCenter, tw.justifyCenter]}>
          {renderDetail()}
        </View>
      );
    };
    const navi = (num: number) => {
      console.log(num);
      switch (num) {
        case 1:
          navigation.navigate('UserAgreement');
          break;
        case 2:
          navigation.navigate('PrivacyAgreement');
          break;
      }
    };
    const getRed = (name: string, num: number) => {
      return (
        <Text
          onPress={() => {
            navi(num);
          }}
          style={[tw.textXs, { color: colors.notification }]}
        >
          {name}
        </Text>
      );
    };

    return (
      <BaseView useSafeArea={true} ref={loading}>
        <Icon name="chevron-left" size={45} color={colors.placeholder} style={[tw.mL2]} onPress={throttle(() => navigation.goBack())} />
        <KeyboardAvoidingView style={[tw.flex]} behavior="padding" keyboardVerticalOffset={30}>
          <ScrollView style={[tw.hFull, tw.flexCol]}>
            <View style={[tw.flexCol, tw.itemsCenter, tw.justifyCenter, tw.mT8]}>
              {renderQRCode()}
              <View style={[tw.flexRow, tw.mT2, tw.itemsCenter]}>
                <Text style={[tw.textXs, tw.mX1, tw.textCenter, { color: colors.placeholder }]}>
                  <Icon style={[tw.selfCenter]} name="copyright" size={12} color={colors.placeholder} />
                  {t('loginByName.loginOne')}
                  {getRed(t('loginByName.loginThree'), 1)}
                  {t('loginByName.and')}
                  {getRed(t('loginByName.loginTwo'), 2)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BaseView>
    );
  }
);
