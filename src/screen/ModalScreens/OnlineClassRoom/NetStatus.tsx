import React, { useCallback, useEffect, useRef, useState } from 'react';
import { color as twColor } from 'react-native-tailwindcss';
import { Text } from 'react-native-paper';
import Ping from 'react-native-ping-rename';
import { appConfig } from '../../../common/app.config';

export interface NetStatusProps {
  serverUrl?: string | undefined;
  interval?: number | undefined;
}

export const NetStatus = (props: NetStatusProps): JSX.Element => {
  const { serverUrl = __DEV__ ? appConfig.server.dev.API_HOST : appConfig.server.prod.API_HOST, interval = 10 } = props;
  const timer = useRef<any>();
  const [timeoutValue, setTimeoutValue] = useState('');

  const detectNetStatus = useCallback(() => {
    Ping.start(serverUrl, { timeout: 1000 * 5 })
      .then((ms) => {
        const currentTimeout = Number.isNaN(Math.ceil(ms)) ? 0 : Math.ceil(ms);
        setTimeoutValue(currentTimeout + 'ms');
      })
      .catch(() => {
        setTimeoutValue('0ms');
      });
  }, [serverUrl]);

  useEffect(() => {
    detectNetStatus();
    timer.current = setInterval(detectNetStatus, 1000 * interval);
    return () => {
      clearInterval(timer.current);
    };
  }, [detectNetStatus, interval]);

  return <Text style={{ color: twColor.green300, fontSize: 9 }}>{timeoutValue}</Text>;
};
