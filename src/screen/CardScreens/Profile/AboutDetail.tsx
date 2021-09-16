import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { NavigatorComponentProps } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { t } from '../../../common/tools';
import { observer } from 'mobx-react-lite';
import { MenuList } from '../../../component/profile/MenuList';
import { useStore } from '../../../store';
import { CheckUpdateView } from '../../../component/home/CheckUpdateView';

type Props = {};

export const AboutDetail: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { colors } = useTheme();
    const { checkUpdateStore } = useStore();
    const ICON_SIZE = 18;
    const setting = useRef<any>([
      {
        title: t('aboutDetail.userAgree'),
        action: t('aboutDetail.detail'),
        navigate: () => {
          navigation.navigate('UserAgreement');
        }
      },
      {
        title: t('aboutDetail.privacyAgree'),
        action: t('aboutDetail.detail'),
        navigate: () => {
          navigation.navigate('PrivacyAgreement');
        }
      },
      {
        title: t('aboutDetail.contactUs'),
        action: t('aboutDetail.detail'),
        navigate: () => {
          navigation.navigate('Main', { screen: 'ContactUs', options: { animationEnabled: false } });
        }
      }
      // {
      //   title: t('aboutDetail.feedback'),
      //   action: t('aboutDetail.questions'),
      //   navigate: () => {
      //     navigation.navigate('Main', { screen: 'ProblemFeedback', options: { animationEnabled: false } });
      //   }
      // }
    ]);
    const [nowVersion, setNowVersion] = useState(false);
    useEffect(() => {
      (async () => {
        let Version = await checkUpdateStore.autoMaticDetection();
        setNowVersion(Version);
      })();
    }, [checkUpdateStore]);
    const renderContent = () => {
      return (
        <View style={[tw.flex1]}>
          <Appbar.Header style={{ backgroundColor: colors.background }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={t('aboutDetail.about')} />
          </Appbar.Header>
          <ScrollView>
            {setting.current.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[{ borderColor: colors.deepBackground, borderBottomWidth: 1 }]}
                activeOpacity={0.8}
                onPress={() => {
                  item.navigate();
                }}
              >
                <View style={[tw.flexRow, tw.itemsCenter, { padding: 16 }]}>
                  <Text style={[tw.mL1, tw.textSm, tw.flexGrow]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[tw.mL1, tw.textSm, { color: colors.placeholder }]} numberOfLines={1}>
                    {item.action}
                  </Text>
                  <Icon name="chevron-right" size={ICON_SIZE} color={colors.placeholder} />
                </View>
              </TouchableOpacity>
            ))}
            {MenuList({
              title: t('profileDetail.vInfo'),
              settingTab: [t('profileDetail.versionUpdate')],
              remind: t('profileDetail.disNewV'),
              coreMeaning: t('profileDetail.now') + 'v' + require('../../../../package.json').version,
              thereIsAChoice: nowVersion,
              doTheAction: async () => {
                const res = await checkUpdateStore.checkUpdate(baseView, true);
                if (res) {
                  baseView.current?.showMessage({ text: res, delay: 3 });
                }
              }
            })}
          </ScrollView>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
        {CheckUpdateView()}
      </BaseView>
    );
  }
);
