import React from 'react';
import { useTheme } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';

type SelectButtonProps = {
  changeSelect: (string) => void;
  select: string[];
  id: string;
};

export const SelectButton: React.FC<SelectButtonProps> = observer(
  (props): JSX.Element => {
    const { colors } = useTheme();
    const { changeSelect, select, id } = props;

    const selectId = (item) => {
      return item === id;
    };

    return (
      <TouchableOpacity
        style={[tw.wFull, tw.hFull, tw.itemsCenter, tw.flexRow, tw.justifyCenter]}
        onPress={() => {
          changeSelect(id);
        }}
      >
        <View
          style={[
            tw.itemsCenter,
            tw.justifyCenter,
            select.filter(selectId).length > 0 ? tw.bgBlue500 : null,
            {
              width: select.filter(selectId).length > 0 ? 20 : 10,
              height: select.filter(selectId).length > 0 ? 20 : 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: select.filter(selectId).length > 0 ? colors.background : colors.disabled
            }
          ]}
        >
          {select.filter(selectId).length > 0 ? <Icon name="done" color={colors.background} size={17} /> : null}
        </View>
      </TouchableOpacity>
    );
  }
);
