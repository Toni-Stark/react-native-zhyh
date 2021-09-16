import React from 'react';
import { tw } from 'react-native-tailwindcss';
import { Text, useTheme } from 'react-native-paper';
import { Linking, StatusBar, View } from 'react-native';
import { t } from '../common/tools';

export const ShengWangView: React.FC = (props): JSX.Element => {
  const { colors } = useTheme();

  const open = () => {
    let url = 'https://www.agora.io/cn/?utm_source=baidu&utm_medium=cpc&bd_vid=12586887144581134538';
    Linking.openURL(url).then((res) => {
      console.log(res);
    });
  };

  return (
    <View style={[tw.mX2, tw.flexRow, tw.selfCenter, StatusBar.currentHeight && StatusBar.currentHeight > 30 ? tw.mT1 : tw.mT0]}>
      <Text style={[{ fontSize: 12, color: colors.placeholder }, tw.textCenter]}>
        {t('shengWang.one')}
        <Text
          onPress={() => {
            open();
          }}
          style={[{ fontSize: 12, color: colors.accent }]}
        >
          {t('shengWang.two')}
        </Text>
        {t('shengWang.three')}
      </Text>
    </View>
  );
};
