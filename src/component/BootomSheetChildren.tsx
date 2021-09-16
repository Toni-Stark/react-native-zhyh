import * as React from 'react';
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';
export interface BottomSheetViewProps {}

export const BottomSheetChildren: React.FC<BottomSheetViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  return (
    <View style={[tw.wFull, tw.hFull, tw.pX5, tw.pY2, { backgroundColor: colors.surface, borderTopStartRadius: 20 }]}>
      <Icon name="menu" size={20} color={colors.disabled} style={[tw.selfCenter]} />
      {props.children}
    </View>
  );
};
