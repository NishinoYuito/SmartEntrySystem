import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import Scanner from "./screens/Scanner";
import Generator from "./screens/Generator";

//スタックナビゲーターのおかげで、画面間の移動ができます
const Stack = createStackNavigator();

// export default function App() {
//   return <HomeScreen />;
// }

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ホーム" component={HomeScreen} />
      <Stack.Screen name="スキャナー" component={Scanner} />
      <Stack.Screen name="ジェネレータ" component={Generator} />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <App />
  );
};