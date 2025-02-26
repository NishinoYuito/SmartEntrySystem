import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, Linking } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function Scanner() {
  //アプリはカメラを使う許可が認められるかどうか
  const [hasPermission, setHasPermission] = useState(null);
  //アプリはQRコードをスキャンしたかどうか
  const [scanned, setScanned] = useState(false);

  //最初のレンダリングで、カメラの許可を要求する
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);


  //QRコードがスキャンされると、読み取ったリンクを開く
  //リンクを開く事がでない場合にはメッセージを表示する
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    // if (type != 'qr') {
    //   alert("QRコードのデータはURLではありません。");
    // }
    
      Linking.canOpenURL(data).then(supported => {
        if (supported) {
          Linking.openURL(data);
        } else {
          alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        }
      });
    
  };

  {/* カメラアにクセスすることがまだ許可も拒否もされていない場合 */}
  if (hasPermission === null) {
    return <Text>カメラの許可を要求しています。</Text>;
  }
  {/* カメラアにクセスすることが拒否されている合 */}
  if (hasPermission === false) {
    return <Text>カメラにアクセスできません</Text>;
  }

  return (
    <View style={styles.container}>
      {/* カメラアにクセスすることが許可されている場合 */}
      {hasPermission && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {/* スキャンが終わってから表示する */}
      {scanned && (
        <Pressable onPress={() => setScanned(false)} style={styles.button}>
          <Text style={styles.text}>別のQRコードを読み取る</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
