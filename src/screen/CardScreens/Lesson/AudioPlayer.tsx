import React, { useEffect, useRef, useState } from 'react';
import { Appbar, ProgressBar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { RouteProp } from '@react-navigation/native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { ScreensParamList } from '../index';
import { NavigatorComponentProps } from '../../index';
import Video from 'react-native-video';
import { LessonDetailPlaceholder } from '../../../component/skeleton/LessonDetailPlaceholder';
import { Dimensions, Animated, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import FastImage from 'react-native-fast-image';

type ScreenRouteProp = RouteProp<ScreensParamList, 'AudioPlayer'>;
type Props = {
  route: ScreenRouteProp;
};

export const AudioPlayer: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const playVideo = useRef<Video>();
    let timer = useRef<any>(null);
    const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
    const fadeAnim = useRef(new Animated.Value(1));
    const [rate, setRate] = useState(1);
    const [paused, setPaused] = useState(false);
    const [volume] = useState(0.5);
    const [muted] = useState(false);
    const [resizeMode] = useState('contain');
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [controlShow, setControlShow] = useState(true);
    // const [fullScreen, setFullScreen] = useState(false);
    const [vodHeight] = useState((Dimensions.get('window').width / 16) * 9);
    const [screenWidth] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
    // const [speed, setSpeed] = useState(0);
    const [speedList] = useState([0.75, 1, 1.25, 1.5, 2]);
    const [showVert, setShowVert] = useState(false);
    const isIos = Platform.OS === 'ios';
    useEffect(() => {
      if (route.params.url) {
        setTimeout(() => {
          setShowPlaceholder(false);
        }, 500);
      }
    }, [route.params.url]);

    useEffect(() => {
      return () => {
        console.log(route.params.back);
        if (route.params?.back) {
          navigation.navigate(route.params.back);
        }
      };
    }, [navigation, route.params.back]);

    useEffect(() => {
      if (screenWidth) StatusBar.setHidden(true, 'fade');
      return () => {
        StatusBar?.setHidden(false, 'fade');
      };
    }, [screenWidth]);

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
      console.log('onAudioBecomingNoisy');
    };

    const onAudioFocusChanged = () => {
      console.log('onAudioFocusChanged');
    };

    const fadeIn = () => {
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(fadeAnim.current, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    };

    const fadeOut = () => {
      // Will change fadeAnim value to 0 in 5 seconds
      Animated.timing(fadeAnim.current, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    };

    const timeFadeOut = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setControlShow(controlShow);
        setShowVert(false);
        fadeOut();
      }, 8000);
    };

    const onBuffer = (e) => {
      console.log('onBuffer', e);
    };

    const customerSliderValue = (value) => {
      console.log(value, progress, duration);
      playVideo.current.seek(value * duration);
    };

    const renderContent = () => {
      return (
        <View style={[tw.bgGray200, tw.selfCenter, tw.itemsCenter, tw.mT10, { borderRadius: 10 }]}>
          {/*<View style={[tw.m3, { height: fullScreen ? Dimensions.get('screen').width : vodHeight, width: vodHeight, backgroundColor: colors.onBackground }]}>*/}
          <View
            style={[
              tw.m3,
              { height: screenWidth ? vodHeight / 2 : vodHeight, width: screenWidth ? vodHeight / 2 : vodHeight, backgroundColor: colors.onBackground }
            ]}
          >
            {route.params.url ? (
              <Video
                ref={playVideo}
                // controls={Platform.OS === 'ios'}
                // source={{ uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__', type: 'mpd' }}
                source={{ uri: route.params.url }} // Can be a URL or a local file.
                rate={rate} //播放速率
                paused={paused} //暂停
                volume={volume} //调节音量
                muted={muted} //控制音频是否静音
                style={[tw.wFull, tw.hFull]}
                // fullscreen={fullScreen}
                fullscreenAutorotate={true}
                onBuffer={onBuffer}
                resizeMode={resizeMode} //缩放模式
                onLoad={onLoad} //加载媒体并准备播放时调用的回调函数。
                onProgress={onProgress} //视频播放过程中每个间隔进度单位调用的回调函数
                onEnd={onEnd} //视频播放结束时的回调函数
                onAudioBecomingNoisy={onAudioBecomingNoisy} //音频变得嘈杂时的回调 - 应暂停视频
                onAudioFocusChanged={onAudioFocusChanged} //音频焦点丢失时的回调 - 如果焦点丢失则暂停
                repeat={!isIos} //确定在到达结尾时是否重复播放视频。
              />
            ) : null}
            {/*{Platform.OS === 'ios' ? null : (*/}
            <FastImage
              source={require('../../../assets/current-music.jpeg')}
              style={[tw.absolute, { width: screenWidth ? vodHeight / 2 : vodHeight, height: screenWidth ? vodHeight / 2 : vodHeight, zIndex: 0 }]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {/*)}*/}

            {/*{Platform.OS !== 'ios' ? (*/}
            {/*<View style={[tw.absolute, { borderRadius: 10, height: fullScreen ? Dimensions.get('screen').width : vodHeight, width: '100%' }]}>*/}
            {/*  {fullScreen || screenWidth ? (*/}
            <View style={[tw.absolute, { borderRadius: 10, height: screenWidth ? vodHeight / 2 : vodHeight, width: '100%' }]}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[tw.flex1, tw.itemsCenter]}
                onPressIn={() => {
                  setControlShow(!controlShow);
                  setShowVert(false);
                  if (controlShow) {
                    fadeOut();
                  } else {
                    fadeIn();
                    timeFadeOut();
                  }
                }}
                onLongPress={() => {
                  timeFadeOut();
                }}
                onPressOut={() => {
                  timeFadeOut();
                }}
              >
                <Animated.View
                  style={[
                    tw.relative,
                    {
                      top: screenWidth ? vodHeight / 4 - 20 : vodHeight / 2 - 26,
                      opacity: fadeAnim.current
                      // Bind opacity to animated value
                    }
                  ]}
                >
                  <Icon
                    size={55}
                    style={[
                      {
                        // backgroundColor: colors.disabled,
                        color: colors.placeholder,
                        opacity: 0.8,
                        borderRadius: 40
                      }
                    ]}
                    onPress={() => {
                      setPaused(!paused);
                      timeFadeOut();
                    }}
                    name={paused ? 'play-arrow' : 'pause'}
                  />
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={[
                  {
                    opacity: fadeAnim.current
                    // Bind opacity to animated value
                  }
                ]}
              >
                <View style={[tw.wFull, { height: 40 }]}>
                  <View style={[tw.absolute, { left: 10, bottom: 14 }]}>
                    <Text style={[{ fontSize: 10, color: colors.text }]}>
                      {[
                        moment.duration(currentTime, 'second').hours(),
                        moment.duration(currentTime, 'second').minutes(),
                        moment.duration(currentTime, 'second').seconds()
                      ].join(':')}
                    </Text>
                  </View>
                  <Slider
                    style={[tw.absolute, { height: 20, borderRadius: 5, left: isIos ? 40 : 30, right: isIos ? 50 : 45, bottom: 10 }]}
                    value={progress}
                    minimumTrackTintColor={colors.accent}
                    maximumTrackTintColor={colors.placeholder}
                    thumbTintColor={colors.accent}
                    onValueChange={(e) => {
                      timeFadeOut();
                      customerSliderValue(e);
                    }}
                  />
                  <View style={[tw.absolute, { right: 15, bottom: 14 }]}>
                    <Text style={[{ fontSize: 10, color: colors.text }]}>
                      {[
                        moment.duration(duration, 'second').hours(),
                        moment.duration(duration, 'second').minutes(),
                        moment.duration(duration, 'second').seconds()
                      ].join(':')}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>
            {/*) : null}*/}

            {/*{Platform.OS !== 'ios' ? (*/}
            {!controlShow ? (
              <ProgressBar
                progress={progress}
                color={colors.notification5}
                style={[tw.absolute, { bottom: 0, backgroundColor: colors.disabled, width: screenWidth ? vodHeight / 2 : vodHeight, height: 2 }]}
              />
            ) : null}
            {/*) : null}*/}
          </View>
        </View>
      );
    };
    if (showPlaceholder) {
      return <LessonDetailPlaceholder />;
    } else {
      return (
        <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            {/*<Appbar.BackAction onPress={navigation.goBack} />*/}
            <Icon
              style={[tw.absolute, tw.selfCenter, { left: 20, zIndex: 99 }]}
              name="arrow-back-ios"
              size={22}
              color={colors.placeholder}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View style={[tw.flex1, tw.itemsCenter]}>
              <Text style={[tw.itemsCenter, { fontSize: 16 }]}>{route.params.name}</Text>
            </View>
          </Appbar.Header>
          {renderContent()}
          <View
            style={[
              tw.pY4,
              screenWidth ? tw.pX40 : tw.pX10,
              tw.flexRow,
              tw.itemsCenter,
              tw.justifyBetween,
              { borderColor: colors.disabled, borderBottomWidth: 0.25 }
            ]}
          >
            <Text style={[{ fontSize: 16 }]}>
              音乐：<Text style={[{ color: colors.accent }]}>{route.params.name}</Text>
            </Text>
            <View style={[tw.itemsCenter]}>
              <TouchableOpacity
                style={[tw.p1]}
                onPress={() => {
                  setShowVert(!showVert);
                  if (showVert) {
                    fadeOut();
                  } else {
                    fadeIn();
                    timeFadeOut();
                  }
                }}
              >
                <Text style={[{ fontSize: 14, color: colors.text }]}>x{rate}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {showVert ? (
            <Animated.View
              style={[
                // tw.absolute,
                // tw.itemsCenter,
                // {
                //   backgroundColor: colors.disabled,
                //   top: 380,
                //   right: 0,
                //   opacity: fadeAnim.current,
                //   width: 100,
                //   height: fullScreen ? Dimensions.get('window').height - 100 : vodHeight - 60
                //   // Bind opacity to animated value
                // }
                tw.absolute,
                tw.itemsCenter,
                {
                  backgroundColor: colors.disabled,
                  top: isIos ? 460 : screenWidth ? 50 : 380,
                  right: 0,
                  opacity: fadeAnim.current,
                  width: 100,
                  height: vodHeight - 60
                  // Bind opacity to animated value
                }
              ]}
            >
              <View style={[tw.flex1, tw.justifyAround]}>
                {speedList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setRate(item);
                      timeFadeOut();
                    }}
                  >
                    <Text
                      style={[{ color: colors.background, fontSize: 14 }]}
                      key={index}
                      onPress={() => {
                        setRate(item);
                        timeFadeOut();
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ) : null}
        </BaseView>
      );
    }
  }
);
