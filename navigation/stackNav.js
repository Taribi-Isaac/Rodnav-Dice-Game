import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GameScreen from "../screens/GameScreen";
import Home from "../screens/Home";
const Stack = createStackNavigator();
const StackNavigation = () => {
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{ headerShown: false }}
        />
          </Stack.Navigator>
  );
};

export default StackNavigation;