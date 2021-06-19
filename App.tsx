import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import AppbarBottom from './src/AppbarBottom';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useEffect} from 'react';
// import {SafeAreaProvider, useSafeArea} from 'react-native-safe-area-context';

type RootStackParamList = {
  First: undefined;
  Two: undefined;
  Three: undefined;
  Fourth: undefined;
  Fifth: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const First = () => (
  <SafeAreaView
    style={{flex: 1, backgroundColor: '#EA3B91', alignItems: 'center', justifyContent: 'center'}}
  >
    <Text>One</Text>
  </SafeAreaView>
);
const Two = () => (
  <SafeAreaView
    style={{flex: 1, backgroundColor: '#4773EC', alignItems: 'center', justifyContent: 'center'}}
  >
    <Text>Two</Text>
  </SafeAreaView>
);
const Three = () => (
  <SafeAreaView
    style={{flex: 1, backgroundColor: '#00effe', alignItems: 'center', justifyContent: 'center'}}
  >
    <Text>Three</Text>
  </SafeAreaView>
);
const Fourth = () => (
  <SafeAreaView
    style={{flex: 1, backgroundColor: '#FF0EE6', alignItems: 'center', justifyContent: 'center'}}
  >
    <Text>Fourth</Text>
  </SafeAreaView>
);
const Fifth = () => (
  <SafeAreaView
    style={{flex: 1, backgroundColor: '#4afab6', alignItems: 'center', justifyContent: 'center'}}
  >
    <Text>Fifth</Text>
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
export function FourthStack() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'Fourth'} component={Fourth} />
    </Stack.Navigator>
  );
}
export function FifthStack() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'Fifth'} component={Fifth} />
    </Stack.Navigator>
  );
}

export function Navigation() {
  return (
    <Tab.Navigator
      // initialRouteName="Two"
      tabBar={(props: BottomTabBarProps) => (
        <AppbarBottom
          colors={{background: '#5723E4', button: 'black', active: 'pink', icon: 'white'}}
          {...props}
        />
      )}
    >
      <Tab.Screen name={'menu'} component={FirstStack} />
      <Tab.Screen name={'music'} component={SecondStack} />
      <Tab.Screen name={'plus'} component={ThirdStack} />
      <Tab.Screen name={'list'} component={FourthStack} />
      <Tab.Screen name={'search'} component={FifthStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  const lockScreen = async () =>
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  useEffect(() => {
    void lockScreen();
  });
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
