// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import {
  GET_CURRENCIES,
  SUBMIT_EXPENSES,
  DELETE_EXPENSES,
  UPDATE_EXPENSES,
  SAVE_UPDATE_EXPENSES } from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
  total: 0,
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_CURRENCIES:
    return {
      ...state,
      currencies: action.payload,
    };
  case SUBMIT_EXPENSES:
    return {
      ...state,
      expenses: [...state.expenses, action.payload],
    };
  case DELETE_EXPENSES:
    return {
      ...state,
      expenses: state.expenses.filter(({ id }) => action.payload.id !== id),
    };
  case UPDATE_EXPENSES:
    return {
      ...state,
      editor: true,
      idToEdit: action.payload,
    };
  case SAVE_UPDATE_EXPENSES:
    return {
      ...state,
      expenses: state.expenses.map((expense) => {
        if (expense.id === state.idToEdit) return { ...action.payload };
        return expense;
      }),
      editor: false,
      idToEdit: 0,
    };
  default:
    return state;
  }
};

export default wallet;
