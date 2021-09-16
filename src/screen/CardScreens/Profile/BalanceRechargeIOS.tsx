import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Appbar, Button, Card, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import accounting from 'accounting';
import { useStore } from '../../../store';
import { ActivityIndicator, Dimensions, NativeModules, Platform, TouchableOpacity, View } from 'react-native';
import { IN_APP_PURCHASE_ITEMS } from '../../../store/PayStore';
import { NavigatorComponentProps } from '../../index';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../index';
import { tw } from 'react-native-tailwindcss';
import { genRandomString, t } from '../../../common/tools';

const RNInAppPurchaseModule = NativeModules.RNInAppPurchaseModule;

type IOSPayItem = {
  identifier: string;
  priceString: string;
  title: string;
  description: string;
};

type ScreenRouteProp = RouteProp<ScreensParamList, 'BalanceRechargeIOS'>;
type Props = {
  route: ScreenRouteProp;
};

export const BalanceRechargeIOS: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const { userStore, payStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [selection, setSelection] = useState('');
    const [payList, setPayList] = useState<IOSPayItem[]>([]);
    const [paying, setPaying] = useState(false);
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();

    useEffect(() => {
      if (route.params?.message) {
        // baseView.current?.showMessage({ text: route.params?.message });
      }
    }, [route.params?.message]);

    useEffect(() => {
      if (Platform.OS === 'ios') {
        //加载产品
        RNInAppPurchaseModule.loadProducts(IN_APP_PURCHASE_ITEMS, (error, products) => {
          if (error === null) {
            const list: Array<IOSPayItem> = [];
            products.forEach((p) => {
              list.push({
                identifier: p.identifier,
                priceString: p.priceString,
                title: p.title,
                description: p.description
              });
            });
            setPayList(list);
          } else {
            baseView.current?.showMessage({ text: t('pay.errorGettingApplePaymentInformation'), delay: 2 });
          }
        });
      }
    }, []);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      userStore
        .getProfile()
        .then()
        .catch((e) => {
          console.log(e);
        });
      setRefreshing(false);
    }, [userStore]);

    // const renderPaySelection = (items: Array<IOSPayItem>) => {
    //   const ITEM_WIDTH = (Dimensions.get('window').width - 80) / 3;
    // const renderPayItem = (item: IOSPayItem) => {
    //   const handleSelectItem = () => {
    //     setSelection(item.identifier);
    //   };
    //   return (
    //     <TouchableOpacity key={item.identifier + genRandomString(8)} onPress={() => handleSelectItem()}>
    //       <Card
    //         style={[
    //           tw.itemsCenter,
    //           tw.mY5,
    //           tw.mX8,
    //           tw.pY5,
    //           tw.pX10,
    //           { width: ITEM_WIDTH, backgroundColor: selection === item.identifier ? colors.notification3 : colors.notification7 }
    //         ]}
    //       >
    //         {/*<Text style={[{ fontSize: 18, color: selection === item.identifier ? colors.background : colors.notification5 }]}>{item.title}</Text>*/}
    //         <Text style={[{ fontSize: 18, color: selection === item.identifier ? colors.background : colors.notification5 }]}>wefghjhgfd</Text>
    //         {/*<Text style={{ fontSize: 18, color: selection === item.identifier ? colors.background : colors.notification5 }}>{item.priceString}</Text>*/}
    //         <Text style={{ fontSize: 18, color: selection === item.identifier ? colors.background : colors.notification5 }}>wefghjhgfd</Text>
    //       </Card>
    //     </TouchableOpacity>
    //   );
    // };

    const renderPaySelection = (items: IOSPayItem[]) => {
      const ITEM_WIDTH = (Dimensions.get('window').width - 80) / 3;
      const renderPayItem = (item: IOSPayItem) => {
        const handleSelectItem = () => {
          setSelection(item.identifier);
        };
        return (
          <TouchableOpacity key={item.title + genRandomString(8)} onPress={() => handleSelectItem()}>
            <Card
              style={[
                tw.flex,
                tw.justifyCenter,
                tw.itemsCenter,
                tw.bgIndigo500,
                tw.mY1,
                tw.pY3,
                {
                  width: ITEM_WIDTH,
                  backgroundColor: selection !== item.identifier ? colors.background : colors.primary,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.accent
                }
              ]}
            >
              <Text style={[{ fontSize: 14, color: selection === item.identifier ? colors.background : colors.accent }]}>{item.priceString}元</Text>
              <Text style={[{ fontSize: 10, color: selection === item.identifier ? colors.background : colors.accent }]}>{item.title}</Text>
            </Card>
          </TouchableOpacity>
        );
      };

      const renderArray: JSX.Element[] = [];
      items.forEach((item) => renderArray.push(renderPayItem(item)));
      //加载中
      if (renderArray.length === 0) {
        renderArray.push(<ActivityIndicator key={genRandomString(8)} />);
      }
      if (refreshing) {
        return <ActivityIndicator />;
      } else {
        return <View style={[tw.itemsCenter, tw.flex, tw.flexRow, tw.flexWrap, tw.justifyBetween]}>{renderArray}</View>;
      }
    };

    const handlePurchase = async () => {
      // //按钮不能点击
      setPaying(true);
      baseView.current?.showLoading({ text: t('pay.paying') });
      const selectItem: IOSPayItem | undefined = payList.find((p) => p.identifier === selection);
      if (selectItem !== undefined && userStore.userInfo.id) {
        // 生成订单
        payStore
          .createInAppPurchase(userStore.userInfo.id, accounting.parse(selectItem.priceString), selectItem.description)
          .then((resOrder) => {
            // 发起支付
            RNInAppPurchaseModule.purchaseProduct(selection, resOrder.id, (error, result) => {
              console.log(error);
              console.log(result);
              if (error) {
                baseView.current?.showLoading({ text: t('pay.errorGettingApplePaymentInformation') + ':' + (error || t('pay.purchaseFailed')) });
                setPaying(false);
              } else {
                // 回调服务器更新订单状态（服务器和苹果服务器进行订单金额验证）
                payStore
                  .updateInAppPurchaseStatus(resOrder.id, result.transactionIdentifier, result.receiptData)
                  .then(() => {
                    baseView.current?.showMessage({ text: t('pay.success'), delay: 1.5 });
                    setPaying(false);
                    // 验证成功，删除缓存的凭证
                    RNInAppPurchaseModule.removePurchase(result);
                    onRefresh();
                  })
                  .catch((e) => {
                    console.log(e);
                    baseView.current?.showMessage({ text: t('pay.unchecked'), delay: 1.5 });
                    setPaying(false);
                  });
              }
            });
            setTimeout(() => {
              setPaying(false);
              baseView.current?.hideLoading();
            }, 1000 * 3);
          })
          .catch((e) => {
            baseView.current?.hideLoading();
            baseView.current?.showMessage({ text: e, delay: 1.5 });
            setPaying(false);
          });
      } else {
        baseView.current?.hideLoading();
      }
    };

    const renderDescription = () => {
      return (
        <View style={[tw.p3]}>
          <Text style={[{ color: colors.placeholder }]}>{t('pay.explain')}</Text>
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.purchased')}</Text>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.noSupport')}</Text>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.withdrawalAndRefund')}</Text>
          </View>
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.xb')}</Text>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.onlySupport')}</Text>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.purchaseCoursesOnIOSApp')}</Text>
          </View>
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.coursesPurchasedBy')}</Text>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.noSupport')}</Text>
            <Text style={[{ color: colors.placeholder }]}>{t('pay.refund')}</Text>
          </View>
          <Text style={[{ color: colors.placeholder }]}>{t('pay.pleaseCall')}</Text>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={true} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('balanceDetailChild.head')} />
        </Appbar.Header>
        <Card style={[tw.mT3, tw.mX3, tw.p3, { backgroundColor: colors.background }]}>
          <View style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
            <Text style={[{ fontSize: 22, fontWeight: 'bold' }]}>{`${accounting.formatNumber(userStore.userInfo.balance, 2)} ${t('pay.unit')}`}</Text>
            <View style={[tw.flexRow, tw.itemsCenter, tw.mT2]}>
              <Text style={[{ color: colors.placeholder }]}>{t('balanceDetailChild.accountActivityBalance')}</Text>
            </View>
          </View>
          <View style={[tw.mT5]}>{renderPaySelection(payList)}</View>
          <Button mode="contained" disabled={paying || selection === ''} style={[tw.mT5]} contentStyle={[tw.pY1]} onPress={handlePurchase}>
            {paying ? t('pay.paying') : t('recharge.immediatePayment')}
          </Button>
          <View style={[tw.mT5]}>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <Text style={[{ color: colors.notification }]}>{t('recharge.accountFrozenBalance')}</Text>
            </View>
            <Text style={[{ color: colors.accent }]}>{accounting.formatMoney(userStore.userInfo.frozenBalance, t('pay.unit'))}</Text>
          </View>
        </Card>
        {renderDescription()}
      </BaseView>
    );
  }
);
