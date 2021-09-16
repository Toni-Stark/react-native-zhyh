import React, { useLayoutEffect, useRef, useState } from 'react';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { observer } from 'mobx-react-lite';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../../../store';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { throttle, t } from '../../../common/tools';
import { CarouselCardItem } from '../../../component/home/CarouseCardItem';
import { TransitionPresets } from '@react-navigation/stack';
type ScreenRouteProp = RouteProp<ScreensParamList, 'SearchPage'>;
type Props = {
  route: ScreenRouteProp;
};
export const SearchPage: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const { homeStore, searchStore } = useStore();
    const [loading] = useState(false);
    const ICON_SIZE = 18;
    const BACK_SIZE = 28;

    useLayoutEffect(() => {
      navigation.setOptions({
        ...TransitionPresets.SlideFromRightIOS,
        cardOverlayEnabled: true,
        gestureEnabled: false
      });
    }, [navigation]);

    const handleSearch = () => {
      navigation.navigate('Main', { screen: 'Search', options: { animationEnabled: false } });
    };

    const onRefresh = async () => {
      await setRefreshing(true);
      setTimeout(async () => {
        const res = await searchStore.searchConditionInfo(route.params.text, false);
        if (res) {
          baseView.current.showToast({ text: t('searchPage.searchPage'), delay: 1 });
        }
        await setRefreshing(false);
      }, 1000);
    };

    const handleOnLoadMore = async () => {
      if (searchStore.searchList.length > 10) {
        await searchStore.searchConditionInfo(route.params.text, true);
      }
    };

    const renderFooter = () => {
      if (searchStore.searchList.length > 0) {
        return (
          <View style={[tw.selfCenter, tw.pY3, { marginBottom: 30 }]}>
            <Text style={[{ fontSize: 16, color: colors.placeholder }]}>{loading ? t('searchPage.loading') : t('searchPage.end')}</Text>
          </View>
        );
      } else {
        return <Text style={[tw.textCenter, { marginTop: 100, fontSize: 16, color: colors.placeholder }]}>没有近期课程</Text>;
      }
    };

    const viewList = (data) => {
      if (data) {
        return (
          <CarouselCardItem
            data={data.item}
            onClick={(e: string) => {
              switch (searchStore.isLiveOrDemand) {
                case 0:
                  navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId: e } });
                  break;
                case 1:
                  navigation.navigate('Main', { screen: 'LessonVodDetail', params: { lessonId: e } });
                  break;
              }
            }}
          />
        );
      } else {
        return <View />;
      }
    };

    return (
      <BaseView ref={baseView} useSafeArea={true} style={[tw.flex1, tw.mX2]} error={homeStore.error}>
        <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, tw.m3]}>
          <TouchableOpacity style={[tw.flexRow]} onPress={throttle(handleSearch)}>
            <Icon name="navigate-before" color={colors.placeholder} size={BACK_SIZE} />
          </TouchableOpacity>
          <View
            style={[
              tw.flex1,
              tw.flexRow,
              tw.itemsCenter,
              tw.roundedFull,
              tw.border,
              tw.pX3,
              tw.mL2,
              tw.border,
              { height: 30, backgroundColor: colors.surface, borderColor: colors.disabled }
            ]}
          >
            <Icon name="search" color={colors.placeholder} size={ICON_SIZE} onPress={throttle(handleSearch, 500)} />
            <TouchableOpacity style={[tw.w48, tw.hFull, tw.itemsStart, tw.justifyCenter]} onPress={handleSearch}>
              <Text style={[tw.textXs, { color: colors.placeholder }]} numberOfLines={1}>
                {route.params.text}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[tw.flexRow, tw.pX2, tw.pY2, tw.borderGray200, { height: 45, borderBottomWidth: 0.5 }]}
          >
            {searchStore.dataList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[index !== 0 ? tw.mL2 : null]}
                  onPress={async () => {
                    searchStore.searchList = [];
                    searchStore.isLiveOrDemand = index;
                    // baseView.current.showMessage({ text: '切换直播点播课', delay: 1.5 });
                    await searchStore.searchConditionInfo(route.params.text, true);
                  }}
                >
                  <View
                    style={[
                      tw.bgGray100,
                      tw.itemsCenter,
                      tw.justifyCenter,
                      tw.hFull,
                      tw.borderBlue300,
                      item.index === searchStore.isLiveOrDemand ? tw.bgBlue200 : null,
                      { width: 70, borderRadius: 6, borderWidth: item.index === searchStore.isLiveOrDemand ? 1 : 0 }
                    ]}
                  >
                    <Text style={[{ fontSize: 12, color: colors.text }]}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <FlatList
          style={[tw.flex1]}
          scrollEnabled={true}
          data={searchStore.searchList}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          numColumns={1}
          renderItem={viewList}
          onEndReached={handleOnLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={renderFooter()}
        />
      </BaseView>
    );
  }
);
