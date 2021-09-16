import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { FlatList, RefreshControl, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { CarouselCardItem } from './home/CarouseCardItem';
import { AllClassType } from '../store/HomeStore';
import { t } from '../common/tools';

interface CompletedBaseViewProps {
  type: number;
  navigation: (e: string) => void;
  allSearchSmallClass: Array<AllClassType>;
  getNewData: () => void;
  getAddData: () => void;
}

export const FlatListCard: React.FC<CompletedBaseViewProps> = (props): JSX.Element => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnLoadMore = async () => {
    setLoading(true);
    props.getAddData();
    setLoading(false);
  };
  const onRefresh = async () => {
    await setRefreshing(true);
    setTimeout(async () => {
      props.getNewData();
      await setRefreshing(false);
    }, 1000);
  };
  const viewList = (data) => {
    if (data) {
      return (
        <CarouselCardItem
          data={data.item}
          onClick={(e: string) => {
            props.navigation(e);
          }}
        />
      );
    } else {
      return <View />;
    }
  };
  const renderFooter = () => {
    if (props.allSearchSmallClass.slice().length > 0) {
      return (
        <View style={[tw.selfCenter, tw.pY3, { marginBottom: 180 }]}>
          <Text>{loading ? t('flatListCard.loading') : t('flatListCard.over')}</Text>
        </View>
      );
    } else {
      return <Text style={[tw.textCenter, { marginTop: 100, fontSize: 20 }]}>{t('flatListCard.noCourses')}</Text>;
    }
  };

  return (
    <FlatList
      style={[tw.flex1]}
      scrollEnabled={true}
      data={props.allSearchSmallClass.slice()}
      keyExtractor={(item, index) => {
        return props.type + index.toString();
      }}
      numColumns={1}
      renderItem={viewList}
      onEndReached={handleOnLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListFooterComponent={renderFooter()}
    />
  );
};
