import * as React from 'react';
import { forwardRef, ForwardRefExoticComponent, useImperativeHandle, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Modal, Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import { Platform, StyleProp, View, ViewStyle, ScrollView } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { tw } from 'react-native-tailwindcss';
import LottieView from 'lottie-react-native';
import { getBottomSpace, throttle } from '../common/tools';
import { Chase } from 'react-native-animated-spinkit';

interface BaseViewProps {
  ref?: any;
  useSafeArea?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  error?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

const BaseView: ForwardRefExoticComponent<BaseViewProps> = forwardRef(
  (props, ref): JSX.Element => {
    const { colors } = useTheme();
    const { window } = useDimensions();
    const { useSafeArea = true, scroll = false, style = {}, error = false, onRefresh = null } = props;
    const styleCopy = { backgroundColor: colors.background, height: window.height };
    Object.assign(styleCopy, style);
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('载入中...');
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('加載中...');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageDelay, setMessageDelay] = useState(5);
    const [aboveTab, setAboveTab] = useState(false);
    const timer = useRef<any>();

    useImperativeHandle(
      ref,
      () => ({
        showLoading: (param?: { text?: string; delay?: number }) => {
          const delay = param?.delay || 0;
          const text = param?.text || '载入中...';
          setLoadingText(text);
          setShowLoading(true);
          if (delay > 0) {
            if (timer.current !== undefined) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              setShowLoading(false);
            }, 1000 * delay);
          }
        },
        hideLoading: () => {
          setShowLoading(false);
          if (timer.current !== undefined) {
            clearTimeout(timer.current);
          }
        },
        showToast: (param?: { text?: string; delay?: number }) => {
          const delay = param?.delay || 0;
          const text = param?.text || '载入中...';
          setToastText(text);
          setShowToast(true);
          if (delay > 0) {
            if (timer.current !== undefined) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              setShowToast(false);
            }, 1000 * delay);
          }
        },
        showMessage: (param: { text: string; delay?: number; aboveTab?: boolean }) => {
          if (param.text) {
            setAboveTab(param.aboveTab || false);
            setMessage(param.text);
            setMessageDelay(param.delay || 5);
            setShowMessage(true);
          }
        }
      }),
      []
    );

    const renderLoading = () => {
      return (
        <Portal>
          <Modal visible={showLoading} dismissable={false} onDismiss={() => setShowLoading(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.justifyCenter, tw.itemsCenter, tw.roundedLg, tw.pY4, tw.pX6, { backgroundColor: colors.surface }]}>
              <Chase size={36} color={colors.primary} />
              <Text style={[tw.mT2, tw.fontLight, { fontSize: 10 }]}>{loadingText}</Text>
            </View>
          </Modal>
        </Portal>
      );
    };
    const renderToast = () => {
      return (
        <Portal>
          <Modal visible={showToast} dismissable={false} onDismiss={() => setShowToast(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.justifyCenter, tw.itemsCenter, tw.roundedLg, tw.pY4, tw.pX6, { backgroundColor: colors.surface }]}>
              <Text style={[tw.fontLight, { fontSize: 14 }]}>{toastText}</Text>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderMessage = () => {
      const hackHeightOfAndroid = Platform.OS === 'android' ? 25 : 0;
      const heightOfTab = 60 + getBottomSpace() + hackHeightOfAndroid;
      return (
        <Snackbar
          style={{ marginBottom: aboveTab ? heightOfTab : hackHeightOfAndroid, backgroundColor: colors.background }}
          visible={showMessage}
          duration={messageDelay * 1000}
          onDismiss={() => {
            setShowMessage(false);
            setMessage('');
          }}
          action={{
            label: '关闭',
            onPress: () => {
              setShowMessage(false);
              setMessage('');
            }
          }}
        >
          <Text>{message}</Text>
        </Snackbar>
      );
    };

    const handleRefresh = () => {
      if (onRefresh !== null) {
        onRefresh();
      }
    };

    const renderContent = () => {
      if (error) {
        return (
          <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.m16, tw.pB24]}>
            <LottieView source={require('./../assets/no-connection.json')} autoPlay={true} resizeMode="cover" style={[tw.wFull]} />
            <Text style={[tw.mT4]}>网络异常，请重试！</Text>
            <Button mode="contained" icon="wifi-strength-alert-outline" style={[tw.mT4]} onPress={throttle(handleRefresh)}>
              重试
            </Button>
          </View>
        );
      } else {
        if (scroll) {
          return (
            <ScrollView overScrollMode="always" style={{ ...styleCopy }}>
              {props.children}
            </ScrollView>
          );
        } else {
          return props.children;
        }
      }
    };

    if (useSafeArea) {
      return (
        <SafeAreaView style={{ ...styleCopy }}>
          {renderContent()}
          {renderLoading()}
          {renderToast()}
          {renderMessage()}
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ ...styleCopy }}>
          {renderContent()}
          {renderLoading()}
          {renderToast()}
          {renderMessage()}
        </View>
      );
    }
  }
);

export default BaseView;
