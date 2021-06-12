import React from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';

type Tab = {
  name: string;
};

interface StaticBarProps {
  tabs: Tab[];
  value: Animated.Value;
}

export const tabHeight = 64;
const {width} = Dimensions.get('window');

export default class StaticBar extends React.PureComponent<StaticBarProps> {
  tabWidth = width / this.props.tabs.length;
  values: Animated.Value[] = [];

  constructor(props: StaticBarProps) {
    super(props);
    const {tabs} = this.props;
    this.values = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0));
  }

  onPress = (index: number) => {
    const {value} = this.props;

    Animated.sequence([
      ...this.values.map(value =>
        Animated.timing(value, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
      ),
      Animated.parallel([
        Animated.spring(this.values[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(value, {
          toValue: -width + this.tabWidth * index,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  render() {
    const {tabs, value} = this.props;
    return (
      <View style={styles.container}>
        {tabs.map(({name}, key) => {
          const activeValue = this.values[key];

          const opacity = value.interpolate({
            inputRange: [
              -width + this.tabWidth * (key - 1),
              -width + this.tabWidth * key,
              -width + this.tabWidth * (key + 1),
            ],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp',
          });

          const translateY = activeValue.interpolate({
            inputRange: [0, 1],
            outputRange: [tabHeight + 10, 0],
          });

          return (
            <React.Fragment {...{key}}>
              <TouchableWithoutFeedback {...{key}} onPress={() => this.onPress(key)}>
                <Animated.View style={[styles.tab, {opacity}]}>
                  <Icon size={20} {...{name}} color="silver" />
                </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: this.tabWidth,
                  left: this.tabWidth * key,
                  height: tabHeight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -8,
                  transform: [{translateY}],
                }}
              >
                <View style={styles.circle}>
                  <Icon size={32} {...{name}} />
                </View>
              </Animated.View>
            </React.Fragment>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: tabHeight,
  },
  circle: {
    backgroundColor: 'white',
    width: 66,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
  },
});
