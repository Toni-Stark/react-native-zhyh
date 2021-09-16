import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheetBehavior from 'reanimated-bottom-sheet';
import BottomSheet from 'reanimated-bottom-sheet';

export interface BottomSheetViewProps {
  height: number;
  show: boolean;
  onDismiss: () => void;
  title: string;
  content: Array<DescriptionType>;
}

export interface DescriptionType {
  title: string;
  description: string;
}

const BottomSheetView: React.FC<BottomSheetViewProps> = (props): JSX.Element => {
  const { height, show, onDismiss, title, content } = props;
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetBehavior>(null);

  useEffect(() => {
    if (bottomSheetRef.current !== null) {
      if (show) {
        bottomSheetRef.current.snapTo(0);
      } else {
        bottomSheetRef.current.snapTo(2);
      }
    }
  }, [show]);

  const renderDescriptions = () => {
    const viewArray: Array<JSX.Element> = [];
    content.forEach((c, index) => {
      viewArray.push(
        <View key={`description-${index}`} style={[tw.flexRow, tw.mX1, tw.mY2]}>
          <Icon name="check-circle" size={15} color={colors.notification} style={[tw.w6]} />
          <View style={[tw.mL2, tw.flex1]}>
            <Text>{c.title}</Text>
            <Text style={[tw.mT2, { fontSize: 11, color: colors.placeholder }]}>{c.description}</Text>
          </View>
        </View>
      );
    });
    return viewArray;
  };

  const renderContent = () => {
    return (
      <View style={[tw.p4, tw.itemsCenter, { backgroundColor: colors.deepBackground, height }]}>
        <Icon
          name="clear"
          size={20}
          color={colors.placeholder}
          style={[tw.absolute, { right: 15, top: 15 }]}
          onPress={() => {
            if (bottomSheetRef.current !== null) {
              bottomSheetRef.current.snapTo(2);
            }
          }}
        />
        <Text style={[tw.textBase, tw.fontMedium]}>{title}</Text>
        {renderDescriptions()}
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[height, (height * 2) / 3, 0]}
      initialSnap={2}
      borderRadius={20}
      renderContent={renderContent}
      onCloseEnd={onDismiss}
    />
  );
};

export default BottomSheetView;
