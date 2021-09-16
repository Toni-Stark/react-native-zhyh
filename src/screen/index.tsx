import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { createStackNavigator, StackNavigationOptions, StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { blue500 } from 'react-native-paper/src/styles/colors';
import { useStore } from '../store';
import { t } from '../common/tools';
import { Home } from './Home';
import { Profile } from './Profile';
import { ModalScreens } from './ModalScreens';
import { CardScreens, ScreensParamList } from './CardScreens';
import { View } from 'react-native';
import { CloudDisk } from './CloudDisk';
import { Lesson } from './Lesson';
import { observer } from 'mobx-react-lite';
import { USER_MODE_CLASS_STUDENT, USER_MODE_CLASS_TEACHER } from '../common/status-module';
import RNBootSplash from 'react-native-bootsplash';

const BottomIconSize = 22;
const RootStack = createStackNavigator();
const BottomTabStack = createMaterialBottomTabNavigator();
export const TopTabStack = createMaterialTopTabNavigator();
const MainStack = createStackNavigator<ScreensParamList>();

const BottomTabs = observer(() => {
  const { colors } = useTheme();
  const { systemStore, userStore } = useStore();

  return (
    <BottomTabStack.Navigator
      backBehavior="none"
      shifting={false}
      activeColor={blue500}
      barStyle={{ backgroundColor: colors.background }}
      key={systemStore.language}
    >
      <BottomTabStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'house' : 'home'} color={color} size={BottomIconSize} />
        }}
      />
      <BottomTabStack.Screen
        name="Lesson"
        component={Lesson}
        options={{
          tabBarLabel: userStore.userInfoDetail.userType === USER_MODE_CLASS_TEACHER ? t('tabs.class') : t('tabs.lesson'),
          tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'local-library' : 'school'} color={color} size={BottomIconSize} />
        }}
      />
      {userStore.userInfoDetail.userType && userStore.userInfoDetail.userType !== USER_MODE_CLASS_STUDENT ? (
        <BottomTabStack.Screen
          name="CloudDisk"
          component={CloudDisk}
          options={{
            tabBarLabel: '网盘',
            tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'cloud-queue' : 'cloud-circle'} color={color} size={BottomIconSize} />
          }}
        />
      ) : null}

      <BottomTabStack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: t('tabs.profile'),
          // tabBarBadge: userStore.msg,
          tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'person' : 'account-circle'} color={color} size={BottomIconSize} />
        }}
      />
    </BottomTabStack.Navigator>
  );
});

const MainScreens = () => {
  return (
    <MainStack.Navigator>
      <RootStack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false, gestureEnabled: false }} />
      {CardScreens.map((screen) => (
        <RootStack.Screen name={screen.name} component={screen.component} key={screen.name} options={{ headerShown: false }} />
      ))}
    </MainStack.Navigator>
  );
};

const renderFallback = () => {
  return (
    <View style={{ height: '100%', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
};

const linking = {
  prefixes: ['xueyue://'],
  screens: {
    initialRouteName: 'Home',
    LessonDetail: {
      path: 'lesson-live/:id'
    },
    LessonVodDetail: {
      path: 'lesson-vod/:id'
    },
    HomeworkLesson: {
      path: 'homework-lesson/:id'
    },
    HomeworkGroup: {
      path: 'homework-group/:id'
    },
    NotFound: '*'
  }
};

export const NavigatorStack = observer(() => {
  RNBootSplash.hide();
  return (
    <NavigationContainer linking={linking} fallback={renderFallback()}>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen name="Main" component={MainScreens} options={{ headerShown: false }} />
        {ModalScreens.map((screen) => (
          <RootStack.Screen name={screen.name} component={screen.component} key={screen.name} options={{ headerShown: false }} />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
});

export type NavigatorComponentProps = StackScreenProps<ParamListBase> & {
  options?: StackNavigationOptions;
};

export type ScreenComponent = React.FC<NavigatorComponentProps>;

export interface ScreenList {
  name: string;
  component: ScreenComponent | React.FC<any>;
}
