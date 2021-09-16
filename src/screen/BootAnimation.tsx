import React, { useEffect } from 'react';
// import { Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import LottieView from 'lottie-react-native';
import RNBootSplash from 'react-native-bootsplash';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

export const BootAnimation: React.FC = observer(
  (): JSX.Element => {
    const showSplash = false;
    const { systemStore } = useStore();
    // const [animationIsVisible, setAnimationIsVisible] = useState(true);
    // const progress = useRef<Animated.Value>(new Animated.Value(0));
    // const opacity = useRef<Animated.Value>(new Animated.Value(1));

    useEffect(() => {
      RNBootSplash.hide()
        .then(() => {
          systemStore.showBootAnimation = false;
        })
        .catch(() => (systemStore.showBootAnimation = false));
    }, [showSplash, systemStore]);

    // useEffect(() => {
    //   setTimeout(() => {
    //     RNBootSplash.hide()
    //       .then(() => {
    //         if (!progress.current) {
    //           return null;
    //         }
    //
    //         Animated.sequence([
    //           Animated.timing(progress.current, {
    //             toValue: 1,
    //             useNativeDriver: true,
    //             duration: 2500,
    //             easing: Easing.ease
    //           }),
    //           Animated.timing(opacity.current, {
    //             delay: 250,
    //             toValue: 0,
    //             useNativeDriver: true,
    //             duration: 250,
    //             easing: Easing.in(Easing.ease)
    //           })
    //         ]).start(() => {
    //           setAnimationIsVisible(false);
    //           systemStore.showBootAnimation = false;
    //         });
    //       })
    //       .catch(() => (systemStore.showBootAnimation = false));
    //   }, 1000);
    // }, [showSplash, systemStore]);

    // const renderLottieSplash = () => {
    //   if (animationIsVisible) {
    //     return (
    //       <Animated.View
    //         style={[
    //           StyleSheet.absoluteFill,
    //           {
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             opacity: opacity.current
    //           }
    //         ]}
    //       >
    //         <LottieView
    //           source={require('./../assets/splash.json')}
    //           loop={false}
    //           progress={progress.current}
    //           resizeMode="cover"
    //           style={{ width: 200, height: 200 }}
    //         />
    //       </Animated.View>
    //     );
    //   }
    // };

    return <SafeAreaView style={{ height: '100%' }} />;
  }
);
