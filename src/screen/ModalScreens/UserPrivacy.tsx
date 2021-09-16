import React, { useRef } from 'react';
import { Appbar, Button, Text, useTheme } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import BaseView from '../../component/BaseView';
import { Linking, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import RNBootSplash from 'react-native-bootsplash';

export type Props = {
  outApp: () => void;
  goInApp: () => void;
};
export const UserPrivacy: React.FunctionComponent<Props> = observer((props) => {
  const { colors } = useTheme();
  const loading = useRef<any>(undefined);
  RNBootSplash.hide();

  const navi = (num: number) => {
    console.log(num);
    switch (num) {
      case 1:
        let urlOne = 'http://www.icst-edu.com/?xueyue/32.html';
        Linking.openURL(urlOne).then((res) => {
          console.log(res);
        });
        break;
      case 2:
        let urlTwo = 'http://www.icst-edu.com/?xueyue/37.html';
        Linking.openURL(urlTwo).then((res) => {
          console.log(res);
        });
        break;
    }
  };
  const getRed = (name: string, num: number) => {
    return (
      <Text
        onPress={() => {
          navi(num);
        }}
        style={[{ fontSize: 15, color: colors.notification }]}
      >
        {name}
      </Text>
    );
  };
  return (
    <BaseView useSafeArea={false} ref={loading}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.Content title="用户及隐私协议" />
      </Appbar.Header>
      <View style={[tw.flex1, tw.p5]}>
        <Text style={[{ fontSize: 16 }]}>
          感谢您下载并使用云海学悦！我们非常重视您的个人信息和隐私保护。为了更好地保障您的权益，请您认真阅读下面协议的全部内容，同意并接受全部条款后，开始使用我们的产品和服务。
        </Text>
        <Text style={[tw.mT6, tw.selfCenter, { fontSize: 15, color: colors.placeholder }]}>
          点击查看 {getRed('《隐私协议》', 1)} 和{getRed('《用户协议》', 2)}
        </Text>
        <View style={[tw.flexRow, tw.selfCenter, tw.mT5]}>
          <Button
            mode="outlined"
            style={[tw.mR5]}
            onPress={() => {
              props.outApp();
            }}
          >
            不同意退出
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              props.goInApp();
            }}
          >
            同意并继续
          </Button>
        </View>
      </View>
    </BaseView>
  );
});
