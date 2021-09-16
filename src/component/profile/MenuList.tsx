import React from 'react';
import { tw } from 'react-native-tailwindcss';
import { View, TouchableOpacity } from 'react-native';
import { Switch, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MenuListProps {
  title?: string;
  settingList?: string[];
  settingTab?: string[];
  coreMeaning?: string;
  remind?: string;
  thereIsAChoice?: boolean;
  selected?: number;
  checkedSelected?: (index: number) => void;
  doTheAction?: () => void;
}

export const MenuList: React.FC<MenuListProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const ICON_SIZE = 24;

  const renderNotification = () => {
    if (props.thereIsAChoice) {
      return <View style={[tw.roundedFull, tw.w1, tw.h1, tw.mL1, { backgroundColor: colors.notification }]} />;
    } else {
      return null;
    }
  };
  return (
    <View style={[tw.pX3, tw.mB15]}>
      <View style={[{ borderColor: colors.deepBackground, paddingRight: 12, paddingTop: 15, opacity: 0.3 }]}>
        <Text>{props.title}</Text>
      </View>
      {props.settingList?.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[{ borderColor: colors.deepBackground, borderBottomWidth: 1 }]}
          activeOpacity={0.1}
          onPress={() => {
            if (typeof props.checkedSelected !== 'undefined') {
              props.checkedSelected(index);
            }
          }}
        >
          <View style={[tw.flexRow, tw.itemsCenter, { padding: 10 }]}>
            <Text style={[tw.mL1, tw.textSm, tw.flexGrow]} numberOfLines={1}>
              {item}
            </Text>
            <Switch
              onValueChange={() => {
                if (typeof props.checkedSelected !== 'undefined') {
                  props.checkedSelected(index);
                }
              }}
              value={props.selected === index}
            />
          </View>
        </TouchableOpacity>
      ))}
      {props.settingTab?.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[{ borderColor: colors.deepBackground, borderBottomWidth: 1 }]}
          activeOpacity={0.8}
          onPress={() => {
            if (typeof props.doTheAction !== 'undefined') {
              props.doTheAction();
            }
          }}
        >
          <View style={[tw.flexRow, tw.itemsCenter, { padding: 10 }]}>
            <Text style={[tw.mL1, tw.textSm, tw.flexGrow]} numberOfLines={1}>
              {item}
            </Text>
            <Text style={[tw.mL1, tw.textXs, { color: colors.placeholder }]} numberOfLines={1}>
              {props.thereIsAChoice ? props.remind : props.coreMeaning}
            </Text>
            {renderNotification()}
            <Icon name="chevron-right" size={ICON_SIZE} color={colors.placeholder} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
