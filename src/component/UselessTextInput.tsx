import React from 'react';
import { TextInput } from 'react-native';

interface CompletedBaseViewProps {
  multiline: boolean;
  numberOfLines: number;
  onChangeText: (e) => void;
  value?: string;
  placeholder: string;
  placeholderTextColor: string;
  textColor?: string;
  editable?: boolean;
}

export const UselessTextInput: React.FC<CompletedBaseViewProps> = (props): JSX.Element => {
  return <TextInput style={[{ height: 150, textAlign: 'left', textAlignVertical: 'top', fontSize: 16, color: props.textColor }]} {...props} maxLength={200} />;
};
