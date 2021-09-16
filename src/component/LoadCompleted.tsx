import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

interface CompletedBaseViewProps {
  title: string;
}

export const LoadCompleted: React.FC<CompletedBaseViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const { title } = props;
  return (
    <View style={[tw.mT3, tw.selfCenter, tw.itemsCenter, tw.flexRow, { marginBottom: 32 }]}>
      <Icon size={14} color={colors.disabled} name="receipt-long" />
      <Text style={[tw.mL1, { color: colors.disabled }]}>{title}</Text>
    </View>
  );
};
