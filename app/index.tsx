import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/TopPage";
import Scanner from "./screens/Scanner";
import Generator from "./screens/Generator";
import "./global.css"

import Toast from 'react-native-toast-message';

type RootStackParamList = {
  ホーム: { toastMessage: boolean };
  スキャナー: undefined;
  ジェネレータ: undefined;
}

//スタックナビゲーターのおかげで、画面間の移動ができます
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App () {
  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ホーム" component={HomeScreen} />
        <Stack.Screen name="スキャナー" component={Scanner} />
        <Stack.Screen name="ジェネレータ" component={Generator} />
      </Stack.Navigator>
      <Toast />
    </>
  );
};