import React from 'react';
import { useTheme } from 'react-native-paper';
import { AUDIO, EXCEL_DOCUMENT, FOLDER, OTHER, PDF_DOCUMENT, PICTURE, PPT_DOCUMENT, VIDEO, WORD_DOCUMENT } from '../common/status-module';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CompletedBaseViewProps {
  type?: number;
  size?: number;
}

export const GetIconOfFiles: React.FC<CompletedBaseViewProps> = (props): JSX.Element => {
  const { colors } = useTheme();
  const { type = 5, size = 30 } = props;

  const setName = (): string => {
    switch (props.type) {
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

  return <Icon name={setName()} size={size} color={colors.accent} />;
};
