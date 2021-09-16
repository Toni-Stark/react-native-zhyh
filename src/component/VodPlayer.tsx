import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { tw } from 'react-native-tailwindcss';
import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { Animated, Dimensions, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import Video from 'react-native-video';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

type Props = {
  uri?: string;
  getFull?: (full: boolean) => void;
  widthFull: boolean;
  widthFullPress?: () => void;
};

export const VodPlayer: React.FC<Props> = (props): JSX.Element => {
  const { colors } = useTheme();
  const playVideo = useRef<Video>();
  let timer = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0));
  const [rate] = useState(1);
  const [paused, setPaused] = useState(false);
  const [volume] = useState(0.5);
  const [muted] = useState(false);
  const [resizeMode] = useState('contain');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlShow, setControlShow] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [vodHeight] = useState((Dimensions.get('window').width / 16) * 9);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim.current, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.timing(fadeAnim.current, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  useEffect(() => {
    if (vodHeight) {
      StatusBar.setHidden(true, 'fade');
      return () => {
        StatusBar.setHidden(false, 'fade');
      };
    }
  }, [vodHeight]);

  useLayoutEffect(() => {
    if (Platform.OS !== 'ios') {
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
          StatusBar.setHidden(false, 'fade');
          Orientation.removeOrientationListener(lockToLandscape);
          Orientation.lockToPortrait();
        };
      }
    }
  }, [fullScreen]);

  const onBuffer = (e) => {
    console.log('onBuffer', e);
  };

  const onLoad = (e) => {
    console.log('ready > > >', e);
    setCurrentTime(e.currentTime);
    setDuration(e.duration);
  };

  const onProgress = (e) => {
    setCurrentTime(e.currentTime);
    setProgress(e.currentTime / e.seekableDuration);
  };

  const onEnd = () => {
    console.log('onEnd');
  };

  const onAudioBecomingNoisy = () => {
    //音频变得嘈杂时的回调
    console.log('onAudioBecomingNoisy');
  };

  const onAudioFocusChanged = () => {
    //音频焦点丢失时的回调 - 如果焦点丢失则暂停
    console.log('onAudioFocusChanged');
  };

  const timeFadeOut = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setControlShow(controlShow);
      fadeOut();
    }, 6000);
  };

  const customerSliderValue = (value) => {
    playVideo.current.seek(value * duration);
  };

  return (
    <View style={[{ height: fullScreen ? Dimensions.get('screen').width : vodHeight }]}>
      <Video
        ref={playVideo}
        controls={Platform.OS === 'ios'}
        // source={{ uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__', type: 'mpd' }}
        source={{ uri: props.uri }} // Can be a URL or a local file.
        rate={rate} //播放速率
        paused={paused} //暂停
        volume={volume} //调节音量
        muted={muted} //控制音频是否静音
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
      {Platform.OS !== 'ios' ? (
        <View style={[tw.absolute, { height: fullScreen ? Dimensions.get('screen').width : vodHeight, width: '100%' }]}>
          {props.widthFull || fullScreen ? (
            <Animated.View
              style={[
                {
                  opacity: fadeAnim.current
                  // Bind opacity to animated value
                }
              ]}
            >
              <View style={[tw.wFull, { height: 40 }]}>
                <Icon
                  size={20}
                  onPress={() => {
                    if (props.widthFull && props.widthFullPress) {
                      props.widthFullPress();
                    } else {
                      if (props.getFull) {
                        props.getFull(!fullScreen);
                      }
                      setFullScreen(!fullScreen);
                    }

                    timeFadeOut();
                  }}
                  style={[tw.absolute, { color: colors.text, top: 10, left: 10 }]}
                  name="arrow-back-ios"
                />
              </View>
            </Animated.View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.9}
            style={[tw.flex1, tw.wFull]}
            onPressIn={() => {
              setControlShow(!controlShow);
              if (controlShow) {
                fadeOut();
              } else {
                fadeIn();
                timeFadeOut();
              }
            }}
            onLongPress={(e) => {
              console.log('long', e);
              timeFadeOut();
            }}
            onPressOut={(e) => {
              console.log('out', e);
              timeFadeOut();
            }}
          />
          <Animated.View
            style={[
              {
                opacity: fadeAnim.current
              }
            ]}
          >
            <View style={[tw.wFull, { height: 40 }]}>
              <Icon
                size={30}
                style={[tw.absolute, { color: colors.text, left: 5, bottom: props.widthFull ? 10 : 5 }]}
                onPress={() => {
                  setPaused(!paused);
                  timeFadeOut();
                }}
                name={paused ? 'play-arrow' : 'pause'}
              />
              {props.widthFull ? null : fullScreen ? null : (
                <Icon
                  size={30}
                  style={[tw.absolute, { color: colors.text, right: 5, bottom: props.widthFull ? 10 : 5 }]}
                  onPress={() => {
                    props.widthFull;
                    if (props.getFull) {
                      props.getFull(!fullScreen);
                    }
                    setFullScreen(!fullScreen);
                    timeFadeOut();
                  }}
                  name="fullscreen"
                />
              )}

              <Slider
                style={[
                  tw.absolute,
                  { height: 4, borderRadius: 5, left: 30, right: 105, bottom: props.widthFull ? 23.5 : 18.5, transform: [{ scaleX: 1 }, { scaleY: 1 }] }
                ]}
                value={progress}
                // thumbImage={require('../assets/card.png')}
                minimumTrackTintColor={colors.notification6}
                maximumTrackTintColor={colors.disabled}
                onValueChange={(e) => {
                  timeFadeOut();
                  customerSliderValue(e);
                }}
              />
              <View style={[tw.absolute, { right: 45, bottom: props.widthFull ? 19 : 14 }]}>
                <Text style={[{ fontSize: 10, color: colors.text }]}>
                  {[
                    moment.duration(currentTime, 'second').hours(),
                    moment.duration(currentTime, 'second').minutes(),
                    moment.duration(currentTime, 'second').seconds()
                  ].join(':')}
                  /
                  {[
                    moment.duration(duration, 'second').hours(),
                    moment.duration(duration, 'second').minutes(),
                    moment.duration(duration, 'second').seconds()
                  ].join(':')}
                </Text>
              </View>
              {/*<FastImage*/}
              {/*  source={require('../../../assets/card.png')}*/}
              {/*  style={[tw.absolute, tw.bgOrange400, { width: 20, height: 20, bottom: 10, left: (Dimensions.get('window').width - 165) * progress + 35 }]}*/}
              {/*  resizeMode={FastImage.resizeMode.stretch}*/}
              {/*/>*/}
            </View>
          </Animated.View>
        </View>
      ) : null}
      {Platform.OS !== 'ios' ? (
        !controlShow ? (
          <ProgressBar
            progress={progress}
            color={colors.notification5}
            style={[tw.absolute, { bottom: 0, backgroundColor: colors.disabled, width: Dimensions.get('window').width, height: 2 }]}
          />
        ) : null
      ) : null}
    </View>
  );
};
