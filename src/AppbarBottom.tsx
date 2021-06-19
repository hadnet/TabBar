import React from 'react';
import {View, Dimensions, StyleSheet, SafeAreaView} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import * as shape from 'd3-shape';
import StaticBar, {TAB_HEIGHT as HEIGHT} from './StaticBar';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

export type AppbarBottomColorProps = {
  bar: string;
  fab: string;
  icon: string;
  activeIcon?: string;
};

export type AppbarBottomProps = {
  color: AppbarBottomColorProps;
};

const {width} = Dimensions.get('window');

const CURVE_WIDTH = 120;

const left = (width: number) =>
  shape
    .line()
    .x(([x]) => x)
    .y(([_x, y]) => y)([
    [0, 0],
    [width, 0],
  ]);

const tab = (width: number, tabWidth: number) =>
  shape
    .line()
    .x(([x]) => x)
    .y(([_, y]) => y)
    .curve(shape.curveBasis)([
    [width + 23, 0],
    [width + 25, 2],
    [width + tabWidth / 4.33, 16],
    [width + tabWidth / 3, 30],
    [width + tabWidth / 2, 36.33],
    [width + tabWidth - tabWidth / 3, 30],
    [width + tabWidth - tabWidth / 4.33, 16],
    [width + tabWidth - 25, 2],
    [width + tabWidth - 23, 0],
  ]);

const right = (width: number, tabWidth: number) =>
  shape
    .line()
    .x(([x]) => x)
    .y(([_, y]) => y)([
    [width + tabWidth, 0],
    [width * 2.5, 0],
    [width * 2.5, HEIGHT],
    [0, HEIGHT],
    [0, 0],
  ]);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function AppbarBottom(props: BottomTabBarProps & AppbarBottomProps) {
  const {
    state,
    color: {bar},
  } = props;
  const tabFraction = width / state.routes.length;
  const translateX = useSharedValue<number>(
    width / (state.routes.length === 5 ? 5 : width) - width + width / state.routes.length,
  );
  const translateXAnimatedStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: translateX.value}]};
  });
  const d = `${left(width)} ${tab(width - (CURVE_WIDTH - tabFraction) / 2, CURVE_WIDTH)} ${right(
    width,
    width,
  )}`;
  return (
    <>
      <View>
        <View {...{width, height: HEIGHT}} style={{position: 'absolute', bottom: 0}}>
          <AnimatedSvg width={width * 2.5} {...{height: HEIGHT}} style={translateXAnimatedStyle}>
            <Path {...{d}} fill={bar} />
          </AnimatedSvg>
          <View style={[StyleSheet.absoluteFill]}>
            <StaticBar {...props} staticBarTranslateX={translateX} />
          </View>
        </View>
      </View>
      <SafeAreaView style={{backgroundColor: bar}} />
    </>
  );
}
