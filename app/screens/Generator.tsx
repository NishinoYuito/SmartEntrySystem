import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { Checkbox, Provider as PaperProvider } from 'react-native-paper';

export default function Generator() {
  const [visitor, setVisitor] = useState('');     
  const [mailAddress, setMailAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [additionalVisitors, setAdditionalVisitors] = useState([{ name: '' }]);
  const [visitReasons, setVisitReasons] = useState([
    { id: 1, reason: 'Meeting', checked: false },
    { id: 2, reason: 'Interview', checked: false },
    { id: 3, reason: 'Delivery', checked: false },
    { id: 4, reason: 'Other', checked: false },
  ]);

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

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
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

        <Button
          title="Add Additional Visitor"
          onPress={addAdditionalVisitor}
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

        <Button
          title="Submit"
          onPress={() => {
            // Handle form submission
          }}
        />
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
});