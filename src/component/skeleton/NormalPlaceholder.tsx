import React from 'react';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { View } from 'react-native';

export const NormalPlaceholder = (): JSX.Element => {
  const renderContent = (counts: number) => {
    const view: Array<JSX.Element> = [];
    for (let i = 0; i < counts; i++) {
      const percent = Math.ceil(Math.random() * 100);
      view.push(
        <Placeholder key={i} Animation={Fade} Left={PlaceholderMedia}>
          <PlaceholderLine width={percent} />
          <PlaceholderLine />
        </Placeholder>
      );
    }
    return view;
  };

  return <View style={{ margin: 10 }}>{renderContent(10)}</View>;
};
