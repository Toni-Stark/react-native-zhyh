import * as React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export interface SelectTabBarProps {
  data: any[];
  currentNum: number;
  onChangeIndex: (e: number) => void;
}

export const SelectTabBar: React.FC<SelectTabBarProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const { data, currentNum } = props;

  const renderContent = () => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={[tw.flexRow, { height: 40 }]}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                props.onChangeIndex(index);
              }}
              style={[tw.itemsCenter, tw.justifyCenter, tw.mX2]}
            >
              <Text
                style={[
                  {
                    fontWeight: currentNum === index ? 'bold' : '500',
                    fontSize: currentNum === index ? 19 : 17,
                    color: currentNum === index ? colors.onBackground : colors.placeholder
                  }
                ]}
              >
                {item.name}
              </Text>
              {currentNum === index ? (
                <View style={[tw.flexRow, { opacity: 0.6 }]}>
                  <View style={[tw.bgBlue500, { marginTop: 2, width: 4, height: 3.5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }]} />
                  {/*<View style={[tw.bgGreen500, { marginTop: 2, width: 3, height: 3.5 }]} />*/}
                  <View style={[tw.bgBlue500, { marginTop: 2, width: 4, height: 3.5, borderTopRightRadius: 5, borderBottomRightRadius: 5 }]} />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={[tw.flexRow, tw.mT1, tw.mB3]}>
      <View
        style={[tw.itemsCenter, tw.justifyCenter, tw.borderGray200, { borderWidth: 0.5, width: '15%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }]}
      >
        <Text style={[{ fontSize: 15, color: colors.accent, fontWeight: 'bold' }]}>分类</Text>
      </View>

      {renderContent()}
    </View>
  );
};
