import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { throttle } from '../../common/tools';
import { Chip, Modal, Portal, Subheading, Text, useTheme } from 'react-native-paper';

export interface FilterModalViewProps {
  visible: boolean;
  onDismiss: Function;
  data: Array<FilterDataItemType>;
  onSelected: (text: string) => void;
}

export interface FilterDataItemType {
  groupName: string;
  grades: Array<FilterDataGradeItemType>;
}

export interface FilterDataGradeItemType {
  name: string;
  selected?: boolean;
}

const FilterModalView: React.FC<FilterModalViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const [viewArray, setViewArray] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    const array: JSX.Element[] = [];

    const renderGrades = (dataArray: Array<FilterDataGradeItemType>) => {
      const output: JSX.Element[] = [];
      dataArray.forEach((d, index) => {
        output.push(
          <Chip
            key={`chip-${index}`}
            mode="outlined"
            icon={!!d.selected ? 'check-circle' : ''}
            selected={!!d.selected}
            style={[tw.m1]}
            onPress={throttle(() => props.onSelected(d.name))}
          >
            {d.name}
          </Chip>
        );
      });
      return output;
    };

    props.data.forEach((d, index) => {
      array.push(
        <View key={`filter-view-${index}`} style={[tw.mT2]}>
          <Text style={[tw.fontBold]}>{d.groupName}</Text>
          <View style={[tw.flexRow, tw.flexWrap, tw.mT2]}>{renderGrades(d.grades)}</View>
        </View>
      );
    });
    setViewArray(array);
  }, [props]);

  return (
    <Portal>
      <Modal contentContainerStyle={[tw.p5]} visible={props.visible} onDismiss={() => props.onDismiss()}>
        <View style={[tw.flex, tw.p5, tw.rounded, { backgroundColor: colors.background }]}>
          <View style={[tw.itemsCenter]}>
            <Subheading>设置年级</Subheading>
          </View>
          {viewArray}
        </View>
      </Modal>
    </Portal>
  );
};

export default FilterModalView;
