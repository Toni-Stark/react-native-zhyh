import { DefaultTheme } from 'react-native-paper';
import { black, white } from 'react-native-paper/src/styles/colors';
import color from 'color';
import { color as twColor } from 'react-native-tailwindcss';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      notificationBackground: string;
      deepBackground: string;
      deepMoreBackground: string;
      background2: string;
      background3: string;
      notification2: string;
      notification3: string;
      notification4: string;
      notification5: string;
      notification6: string;
      notification7: string;
      lightHint: string;
    }
    interface Theme {}
  }
}

export const theme = {
  ...DefaultTheme,
  colors: {
    primary: twColor.blue700,
    accent: twColor.blue500,
    background: twColor.white,
    surface: twColor.gray100,
    error: twColor.red700,
    success: twColor.green700,
    text: black,
    onBackground: twColor.black,
    onSurface: twColor.black,
    disabled: color(black).alpha(0.26).rgb().string(),
    placeholder: color(black).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: twColor.red700,
    notificationBackground: twColor.red200,
    deepBackground: twColor.gray200,
    deepMoreBackground: twColor.gray300,
    background2: twColor.gray400,
    background3: twColor.gray500,
    notification2: twColor.green700,
    notification3: twColor.orange700,
    notification4: twColor.purple700,
    notification5: twColor.indigo700,
    notification6: twColor.pink700,
    notification7: twColor.yellow700,
    lightHint: color(black).alpha(0.1).rgb().string()
  }
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    primary: twColor.blue300,
    accent: twColor.blue500,
    background: twColor.black,
    surface: twColor.gray900,
    error: twColor.red300,
    success: twColor.green300,
    text: twColor.white,
    onBackground: twColor.white,
    onSurface: twColor.white,
    disabled: color(white).alpha(0.38).rgb().string(),
    placeholder: color(white).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: twColor.red300,
    notificationBackground: twColor.red700,
    deepBackground: twColor.gray800,
    deepMoreBackground: twColor.gray700,
    background2: twColor.gray600,
    background3: twColor.gray500,
    notification2: twColor.green300,
    notification3: twColor.orange300,
    notification4: twColor.purple300,
    notification5: twColor.indigo300,
    notification6: twColor.pink300,
    notification7: twColor.yellow300,
    lightHint: color(white).alpha(0.1).rgb().string()
  }
};
