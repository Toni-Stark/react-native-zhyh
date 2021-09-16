import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { throttle } from '../../common/tools';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface SearchBarViewProps {
  filterCallback: Function;
  searchCallback: Function;
  qrScanCallback: Function;
}

const SearchBarView: React.FC<SearchBarViewProps> = (props): JSX.Element => {
  const ICON_SIZE = 18;
  const { colors } = useTheme();

  const handleSearch = () => {
    props.searchCallback();
  };

  return (
    <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, tw.textCenter, tw.pX4, tw.pY1]}>
      {/*<TouchableOpacity style={[tw.flexRow]} onPress={throttle(props.filterCallback)}>*/}
      {/*  /!*<Text style={{ color: colors.placeholder }}>三年级</Text>*!/*/}
      {/*  <Icon name="school" color={colors.placeholder} size={ICON_SIZE} />*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity
        style={[
          tw.flex1,
          tw.flexRow,
          tw.itemsCenter,
          tw.roundedFull,
          tw.border,
          tw.pX3,
          tw.mL2,
          tw.border,
          { height: 30, backgroundColor: colors.surface, borderColor: colors.disabled }
        ]}
        onPress={handleSearch}
      >
        <Icon name="search" color={colors.placeholder} size={ICON_SIZE} />
        <View style={[tw.w48, tw.hFull, tw.itemsStart, tw.justifyCenter]}>
          <Text style={[tw.textXs, { color: colors.placeholder }]} numberOfLines={1}>
            搜索课程
          </Text>
        </View>
      </TouchableOpacity>
      <IconButton icon="qrcode-scan" size={ICON_SIZE} color={colors.placeholder} onPress={throttle(props.qrScanCallback)} />
    </View>
  );
};

export default SearchBarView;
