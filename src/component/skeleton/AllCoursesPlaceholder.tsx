import React from 'react';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export const AllCoursesPlaceholder = (): JSX.Element => {
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

  return (
    <View style={[tw.m4]}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine noMargin height={30} style={{ marginBottom: 10, borderRadius: 5 }} />
        <PlaceholderLine noMargin height={120} style={{ marginBottom: 10, borderRadius: 5 }} />
      </Placeholder>
      {renderContent(10)}
    </View>
  );
};
