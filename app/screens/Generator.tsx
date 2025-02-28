import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { Checkbox, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import CryptoES from 'crypto-es';
import { useNavigation } from "@react-navigation/native";
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from "expo-file-system";

export default function Generator() {
  const navigation = useNavigation();
  const secretKey = 'Arsaga';

  const [visitor, setVisitor] = useState('');
  const [mailAddress, setMailAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [visitDate, setVisitDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [additionalVisitors, setAdditionalVisitors] = useState([{ id: '', name: '' }]);
  const [visitReasons, setVisitReasons] = useState([
    { id: 1, reason: 'プロジェクト定例会、お打ち合わせ', checked: false },
    { id: 2, reason: '営業アポイントメント', checked: false },
    { id: 3, reason: '面接、面談', checked: false },
    { id: 4, reason: 'その他', checked: false },
  ]);
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);

  // const [qrCodeUrl, setQrCodeUrl] = useState("");
  // const [qrValue, setQrValue] = useState('');
  // const [encryptedUUID, setEncryptedUUID] = useState('');
  // const [decryptedUUID, setDecryptedUUID] = useState('');

  const onChange = (event: never, selectedDate: never) => {
    const currentDate = selectedDate;
    setShow(false);
    setVisitDate(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };

  const addAdditionalVisitor = () => {
    if (additionalVisitors.length < 9) {
      setAdditionalVisitors([...additionalVisitors, { id: uuidv4(), name: '' }]);
    } else {
      Alert.alert('限界', '申し訳ございません、同行者は9名までです。');
    }
  };

  const removeAdditionalVisitor = () => {
    if (additionalVisitors.length > 1) {
      const updatedVisitors = additionalVisitors.slice(0, -1);
      setAdditionalVisitors(updatedVisitors);
    }
  };

  const handleAdditionalVisitorChange = (index: number, value: string) => {
    const updatedVisitors = additionalVisitors.map((visitor, i) =>
      i === index ? { ...visitor, name: value } : visitor
    );
    setAdditionalVisitors(updatedVisitors);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedReasons = visitReasons.map(reason =>
      reason.id === id ? { ...reason, checked: !reason.checked } : reason
    );
    setVisitReasons(updatedReasons);
  };

  const downloadQRImage = async (qrURL: string) => {
    try {
      const fileUri = FileSystem.cacheDirectory + "qrcode.png";
      const { uri } = await FileSystem.downloadAsync(qrURL, fileUri);
      return uri;
    } catch (error) {
      console.error("QRコードのダウンロード途中エラーが発生しました:", error);
      Alert.alert("エラー", "QRコードのダウンロードが失敗しました。");
    }
  };

  const handleSubmit = async () => {
    if (!visitor) {
      alert('代表者の名前を入力してください。');
    } 
    else if (!mailAddress) {
      alert('メールアドレスを入力してください。')
    }
    else if (!companyName) {
      alert('会社名を入力してください。')
    }
    else {
      const visitorUUID = uuidv4();
      setLoading(true); // Show loading screen

      const hash = CryptoES.AES.encrypt(visitorUUID, secretKey);
      // setEncryptedUUID(hash.toString()); // Set the encrypted UUID
      // setQrValue(hash.toString()); // Set the value for the QR code

      // const decrypted = CryptoES.AES.decrypt(hash, secretKey);
      // setDecryptedUUID(decrypted.toString(CryptoES.enc.Utf8));

      const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(hash.toString())}`

      try {
        const base64QR = await downloadQRImage(url);

        const emailContent = 
`本メールはスマートエントリシステムよりお送りしております

${companyName}
${visitor} 様

下記内容にて来客予約を受け付けました。
弊社ご入室の際は、弊社担当に添付のQRコードをお見せください。


訪問日時：${visitDate.toLocaleString('ja-JP', options)}
ご案内先：7F アルサーガパートナーズ 株式会社
予約担当者：アルサーガパートナーズ 株式会社

入室QRコードはこのメールに添付しました。`;

        const isAvailable = await MailComposer.isAvailableAsync();
        if (isAvailable) {
          await MailComposer.composeAsync({
            recipients: [mailAddress],
            subject: 'アルサーガパートナーズ 株式会社 入退出管理のご案内',
            body: emailContent,
            attachments: [base64QR!],
          });
        } else {
          Alert.alert('エラー', 'MailComposerはこのデバイスに存在しません。');
        }
  
        setLoading(false);
        navigation.replace('ホーム', { toastMessage: true });
      } catch (error) {
        console.error('メール作成エラー:', error);
        setLoading(false);
        Alert.alert('エラー', 'メール送信失敗しました。もう一度送信してください。');
      }
    }
  };

  return (
    <PaperProvider>
      <View className="flex-1">
        <ScrollView className='p-5 pb-10 flex-grow'>
          <Text className="mb-4">来社日: {visitDate.toLocaleString('ja-JP', options)}</Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={visitDate}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          <View className="flex-row space-around mb-5">
            <View className='mr-4'><Button onPress={showDatepicker} title="日付指定" /></View>
            <Button onPress={showTimepicker} title="時間指定" />
          </View>

          <Text className="mb-2">貴社名:</Text>
          <TextInput
            className="h-10 border border-gray-400 mb-5 p-2"
            value={companyName}
            onChangeText={setCompanyName}
          />

          <Text className="mb-2">代表者氏名:</Text>
          <TextInput
            className="h-10 border border-gray-400 mb-5 p-2"
            value={visitor}
            onChangeText={setVisitor}
          />

          <Text className="mb-2">メールアドレス:</Text>
          <TextInput
            className="h-10 border border-gray-400 mb-5 p-2"
            value={mailAddress}
            onChangeText={setMailAddress}
          />

          <Text className="mb-2">来社目的:</Text>
          {visitReasons.map(reason => (
            <View key={reason.id} className="flex-row items-center mb-2">
              <Checkbox
                status={reason.checked ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(reason.id)}
              />
              <Text>{reason.reason}</Text>
            </View>
          ))}

          {visitReasons.find(reason => reason.id === 4)?.checked && (
            <View className="mb-5">
              <Text className="mb-2">記入:</Text>
              <TextInput
                className="h-10 border border-gray-400 p-2"
                value={otherReason}
                onChangeText={setOtherReason}
              />
            </View>
          )}

          {additionalVisitors.map((visitor, index) => (
            <View key={index} className="mb-5">
              <Text className="mb-2">同行者 {index+1}:</Text>
              <TextInput
                className="h-10 border border-gray-400 p-2"
                value={visitor.name}
                onChangeText={(value) => handleAdditionalVisitorChange(index, value)}
              />
            </View>
          ))}

          <View className="flex-row justify-between mb-5">
            <Button
              title="同行者追加"
              onPress={addAdditionalVisitor}
            />
            {additionalVisitors.length > 1? 
            <Button
              title="同行者削除"
              onPress={removeAdditionalVisitor}
              disabled={additionalVisitors.length <= 1}
              color='#ff0000'
            />
            : ''}
          </View>

          {/* {qrCodeUrl ? 
            <View className="items-center">
              <Image 
                source={{ uri: qrCodeUrl }}
                className="w-40 h-40 mb-10"
              /> 
            </View>
          : null } */}
        </ScrollView>

        <View className="p-5">
          <Button
            title="登録"
            onPress={handleSubmit}
          />
        </View>

        <Toast />
      </View>

      {/* Loading Screen */}
      <Modal
        transparent={true}
        animationType='none'
        visible={loading}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10, fontSize: 18, color: '#fff' }}>QRコード生成中．．．</Text>
        </View>
      </Modal>
    </PaperProvider>
  );
};