import React from "react";
import { View, Text,} from "react-native";


export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100">
      <Text className="text-5xl font-bold text-slate-800">
        TailwindCSSが動いてるよ！
      </Text>
    </View>
  );
}

