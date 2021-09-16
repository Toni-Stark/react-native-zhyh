import React from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export const MyCalendarPlaceholder = (): JSX.Element => {
  const left = () => {
    return <PlaceholderLine width={15} height={50} style={[tw.mR5]} />;
  };
  const renderContent = () => {
    return (
      <Placeholder Animation={Fade} Left={left} style={[tw.pX4, tw.mB10]}>
        <PlaceholderLine width={70} height={20} style={[tw.mB2]} />
        <PlaceholderLine width={50} />
        <PlaceholderLine width={40} />
        <PlaceholderLine width={50} />
      </Placeholder>
    );
  };
  const HeaderContent = () => {
    return <PlaceholderLine height={90} style={[{ borderRadius: 0, marginBottom: 30 }]} />;
  };

  return (
    <View>
      {HeaderContent()}
      {renderContent()}
      {renderContent()}
      {renderContent()}
      {renderContent()}
    </View>
  );
};
