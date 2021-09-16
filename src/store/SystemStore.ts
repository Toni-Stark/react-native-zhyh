import { action, makeAutoObservable, observable } from 'mobx';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from 'i18n-js';
import { Appearance, Platform, StatusBar } from 'react-native';
import { APP_COLOR_MODE, APP_LANGUAGE } from '../common/constants';
import { t } from '../common/tools';
import { darkTheme, theme } from '../common/theme';

const translationGetters = {
  en: () => require('../i18n/en.json'),
  zh: () => require('../i18n/zh.json')
};

export type AppColorModeType = 'light' | 'dark' | 'system';
export type AppLanguageType = 'zh' | 'en' | 'system';

export class SystemStore {
  readonly defaultLanguage: AppLanguageType = 'zh';
  readonly defaultColorMode = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';

  @observable showBootAnimation: boolean = true;
  @observable language: AppLanguageType = this.defaultLanguage;
  @observable colorMode: AppColorModeType = this.defaultColorMode;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async setI18nConfig(language: AppLanguageType | string | null, saveSetting: boolean = true) {
    let selectedLanguage, saveLanguage;
    switch (language) {
      case 'en':
      case 'zh':
        selectedLanguage = language;
        saveLanguage = language;
        break;
      case 'system':
      case null:
        selectedLanguage = (RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || { languageTag: 'zh' }).languageTag;
        saveLanguage = 'system';
        break;
      default:
        selectedLanguage = this.defaultLanguage;
        saveLanguage = 'system';
    }
    t.cache.clear();
    i18n.translations = { [selectedLanguage]: translationGetters[selectedLanguage]() };
    i18n.locale = selectedLanguage;
    if (saveSetting) {
      await AsyncStorage.setItem(APP_LANGUAGE, saveLanguage);
    }
    this.language = selectedLanguage;
  }

  @action
  async setColorModeConfig(params: {
    isSys: boolean;
    mode: AppColorModeType | string | undefined | null;
    saveSetting?: boolean;
    backgroundColorStatusBar: string;
  }) {
    let selectedMode, saveMode, statusBarStyle;
    let nowMode = Appearance.getColorScheme();
    switch (params.mode) {
      case 'light':
        selectedMode = 'light';
        saveMode = params.isSys ? 'system' : 'light';
        statusBarStyle = 'dark-content';
        break;
      case 'dark':
        selectedMode = 'dark';
        saveMode = params.isSys ? 'system' : 'dark';
        statusBarStyle = 'light-content';
        break;
      default:
        selectedMode = Appearance.getColorScheme();
        saveMode = 'system';
        statusBarStyle = nowMode === 'dark' ? 'light-content' : 'dark-content';
    }
    if (params.saveSetting || true) {
      await AsyncStorage.setItem(APP_COLOR_MODE, saveMode);
      StatusBar.setBarStyle(statusBarStyle, false);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(selectedMode === 'light' ? theme.colors.background : darkTheme.colors.background);
      }
    }
    this.colorMode = selectedMode;
  }
}
