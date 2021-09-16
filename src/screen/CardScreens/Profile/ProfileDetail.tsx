import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { tw } from 'react-native-tailwindcss';
import { useTheme, Appbar } from 'react-native-paper';
import { MenuList } from '../../../component/profile/MenuList';
import { useStore } from '../../../store';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_COLOR_MODE, APP_LANGUAGE } from '../../../common/constants';
import { t } from '../../../common/tools';
import { observer } from 'mobx-react-lite';

type ScreenRouteProp = RouteProp<ScreensParamList, 'LessonDetail'>;
type Props = {
  route: ScreenRouteProp;
};

export const ProfileDetail: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>(undefined);
    const [themeSelected, setThemeSelected] = useState(2);
    const [languageSelected, setLanguageSelected] = useState(2);
    const { systemStore } = useStore();

    const checkedTheme = async (e: number) => {
      setThemeSelected(e);
      await systemStore.setColorModeConfig(
        e === 0
          ? { mode: 'light', saveSetting: false, backgroundColorStatusBar: colors.background, isSys: false }
          : e === 1
          ? { mode: 'dark', saveSetting: false, backgroundColorStatusBar: colors.background, isSys: false }
          : { mode: 'system', saveSetting: false, backgroundColorStatusBar: colors.background, isSys: true }
      );
    };
    const checkedLanguage = async (e: number) => {
      setLanguageSelected(e);
      await systemStore.setI18nConfig(e === 0 ? 'zh' : e === 1 ? 'en' : 'system');
    };
    useEffect(() => {
      (async () => {
        let nowLanguage = await AsyncStorage.getItem(APP_LANGUAGE);
        setLanguageSelected(nowLanguage === 'zh' ? 0 : nowLanguage === 'en' ? 1 : 2);
      })();
      (async () => {
        let nowTheme = await AsyncStorage.getItem(APP_COLOR_MODE);
        setThemeSelected(nowTheme === 'light' ? 0 : nowTheme === 'dark' ? 1 : 2);
      })();
    }, []);
    // useEffect(() => {
    //   (async () => {
    //     let nowTheme = systemStore.colorMode;
    //     setThemeSelected(nowTheme === 'light' ? 0 : nowTheme === 'dark' ? 1 : 2);
    //   })();
    // }, [systemStore.colorMode]);

    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('profileDetail.setting')} />
          </Appbar.Header>
          <ScrollView>
            {MenuList({
              title: t('profileDetail.sysTheme'),
              settingList: [t('profileDetail.lightMode'), t('profileDetail.darkMode'), t('profileDetail.sysDecision')],
              selected: themeSelected,
              checkedSelected: async (e) => {
                await checkedTheme(e);
              }
            })}
            {MenuList({
              title: t('profileDetail.sysLanguage'),
              settingList: [t('profileDetail.zhCn'), t('profileDetail.en'), t('profileDetail.sysDecision')],
              selected: languageSelected,
              checkedSelected: async (e) => {
                await checkedLanguage(e);
              }
            })}
          </ScrollView>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
