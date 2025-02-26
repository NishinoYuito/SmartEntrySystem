import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>QRコードスキャナー画面に移動</Text>
      <Pressable
        onPress={() => navigation.navigate("スキャナー")}
        style={styles.button}
      >
        <Text style={styles.text}>QRコードを読み取る</Text>
      </Pressable>

      <Text>情報入力して、QRコード生成する</Text>
      <Pressable
        onPress={() => navigation.navigate("ジェネレータ")}
        style={styles.button}
      >
        <Text style={styles.text}>QRコードを生成する</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "cyan",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "whitesmoke",
  },
});

// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
//
// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Hello, World</Text>
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f8f8",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
// });
