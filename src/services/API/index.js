import axios from 'axios';

export const BASE_URL = 'http://192.168.0.118:5000';

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/expenses`);
    console.log('Fetched Expenses:', response.data);
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
};

export const addExpenseAPI = async expense => {
  try {
    const response = await axios.post(`${BASE_URL}/expenses`, expense);
    console.log('Expense added:', response.data);
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

export const updateExpenseAPI = async (id, updatedExpense) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/expenses/${id}`,
      updatedExpense,
    );
    console.log('Expense updated:', response.data);
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

export const deleteExpense = async id => {
  try {
    const response = await axios.delete(`${BASE_URL}/expenses/${id}`);
    console.log('Expense deleted:', response.data);
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};
