import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useColorScheme } from "nativewind";
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ホーム: { toastMessage: boolean };
  スキャナー: undefined;
  ジェネレータ: undefined;
}

type EntryExitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ホーム'>;
type EntryExitScreenRouteProp = RouteProp<RootStackParamList, 'ホーム'>;
interface Props {
  navigation: EntryExitScreenNavigationProp;
  route: EntryExitScreenRouteProp;
}

const EntryExitSystem: React.FC<Props> = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (route.params?.toastMessage) {
      Toast.show({
        type: 'success',
        text1: 'QRコード生成しました！',
        text2: 'メール送りました！'
      });
    }
  }, [route.params?.toastMessage]);


  const handleButtonPress = (buttonType: string) => {
    setSelectedButton(buttonType);
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-50 dark:bg-slate-900">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "#0f172a" : "#eef2ff"}
      />

      {/* タイトルエリア */}
      <View className="items-center pt-12 pb-8">
        <Text className="text-3xl font-bold text-indigo-900 dark:text-indigo-200">
          SmartEntry
        </Text>
        <View className="w-20 h-1 bg-indigo-500 mt-3 rounded-full" />
      </View>

      {/* ボタンエリア */}
      <View className="flex-1 px-6 justify-center">
        <View className="space-y-5">
          {/*　入室ボタン */}
          <TouchableOpacity
            className={`mb-8 bg-emerald-500 py-5 rounded-xl shadow-lg ${
              selectedButton === "enter" ? "border-4 border-emerald-700" : ""
            }`}
            onPress={() => navigation.navigate("スキャナー")}
            activeOpacity={0.8}
            style={{
              transform: [{ scale: selectedButton === "enter" ? 0.98 : 1 }],
            }}
          >
            <Text className="text-white text-xl font-bold text-center">
              入室
            </Text>
          </TouchableOpacity>

          {/* 退出ボタン */}
          <TouchableOpacity
            className={`bg-rose-500 py-5 rounded-xl shadow-lg ${
              selectedButton === "exit" ? "border-4 border-rose-700" : ""
            }`}
            onPress={() => handleButtonPress("exit")}
            activeOpacity={0.8}
            style={{
              transform: [{ scale: selectedButton === "exit" ? 0.98 : 1 }],
            }}
          >
            <Text className="text-white text-xl font-bold text-center">
              退室
            </Text>
          </TouchableOpacity>

          {/* 事前入力ボタン */}
          <TouchableOpacity
            className={`bg-indigo-600 py-5 rounded-xl shadow-lg mt-8 ${
              selectedButton === "register" ? "border-4 border-indigo-800" : ""
            }`}
            onPress={() => navigation.navigate("ジェネレータ")}
            activeOpacity={0.8}
            style={{
              transform: [{ scale: selectedButton === "register" ? 0.98 : 1 }],
            }}
          >
            <Text className="text-white text-xl font-bold text-center">
              訪問者情報入力
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EntryExitSystem;
