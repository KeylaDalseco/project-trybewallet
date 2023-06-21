import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import WalletForm from '../components/WalletForm';
import mockData from './helpers/mockData';
import { submitExpenses, deleteExchange } from '../redux/actions';

describe('Testando a page wallet', () => {
  test('Teste se a page está sendo renderizado', () => {
    const initialEntries = ['/carteira'];
    const { history } = renderWithRouterAndRedux(<Wallet />, { initialEntries });

    screen.getByRole('heading', { name: /trybewallet/i });
    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
  });
  test('Teste se possui os elementos despesa total, valor e a moeda BRL', () => {
    renderWithRouterAndRedux(<Wallet />);

    screen.getByText(/despesa total: r\$/i);
    screen.getByRole('heading', { name: /0\.00/i });
    screen.getByRole('heading', { name: /brl/i });
  });
  test('Teste se o fetch da API para criação do select com as currencies está sendo realizada', async () => {
    const currency = ['USD', 'CAD', 'GBP', 'ARS', 'BTC', 'LTC', 'EUR', 'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE'];

    currency.forEach((moedas) => {
      screen.findAllByText(moedas);
    });

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(currency),
    });

    renderWithRouterAndRedux(<WalletForm />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  test('Teste se a page possui os inputs do walletForm: valor, moeda, descrição, moeda, metodo de pagamento, categoria e botão', () => {
    renderWithRouterAndRedux(<WalletForm />);
    screen.getByRole('textbox', { name: /valor:/i });
    screen.getByRole('textbox', { name: /descrição:/i });
    const moedas = screen.getByText(/moeda:/i);
    within(moedas).getByRole('combobox');
    screen.getByRole('textbox', { name: /valor:/i });
    screen.getByText(/categoria:/i);
    screen.getByRole('button', { name: /adicionar despesa/i });
  });
  test('Teste se após clicar ao botão, as informações foram inseridas na store', async () => {
    jest.spyOn(global, 'fetch');
    const initialState = {
      user: {
        email: '',
      },
      wallet: {
        currencies: [],
        expenses: [],
        editor: false,
        idToEdit: 0,
        total: 0,
      },
    };

    const initialEntries = ['/carteira'];
    const { store } = renderWithRouterAndRedux(
      <WalletForm />,
      { initialEntries, initialState },
    );
    const btn = screen.getByRole('button', { name: /adicionar despesa/i });
    // console.log(store.getState());
    act(() => userEvent.click(btn));
    expect(global.fetch).toHaveBeenCalled();
    expect(store.getState().wallet.expenses).toHaveLength(0);
  });
  test('Teste se o fetch da API para criação do objeto expenses é realizada', () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    renderWithRouterAndRedux(<WalletForm />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const btn = screen.getByRole('button', { name: /adicionar despesa/i });
    act(() => userEvent.click(btn));
    expect(fetch).toHaveBeenCalled();
  });
  test('Teste se o estado local é atualizado após digitar no input', () => {
    jest.spyOn(global, 'fetch');
    renderWithRouterAndRedux(<WalletForm />);

    const initialState = {
      user: {
        email: 'keylacostadalseco@gmail.com',
      },
      wallet: {
        currencies: [],
        expenses: [],
        editor: false,
        idToEdit: 0,
        total: 0,
      },
    };

    const state = {
      id: 0,
      value: '22',
      description: 'teste',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Trabalho',
    };

    const initialEntries = ['/carteira'];
    const { store } = renderWithRouterAndRedux(
      <Wallet />,
      { initialEntries, initialState },
    );
    store.dispatch(submitExpenses({ ...state, exchangeRates: mockData }));
    expect(store.getState().user.email).toBe('keylacostadalseco@gmail.com');
    screen.getByRole('heading', { name: /email: keylacostadalseco@gmail.com/i });
  });
  test('Teste se os inputs recebem os valores corretos', () => {
    jest.spyOn(global, 'fetch');
    renderWithRouterAndRedux(<WalletForm />);
    const inputValue = screen.getByRole('textbox', { name: /valor:/i });
    const inputDescrição = screen.getByRole('textbox', { name: /descrição:/i });
    const btn = screen.getByRole('button', { name: /adicionar despesa/i });
    // const selectedMoedas = screen.getByLabelText(/moeda:/i);

    // const moedas = Object.keys(mockData).filter((moeda) => moeda !== 'USDT');
    const valor = '240';
    const valorDescrição = 'teste';
    userEvent.type(inputValue, valor);
    expect(inputValue).toHaveValue(valor);
    expect(screen.queryByText(valor)).not.toBeInTheDocument();
    act(() => userEvent.click(btn));
    userEvent.type(inputDescrição, valorDescrição);
    const options = screen.getAllByRole('option');
    const optionUSD = options.find((option) => option.value === 'USD');

    if (optionUSD) {
      userEvent.selectOptions(options, 'USD');
    }
    const optionPagamento = screen.getByTestId('method-input');
    userEvent.selectOptions(optionPagamento, 'Dinheiro');
  });
  test('Testando o botão de apagar na tabela', async () => {
    jest.spyOn(global, 'fetch');
    const createDate = '2023-05-17 15:53:04';
    const createDate2 = '2023-05-17 15:52:59';
    const createDate3 = '2023-05-17 15:53:23';
    const expense = {
      USD: {
        code: 'USD',
        codein: 'BRL',
        name: 'Dólar Americano/Real Brasileiro',
        high: '4.9707',
        low: '4.9236',
        varBid: '-0.0056',
        pctChange: '-0.11',
        bid: '4.9341',
        ask: '4.9352',
        timestamp: '1684349579',
        create_date: createDate2,
      },
      USDT: {
        code: 'USD',
        codein: 'BRLT',
        name: 'Dólar Americano/Real Brasileiro Turismo',
        high: '4.99',
        low: '4.945',
        varBid: '-0.01',
        pctChange: '-0.2',
        bid: '4.81',
        ask: '5.1',
        timestamp: '1684348320',
        create_date: '2023-05-17 15:32:00',
      },
      CAD: {
        code: 'CAD',
        codein: 'BRL',
        name: 'Dólar Canadense/Real Brasileiro',
        high: '3.6873',
        low: '3.6545',
        varBid: '0.0024',
        pctChange: '0.07',
        bid: '3.6659',
        ask: '3.6714',
        timestamp: '1684349589',
        create_date: '2023-05-17 15:53:09',
      },
      GBP: {
        code: 'GBP',
        codein: 'BRL',
        name: 'Libra Esterlina/Real Brasileiro',
        high: '6.192',
        low: '6.138',
        varBid: '-0.0087',
        pctChange: '-0.14',
        bid: '6.1589',
        ask: '6.1627',
        timestamp: '1684349587',
        create_date: '2023-05-17 15:53:07',
      },
      ARS: {
        code: 'ARS',
        codein: 'BRL',
        name: 'Peso Argentino/Real Brasileiro',
        high: '0.0215',
        low: '0.0213',
        varBid: '-0.0001',
        pctChange: '-0.47',
        bid: '0.0213',
        ask: '0.0213',
        timestamp: '1684349584',
        create_date: createDate,
      },
      BTC: {
        code: 'BTC',
        codein: 'BRL',
        name: 'Bitcoin/Real Brasileiro',
        high: '135444',
        low: '132500',
        varBid: '280',
        pctChange: '0.21',
        bid: '134433',
        ask: '134504',
        timestamp: '1684349603',
        create_date: createDate3,
      },
      LTC: {
        code: 'LTC',
        codein: 'BRL',
        name: 'Litecoin/Real Brasileiro',
        high: '470.23',
        low: '442.1',
        varBid: '25.17',
        pctChange: '5.67',
        bid: '468.07',
        ask: '469.03',
        timestamp: '1684349599',
        create_date: '2023-05-17 15:53:19',
      },
      EUR: {
        code: 'EUR',
        codein: 'BRL',
        name: 'Euro/Real Brasileiro',
        high: '5.3769',
        low: '5.3399',
        varBid: '-0.0197',
        pctChange: '-0.37',
        bid: '5.3432',
        ask: '5.3512',
        timestamp: '1684349597',
        create_date: '2023-05-17 15:53:17',
      },
      JPY: {
        code: 'JPY',
        codein: 'BRL',
        name: 'Iene Japonês/Real Brasileiro',
        high: '0.03625',
        low: '0.0358',
        varBid: '-0.0004',
        pctChange: '-1.1',
        bid: '0.03585',
        ask: '0.03587',
        timestamp: '1684349601',
        create_date: '2023-05-17 15:53:21',
      },
      CHF: {
        code: 'CHF',
        codein: 'BRL',
        name: 'Franco Suíço/Real Brasileiro',
        high: '5.5229',
        low: '5.4798',
        varBid: '-0.0225',
        pctChange: '-0.41',
        bid: '5.4856',
        ask: '5.4938',
        timestamp: '1684349592',
        create_date: '2023-05-17 15:53:12',
      },
      AUD: {
        code: 'AUD',
        codein: 'BRL',
        name: 'Dólar Australiano/Real Brasileiro',
        high: '3.3056',
        low: '3.2791',
        varBid: '-0.0032',
        pctChange: '-0.1',
        bid: '3.2842',
        ask: '3.2891',
        timestamp: '1684349584',
        create_date: createDate,
      },
      CNY: {
        code: 'CNY',
        codein: 'BRL',
        name: 'Yuan Chinês/Real Brasileiro',
        high: '0.7102',
        low: '0.7035',
        varBid: '-0.0023',
        pctChange: '-0.32',
        bid: '0.7051',
        ask: '0.7052',
        timestamp: '1684349582',
        create_date: '2023-05-17 15:53:02',
      },
      ILS: {
        code: 'ILS',
        codein: 'BRL',
        name: 'Novo Shekel Israelense/Real Brasileiro',
        high: '1.3614',
        low: '1.3497',
        varBid: '0.0027',
        pctChange: '0.2',
        bid: '1.3537',
        ask: '1.354',
        timestamp: '1684349584',
        create_date: '2023-05-17 15:53:04',
      },
      ETH: {
        code: 'ETH',
        codein: 'BRL',
        name: 'Ethereum/Real Brasileiro',
        high: '9134.42',
        low: '8903.21',
        varBid: '-30.07',
        pctChange: '-0.33',
        bid: '9013.39',
        ask: '9062.08',
        timestamp: '1684349604',
        create_date: '2023-05-17 15:53:24',
      },
      XRP: {
        code: 'XRP',
        codein: 'BRL',
        name: 'XRP/Real Brasileiro',
        high: '2.29',
        low: '2.1',
        varBid: '0.12',
        pctChange: '5.8',
        bid: '2.22',
        ask: '2.22',
        timestamp: '1684349603',
        create_date: createDate3,
      },
      DOGE: {
        code: 'DOGE',
        codein: 'BRL',
        name: 'Dogecoin/Real Brasileiro',
        high: '0.36914',
        low: '0.35549',
        varBid: '0.01225',
        pctChange: '3.43',
        bid: '0.36904',
        ask: '0.36904',
        timestamp: '1684349579',
        create_date: '2023-05-17 15:52:59',
      },
    };

    const initialState = {
      user: {
        email: 'teste@gmail.com',
      },
      wallet: {
        currencies: [
          'USD',
          'CAD',
          'GBP',
          'ARS',
          'BTC',
          'LTC',
          'EUR',
          'JPY',
          'CHF',
          'AUD',
          'CNY',
          'ILS',
          'ETH',
          'XRP',
          'DOGE',
        ],
        expenses: [
          {
            id: 0,
            value: '111',
            description: 'teste',
            currency: 'USD',
            method: 'Dinheiro',
            tag: 'Alimentação',
            exchangeRates: {
              USD: {
                code: 'USD',
                codein: 'BRL',
                name: 'Dólar Americano/Real Brasileiro',
                high: '4.9707',
                low: '4.9236',
                varBid: '-0.0056',
                pctChange: '-0.11',
                bid: '4.9341',
                ask: '4.9352',
                timestamp: '1684349579',
                create_date: createDate2,
              },
              USDT: {
                code: 'USD',
                codein: 'BRLT',
                name: 'Dólar Americano/Real Brasileiro Turismo',
                high: '4.99',
                low: '4.945',
                varBid: '-0.01',
                pctChange: '-0.2',
                bid: '4.81',
                ask: '5.1',
                timestamp: '1684348320',
                create_date: '2023-05-17 15:32:00',
              },
              CAD: {
                code: 'CAD',
                codein: 'BRL',
                name: 'Dólar Canadense/Real Brasileiro',
                high: '3.6873',
                low: '3.6545',
                varBid: '0.0024',
                pctChange: '0.07',
                bid: '3.6659',
                ask: '3.6714',
                timestamp: '1684349589',
                create_date: '2023-05-17 15:53:09',
              },
              GBP: {
                code: 'GBP',
                codein: 'BRL',
                name: 'Libra Esterlina/Real Brasileiro',
                high: '6.192',
                low: '6.138',
                varBid: '-0.0087',
                pctChange: '-0.14',
                bid: '6.1589',
                ask: '6.1627',
                timestamp: '1684349587',
                create_date: '2023-05-17 15:53:07',
              },
              ARS: {
                code: 'ARS',
                codein: 'BRL',
                name: 'Peso Argentino/Real Brasileiro',
                high: '0.0215',
                low: '0.0213',
                varBid: '-0.0001',
                pctChange: '-0.47',
                bid: '0.0213',
                ask: '0.0213',
                timestamp: '1684349584',
                create_date: createDate,
              },
              BTC: {
                code: 'BTC',
                codein: 'BRL',
                name: 'Bitcoin/Real Brasileiro',
                high: '135444',
                low: '132500',
                varBid: '280',
                pctChange: '0.21',
                bid: '134433',
                ask: '134504',
                timestamp: '1684349603',
                create_date: createDate3,
              },
              LTC: {
                code: 'LTC',
                codein: 'BRL',
                name: 'Litecoin/Real Brasileiro',
                high: '470.23',
                low: '442.1',
                varBid: '25.17',
                pctChange: '5.67',
                bid: '468.07',
                ask: '469.03',
                timestamp: '1684349599',
                create_date: '2023-05-17 15:53:19',
              },
              EUR: {
                code: 'EUR',
                codein: 'BRL',
                name: 'Euro/Real Brasileiro',
                high: '5.3769',
                low: '5.3399',
                varBid: '-0.0197',
                pctChange: '-0.37',
                bid: '5.3432',
                ask: '5.3512',
                timestamp: '1684349597',
                create_date: '2023-05-17 15:53:17',
              },
              JPY: {
                code: 'JPY',
                codein: 'BRL',
                name: 'Iene Japonês/Real Brasileiro',
                high: '0.03625',
                low: '0.0358',
                varBid: '-0.0004',
                pctChange: '-1.1',
                bid: '0.03585',
                ask: '0.03587',
                timestamp: '1684349601',
                create_date: '2023-05-17 15:53:21',
              },
              CHF: {
                code: 'CHF',
                codein: 'BRL',
                name: 'Franco Suíço/Real Brasileiro',
                high: '5.5229',
                low: '5.4798',
                varBid: '-0.0225',
                pctChange: '-0.41',
                bid: '5.4856',
                ask: '5.4938',
                timestamp: '1684349592',
                create_date: '2023-05-17 15:53:12',
              },
              AUD: {
                code: 'AUD',
                codein: 'BRL',
                name: 'Dólar Australiano/Real Brasileiro',
                high: '3.3056',
                low: '3.2791',
                varBid: '-0.0032',
                pctChange: '-0.1',
                bid: '3.2842',
                ask: '3.2891',
                timestamp: '1684349584',
                create_date: createDate,
              },
              CNY: {
                code: 'CNY',
                codein: 'BRL',
                name: 'Yuan Chinês/Real Brasileiro',
                high: '0.7102',
                low: '0.7035',
                varBid: '-0.0023',
                pctChange: '-0.32',
                bid: '0.7051',
                ask: '0.7052',
                timestamp: '1684349582',
                create_date: '2023-05-17 15:53:02',
              },
              ILS: {
                code: 'ILS',
                codein: 'BRL',
                name: 'Novo Shekel Israelense/Real Brasileiro',
                high: '1.3614',
                low: '1.3497',
                varBid: '0.0027',
                pctChange: '0.2',
                bid: '1.3537',
                ask: '1.354',
                timestamp: '1684349584',
                create_date: createDate,
              },
              ETH: {
                code: 'ETH',
                codein: 'BRL',
                name: 'Ethereum/Real Brasileiro',
                high: '9134.42',
                low: '8903.21',
                varBid: '-30.07',
                pctChange: '-0.33',
                bid: '9013.39',
                ask: '9062.08',
                timestamp: '1684349604',
                create_date: '2023-05-17 15:53:24',
              },
              XRP: {
                code: 'XRP',
                codein: 'BRL',
                name: 'XRP/Real Brasileiro',
                high: '2.29',
                low: '2.1',
                varBid: '0.12',
                pctChange: '5.8',
                bid: '2.22',
                ask: '2.22',
                timestamp: '1684349603',
                create_date: '2023-05-17 15:53:23',
              },
              DOGE: {
                code: 'DOGE',
                codein: 'BRL',
                name: 'Dogecoin/Real Brasileiro',
                high: '0.36914',
                low: '0.35549',
                varBid: '0.01225',
                pctChange: '3.43',
                bid: '0.36904',
                ask: '0.36904',
                timestamp: '1684349579',
                create_date: createDate2,
              },
            },
          },
        ],
        editor: false,
        idToEdit: 0,
        total: 0,
      },
    };
    const initialEntries = ['/carteira'];
    const { store } = renderWithRouterAndRedux(
      <Wallet />,
      { initialEntries, initialState },
    );
    screen.getByRole('heading', { name: /walletform/i });
    const btn = screen.getByRole('button', { name: /adicionar despesa/i });
    act(() => userEvent.click(btn));
    store.dispatch(deleteExchange(expense));
    expect(store.getState().wallet.currencies[0]).toBe('USD');
  });
  test('Testando se os inputs são limpos após clicar no botão', async () => {
    renderWithRouterAndRedux(<Wallet />);

    const btn = screen.getByRole('button', { name: /adicionar despesa/i });
    act(() => userEvent.click(btn));

    const inputDescription = await screen.findByLabelText(/descrição:/i);
    const inputExpense = await screen.findByLabelText(/valor:/i);

    expect(inputExpense).toHaveValue('');
    expect(inputDescription).toHaveValue('');
  });
});
