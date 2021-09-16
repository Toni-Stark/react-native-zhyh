import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { Appearance, BackHandler, Platform } from 'react-native';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { NavigatorStack } from './screen';
import { APP_COLOR_MODE, APP_LANGUAGE, USER_AGREEMENT } from './common/constants';
import { darkTheme, theme } from './common/theme';
import { useStore } from './store';
import { BootAnimation } from './screen/BootAnimation';
import { delay, getStorage } from './common/tools';
import { UserStore } from './store/UserStore';
import { observer, Observer } from 'mobx-react-lite';
import { UserPrivacy } from './screen/ModalScreens/UserPrivacy';

const App = observer(() => {
  const { colors } = useTheme();
  const { systemStore, userStore } = useStore();
  const [userAgree, setUserAgree] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      enableScreens();
      await Icon.loadFont();
    })();
  }, []);

  useEffect(() => {
    getStorage(USER_AGREEMENT)
      .then((res) => {
        setUserAgree(!!res);
      })
      .catch(() => {
        setUserAgree(false);
      });
  }, []);

  useEffect(() => {
    (async () => {
      let anyThing = await AsyncStorage.getItem(APP_COLOR_MODE);
      console.log(anyThing, anyThing === null, '首次进入app');
    })();
    const handleColorModeChange = async (preferences: Appearance.AppearancePreferences) => {
      const colorModeStore = await AsyncStorage.getItem(APP_COLOR_MODE);
      if (colorModeStore === 'system') {
        await systemStore.setColorModeConfig({
          mode: Appearance.getColorScheme(),
          saveSetting: false,
          backgroundColorStatusBar: colors.background,
          isSys: true
        });
      }
    };
    (async () => {
      const colorModeStore = await AsyncStorage.getItem(APP_COLOR_MODE);
      if (colorModeStore === null || colorModeStore === 'system') {
        await systemStore.setColorModeConfig({ mode: 'system', saveSetting: true, backgroundColorStatusBar: colors.background, isSys: true });
      }
      if (colorModeStore === 'light') {
        await systemStore.setColorModeConfig({ mode: 'light', saveSetting: true, backgroundColorStatusBar: colors.background, isSys: false });
      }
      if (colorModeStore === 'dark') {
        await systemStore.setColorModeConfig({ mode: 'dark', saveSetting: true, backgroundColorStatusBar: colors.background, isSys: false });
      }
    })();

    Appearance.addChangeListener(delay(handleColorModeChange));

    return () => {
      Appearance.removeChangeListener(handleColorModeChange);
    };
  }, [colors.background, systemStore]);

  useEffect(() => {
    const handleLocalizationChange = async () => {
      const language = await AsyncStorage.getItem(APP_LANGUAGE);
      await systemStore.setI18nConfig(language);
    };

    (async () => {
      await handleLocalizationChange();
    })();

    RNLocalize.addEventListener('change', handleLocalizationChange);

    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, [systemStore]);

  useEffect(() => {
    UserStore.getToken().then(async (token) => {
      if (token) {
        const res = await userStore.queryUserInfo();
        if (res) {
          console.log('登录成功');
        }
      }
    });
  }, [userStore]);

  const goInApp = async () => {
    await AsyncStorage.setItem(USER_AGREEMENT, 'Happy every day');
    getStorage(USER_AGREEMENT)
      .then((res) => {
        setUserAgree(!!res);
      })
      .catch(() => {
        setUserAgree(false);
      });
  };
  const outApp = async () => {
    await AsyncStorage.removeItem(USER_AGREEMENT);
    getStorage(USER_AGREEMENT)
      .then((res) => {
        setUserAgree(!!res);
      })
      .catch(() => {
        setUserAgree(false);
      });
    BackHandler.exitApp();
    BackHandler.exitApp();
    BackHandler.exitApp();
    BackHandler.exitApp();
  };

  const showScreens = () => {
    if (systemStore.showBootAnimation) {
      return <BootAnimation />;
    } else if (Platform.OS === 'android' && !userAgree) {
      return (
        <UserPrivacy
          outApp={async () => {
            await outApp();
          }}
          goInApp={async () => {
            await goInApp();
          }}
        />
      );
    } else {
      return <NavigatorStack />;
    }
  };

  return (
    <Observer>
      {() => (
        <SafeAreaProvider>
          <PaperProvider theme={systemStore.colorMode === 'dark' ? darkTheme : theme}>{showScreens()}</PaperProvider>
        </SafeAreaProvider>
      )}
    </Observer>
  );
});

export default App;
