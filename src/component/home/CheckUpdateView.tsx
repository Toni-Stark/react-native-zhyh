import * as React from 'react';
import { Button, Dialog, Portal, ProgressBar } from 'react-native-paper';
import { tw } from 'react-native-tailwindcss';
import { View } from 'react-native';
import { useStore } from '../../store';
import { t } from '../../common/tools';

export const CheckUpdateView = (): JSX.Element => {
  const { checkUpdateStore } = useStore();

  const talkOff = (): void => {
    checkUpdateStore.needUpdate = false;
  };

  const ActionsButton = (title: string, isConfirm: boolean) => {
    if (!checkUpdateStore.showProgress) {
      return (
        <Button
          mode={isConfirm ? 'contained' : 'outlined'}
          style={[tw.mX2]}
          onPress={async () => {
            if (isConfirm) {
              await checkUpdateStore.startDownload();
            } else if (!isConfirm) {
              talkOff();
            }
          }}
        >
          {title}
        </Button>
      );
    }
  };

  return (
    <Portal>
      <Dialog
        visible={checkUpdateStore.needUpdate}
        onDismiss={() => {
          talkOff();
        }}
        style={[tw.pB5, tw.pX6]}
      >
        <Dialog.Title style={[tw.textBase, tw.textCenter]}>
          {checkUpdateStore.showProgress ? t('checkUpdateView.download') : t('checkUpdateView.foundNew')}
        </Dialog.Title>
        <View style={[tw.flex, tw.justifyCenter, tw.flexRow]}>
          {ActionsButton(t('checkUpdateView.cancel'), false)}
          {ActionsButton(t('checkUpdateView.confirm'), true)}
        </View>
        <ProgressBar visible={checkUpdateStore.showProgress} progress={checkUpdateStore.progress} />
      </Dialog>
    </Portal>
  );
};
