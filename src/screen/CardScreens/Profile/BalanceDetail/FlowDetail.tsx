import React, { useCallback, useEffect, useRef, useState } from 'react';
import BaseView from '../../../../component/BaseView';
import { useStore } from '../../../../store';
import { t } from '../../../../common/tools';
import { FlatList, View, RefreshControl } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, List, Avatar, Text, Chip } from 'react-native-paper';
import { ScreenComponent } from '../../../index';
import { LoadCompleted } from '../../../../component/LoadCompleted';
import { observer } from 'mobx-react-lite';

export const FlowDetail: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { payStore } = useStore();
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const wait = useCallback(() => {
      return new Promise(async (resolve) => {
        const res = await payStore.foundMyList(true);
        if (res) {
          resolve();
          baseView.current?.showMessage({ text: t('flowDetail.updatedSuccess'), delay: 1 });
        } else {
          resolve();
        }
      });
    }, [payStore]);
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      wait().then(() => setRefreshing(false));
    }, [wait]);

    const handleOnLoadMore = async (info) => {
      if (info.distanceFromEnd > 0) {
        await payStore.foundMyList(false);
      }
    };

    useEffect(() => {
      (async () => {
        await payStore.foundMyList(true);
      })();
    }, [payStore]);

    const ListItem = (data) => {
      const { item, index } = data;
      return (
        <List.Item
          key={index}
          title={item.description}
          titleStyle={[{ fontSize: 16 }]}
          description={item.updateTime}
          descriptionStyle={[{ fontSize: 14 }]}
          style={[tw.pX3, { borderBottomWidth: 0.5, borderColor: colors.lightHint }]}
          onPress={() => {}}
          left={() => (
            <Avatar.Image
              style={[tw.selfCenter, { backgroundColor: colors.deepBackground }]}
              size={36}
              source={item.payType === '支付宝' ? require('../../../../assets/aliPay.png') : require('../../../../assets/weChat.png')}
            />
          )}
          right={() => (
            <View style={[tw.justifyAround]}>
              <Text style={[tw.selfCenter, { fontSize: 16 }]}>{item.amount}</Text>
              <Chip style={[tw.selfEnd, tw.itemsCenter, { height: 20, backgroundColor: item.type === 1 ? colors.notification : colors.primary }]}>
                <Text style={[{ fontSize: 10, color: colors.deepBackground }]}>{item.type === 1 ? t('flowDetail.recharge') : t('flowDetail.consumption')}</Text>
              </Chip>
            </View>
          )}
        />
      );
    };
    const renderContent = () => {
      if (payStore.payOrderRecords.length > 0) {
        return (
          <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={payStore.payOrderRecords}
            renderItem={ListItem}
            onEndReached={handleOnLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={<LoadCompleted title={t('flowDetail.tips')} />}
          />
        );
      } else {
        return (
          <View style={[tw.itemsCenter, { marginTop: 220 }]}>
            <Text style={[{ fontSize: 16 }]}>-{t('flowDetail.noInfo')}-</Text>
          </View>
        );
      }
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('flowDetail.myHeader')} />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
