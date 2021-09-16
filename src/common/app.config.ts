export const WHITEBOARD_VERSION = '1.6.1';

export const appConfig = {
  VERSION: 'v2.1.8',
  MSG_API_VERSION: '2.1.0',

  WX_APP_ID: 'wx7317dd1555d82433',
  wideScreenDevices: ['rk3399_nextclass'],

  server: {
    dev: {
      // API_PROTOCOL: 'http://',
      // API_HOST: '192.168.0.100',
      // HOST_PORT: '50180/api/v2',
      // WEBSOCKET_PATH: 'wss://192.168.0.100:50199/communicate',
      // WHITEBOARD_URL: `http://app.icst-edu.com:50188/whiteboard/${WHITEBOARD_VERSION}/index.html`
      API_PROTOCOL: 'https://',
      API_HOST: 'app.icst-edu.com',
      HOST_PORT: '50187/api/v2',
      WEBSOCKET_PATH: 'wss://app.icst-edu.com:50187/communicate',
      WHITEBOARD_URL: `http://app.icst-edu.com:50188/whiteboard/${WHITEBOARD_VERSION}/index.html`
    },
    prod: {
      API_PROTOCOL: 'https://',
      API_HOST: 'app.icst-edu.com',
      HOST_PORT: '50187/api/v2',
      WEBSOCKET_PATH: 'wss://app.icst-edu.com:50187/communicate',
      /**
       * 因为Electron端上传时是http连接上传的方式，
       * 所以如果此处用如果https加载白板，可能会出现，桌面端上产图片后，Android端无法看到图片
       * 故此处改用http加载白板
       */
      WHITEBOARD_URL: `http://app.icst-edu.com:50188/whiteboard/${WHITEBOARD_VERSION}/index.html`
    }
  }
};

export const SERVER_URL = __DEV__
  ? `${appConfig.server.dev.API_PROTOCOL}${appConfig.server.dev.API_HOST}:${appConfig.server.dev.HOST_PORT}`
  : `${appConfig.server.prod.API_PROTOCOL}${appConfig.server.prod.API_HOST}:${appConfig.server.prod.HOST_PORT}`;

export const SERVER_WEBSOCKET_URL = __DEV__ ? `${appConfig.server.dev.WEBSOCKET_PATH}` : `${appConfig.server.prod.WEBSOCKET_PATH}`;
export const SERVER_WHITEBOARD_URL = __DEV__ ? `${appConfig.server.dev.WHITEBOARD_URL}` : `${appConfig.server.prod.WHITEBOARD_URL}`;
