import * as React from 'react';
import { Avatar, useTheme } from 'react-native-paper';
import { isBlank } from '../common/tools';

interface BaseViewProps {
  avatar: string;
  name: string;
  size?: number;
  color?: string;
}

const AvatarView: React.FC<BaseViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const { avatar, name, size = 25, color = colors.primary } = props;

  if (isBlank(avatar)) {
    return <Avatar.Text size={size} label={name.substr(0, 1)} color={colors.background} style={{ backgroundColor: color }} />;
  } else {
    return <Avatar.Image size={size} source={{ uri: avatar }} />;
  }
};

export default AvatarView;
