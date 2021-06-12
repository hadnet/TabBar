import React, {Component} from 'react';
import {View, SafeAreaView, Dimensions, Animated, StyleSheet} from 'react-native';
import Svg from 'react-native-svg';
import * as shape from 'd3-shape';
import StaticBar, {tabHeight as height} from './StaticBar';

type Tab = {
  name: string;
};

const tabs: Tab[] = [{name: 'grid'}, {name: 'list'}, {name: 'repeat'}, {name: 'layers'}, {name: 'user'}];

const {width} = Dimensions.get('window');
const tabWidth = width / tabs.length;
const {Path} = Svg;

const left = shape
  .line()
  .x(d => d.x)
  .y(d => d.y)([
  {x: 0, y: 0},
  {x: width, y: 0},
]);

const tab = shape
  .line()
  .x(d => d.x)
  .y(d => d.y)
  .curve(shape.curveBasis)([
  {x: width, y: 0},
  {x: width - 45, y: 0},
  {x: width + 2, y: 0},
  {x: width + 2, y: height / 1.1},
  {x: width + tabWidth - 2, y: height / 1.1},
  {x: width + tabWidth - 2, y: 0},
  {x: width + tabWidth + 45, y: 0},
]);

const right = shape
  .line()
  .x(d => d.x)
  .y(d => d.y)([
  {x: width + tabWidth, y: 0},
  {x: width * 2.5, y: 0},
  {x: width * 2.5, y: height},
  {x: 0, y: height},
  {x: 0, y: 0},
]);

const d = `${left} ${tab} ${right}`;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type AppbarProps = {};
export default class AppbarBottom extends Component<AppbarProps> {
  value = new Animated.Value(-width);
  render() {
    const {value: translateX} = this;
    return (
      <>
        <View {...{width, height}}>
          <AnimatedSvg width={width * 2.5} {...{height}} style={{transform: [{translateX}]}}>
            <Path {...{d}} fill="white" />
          </AnimatedSvg>
          <View {...{...StyleSheet.absoluteFill}}>
            <StaticBar value={translateX} {...{tabs}} />
          </View>
        </View>
        <SafeAreaView {...{backgroundColor: 'white'}} />
      </>
    );
  }
}
