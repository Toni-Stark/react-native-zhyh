import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Appbar, ProgressBar, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { RouteProp } from '@react-navigation/native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { ScreensParamList } from '../index';
import { NavigatorComponentProps } from '../../index';
import Video from 'react-native-video';
import { Dimensions, Animated, TouchableOpacity, View, StatusBar, Platform, ScrollView } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useStore } from '../../../store';

type ScreenRouteProp = RouteProp<ScreensParamList, 'ReplayVideo'>;
type Props = {
  route: ScreenRouteProp;
};

export const ReplayVideo: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const playVideo = useRef<Video>();
    let timer = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0));
    const { lessonDetailStore } = useStore();
    const [rate, setRate] = useState(1);
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
    const [screenWidth] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
    const [speedList] = useState([0.75, 1, 1.25, 1.5, 2]);
    const [showVert, setShowVert] = useState(false);
    const [collection, setCollection] = useState(0);
    const isIos = Platform.OS === 'ios';

    useEffect(() => {
      (async () => {
        const res = await lessonDetailStore.getSchedulesReplay(route.params.id);
        console.log(route.params.index, '这是index');
        if (route.params?.index) {
          setCollection(route.params.index);
        }
        if (typeof res === 'string') {
          baseView.current.showMessage({ text: res, delay: 3 });
        }
      })();
    }, [lessonDetailStore, route.params.id, route.params.index]);

    useEffect(() => {
      if (screenWidth) StatusBar.setHidden(true, 'fade');
      return () => {
        StatusBar?.setHidden(false, 'fade');
      };
    }, [screenWidth]);

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
      Animated.timing(fadeAnim.current, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    };

    const fadeOut = () => {
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
        <View style={[tw.flex1]}>
          <View style={[{ height: fullScreen ? Dimensions.get('screen').width : vodHeight, backgroundColor: colors.onBackground }]}>
            {lessonDetailStore.scheduleReplays.length > 0 ? (
              <Video
                ref={playVideo}
                controls={Platform.OS === 'ios'}
                source={{ uri: lessonDetailStore.scheduleReplays[collection] }} // Can be a URL or a local file.
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
              />
            ) : null}

            {Platform.OS !== 'ios' ? (
              <View style={[tw.absolute, { height: fullScreen ? Dimensions.get('screen').width : vodHeight, width: '100%' }]}>
                {fullScreen || screenWidth ? (
                  <Animated.View
                    style={[
                      {
                        opacity: fadeAnim.current
                      }
                    ]}
                  >
                    <View style={[tw.wFull, { height: 40 }]}>
                      <Icon
                        size={20}
                        onPress={() => {
                          if (screenWidth) {
                            navigation.goBack();
                          } else {
                            setFullScreen(!fullScreen);
                            timeFadeOut();
                          }
                        }}
                        style={[tw.absolute, { color: colors.background, top: 10, left: 10 }]}
                        name="arrow-back-ios"
                      />
                    </View>
                  </Animated.View>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[tw.flex1, tw.wFull, tw.itemsCenter]}
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
                        top: !fullScreen ? vodHeight / 2 - 30 : vodHeight / 2,
                        opacity: fadeAnim.current
                      }
                    ]}
                  >
                    <Icon
                      size={55}
                      style={[
                        {
                          color: colors.background,
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
                  {showVert ? (
                    <Animated.View
                      style={[
                        tw.absolute,
                        tw.itemsCenter,
                        {
                          backgroundColor: colors.disabled,
                          top: 10,
                          right: 40,
                          opacity: fadeAnim.current,
                          width: 40,
                          height: fullScreen ? Dimensions.get('window').height - 100 : vodHeight - 60
                          // Bind opacity to animated value
                        }
                      ]}
                    >
                      <View style={[tw.flex1, tw.justifyAround]}>
                        {speedList.map((item, index) => (
                          <Text
                            style={[{ color: colors.background, fontSize: 12 }, tw.flex1]}
                            key={index}
                            onPress={() => {
                              setRate(item);
                              timeFadeOut();
                            }}
                          >
                            {item}
                          </Text>
                        ))}
                      </View>
                    </Animated.View>
                  ) : null}
                </TouchableOpacity>

                <Animated.View
                  style={[
                    {
                      opacity: fadeAnim.current
                    }
                  ]}
                >
                  <View style={[tw.wFull, { height: 40 }]}>
                    {!fullScreen ? (
                      screenWidth ? null : (
                        <Icon
                          size={30}
                          style={[tw.absolute, { color: colors.background, right: 5, bottom: 5 }]}
                          onPress={() => {
                            setFullScreen(!fullScreen);
                            timeFadeOut();
                          }}
                          name="fullscreen"
                        />
                      )
                    ) : null}
                    <View style={[tw.absolute, { left: 10, bottom: 14 }]}>
                      <Text style={[{ fontSize: 10, color: colors.background }]}>
                        {[
                          moment.duration(currentTime, 'second').hours(),
                          moment.duration(currentTime, 'second').minutes(),
                          moment.duration(currentTime, 'second').seconds()
                        ].join(':')}
                      </Text>
                    </View>
                    <Slider
                      style={[tw.absolute, { height: 20, borderRadius: 5, left: 30, right: 95, bottom: 10 }]}
                      value={progress}
                      disabled={false}
                      minimumTrackTintColor={colors.accent}
                      maximumTrackTintColor={colors.background}
                      thumbTintColor={colors.accent}
                      onValueChange={(e) => {
                        timeFadeOut();
                        customerSliderValue(e);
                      }}
                    />
                    <View style={[tw.absolute, { right: 75, bottom: 14 }]}>
                      <Text style={[{ fontSize: 10, color: colors.background }]}>
                        {[
                          moment.duration(duration, 'second').hours(),
                          moment.duration(duration, 'second').minutes(),
                          moment.duration(duration, 'second').seconds()
                        ].join(':')}
                      </Text>
                    </View>

                    <View style={[tw.itemsCenter, tw.absolute, { width: 40, right: 35, bottom: 14 }]}>
                      <TouchableOpacity
                        style={[tw.pX1]}
                        onPress={() => {
                          // setShowVert(!showVert);
                          setShowVert(true);
                          timeFadeOut();
                        }}
                      >
                        <Text style={[{ fontSize: 13, color: colors.background }]}>x{rate}</Text>
                      </TouchableOpacity>
                    </View>
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
          <View style={[tw.flex1]}>
            <View style={[tw.p4, { backgroundColor: colors.background }]}>
              <Text style={[{ fontSize: 17, fontWeight: 'bold' }]}>{lessonDetailStore.lessonDetailSchedules?.name}</Text>
              <Text style={[tw.mT3, { fontSize: 13, color: colors.placeholder }]}>已结束，共{lessonDetailStore.scheduleReplays.length}节回放</Text>
            </View>
            <View>
              <View style={[tw.pT4, tw.pB2, tw.pX4, tw.flexRow, tw.justifyBetween, { backgroundColor: colors.background }]}>
                <Text>选集</Text>
                <Text style={[{ fontSize: 13, color: colors.placeholder }]}>全{lessonDetailStore.scheduleReplays.length}节</Text>
              </View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={[tw.flexRow]}>
                {lessonDetailStore.scheduleReplays.slice().map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (isIos) {
                          navigation.goBack();
                          navigation.navigate('Main', { screen: 'ReplayVideo', params: { id: route.params.id, index: index } });
                        } else {
                          setCollection(index);
                        }
                      }}
                      key={index}
                    >
                      <View
                        style={[
                          tw.mY1,
                          tw.mX2,
                          tw.p3,
                          collection === index ? tw.borderPink400 : tw.borderGray500,
                          { height: 45, width: 100, borderRadius: 6, borderWidth: 0.5 }
                        ]}
                      >
                        <Text style={[collection === index ? tw.textPink400 : { color: colors.text }]}>第{index + 1}节</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      );
    };
    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        {!fullScreen ? (
          screenWidth ? null : (
            <Appbar.Header style={{ backgroundColor: colors.background }}>
              {/*<Appbar.BackAction onPress={navigation.goBack} />*/}
              <Icon
                style={[tw.selfCenter, tw.mL2]}
                name="arrow-back-ios"
                size={22}
                color={colors.placeholder}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <View style={[tw.flex1, tw.itemsCenter]}>
                <Text style={[tw.itemsCenter, { fontSize: 16 }]}>课程回放</Text>
              </View>
            </Appbar.Header>
          )
        ) : null}

        {renderContent()}
      </BaseView>
    );
  }
);
