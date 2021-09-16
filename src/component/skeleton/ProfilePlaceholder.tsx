import React from 'react';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export const ProfilePlaceholder = (): JSX.Element => {
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

  const renderAvatar = () => {
    return <PlaceholderMedia size={80} isRound style={{ marginRight: 10 }} />;
  };

  return (
    <View style={[tw.m4]}>
      <Placeholder Animation={Fade}>
        <Placeholder Animation={Fade} Left={renderAvatar} style={{ marginBottom: 20 }}>
          <View style={{ marginTop: 20 }}>
            <PlaceholderLine width={50} />
            <PlaceholderLine width={70} />
          </View>
        </Placeholder>
      </Placeholder>
      <PlaceholderLine height={100} style={{ marginBottom: 10, borderRadius: 5 }} />
      {renderContent(8)}
    </View>
  );
};
