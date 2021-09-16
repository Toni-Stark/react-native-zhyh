import React from 'react';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export const LessonDetailPlaceholder = (): JSX.Element => {
  const renderContent = (counts: number) => {
    const view: Array<JSX.Element> = [];
    for (let i = 0; i < counts; i++) {
      const percent = Math.ceil(Math.random() * 100);
      view.push(
        <Placeholder Animation={Fade} key={i} Left={PlaceholderMedia}>
          <PlaceholderLine width={percent} />
          <PlaceholderLine />
        </Placeholder>
      );
    }
    return view;
  };

  return (
    <View style={{ margin: 10 }}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine height={30} style={[tw.mB2]} />
        <PlaceholderLine height={250} style={[tw.rounded, tw.mB2]} />
        {renderContent(10)}
      </Placeholder>
    </View>
  );
};
