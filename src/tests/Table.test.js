import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
// import Table from '../components/Table';

describe('Testando a page wallet', () => {
  test('Teste se o component Table está sendo renderizado', () => {
    renderWithRouterAndRedux(<Wallet />);
    screen.getByText(/despesa total: r\$/i);
    screen.getByRole('heading', { name: /0\.00/i });
    screen.getByRole('heading', { name: /walletform/i });
    screen.getByRole('columnheader', { name: /descrição/i });
    screen.getByRole('columnheader', { name: /tag/i });
    screen.getByRole('columnheader', { name: /método de pagamento/i });
    screen.getAllByRole('columnheader', { name: /valor/i });
    screen.getAllByRole('columnheader', { name: /moeda/i });
    screen.getByRole('columnheader', { name: /câmbio utilizado/i });
    screen.getByRole('columnheader', { name: /valor convertido/i });
    screen.getByRole('columnheader', { name: /moeda de conversão/i });
    screen.getByRole('columnheader', { name: /valor convertido/i });
  });
  test('Teste se após clicar no botão de adicionar despesa, aparecem os valores do input e um botão para editar e outro para excluir, e botão editar despesa quando clicar em edit', async () => {
    renderWithRouterAndRedux(<Wallet />);

    screen.getByRole('heading', { name: /walletform/i });
    const inputValue = screen.getByRole('textbox', { name: /valor:/i });
    userEvent.type(inputValue, '22');
    const inputDescricao = screen.getByRole('textbox', { name: /descrição:/i });
    userEvent.type(inputDescricao, 'teste');
    const selectMoeda = screen.getByText(/moeda:/i);
    userEvent.type(selectMoeda, 'USD');
    const optionPagamento = screen.getByTestId('method-input');
    userEvent.selectOptions(optionPagamento, 'Cartão de crédito');
    const categoria = screen.getByTestId('tag-input');
    userEvent.selectOptions(categoria, 'Alimentação');

    const btnAdicionarDespesa = screen.getByRole('button', { name: /adicionar despesa/i });
    act(() => userEvent.click(btnAdicionarDespesa));
    await screen.findByRole('cell', { name: /22\.00/i });
    await screen.findByRole('cell', { name: /teste/i });
    await screen.findByRole('cell', { name: /dólar americano\/real brasileiro/i });
    await screen.findByRole('cell', { name: /cartão de crédito/i });
    await screen.findByRole('cell', { name: /alimentação/i });
    await screen.findByRole('button', { name: /editar/i });
    await screen.findByRole('button', { name: /excluir/i });
  });
  test('Teste se no component Table, o botão de editar está fucionando corretamente', async () => {
    const { store } = renderWithRouterAndRedux(<Wallet />);
    screen.getByRole('heading', { name: /walletform/i });
    const inputValue = await screen.findByRole('textbox', { name: /valor:/i });
    const inputDescricao = await screen.findByRole('textbox', { name: /descrição:/i });
    const btnAdicionarDespesa = screen.getByRole('button', { name: /adicionar despesa/i });

    // adicionando 1
    const inputVazio = screen.getByRole('textbox', { name: /valor:/i });
    const describeVazio = screen.getByRole('textbox', { name: /descrição:/i });
    act(() => userEvent.type(inputVazio, '100'));
    act(() => userEvent.type(describeVazio, 'alterando outra despesa'));
    act(() => userEvent.click(btnAdicionarDespesa));
    await screen.findByRole('cell', { name: /alterando outra despesa/i });
    await screen.findByRole('cell', { name: /100\.00/i });

    act(() => userEvent.type(screen.getByRole('textbox', { name: /valor:/i }), ''));

    // adicionando 2
    const inputVazio2 = screen.getByRole('textbox', { name: /valor:/i });
    const describeVazio2 = screen.getByRole('textbox', { name: /descrição:/i });
    act(() => userEvent.type(inputVazio2, '500'));
    act(() => userEvent.type(describeVazio2, 'alterando 2'));
    act(() => userEvent.click(btnAdicionarDespesa));

    act(() => userEvent.type(screen.getByRole('textbox', { name: /valor:/i }), ''));

    await screen.findByRole('cell', { name: /alterando 2/i });
    await screen.findByRole('cell', { name: /500\.00/i });
    const btnEditar = await screen.findAllByRole('button', { name: /editar/i });
    act(() => userEvent.click(btnEditar[1]));
    act(() => userEvent.type(inputValue, '22'));
    act(() => userEvent.type(inputDescricao, 'teste'));
    act(() => userEvent.click(screen.getByRole('button', { name: /editar despesas/i })));
    // expect(inputValue).toHaveValue('22');
    // expect(inputDescricao).toHaveValue('teste');

    console.log(store.getState().wallet.expenses);
  });
  test('Teste se o component Table está de apagando a tabela corretamente', async () => {
    renderWithRouterAndRedux(<Wallet />);
    const inputValue = screen.getByRole('textbox', { name: /valor:/i });
    const inputDescricao = screen.getByRole('textbox', { name: /descrição:/i });
    const btnAdicionarDespesa = screen.getByRole('button', { name: /adicionar despesa/i });
    act(() => userEvent.type(inputValue, '22'));
    act(() => userEvent.type(inputDescricao, 'teste'));
    act(() => userEvent.click(btnAdicionarDespesa));
    await screen.findByRole('cell', { name: /teste/i });
    await screen.findByRole('button', { name: /excluir/i });
    const btnExcluir = await screen.findByRole('button', { name: /excluir/i });
    act(() => userEvent.click(btnExcluir));
    expect(screen.queryByRole('cell', { name: /teste/i })).not.toBeInTheDocument();
  });
});
