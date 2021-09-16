import React, { useLayoutEffect } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, View } from 'react-native';
import { ScreenComponent } from '../../index';
import { Button, Divider, useTheme, Text, Chip } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { getOnlyWord, throttle } from '../../../common/tools';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';
import { t } from '../../../common/tools';

export const Search: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const ICON_SIZE = 18;
    const { colors } = useTheme();
    const { searchStore } = useStore();

    useLayoutEffect(() => {
      navigation.setOptions({
        animationEnabled: false
      });
    }, [navigation]);

    const handleCancel = () => {
      navigation.goBack();
    };

    const handleSearch = async (search: string) => {
      if (search.trim().length > 0) {
        const searchIndeed = getOnlyWord(search);
        await searchStore.addSearchHistory(searchIndeed);
        const res = await searchStore.searchConditionInfo(search, false);
        if (res) {
          navigation.navigate('Main', { screen: 'SearchPage', params: { text: search }, options: { animationEnabled: false } });
        }
      }
    };

    const handleNewSearch = async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      let text: string = e.nativeEvent.text;
      await handleSearch(text);
    };

    const renderHistoryTitle = () => {
      if (searchStore.history.length > 0) {
        return (
          <View style={[tw.flexRow, tw.itemsCenter, tw.m4, tw.fontBold]}>
            <View style={[tw.flexGrow]}>
              <Text>{t('search.history')}</Text>
            </View>
            <Icon name="history" color={colors.placeholder} size={ICON_SIZE} onPress={() => searchStore.clearHistory()} />
          </View>
        );
      } else {
        return null;
      }
    };

    const renderHistory = () => {
      const viewArray: JSX.Element[] = [];
      searchStore.history.forEach((h, index) => {
        viewArray.push(
          <Chip key={`chip-${index}`} mode="outlined" style={[tw.m1]} onPress={throttle(() => handleSearch(h))}>
            {h}
          </Chip>
        );
      });
      return viewArray;
    };

    return (
      <BaseView>
        <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, tw.textCenter, tw.pX4, tw.pY2]}>
          <View
            style={[
              tw.flex1,
              tw.flexRow,
              tw.itemsCenter,
              tw.roundedFull,
              tw.border,
              tw.pX3,
              tw.border,
              { height: 30, backgroundColor: colors.surface, borderColor: colors.disabled }
            ]}
          >
            <Icon name="search" color={colors.placeholder} size={ICON_SIZE} />
            <TextInput
              style={[tw.flex1, tw.mL2, tw.h10, { color: colors.text }]}
              autoFocus
              multiline={false}
              maxLength={20}
              placeholder={t('search.searchCourses')}
              returnKeyType="search"
              clearButtonMode="while-editing"
              onSubmitEditing={handleNewSearch}
            />
          </View>
          <Button compact onPress={throttle(handleCancel)}>
            {t('search.cancel')}
          </Button>
        </View>
        <Divider />
        {renderHistoryTitle()}
        <View style={[tw.flexRow, tw.flexWrap, tw.m4]}>{renderHistory()}</View>
      </BaseView>
    );
  }
);
