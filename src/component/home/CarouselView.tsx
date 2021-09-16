import * as React from 'react';
import { Dimensions, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { tw } from 'react-native-tailwindcss';
import FastImage from 'react-native-fast-image';
import { useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';
import { getSafeAvatar } from '../../common/tools';

export interface CarouselViewProps {
  data: Array<CarouselViewItemType>;
  autoplayTimeout?: number;
  navi: (e) => void;
}

export interface CarouselViewItemType {
  id?: string;
  orgCode?: string;
  status?: string;
  createTime?: string;
  description?: string;
  pictureUrl?: string;
  callback?: Function;
  targetType?: string;
  targetId?: string;
  sort?: string;
  weight?: number;
  imageUrl?: string;
}

const CarouselView: React.FC<CarouselViewProps> = (props): JSX.Element => {
  const { data, autoplayTimeout = 5 } = props;
  const { colors } = useTheme();
  const [widthView, setWidthView] = useState<number>(0);
  const [heightView, setHeightView] = useState<number | undefined>(undefined);

  useEffect(() => {
    const width = Dimensions.get('window').width;
    setWidthView(width);
    setHeightView(width / 2.4);
  }, [widthView]);

  return (
    <View style={[{ height: heightView }]}>
      <Swiper autoplay autoplayTimeout={autoplayTimeout} paginationStyle={{ bottom: 5 }} activeDotColor={colors.background}>
        {data.map((c, index) => (
          <TouchableWithoutFeedback
            key={`carousel-${index}`}
            onPress={() => {
              if (c) {
                props.navi(c);
              }
            }}
          >
            <FastImage style={[{ height: heightView }, tw.mX3, tw.roundedLg]} source={{ uri: c.imageUrl }} resizeMode={FastImage.resizeMode.stretch} />
          </TouchableWithoutFeedback>
        ))}
      </Swiper>
    </View>
  );
};

export default CarouselView;
