import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type CompletedBaseViewProps = {
  footerText: string;
  data: any[];
  select?: string[];
  changeSelect: (e: string, id: string) => void;
  searchText: (e) => void;
  disableId?: string;
  selectObj?: any[];
};

export const SelectSearchList: React.FC<CompletedBaseViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();

  const renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        disabled={props.disableId === item.id}
        onPress={() => {
          props.changeSelect(index, item.id);
        }}
      >
        <View key={index} style={[tw.flexRow, tw.itemsCenter, tw.mX1, tw.mB1, { height: 60 }]}>
          <View
            style={[
              props.select && props.select.filter((e) => e === item.id).length > 0 ? tw.bgBlue600 : tw.bgGray100,
              tw.justifyCenter,
              props.select && props.select.filter((e) => e === item.id).length > 0
                ? { borderRadius: 100, width: 20, height: 20 }
                : { borderRadius: 100, width: 18, height: 18, borderWidth: 1.5, borderColor: colors.disabled }
            ]}
          >
            {props.select && props.select.filter((e) => e === item.id).length > 0 ? (
              <Icon style={[tw.selfCenter]} name="check" size={18} color={colors.background} />
            ) : null}
          </View>

          <View style={[tw.bgBlue500, tw.mL3, tw.itemsCenter, tw.justifyCenter, { width: 42, height: 42, borderRadius: 7 }]}>
            <Text style={[tw.textCenter, tw.textWhite, { fontSize: 11 }]}>{item.username}</Text>
          </View>
          <View style={[tw.flex1, tw.justifyCenter, tw.mL3, { borderBottomWidth: 0.25, borderColor: colors.surface, height: '100%' }]}>
            <Text style={[{ fontSize: 15 }]}>{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[tw.flex1]}>
      <View style={[tw.flexRow, tw.pL2, tw.mB2, { backgroundColor: colors.surface, height: 35, borderRadius: 5 }]}>
        <Icon style={[tw.selfCenter]} name="search" size={20} color={colors.disabled} />
        <TextInput
          inlineImageLeft="add"
          returnKeyType="search"
          onEndEditing={(e) => {
            props.searchText(e.nativeEvent.text);
          }}
          style={[tw.flex1, { height: 35, borderRadius: 5, fontSize: 13 }]}
        />
      </View>
      <FlatList
        style={[tw.flex1, { backgroundColor: colors.background }]}
        scrollEnabled={true}
        data={props.data}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        numColumns={1}
        renderItem={renderItems}
        ListHeaderComponent={
          <View>
            {props.selectObj?.map((item, index) => {
              return props.data.filter((items) => items.id === item.id).length > 0 ? null : (
                <TouchableOpacity
                  disabled={props.disableId === item.id}
                  onPress={() => {
                    props.changeSelect(index.toString(), item.id);
                  }}
                >
                  <View key={index} style={[tw.flexRow, tw.itemsCenter, tw.mX1, tw.mB1, { height: 60 }]}>
                    <View
                      style={[
                        props.select && props.select.filter((e) => e === item.id).length > 0 ? tw.bgBlue600 : tw.bgGray100,
                        tw.justifyCenter,
                        props.select && props.select.filter((e) => e === item.id).length > 0
                          ? { borderRadius: 100, width: 20, height: 20 }
                          : { borderRadius: 100, width: 18, height: 18, borderWidth: 1.5, borderColor: colors.disabled }
                      ]}
                    >
                      {props.select && props.select.filter((e) => e === item.id).length > 0 ? (
                        <Icon style={[tw.selfCenter]} name="check" size={18} color={colors.background} />
                      ) : null}
                    </View>

                    <View
                      style={[
                        tw.bgBlue500,
                        tw.mL3,
                        tw.itemsCenter,
                        tw.justifyCenter,
                        {
                          width: 42,
                          height: 42,
                          borderRadius: 7
                        }
                      ]}
                    >
                      <Text style={[tw.textWhite, tw.textCenter, { fontSize: 11 }]}>{item.username}</Text>
                    </View>
                    <View
                      style={[
                        tw.flex1,
                        tw.justifyCenter,
                        tw.mL3,
                        tw.borderGray300,
                        {
                          borderBottomWidth: 0.25,
                          height: '100%'
                        }
                      ]}
                    >
                      <Text style={[{ fontSize: 15 }]}>{item.username}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        }
        ListFooterComponent={
          <View style={[tw.m2, tw.itemsCenter]}>
            <Text style={[{ color: colors.disabled }]}>{props.footerText}</Text>
          </View>
        }
      />
    </View>
  );
};
