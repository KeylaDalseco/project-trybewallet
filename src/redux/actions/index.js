// Coloque aqui suas actions - initial
export const SAVE_EMAIL = 'SAVE_EMAIL';
export const GET_CURRENCIES = 'GET_CURRENCIES'; // currencies = moedas
export const SUBMIT_EXPENSES = 'SUBMIT_EXPENSES';
export const DELETE_EXPENSES = 'DELETE_EXPENSES';
export const UPDATE_EXPENSES = 'UPDATE_EXPENSES';
export const SAVE_UPDATE_EXPENSES = 'SAVE_UPDATE_EXPENSES';

export const saveEmail = (email) => ({
  type: SAVE_EMAIL,
  payload: email,
});

export const getCurrencies = (currencies) => ({
  type: GET_CURRENCIES,
  payload: currencies,
});

export const submitExpenses = (valoresInput) => ({
  type: SUBMIT_EXPENSES,
  payload: valoresInput,
});

export const deleteExchange = (expenses) => ({
  type: DELETE_EXPENSES,
  payload: expenses,
});

export const updateExpenses = (id) => ({
  type: UPDATE_EXPENSES,
  payload: id,
});

export const saveUpdateExpenses = (expenses) => ({
  type: SAVE_UPDATE_EXPENSES,
  payload: expenses,
});

export const fetchMoedas = () => async (dispatch) => {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const moedas = await response.json();
    const filtroMoedas = Object.keys(moedas).filter((moeda) => moeda !== 'USDT');
    const result = dispatch(getCurrencies(filtroMoedas));
    return result;
    // console.log(result);
  } catch (error) {
    // console.error(error);
  }
};

export const fetchExchanges = (expense) => async (dispatch) => {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const moedas = await response.json();
    // delete moedas.USDT;
    // console.log(moedas);
    dispatch(submitExpenses({ ...expense, exchangeRates: moedas }));
    // return result;
  } catch (error) {
    // console.error(error);
  }
};
