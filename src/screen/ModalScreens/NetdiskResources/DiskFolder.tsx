import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { tw } from 'react-native-tailwindcss';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SelectButton } from './component/SelectButton';
import { AllResourcesList } from './CloudSeaDiskStore';
import { getFileSize } from '../../../common/tools';
import { AUDIO, EXCEL_DOCUMENT, FOLDER, OTHER, PDF_DOCUMENT, PICTURE, PPT_DOCUMENT, VIDEO, WORD_DOCUMENT } from '../../../common/status-module';

export type ClassTypes = {
  type: number;
  name: string;
};

export type CloudDiskType = {
  data: AllResourcesList;
  index: number;
  select: string[];
  changeSelect: (string) => void;
  givePress: (id: string, name: string, type: number) => void;
  useSelect: boolean;
};

export const DiskFolder: React.FC<CloudDiskType> = ({ data, index, select, changeSelect, givePress, useSelect }): React.ReactElement | null => {
  const { colors } = useTheme();

  const selectIcon = (): string => {
    switch (data.type) {
      case FOLDER:
        return 'folder';
      case PICTURE:
        return 'insert-photo';
      case AUDIO:
        return 'album';
      case VIDEO:
        return 'movie';
      case PDF_DOCUMENT:
        return 'picture-as-pdf';
      case WORD_DOCUMENT:
        return 'description';
      case EXCEL_DOCUMENT:
        return 'description';
      case PPT_DOCUMENT:
        return 'description';
      case OTHER:
        return 'description';
      default:
        return 'description';
    }
  };

  return (
    <TouchableOpacity
      key={index}
      style={[
        tw.flexRow,
        tw.pY3,
        tw.itemsCenter,
        tw.justifyBetween,
        tw.pX4,
        { backgroundColor: select.filter((item) => item === data.id).length > 0 ? colors.surface : colors.background }
      ]}
      onPress={() => {
        if (select.length > 0) {
          changeSelect(data.id);
        } else {
          givePress(data.id, data.name, data.type);
        }
      }}
    >
      <View style={[tw.flexRow, tw.itemsCenter]}>
        <View style={[tw.p2, tw.borderGray300, { borderWidth: 0.17 }]}>
          <Icon name={selectIcon()} color={colors.accent} size={22} />
          {data.isPublic ? (
            <View style={[tw.absolute, { padding: 0, right: 0, top: 0 }]}>
              <Text style={[tw.bgGreen400, { padding: 0.5, fontSize: 6, color: colors.background, borderBottomLeftRadius: 3 }]}>共享</Text>
            </View>
          ) : null}
        </View>

        <View style={[tw.mL4]}>
          <View style={[tw.selfStart, tw.flexRow]}>
            <Text ellipsizeMode="middle" numberOfLines={1} style={[{ maxWidth: 200, fontSize: 14, color: colors.text }]}>
              {data.name}
            </Text>
            {data.transCode && data.transCode > 1 ? (
              <View
                style={[
                  tw.relative,
                  tw.itemsCenter,
                  tw.justifyCenter,
                  tw.borderRed600,
                  { borderWidth: 1.5, height: 16, width: 16, left: 1.5, top: -3.5, borderRadius: 10 }
                ]}
              >
                <Text style={[tw.textRed600, { fontSize: 9 }]}>转</Text>
              </View>
            ) : null}
          </View>
          <View>
            <Text style={[tw.mT1, { fontSize: 10, color: colors.disabled }]}>
              {data.type === 0 ? data?.createdTime : data?.createdTime + '  ' + getFileSize(data?.fileSize)}
            </Text>
          </View>
        </View>
      </View>
      {useSelect ? (
        <View style={[tw.flexRow, tw.itemsCenter, tw.justifyEnd, { width: '10%', height: '100%' }]}>
          <SelectButton
            id={data.id}
            changeSelect={(id) => {
              changeSelect(id);
            }}
            select={select}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
