import { ADD_EXPENSE, REMOVE_EXPENSE, SET_EXPENSES } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addExpense = (expense) => {
  return async (dispatch) => {
    try {
      let expenses = await AsyncStorage.getItem('expenses');
      expenses = expenses ? JSON.parse(expenses) : [];
      expenses.push(expense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      dispatch({ type: ADD_EXPENSE, payload: expense });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };
};

export const removeExpense = (id) => {
  return async (dispatch) => {
    try {
      let expenses = await AsyncStorage.getItem('expenses');
      expenses = expenses ? JSON.parse(expenses) : [];
      expenses = expenses.filter((expense) => expense.id !== id);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      dispatch({ type: REMOVE_EXPENSE, payload: id });
    } catch (error) {
      console.error('Error removing expense:', error);
    }
  };
};

export const updateExpense = (updatedExpense) => {
  return {
    type: 'UPDATE_EXPENSE',
    payload: updatedExpense,
  };
};

export const setExpenses = (expenses) => {
  return { type: SET_EXPENSES, payload: expenses };
};
