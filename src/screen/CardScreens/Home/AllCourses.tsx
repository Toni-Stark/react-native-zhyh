import * as React from 'react';
import { useTheme, Appbar } from 'react-native-paper';
import { NavigatorComponentProps } from '../../index';
import { TopTabStack } from '../../index';
import { BigCourses } from './AllCourses/BigCourses';
import { LiveClass } from './AllCourses/LiveClass';
import { OnDemandClass } from './AllCourses/OnDemandClass';
import { SmallCourses } from './AllCourses/SmallCourses';
import { observer } from 'mobx-react-lite';
import { tw } from 'react-native-tailwindcss';
import { t } from '../../../common/tools';
import { View } from 'react-native';

type Props = {};
export const AllCourses: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();

    const renderContent = () => {
      return (
        <TopTabStack.Navigator
          backBehavior="none"
          tabBarOptions={{
            labelStyle: { fontSize: 12, color: colors.text },
            style: { backgroundColor: colors.background, display: 'flex' }
          }}
          style={[
            {
              backgroundColor: colors.background
            }
          ]}
        >
          <TopTabStack.Screen
            name="BigCourses"
            component={BigCourses}
            options={{
              tabBarLabel: t('allCourses.big')
            }}
          />
          <TopTabStack.Screen
            name="SmallCourses"
            component={SmallCourses}
            options={{
              tabBarLabel: t('allCourses.small')
            }}
          />
          <TopTabStack.Screen
            name="LiveClass"
            component={LiveClass}
            options={{
              tabBarLabel: t('allCourses.group')
            }}
          />
          <TopTabStack.Screen
            name="OnDemandClass"
            component={OnDemandClass}
            options={{
              tabBarLabel: t('allCourses.video')
            }}
          />
        </TopTabStack.Navigator>
      );
    };

    return (
      <View style={[tw.flex1]}>
        <Appbar.Header style={[{ backgroundColor: colors.background }]}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={t('allCourses.recentCourses')} />
        </Appbar.Header>
        {renderContent()}
      </View>
    );
  }
);
