import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {removeExpense, setExpenses} from '../../store/actions/expenseActions';
import {BASE_URL, deleteExpense} from '../../services/API';
import axios from 'axios';
import editIcon from '../../assets/edit.png';
import deleteIcon from '../../assets/delete.png';
import plusIcon from '../../assets/plus.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const expenses = useSelector(state => state.expenses.expenses);

  const filteredExpenses = expenses.filter(
    expense =>
      expense?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense?.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleDelete = id => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this expense?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            await deleteExpense(id);

            dispatch(removeExpense(id));
          },
        },
      ],
    );
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const handleEditExpense = expense => {
    navigation.navigate('AddExpense', {expenseToEdit: expense});
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/expenses`);
        dispatch(setExpenses(response.data));
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expenses</Text>
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or category"
          placeholderTextColor={'#807B7B'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredExpenses}
          renderItem={({item}) => (
            <View style={styles.expenseItem} key={item.id}>
              <View>
                <Text style={[styles.expenseHead]}>
                  Name: <Text style={styles.expenseText}>{item.name}</Text>
                </Text>
                <Text style={[styles.expenseHead]}>
                  Amount: $<Text style={styles.expenseText}>{item.amount}</Text>
                </Text>
                <Text style={styles.expenseHead}>
                  Category:{' '}
                  <Text style={styles.expenseText}>{item.category}</Text>
                </Text>
                <Text style={styles.expenseHead}>
                  Date: <Text style={styles.expenseText}>{item.date}</Text>
                </Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => handleEditExpense(item)}>
                  <Image source={editIcon} style={styles.editIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Image source={deleteIcon} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No expenses found.</Text>
          }
        />
      </View>

      <TouchableOpacity onPress={handleAddExpense} style={styles.addIcon}>
        <Image source={plusIcon} style={styles.plusIcon} />
      </TouchableOpacity>
      <Button
        title="Go to Dashboard"
        color={'#624FC0'}
        onPress={() => navigation.navigate('Dashboard')}
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
    marginBottom: 20,
    backgroundColor: '#624FC0',
    width: screenWidth,
    alignSelf: 'center',
    padding: screenHeight * 0.02,
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    marginTop: 5,
    width: screenWidth * 0.9,
    alignSelf: 'center',
    borderRadius: screenWidth * 0.02,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  expenseText: {
    fontSize: 16,
    color: '#624FC0',
    fontWeight: '300',
  },
  expenseHead: {
    fontSize: 16,
    color: '#61646B',
    fontWeight: '400',
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  editText: {
    color: 'blue',
    marginRight: 10,
  },
  deleteText: {
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  searchInput: {
    borderColor: '#AEA5DB',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: screenWidth * 0.02,
    color: '#000',
  },
  contentContainer: {
    padding: screenHeight * 0.02,
    flex: 1,
  },
  editIcon: {
    height: 30,
    width: 30,
    tintColor: '#624FC0',
  },
  deleteIcon: {
    height: 25,
    width: 25,
    tintColor: '#c51616',
  },
  addIcon: {
    backgroundColor: '#624FC0',
    height: screenWidth * 0.15,
    width: screenWidth * 0.15,
    borderRadius: screenWidth * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    bottom: screenHeight * 0.08,
    right: screenWidth * 0.05,
  },
  plusIcon: {
    height: 20,
    width: 20,
    tintColor: '#fff',
  },

});
