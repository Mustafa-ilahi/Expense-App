import { ADD_EXPENSE, REMOVE_EXPENSE, SET_EXPENSES, UPDATE_EXPENSE } from '../actions/types';

const initialState = {
  expenses: [],
};

export const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
      case UPDATE_EXPENSE:
        return {
          ...state,
          expenses: state.expenses.map(expense =>
            expense.id === action.payload.id ? action.payload : expense
          ),
        };
    case REMOVE_EXPENSE:
      return { ...state, expenses: state.expenses.filter((expense) => expense.id !== action.payload) };
    case SET_EXPENSES:
      return { ...state, expenses: action.payload };
    default:
      return state;
  }
};
