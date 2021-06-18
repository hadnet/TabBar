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
  staticBarTranslateX: Animated.SharedValue<number>;
}

export const TAB_HEIGHT = 56;
const {width} = Dimensions.get('window');

export default function StaticBar(props: StaticBarProps) {
  const {/*descriptors, */ state, navigation, staticBarTranslateX} = props;
  const {routes} = props.state;
  const tabWidth = width / routes.length;
  let circleBtns: Animated.SharedValue<number>[] = [];

  const middleTab = (routes: number) => {
    return routes === 3 ? 1 : routes === 5 ? 2 : null;
  };

  useEffect(() => {
    const idx = middleTab(routes.length);
    routes.map((route, index) => {
      index === idx && navigation.navigate(route.name);
    });
  }, []);

  const idx = middleTab(routes.length);
  if (!idx) throw new Error('Bottom tabs must be of 3 tabs or 5 tabs');

  circleBtns = routes.map((_, index) => useSharedValue(index === idx ? 1 : 0));

  const start = (index: number) => {
    circleBtns.map(circleBtn => {
      circleBtn.value = withTiming(0, {
        duration: 10,
      });
    });
    circleBtns[index].value = withSpring(1);
    staticBarTranslateX.value = withSpring(-width + tabWidth * index);
  };

  return (
    <View style={styles.container}>
      {routes.map((route, key) => {
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

        const circleBtnActive = circleBtns[key];

        const opacityAnimatedStyle = useAnimatedStyle(() => {
          return {
            opacity: withTiming(
              interpolate(
                staticBarTranslateX.value,
                [
                  -width + tabWidth * (key - 1),
                  -width + tabWidth * key,
                  -width + tabWidth * (key + 1),
                ],
                [1, 0, 1],
                Extrapolate.CLAMP,
              ),
              {duration: 10},
            ),
          };
        });

        const translateYAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                translateY: withSpring(
                  interpolate(circleBtnActive.value, [0, 1], [TAB_HEIGHT + 12, -18]),
                  {
                    stiffness: 300,
                    damping: 10,
                    mass: 0.1,
                    overshootClamping: true,
                  },
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
                  ...styles.circleWrapper,
                  left: tabWidth * key,
                  width: tabWidth,
                  height: TAB_HEIGHT,
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
  circleWrapper: {
    position: 'absolute',
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 56,
    height: 56,
    bottom: -10,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
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
