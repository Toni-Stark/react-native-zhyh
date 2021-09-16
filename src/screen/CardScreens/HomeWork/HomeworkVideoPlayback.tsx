import * as React from 'react';
import { NavigatorComponentProps } from '../../index';
import { tw } from 'react-native-tailwindcss';
import { Dimensions, Platform, StatusBar, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTheme, Text } from 'react-native-paper';
import Video from 'react-native-video';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

type Props = {
  route: ScreenRouteProp;
};

export type videoListType = {
  url: string;
  time: number;
};

type ScreenRouteProp = RouteProp<ScreensParamList, 'HomeworkVideoPlayback'>;

export const HomeworkVideoPlayback: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const player = useRef<any>(undefined);
    const [paused, setPaused] = useState(false);
    const [resizeMode] = useState('contain');
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
      console.log(route.params.url);
    }, [duration, route.params.url]);

    useLayoutEffect(() => {
      if (fullScreen) {
        const fixRNDimensions = (orientation: OrientationType) => {
          const windowDim = Dimensions.get('window');
          const screenDim = Dimensions.get('screen');
          if (
            (orientation.match(/LANDSCAPE/i) && windowDim.width < windowDim.height) ||
            (orientation.match(/PORTRAIT/i) && windowDim.width > windowDim.height)
          ) {
            console.log('fixing dimensions after rotation', windowDim.width, windowDim.height, screenDim.width, screenDim.height);
            Dimensions.set({
              screen: {
                ...screenDim,
                width: screenDim.height,
                height: screenDim.width
              },
              window: {
                ...windowDim,
                width: windowDim.height,
                height: windowDim.width
              }
            });
          }
        };
        const lockToLandscape = (orientation: OrientationType) => {
          if (orientation !== 'LANDSCAPE-LEFT' && orientation !== 'LANDSCAPE-RIGHT') {
            Orientation.lockToLandscape();
          }
        };
        StatusBar.setHidden(true, 'fade');
        Orientation.lockToLandscape();
        Orientation.addOrientationListener(fixRNDimensions);
        Orientation.addOrientationListener(lockToLandscape);

        return () => {
          StatusBar?.setHidden(false, 'fade');
          Orientation?.removeOrientationListener(lockToLandscape);
          Orientation?.lockToPortrait();
        };
      }
    }, [fullScreen]);

    const onBuffer = (msg) => {
      console.log('msg', msg);
    };

    const onLoad = (e) => {
      console.log('e', e);
      setDuration(e.duration);
    };

    const onProgress = (durations) => {
      console.log('duration', durations);
      setCurrentTime(durations.currentTime);
      setProgress(Math.floor((durations.currentTime / duration) * 100) / 100);
    };
    const onEnd = (time) => {
      setProgress(1);
      player.current.seek(0);
      setPaused(true);
      console.log('endTime', time);
    };
    const onAudioBecomingNoisy = (time) => {
      console.log('onAudioBecomingNoisy', time);
    };
    const onAudioFocusChanged = (time) => {
      console.log('onAudioFocusChanged', time);
    };
    if (Platform.OS === 'android') {
      return (
        <View style={[tw.flex1, { backgroundColor: colors.onBackground }]}>
          <Video
            ref={player}
            controls={false}
            // source={{ uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__', type: 'mpd' }}
            source={{ uri: route.params.url }} // Can be a URL or a local file.
            paused={paused} //暂停
            style={[tw.wFull, tw.hFull]}
            fullscreen={fullScreen}
            fullscreenAutorotate={true}
            onBuffer={onBuffer}
            resizeMode={resizeMode} //缩放模式
            onLoad={onLoad} //加载媒体并准备播放时调用的回调函数。
            onProgress={onProgress} //视频播放过程中每个间隔进度单位调用的回调函数
            onEnd={onEnd} //视频播放结束时的回调函数
            onAudioBecomingNoisy={onAudioBecomingNoisy} //音频变得嘈杂时的回调 - 应暂停视频
            onAudioFocusChanged={onAudioFocusChanged} //音频焦点丢失时的回调 - 如果焦点丢失则暂停
            // repeat={true} //确定在到达结尾时是否重复播放视频。
          />
          <View
            style={[
              tw.flex1,
              tw.absolute,
              tw.justifyBetween,
              { paddingBottom: 10, paddingTop: 10, width: Dimensions.get('window').width, height: Dimensions.get('window').height }
            ]}
          >
            <View style={[tw.pX3, tw.justifyBetween, tw.flexRow, tw.itemsCenter, { width: '100%', height: 60 }]}>
              <Icon
                style={[]}
                onPress={() => {
                  // setFullScreen(!fullScreen);
                  if (fullScreen) {
                    setFullScreen(!fullScreen);
                  } else {
                    navigation.goBack();
                    if (route.params.back) {
                      console.log('返回上一页');
                    } else {
                      setTimeout(() => {
                        navigation.navigate('CloudSeaDisk');
                      }, 200);
                    }
                  }
                }}
                name={fullScreen ? 'keyboard-arrow-left' : 'close'}
                size={36}
                color={colors.background}
              />
              <Icon
                style={[]}
                onPress={() => {
                  navigation.goBack();
                  if (route.params.back) {
                    console.log('返回上一页');
                  } else {
                    setTimeout(() => {
                      navigation.navigate('CloudSeaDisk');
                    }, 200);
                  }
                }}
                name={'done'}
                size={36}
                color={colors.background}
              />
            </View>
            <View style={[tw.itemsCenter, tw.pX4, { width: '100%', height: fullScreen ? 50 : 70 }]}>
              <View style={[tw.flexRow, tw.itemsCenter, tw.mB2]}>
                <Text style={[{ color: colors.background, fontSize: 12 }]}>{currentTime > 60 ? (currentTime / 60).toFixed(0) : '00'} :</Text>
                <Text style={[{ color: colors.background, fontSize: 12 }]}>
                  {currentTime > 60 ? ((currentTime / 60) % 60).toFixed(0) : currentTime > 10 ? currentTime.toFixed() : '0' + currentTime.toFixed(0)}
                </Text>

                <Slider
                  style={[tw.flex1, { height: 3, borderRadius: 4 }]}
                  value={progress}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor={colors.background}
                  thumbTintColor={colors.background}
                  onValueChange={(e) => {
                    player.current.seek(e * duration);
                  }}
                />
                <Text style={[{ color: colors.background, fontSize: 12 }]}>{duration > 60 ? (duration / 60).toFixed(0) : '00'} :</Text>
                <Text style={[{ color: colors.background, fontSize: 12 }]}>
                  {duration > 60 ? ((duration / 60) % 60).toFixed(0) : duration > 10 ? duration.toFixed() : '0' + duration.toFixed(0)}
                </Text>
              </View>
              <View style={[tw.pX2, tw.wFull, tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
                <Icon
                  style={[]}
                  onPress={() => {
                    setPaused(!paused);
                  }}
                  name={paused ? 'play-circle-outline' : 'pause'}
                  size={28}
                  color={colors.background}
                />
                <Icon
                  style={[]}
                  onPress={() => {
                    if (paused) {
                      setPaused(false);
                    }
                    setFullScreen(!fullScreen);
                    return;
                  }}
                  name={'screen-rotation'}
                  size={26}
                  color={colors.background}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <Video
          ref={player}
          controls={Platform.OS === 'ios'}
          source={{ uri: route.params.url }} // Can be a URL or a local file.
          rate={1} //播放速率
          paused={paused} //暂停
          style={[{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }]}
          fullscreen={fullScreen}
          fullscreenAutorotate={true}
          onBuffer={onBuffer}
          resizeMode={resizeMode} //缩放模式
          onLoad={onLoad} //加载媒体并准备播放时调用的回调函数。
          onProgress={onProgress} //视频播放过程中每个间隔进度单位调用的回调函数
          onEnd={onEnd} //视频播放结束时的回调函数
          onAudioBecomingNoisy={onAudioBecomingNoisy} //音频变得嘈杂时的回调 - 应暂停视频
          onAudioFocusChanged={onAudioFocusChanged} //音频焦点丢失时的回调 - 如果焦点丢失则暂停
        />
      );
    }
  }
);
