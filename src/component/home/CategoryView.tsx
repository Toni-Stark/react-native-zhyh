import * as React from 'react';
import { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { color as twColor, tw } from 'react-native-tailwindcss';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { useDimensions } from '@react-native-community/hooks';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
const barColors = [
  twColor.red500,
  twColor.blue500,
  twColor.purple500,
  twColor.orange500,
  twColor.green500,
  twColor.indigo600,
  twColor.pink500,
  twColor.teal500,
  twColor.yellow500
];

type Props = {
  navigate: (navi: any) => void;
};

const CategoryView: React.FC<Props> = observer(
  (props): JSX.Element => {
    const { window } = useDimensions();
    const { homeStore } = useStore();
    const ITEM_WIDTH = Dimensions.get('window').width > 900 ? window.width / 12.5 : window.width / 7.5;

    return (
      <View style={[tw.flexRow, tw.flexWrap, tw.justifyCenter, tw.itemsCenter, tw.mT3, tw.pX3]}>
        {homeStore.categories?.slice()?.map((c, index) => {
          if (index <= 8) {
            return (
              <TouchableOpacity
                key={`carousel-${index}`}
                style={[tw.flexCol, tw.itemsCenter, tw.mX2, tw.mY1, { width: ITEM_WIDTH }]}
                onPress={() => {
                  props.navigate(c);
                }}
              >
                <Avatar.Text
                  label={c.name.substring(0, 1)}
                  size={(ITEM_WIDTH * 4) / 5}
                  color={twColor.white}
                  style={{ backgroundColor: index >= 10 ? barColors[index - 10] : barColors[index] }}
                />
                <Text style={[tw.textXs, tw.mY1]} numberOfLines={1}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
        <TouchableOpacity
          key={`carousel-${888}`}
          style={[tw.flexCol, tw.itemsCenter, tw.mX2, tw.mY1, { width: ITEM_WIDTH }]}
          onPress={() => {
            props.navigate(false);
          }}
        >
          <Avatar.Text label="全" size={(ITEM_WIDTH * 4) / 5} color={twColor.white} style={{ backgroundColor: barColors[barColors.length] }} />
          {/*<View style={[tw.bgBlue600, tw.itemsCenter, tw.justifyCenter, { borderRadius: 30, width: 45, height: 35 }]}>*/}
          {/*  <Text style={[tw.mY1, tw.textWhite, { fontSize: 16, fontWeight: 'bold' }]} numberOfLines={1}>*/}
          {/*    {'全部课程'.substring(0, 1)}*/}
          {/*  </Text>*/}
          {/*</View>*/}

          <Text style={[tw.textXs, tw.mY1]} numberOfLines={1}>
            全部课程
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

export default CategoryView;
