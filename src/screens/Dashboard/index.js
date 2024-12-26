import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {setExpenses} from '../../store/actions/expenseActions';
import axios from 'axios';
import {BASE_URL} from '../../services/API';
import {TouchableOpacity} from 'react-native-gesture-handler';
import arrowIcon from '../../assets/arrow.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function Dashboard({navigation}) {
  const dispatch = useDispatch();

  const expenses = useSelector(state => state.expenses.expenses);

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [startDate, setStartDate] = useState(
    moment().startOf('month').format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/expenses`);
        console.log('Fetched Expenses:', response.data); // Debugging log
        dispatch(setExpenses(response.data));
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [dispatch]);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      console.log('Expenses Available:', expenses);
      filterExpensesByDateRange();
    }
  }, [expenses, startDate, endDate]);

  const filterExpensesByDateRange = () => {
    if (!expenses || expenses.length === 0) return;

    const filtered = expenses.filter(expense => {
      const expenseDate = moment(expense.date);
      return expenseDate.isBetween(startDate, endDate, null, '[]');
    });

    console.log('Filtered Expenses:', filtered);

    setFilteredExpenses(filtered);
    updateCategoryBreakdown(filtered);
    calculateTotalExpenses(filtered);
  };

  const calculateTotalExpenses = filteredExpenses => {
    if (!filteredExpenses || filteredExpenses.length === 0) return 0;

    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    setTotalExpenses(total);
  };

  const updateCategoryBreakdown = filteredExpenses => {
    if (!filteredExpenses || filteredExpenses.length === 0) return;

    const breakdown = {};

    filteredExpenses.forEach(expense => {
      breakdown[expense.category] =
        (breakdown[expense.category] || 0) + expense.amount;
    });

    console.log('Category Breakdown:', breakdown);

    const categoryData = Object.keys(breakdown).map(category => ({
      label: category,
      value: breakdown[category],
      color: getCategoryColor(category),
    }));

    setCategoryBreakdown(categoryData);
  };

  const getCategoryColor = category => {
    const colors = {
      Food: '#33FF57',
      Travel: '#3357FF',
      Entertainment: '#FF5733',
      Bills: '#FF33A1',
      Miscellaneous: '#808080',
    };
    return colors[category] || '#808080';
  };

  const renderCategoryLegend = () => {
    const categories = [
      'Food',
      'Travel',
      'Entertainment',
      'Bills',
      'Miscellaneous',
    ];
    return categories.map(category => (
      <View key={category} style={styles.legendItem}>
        <View
          style={[
            styles.colorBox,
            {backgroundColor: getCategoryColor(category)},
          ]}
        />
        <Text style={styles.categoryText}>{category}</Text>
      </View>
    ));
  };

  return (
    <View>
      <View style={styles.headerView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={arrowIcon}
              tintColor={'#fff'}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Dashboard</Text>
        </View>

        <ScrollView>
      <View style={styles.container}>
        

        <View style={styles.contentContainer}>
          <Text style={styles.totalExpenses}>
            Total Expenses: $
            <Text style={styles.expenseText}>{totalExpenses.toFixed(2)}</Text>
          </Text>

          <View style={styles.dateRangeContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Start Date"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="End Date"
              value={endDate}
              onChangeText={setEndDate}
            />

            <TouchableOpacity
              style={styles.filterButton}
              onPress={filterExpensesByDateRange}>
              <Text style={styles.filterButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legendHeader}>Category Colors</Text>
          <ScrollView style={styles.legendContainer}>
            {renderCategoryLegend()}
          </ScrollView>

          <Text style={styles.chartHeader}>Expense Breakdown by Category</Text>
          <View style={{alignSelf: 'center'}}>
            <PieChart
              data={categoryBreakdown}
              radius={100}
              innerRadius={60}
              strokeWidth={2}
              duration={500}
              isAnimated
              strokeColor="#624FC0"
            />
          </View>

          <Text style={styles.transactionListHeader}>Transactions</Text>

          <FlatList
            data={filteredExpenses}
            renderItem={({item}) => (
              <View style={styles.transactionItem}>
                <Text style={styles.text}>{moment(item.date).format('YYYY-MM-DD')}</Text>
                <Text style={styles.text}>
                  {item.category}: ${item.amount.toFixed(2)}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
<View style={styles.paddingBottom}></View>
        </View>
      </View>
    </ScrollView>
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

  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#624FC0',
    width: screenWidth,
    justifyContent: 'space-between',
    padding: screenHeight * 0.02,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  totalExpenses: {
    fontSize: 20,
    marginBottom: 20,
    color: '#61646B',

    fontWeight: '300',
  },
  expenseText: {
    fontSize: 20,
    color: '#624FC0',
    fontWeight: '400',
  },
  dateRangeContainer: {flexDirection: 'row', marginBottom: 20},
  dateInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    color: '#000',
    borderColor: '#AEA5DB',
    borderWidth: 1,
    borderRadius: screenWidth * 0.02,
  },
  chartHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  legendHeader: {fontSize: 16, fontWeight: '600', color: '#000'},
  categoryText: {
    color: '#8E8E8E',
  },
  legendContainer: {marginTop: 10, marginBottom: 20},
  legendItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  colorBox: {width: 20, height: 20, marginRight: 10},
  transactionListHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,

  },
  contentContainer: {
    padding: screenHeight * 0.02,
    flex: 1,
  },
  filterButton: {
    backgroundColor: '#624FC0',
    padding: screenHeight * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: screenHeight * 0.01,
    borderRadius: screenWidth * 0.02,
  },
  filterButtonText: {
    color: '#fff',
  },
  text:{
    fontSize:14,
    color: '#8E8E8E',
  },
  paddingBottom:{
    paddingBottom:screenHeight*0.05
  }
});
