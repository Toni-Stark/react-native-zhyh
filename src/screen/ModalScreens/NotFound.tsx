import React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';
import { ScreenComponent } from '../index';
import BaseView from '../../component/BaseView';
import { observer } from 'mobx-react-lite';
import { t } from '../../common/tools';

export const NotFound: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    return (
      <BaseView>
        <Text>{t('notFound.noPage')}</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')}>
          {t('notFound.goHome')}
        </Button>
      </BaseView>
    );
  }
);
