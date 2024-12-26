import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch} from 'react-redux';
import {addExpense, updateExpense} from '../../store/actions/expenseActions';
import {addExpenseAPI, updateExpenseAPI} from '../../services/API';
import arrowIcon from '../../assets/arrow.png';
import expenseIcon from '../../assets/expense.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function AddExpense({route, navigation}) {
  const {setExpenses, expenseToEdit} = route.params || {};

  const [name, setName] = useState(expenseToEdit ? expenseToEdit.name : '');
  const [amount, setAmount] = useState(
    expenseToEdit ? expenseToEdit.amount : '',
  );
  const [category, setCategory] = useState(
    expenseToEdit ? expenseToEdit.category : '',
  );
  const [date, setDate] = useState(expenseToEdit ? expenseToEdit.date : '');

  const dispatch = useDispatch();

  const categories = [
    'Food',
    'Travel',
    'Entertainment',
    'Bills',
    'Miscellaneous',
  ];

  const handleSaveExpense = async () => {
    if (!name || !amount || !category || !date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(amount)) {
      Alert.alert('Error', 'Amount must be a numeric value');
      return;
    }

    const newExpense = {
      id: expenseToEdit ? expenseToEdit.id : new Date().getTime().toString(),
      name,
      amount: parseFloat(amount),
      category,
      date,
    };

    if (expenseToEdit) {
      await updateExpenseAPI(newExpense.id, newExpense);
      dispatch(updateExpense(newExpense));
      Alert.alert('Success', 'Expense updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            navigation.goBack(); 
          },
        },
      ]);
    } else {
      await addExpenseAPI(newExpense);
      dispatch(addExpense(newExpense));
      Alert.alert('Success', 'Expense added successfully', [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            navigation.goBack(); 
          },
        },
      ]);
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={arrowIcon}
            tintColor={'#fff'}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.header}>
          {expenseToEdit ? 'Edit Expense' : 'Add Expense'}
        </Text>
      </View>

      <View style={styles.contentContainer}>
          <Text style={styles.label}>Expense Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Expense Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Amount</Text>

          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount.toString()}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Category</Text>

          <View style={styles.pickerInput}>
            <Picker
              selectedValue={category}
              onValueChange={itemValue => setCategory(itemValue)}>
              <Picker.Item
                label="Select Category"
                value=""
                style={{color: '#000', fontSize: 14, fontWeight: '700'}}
              />
              {categories.map((category, index) => (
                <Picker.Item
                  key={index}
                  label={category}
                  value={category}
                  style={{fontSize: 14}}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Date</Text>

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>

      <Button
        title={expenseToEdit ? 'Update Expense' : 'Add Expense'}
        color={'#624FC0'}
        onPress={handleSaveExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: '300',
    alignSelf: 'center',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    flex: 1,
  },
  input: {
    borderColor: '#AEA5DB',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: screenWidth * 0.02,
    color: '#000',
  },
  pickerInput: {
    borderColor: '#AEA5DB',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: screenWidth * 0.02,
    color: '#000',
  },
  contentContainer: {
    padding: screenHeight * 0.02,
    flex: 1,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  label: {
    paddingBottom: screenHeight * 0.01,
    paddingLeft: screenWidth * 0.01,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#624FC0',
    width: screenWidth,
    justifyContent: 'space-between',
    padding: screenHeight * 0.02,
  },
});
