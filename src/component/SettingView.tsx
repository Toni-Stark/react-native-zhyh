import * as React from 'react';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface SettingViewProps {
  settings: Array<SettingViewItemType>;
}

export interface SettingViewItemType {
  icon?: string;
  title: string;
  description?: string;
  colorType?: boolean;
  useAvatar?: boolean;
  needRIcon?: boolean;
  avatarImg?: { uri: string | undefined };
  iconColor?: string;
  notification?: boolean;
  onPress?: () => void;
}

const SettingView: React.FC<SettingViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const ICON_SIZE = 20;

  const renderContent = () => {
    const viewArray: JSX.Element[] = [];
    props.settings.forEach((item, index) => {
      const {
        icon,
        avatarImg,
        colorType = true,
        useAvatar = false,
        title,
        needRIcon = true,
        description = '',
        iconColor = colors.placeholder,
        notification = false,
        onPress = null
      } = item;
      const renderNotification = () => {
        if (notification) {
          return <View style={[tw.roundedFull, tw.w1, tw.h1, tw.mL1, { backgroundColor: colors.notification }]} />;
        } else {
          return null;
        }
      };
      const handlePress = () => {
        if (onPress !== null) {
          onPress();
        }
      };
      const avatarOrText = () => {
        if (useAvatar) {
          if (avatarImg && avatarImg.uri) {
            return (
              <Avatar.Image
                onTouchEnd={() => {
                  handlePress();
                }}
                size={60}
                source={avatarImg}
              />
            );
          } else {
            return (
              <Icon
                name="face"
                size={60}
                color={colors.primary}
                onPress={() => {
                  handlePress();
                }}
              />
            );
          }
        } else {
          return (
            <Text style={[tw.textXs, { color: colorType ? colors.placeholder : colors.text }]} numberOfLines={1}>
              {description}
            </Text>
          );
        }
      };
      viewArray.push(
        <TouchableOpacity key={`settings-${index}`} style={[tw.pX4]} activeOpacity={0.8} onPress={handlePress}>
          <View style={[tw.flexRow, tw.itemsCenter, tw.pY5, { borderColor: colors.deepBackground, borderBottomWidth: 1 }]}>
            {icon ? <Icon style={[tw.mR3]} name={icon} size={ICON_SIZE} color={iconColor} /> : null}
            <Text style={[tw.textSm, tw.flexGrow]} numberOfLines={1}>
              {title}
            </Text>
            <View style={[needRIcon ? null : tw.mR5]}>{avatarOrText()}</View>
            {renderNotification()}
            {needRIcon ? <Icon name="chevron-right" size={ICON_SIZE} color={colors.placeholder} /> : null}
          </View>
        </TouchableOpacity>
      );
    });
    return viewArray;
  };

  return <View>{renderContent()}</View>;
};

export default SettingView;
