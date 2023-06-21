import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import Wallet from '../pages/Wallet';
import { saveEmail } from '../redux/actions';

describe('Testando a aplicação de Login', () => {
  test('Teste se a tela de login está sendo renderizada', async () => {
    renderWithRouterAndRedux(<Login />);
    screen.getByRole('heading', { name: /login/i });
  });

  test('Testando se existe na tela de login os inputs e botão', () => {
    renderWithRouterAndRedux(<Login />);
    screen.getByRole('textbox');
    screen.getByPlaceholderText(/senha/i);
    screen.getByRole('button', { name: /entrar/i });
  });

  test('Testando a funcionalidade do input, botão e validação', () => {
    renderWithRouterAndRedux(<Login />);
    const input = screen.getByRole('textbox');
    const senha = screen.getByTestId('password-input');
    const emailValido = 'keylacostadalseco@gmail.com';
    const emailInvalido = 'keylacostadalseco';
    const senhaInvalida = '12345';

    const btn = screen.getByRole('button', { name: /entrar/i });
    expect(btn).toHaveAttribute('disabled');
    expect(btn).toBeDisabled();
    screen.getByPlaceholderText(/email/i);
    screen.getByPlaceholderText(/senha/i);
    act(() => userEvent.type(input, emailInvalido));
    act(() => userEvent.type(senha, senhaInvalida));
    expect(btn).toBeDisabled();

    act(() => userEvent.type(input, emailInvalido));
    userEvent.type(input, emailValido);
    userEvent.type(senha, '123456');
    expect(btn).not.toBeDisabled();
    expect(btn).toBeVisible();
  });
  test('Testando se a rota é alterada ao clicar no botão', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const btn = screen.getByRole('button', { name: /entrar/i });
    screen.getByRole('heading', { name: /login/i });
    userEvent.type(screen.getByRole('textbox'), 'keylacostadalseco@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '123456');
    expect(btn).not.toBeDisabled();
    userEvent.click(btn);
    act(() => { history.push('/carteira'); });
    const { pathname } = history.location;
    // console.log(pathname);
    expect(pathname).toBe('/carteira');
    await screen.findByText(/trybewallet/i);
  });
  test('Testando a action e o estado global de user', async () => {
    const email = 'teste@gmail.com';
    const initialState = {
      user: {
        email,
      },
    };
    const initialEntries = ['/carteira'];
    const { store } = renderWithRouterAndRedux(
      <Wallet />,
      { initialEntries, initialState },
    );
    store.dispatch(saveEmail('teste@gmail.com'));
    expect(store.getState().user.email).toBe(email);
    screen.getByRole('heading', { name: /email: teste@gmail.com/i });
  });
});
