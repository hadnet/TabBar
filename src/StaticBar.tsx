import React, {useEffect} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Dimensions} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {FeatherIconName} from './Feather.type';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface StaticBarProps extends BottomTabBarProps {
  value: Animated.SharedValue<number>;
}

export const TAB_HEIGHT = 56;
const {width} = Dimensions.get('window');

export default function StaticBar(props: StaticBarProps) {
  const tabWidth = width / props.state.routes.length;
  let values: Animated.SharedValue<number>[] = [];

  const middleTab = (routes: number) => {
    return routes === 3 ? 1 : routes === 5 ? 2 : null;
  };

  useEffect(() => {
    const {state, navigation} = props;
    const idx = middleTab(state.routes.length);
    state.routes.map((route, index) => {
      index === idx && navigation.navigate(route.name);
    });
  }, []);

  const idx = middleTab(props.state.routes.length);
  if (!idx) throw new Error('Bottom tabs must be of 3 tabs or 5 tabs');
  const {routes} = props.state;
  values = routes.map((route, index) => useSharedValue(index === idx ? 1 : 0));

  const start = (index: number) => {
    // Animated.withSequence([
    //   ...this.values.map(value =>
    //     Animated.timing(value, {
    //       toValue: 0,
    //       duration: 10,
    //       useNativeDriver: true,
    //     }),
    //   ),
    //   Animated.parallel([
    //     Animated.spring(this.values[index], {
    //       toValue: 1,
    //       useNativeDriver: true,
    //     }),
    //     Animated.spring(value, {
    //       toValue: -width + this.tabWidth * index,
    //       useNativeDriver: true,
    //     }),
    //   ]),
    // ]).start();
    values.map(value => {
      value.value = withTiming(0, {
        duration: 10,
      });
    });
    values[index].value = withSpring(1);
    props.value.value = withSpring(-width + tabWidth * index);
  };

  const {/*descriptors, */ state, navigation, value} = props;
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
            start(key);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const activeValue = values[key];

        const opacityAnimatedStyle = useAnimatedStyle(() => {
          return {
            opacity: withTiming(
              interpolate(
                value.value,
                [
                  -width + tabWidth * (key - 1),
                  -width + tabWidth * key,
                  -width + tabWidth * (key + 1),
                ],
                [1, 0, 1],
                Extrapolate.CLAMP,
              ),
            ),
          };
        });

        const translateYAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                translateY: withSpring(
                  interpolate(activeValue.value, [0, 1], [TAB_HEIGHT + 10, -18]),
                ),
              },
            ],
          };
        });

        return (
          <React.Fragment key={key}>
            <TouchableWithoutFeedback {...{key}} onPress={onPress} onLongPress={onLongPress}>
              <Animated.View style={[styles.tab, opacityAnimatedStyle]}>
                <Icon size={24} name={route.name as FeatherIconName} color="white" />
              </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: -20,
                  width: tabWidth,
                  left: tabWidth * key,
                  height: TAB_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                translateYAnimatedStyle,
              ]}
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
