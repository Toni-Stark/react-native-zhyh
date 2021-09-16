import * as React from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Video from 'react-native-video';
import { color as twColor, tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PLAYER_REPORT_POS_INTERVAL } from './Constant';

interface Props {
  uri: string;
  width: number;
  height: number;
  onlyAudio: boolean;
  mainColor?: string;
  showControls?: boolean;
  onResetReadyHandler?: () => void;
  onReadyHandler?: () => void;
  onCloseHandler?: () => void;
  onPauseHandler?: (paused: boolean, pos: number) => void;
  onProgressHandler?: (pos: number) => void;
  onErrorHandler?: () => void;
}

const SyncVideoPlayer = forwardRef<{}, Props>(
  (props, ref): JSX.Element => {
    const {
      uri,
      width,
      height,
      onlyAudio,
      mainColor = twColor.blue500,
      showControls = false,
      onResetReadyHandler,
      onReadyHandler,
      onCloseHandler,
      onPauseHandler,
      onProgressHandler,
      onErrorHandler
    } = props;

    const playerRef = useRef<Video>();
    const [duration, setDuration] = useState(0);
    const [playState, setPlayState] = useState<PLAYER_STATES>(PLAYER_STATES.PAUSED);
    const [position, setPosition] = useState(0);

    useImperativeHandle(
      ref,
      () => ({
        seekAndPause: (pos: number, paused: boolean) => {
          setPlayState(paused ? PLAYER_STATES.PAUSED : PLAYER_STATES.PLAYING);
          setPosition(pos);
          playerRef.current?.seek(pos);
        }
      }),
      []
    );

    const handleSeeking = (pos: number) => {
      setPosition(pos);
    };

    const handleSeek = (pos: number) => {
      playerRef.current?.seek(pos);
    };

    const handleOnError = (error) => {
      console.log(error);
      if (onErrorHandler) {
        onErrorHandler();
      }
    };

    const handleOnProgress = ({ currentTime }) => {
      if (onProgressHandler && currentTime > position) {
        onProgressHandler(Math.round(currentTime));
      }
      setPosition(currentTime);
    };

    const handlePause = (state: PLAYER_STATES) => {
      if (state !== playState) {
        setPlayState(state);
        if (onPauseHandler) {
          onPauseHandler(state !== PLAYER_STATES.PLAYING, Math.round(position));
        }
      }
    };

    const handleClose = () => {
      if (onCloseHandler) {
        onCloseHandler();
      }
    };

    const handleOnLoadStart = () => {
      setDuration(0);
      if (onResetReadyHandler) {
        onResetReadyHandler();
      }
    };

    const handleOnLoad = ({ duration: d }) => {
      setDuration(d);
      if (onReadyHandler) {
        onReadyHandler();
      }
    };

    const renderController = () => {
      if (showControls) {
        return (
          <MediaControls
            containerStyle={onlyAudio ? { height: 100 } : {}}
            sliderStyle={{ containerStyle: { marginBottom: 0 }, trackStyle: { height: 1 }, thumbStyle: { width: 25, height: 25 } }}
            toolbarStyle={{}}
            isFullScreen={false}
            duration={duration}
            isLoading={duration === 0}
            progress={position}
            mainColor={mainColor}
            onPaused={handlePause}
            onReplay={() => {
              setPlayState(PLAYER_STATES.PLAYING);
              playerRef.current?.seek(0);
            }}
            onSeeking={handleSeeking}
            onSeek={handleSeek}
            playerState={playState}
          >
            <MediaControls.Toolbar>
              <View style={[tw.absolute, { right: 30, top: 0 }]}>
                <Icon name="highlight-off" size={30} color={twColor.white} onPress={handleClose} />
              </View>
            </MediaControls.Toolbar>
          </MediaControls>
        );
      }
    };

    const renderAudioIcon = () => {
      if (onlyAudio) {
        const iconSize = height / 2;
        return (
          <View style={[tw.absolute, tw.flex, tw.flexRow, tw.itemsCenter, { left: (width - iconSize) / 2, top: (height - iconSize) / 2 }]}>
            <Icon name="audiotrack" size={iconSize} color={mainColor} />
            <Text style={{ fontSize: 9, color: mainColor }}>音乐播放中...</Text>
          </View>
        );
      }
    };

    return (
      <View style={[tw.flex1, tw.justifyCenter, tw.itemsCenter]}>
        <Video
          ref={playerRef}
          source={{
            uri
          }}
          repeat={false}
          progressUpdateInterval={1000 * PLAYER_REPORT_POS_INTERVAL}
          controls={false}
          useTextureView={false}
          onlyAudio={false}
          hideShutterView={true}
          style={{ width, height: onlyAudio ? 0 : height }}
          paused={playState !== PLAYER_STATES.PLAYING}
          onLoadStart={handleOnLoadStart}
          onLoad={handleOnLoad}
          onProgress={handleOnProgress}
          onError={handleOnError}
        />
        {renderAudioIcon()}
        {renderController()}
      </View>
    );
  }
);

export default SyncVideoPlayer;
