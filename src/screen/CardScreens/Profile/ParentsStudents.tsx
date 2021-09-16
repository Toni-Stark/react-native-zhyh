import React, { useEffect, useRef } from 'react';
import BaseView from '../../../component/BaseView';
import { getSafeAvatar, t } from '../../../common/tools';
import { ScreenComponent } from '../../index';
import { FlatList } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme, Text, List, Avatar } from 'react-native-paper';
import { useStore } from '../../../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react-lite';

export const ParentsStudents: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { userStore } = useStore();

    useEffect(() => {
      (async () => {
        const res = await userStore.getParentsStudents();
        if (typeof res !== 'boolean') {
          baseView.current?.showMessage({ text: res, delay: 2 });
        }
      })();
    }, [userStore]);

    // const useHeader = (avatar: string): JSX.Element => {
    //   if (avatar.length > 0) {
    //     return <Avatar.Image style={[tw.selfCenter, { backgroundColor: colors.deepBackground }]} size={36} source={getSafeAvatar(avatar)} />;
    //   } else {
    //     return <Icon name="account-circle" size={36} color={colors.primary} />;
    //   }
    // };

    const ListItem = (data) => {
      const { item, index } = data;
      return (
        <List.Item
          key={index}
          title={item.username}
          titleStyle={[{ fontSize: 16 }]}
          description={item.updateTime}
          // onPress={() => {
          //   console.log(index);
          // }}
          descriptionStyle={[{ fontSize: 14 }]}
          style={[tw.pX4, tw.pY5, { borderBottomWidth: 0.5, borderColor: colors.lightHint }]}
          left={() => {
            if (item.avatar.length > 0) {
              return <Avatar.Image style={[tw.selfCenter, { backgroundColor: colors.deepBackground }]} size={36} source={getSafeAvatar(item.avatar)} />;
            } else {
              return <Icon name="account-circle" style={[tw.selfCenter]} size={36} color={colors.primary} />;
            }
          }}
          // right={() => (
          //   <View style={[tw.justifyAround]}>
          //     <Text style={[tw.selfCenter, { fontSize: 12 }]}>{t('parentsStudents.detail')}</Text>
          //   </View>
          // )}
        />
      );
    };

    const flatListFooter = () => {
      if (userStore.parentsStudents.length === 0) {
        return <Text style={[tw.selfCenter, tw.mT20, { color: colors.placeholder, fontSize: 18 }]}>{t('parentsStudents.notInfo')}</Text>;
      } else return null;
    };

    const renderContent = () => {
      return (
        <FlatList
          scrollEnabled={true}
          data={userStore.parentsStudents}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          numColumns={1}
          renderItem={ListItem}
          ListFooterComponent={flatListFooter}
        />
      );
    };
    return (
      <BaseView useSafeArea={true} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('parentsStudents.myHeader')} />
        </Appbar.Header>
        {renderContent()}
      </BaseView>
    );
  }
);
