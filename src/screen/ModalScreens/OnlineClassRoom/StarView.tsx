import { Animated, Easing, View } from 'react-native';
import * as React from 'react';
import { forwardRef, ForwardRefExoticComponent, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Player } from '@react-native-community/audio-toolkit';

interface StarViewProps {
  ref?: any;
  starCount?: number;
  starSize?: number;
  children: React.ReactNode;
}

const StarView: ForwardRefExoticComponent<StarViewProps> = forwardRef(
  (props, ref): JSX.Element => {
    const [webColors, setWebColors] = useState<string[]>([]);
    const starCount = props.starCount || 20;
    const starSize = props.starSize || 30;
    const values = useRef<Animated.Value[]>([]);
    const [animations, setAnimations] = useState<Animated.CompositeAnimation[]>([]);
    for (let i = 0; i < starCount; i++) {
      values.current.push(new Animated.Value(0));
    }

    useEffect(() => {
      const hex = ['FF', 'CC', '99', '66', '33', '00'];
      const allColors: string[] = [];
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          for (let k = 0; k < 6; k++) {
            allColors.push('#' + hex[j] + hex[k] + hex[i]);
          }
        }
      }
      setWebColors(allColors);
    }, []);

    useEffect(() => {
      const allAnimations: Animated.CompositeAnimation[] = [];
      for (let i = 0; i < starCount; i++) {
        allAnimations.push(
          Animated.timing(values.current[i], {
            useNativeDriver: false,
            toValue: 5,
            duration: 2000,
            easing: Easing.linear
          })
        );
      }
      setAnimations(allAnimations);
    }, [starCount]);

    useImperativeHandle(
      ref,
      () => ({
        animate: () => {
          new Player('award.mp3').play();
          Animated.stagger(80, animations).start(() => {
            for (let i = 0; i < starCount; i++) {
              values.current[i].setValue(0);
            }
          });
        }
      }),
      [animations, starCount]
    );

    const renderStars = () => {
      const view: JSX.Element[] = [];
      for (let i = 0; i < starCount; i++) {
        view.push(
          <Animated.View
            key={i}
            style={{
              bottom: values.current[i].interpolate({
                inputRange: [0, 1, 2, 3, 4],
                outputRange: [0, starSize, starSize * 3, starSize * 6, starSize * 12]
              }),
              right: values.current[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0, Math.round(Math.random() * starSize) - starSize / 2]
              }),
              transform: [
                {
                  scale: values.current[i].interpolate({
                    inputRange: [0, 1, 2, 3, 4],
                    outputRange: [1, 1.1, 1.3, 2, 3]
                  })
                }
              ],
              opacity: values.current[i].interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 0.8, 0]
              })
            }}
          >
            <Icon
              name="star-rate"
              size={starSize}
              color={webColors[Math.round(Math.random() * webColors.length) - 1]}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </Animated.View>
        );
      }
      return view;
    };

    return (
      <View>
        {renderStars()}
        {props.children}
      </View>
    );
  }
);

export default StarView;
