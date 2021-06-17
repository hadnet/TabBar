import React from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {FeatherIconName} from './Feather.type';

interface StaticBarProps extends BottomTabBarProps {
  value: Animated.Value;
}

export const TAB_HEIGHT = 56;
const {width} = Dimensions.get('window');

export default class StaticBar extends React.PureComponent<StaticBarProps> {
  tabWidth = width / this.props.state.routes.length;
  values: Animated.Value[] = [];

  middleTab(routes: number) {
    return routes === 3 ? 1 : routes === 5 ? 2 : null;
  }

  componentDidMount() {
    const {state, navigation} = this.props;
    const idx = this.middleTab(state.routes.length);
    state.routes.map((route, index) => {
      index === idx && navigation.navigate(route.name);
    });
  }

  constructor(props: StaticBarProps) {
    super(props);
    const {state} = this.props;
    const idx = this.middleTab(state.routes.length);
    if (!idx) throw new Error('Bottom tabs must be of 3 tabs or 5 tabs');
    this.values = state.routes.map((_, index) => new Animated.Value(index === idx ? 1 : 0));
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
    const {/*descriptors, */ state, navigation, value} = this.props;
    return (
      <View style={styles.container}>
        {state.routes.map((route, key) => {
          /*const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;*/

          const isFocused = state.index === key;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              this.onPress(key);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

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
            outputRange: [TAB_HEIGHT + 10, -18],
          });

          return (
            <React.Fragment key={key}>
              <TouchableWithoutFeedback {...{key}} onPress={onPress} onLongPress={onLongPress}>
                <Animated.View style={[styles.tab, {opacity}]}>
                  <Icon size={24} name={route.name as FeatherIconName} color="white" />
                </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={{
                  position: 'absolute',
                  top: -20,
                  width: this.tabWidth,
                  left: this.tabWidth * key,
                  height: TAB_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{translateY}],
                }}
              >
                <View style={styles.circle}>
                  <Icon size={24} name={route.name as FeatherIconName} color="white" />
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
    height: TAB_HEIGHT,
  },
  circle: {
    backgroundColor: 'black',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
});
