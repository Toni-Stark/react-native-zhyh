import React, { useEffect, useRef, useState } from 'react';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { observer } from 'mobx-react-lite';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../../../store';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { t } from '../../../common/tools';
import { CarouselCardItem } from '../../../component/home/CarouseCardItem';
type ScreenRouteProp = RouteProp<ScreensParamList, 'Barner'>;
type Props = {
  route: ScreenRouteProp;
};
export const Barner: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const { homeStore } = useStore();
    const [loading] = useState(false);

    const onRefresh = async () => {
      await setRefreshing(true);
      setTimeout(async () => {
        const res = await homeStore.getNaviBarData(route.params.data.id, false);
        if (res) {
          baseView.current.showToast({ text: t('searchPage.searchPage'), delay: 1 });
        }
        await setRefreshing(false);
      }, 1000);
    };

    useEffect(() => {
      (async () => {
        homeStore.isLiveOrDemand = 0;
        await homeStore.getNaviBarData(route.params.data.id ? route.params.data.id : undefined, false);
      })();
    }, [homeStore, route.params.data, route.params.data.id]);

    const handleOnLoadMore = async () => {
      if (homeStore.barDataList.length > 10) {
        await homeStore.getNaviBarData(route.params.data.id, true);
      }
    };

    const renderFooter = () => {
      if (homeStore.barDataList.length > 0) {
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
      return (
        <CarouselCardItem
          data={data.item}
          onClick={(e: string) => {
            switch (homeStore.isLiveOrDemand) {
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
    };

    return (
      <BaseView ref={baseView} useSafeArea={false} style={[tw.flex1, tw.mX2]} error={homeStore.error}>
        <Appbar.Header style={[{ backgroundColor: colors.background }]}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={route.params.data.name} />
        </Appbar.Header>
        <View style={[]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[tw.flexRow, tw.pX2, tw.pY2, tw.borderGray200, { height: 45, borderBottomWidth: 0.5 }]}
          >
            {homeStore.dataList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[index !== 0 ? tw.mL2 : null]}
                  onPress={async () => {
                    homeStore.barDataList = [];
                    homeStore.isLiveOrDemand = index;
                    const res = await homeStore.getNaviBarData(route.params.data.id, false);
                    if (res) {
                      console.log('切换直播点播课', homeStore.dataList[homeStore.isLiveOrDemand].url, homeStore.dataList[homeStore.isLiveOrDemand].name);
                      // baseView.current.showMessage({ text: '切换直播点播课', delay: 1.5 });
                    }
                  }}
                >
                  <View
                    style={[
                      tw.bgGray100,
                      tw.itemsCenter,
                      tw.justifyCenter,
                      tw.hFull,
                      tw.borderBlue300,
                      item.index === homeStore.isLiveOrDemand ? tw.bgBlue200 : null,
                      { width: 70, borderRadius: 6, borderWidth: item.index === homeStore.isLiveOrDemand ? 1 : 0 }
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
          data={homeStore.barDataList.slice()}
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
