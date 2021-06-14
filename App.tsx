import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import AppbarBottom from './src/AppbarBottom';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {SafeAreaProvider, useSafeArea} from 'react-native-safe-area-context';

type RootStackParamList = {
  First: undefined;
  Two: undefined;
  Three: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const First = () => (
  <SafeAreaView style={{flex: 1, backgroundColor: 'deeppink'}}>
    <Text>One</Text>
  </SafeAreaView>
);
const Two = () => (
  <SafeAreaView style={{flex: 1, backgroundColor: 'whitesmoke'}}>
    <Text>Two</Text>
  </SafeAreaView>
);
const Three = () => (
  <SafeAreaView style={{flex: 1, backgroundColor: 'powderblue'}}>
    <Text>Three</Text>
  </SafeAreaView>
);

export function FirstStack() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'First'} component={First} />
    </Stack.Navigator>
  );
}
export function SecondStack() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'Two'} component={Two} />
    </Stack.Navigator>
  );
}
export function ThirdStack() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'Three'} component={Three} />
    </Stack.Navigator>
  );
}

export function Navigation() {
  return (
    <Tab.Navigator tabBar={(props: BottomTabBarProps) => <AppbarBottom {...props} />}>
      <Tab.Screen name={'First'} component={FirstStack} />
      <Tab.Screen name={'Two'} component={SecondStack} />
      <Tab.Screen name={'Three'} component={ThirdStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
