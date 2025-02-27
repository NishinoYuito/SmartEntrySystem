import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Checkbox, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-native-qrcode-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import CryptoES from 'crypto-es';

export default function Generator() {
  const [visitor, setVisitor] = useState('');
  const [mailAddress, setMailAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [visitDate, setVisitDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [additionalVisitors, setAdditionalVisitors] = useState([{ name: '' }]);
  const [visitReasons, setVisitReasons] = useState([
    { id: 1, reason: 'Meeting', checked: false },
    { id: 2, reason: 'Interview', checked: false },
    { id: 3, reason: 'Delivery', checked: false },
    { id: 4, reason: 'Other', checked: false },
  ]);
  const [qrValue, setQrValue] = useState('');
  const [generatedUUID, setGeneratedUUID] = useState('');
  const [loading, setLoading] = useState(false);

  const secretKey = 'Arsaga';
  // Initialize state with the CipherParams object
  const [encryptedUUID, setEncryptedUUID] = useState('');
  const [decryptedUUID, setDecryptedUUID] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setVisitDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const addAdditionalVisitor = () => {
    setAdditionalVisitors([...additionalVisitors, { name: '' }]);
  };

  const handleAdditionalVisitorChange = (index, value) => {
    const updatedVisitors = additionalVisitors.map((visitor, i) =>
      i === index ? { ...visitor, name: value } : visitor
    );
    setAdditionalVisitors(updatedVisitors);
  };

  const handleCheckboxChange = (id) => {
    const updatedReasons = visitReasons.map(reason =>
      reason.id === id ? { ...reason, checked: !reason.checked } : reason
    );
    setVisitReasons(updatedReasons);
  };
  
  const handleSubmit = () => {
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
      setGeneratedUUID(visitorUUID); // Set the generated UUID
      setLoading(true); // Show loading screen

      const hash = CryptoES.AES.encrypt(visitorUUID, secretKey);
      setEncryptedUUID(hash.toString()); // Set the encrypted UUID
      setQrValue(hash.toString()); // Set the value for the QR code

      const decrypted = CryptoES.AES.decrypt(hash, secretKey);
      setDecryptedUUID(decrypted.toString(CryptoES.enc.Utf8));

      // Simulate a 3-second loading period
      setTimeout(() => {
        setLoading(false); // Hide loading screen
        // Show toast message
        Toast.show({
          type: 'success',
          text1: 'QR Code Generated',
          text2: 'QR code successfully generated!'
        });
      }, 3000);
    }
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text className="mb-4">Visit Date: {visitDate.toLocaleString()}</Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={visitDate}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <View className="flex-row justify-between mb-5">
          <Button onPress={showDatepicker} title="日付指定" />
          <Button onPress={showTimepicker} title="時間指定" />
        </View>

        <Text>Visitor Name:</Text>
        <TextInput
          style={styles.input}
          value={visitor}
          onChangeText={setVisitor}
        />

        <Text>Mail Address:</Text>
        <TextInput
          style={styles.input}
          value={mailAddress}
          onChangeText={setMailAddress}
        />

        <Text>Company Name:</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
        />

        <Text>Visit Reason:</Text>
        {visitReasons.map(reason => (
          <View key={reason.id} style={styles.checkboxContainer}>
            <Checkbox
              status={reason.checked ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange(reason.id)}
            />
            <Text>{reason.reason}</Text>
          </View>
        ))}

        {additionalVisitors.map((visitor, index) => (
          <View key={index}>
            <Text>Additional Visitor Name:</Text>
            <TextInput
              style={styles.input}
              value={visitor.name}
              onChangeText={(value) => handleAdditionalVisitorChange(index, value)}
            />
          </View>
        ))}

        <View style={styles.addButton}>
          <Button
            title="Add Additional Visitor"
            onPress={addAdditionalVisitor}
          />
        </View>

        <Button
          title="Submit"
          onPress={handleSubmit}
        />

        {qrValue && (
          <View style={styles.qrContainer}>
            <Text>Generated UUID: </Text>
            <Text>{generatedUUID}</Text>
            <Text>Encrypted UUID: </Text>
            <Text>{encryptedUUID}</Text>
            <Text>Decrypted UUID: </Text>
            <Text>{decryptedUUID}</Text>
            <Text>Generated QR Code:</Text>
            <Text></Text>
            <QRCode
              value={qrValue}
              size={200}
            />
          </View>
        )}

        <Toast />
      </ScrollView>

      {/* Loading Screen */}
      <Modal
        transparent={true}
        animationType='none'
        visible={loading}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Generating QR Code...</Text>
        </View>
      </Modal>

    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 10
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addButton: {
    marginBottom: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
});