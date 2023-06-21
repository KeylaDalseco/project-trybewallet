import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchMoedas, fetchExchanges, saveUpdateExpenses } from '../redux/actions';

class WalletForm extends Component {
  state = {
    id: 0,
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  };

  async componentDidMount() {
    fetchMoedas();
    this.fetchExchanges();
  }

  componentDidUpdate(prevProps) {
    const { expenses, editor, idToEdit } = this.props;
    // console.log(expenses);
    if (editor && prevProps.editor !== editor) {
      const despesa = expenses.find((expense) => expense.id === idToEdit);
      // console.log(despesa);
      this.setState({
        oldId: despesa.id,
        ...despesa,
      });
    }
  }

  handleClickEdit = async () => {
    const { dispatch } = this.props;
    const updateExpense = { ...this.state };
    delete updateExpense.oldId;
    await dispatch(saveUpdateExpenses(updateExpense));
    this.setState({
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    });
  };

  fetchExchanges = async () => {
    const { dispatch } = this.props;
    await dispatch(fetchMoedas());
  };

  btnExpenses = async () => {
    let { id } = this.state;
    const { dispatch } = this.props;
    id += 1;
    // dispatch(submitExpenses({ ...this.state }));
    await dispatch(fetchExchanges({ ...this.state }));
    this.setState({
      value: '',
      description: '',
      id,
    });
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { value, description, currency, method, tag } = this.state;
    const { moedas, editor } = this.props;
    // console.log(moedas);
    return (
      <div>
        <h1>WalletForm</h1>
        <form>
          <label>
            Valor:
            <input
              data-testid="value-input"
              type="text"
              name="value"
              value={ value }
              onChange={ this.handleChange }
              placeholder="Valor"
            />
          </label>
          <label>
            Descrição:
            <input
              data-testid="description-input"
              type="text"
              name="description"
              value={ description }
              onChange={ this.handleChange }
              placeholder="description"
            />
          </label>
          <label>
            {' '}
            Moeda:
            <select
              data-testid="currency-input"
              name="currency"
              value={ currency }
              onChange={ this.handleChange }
              placeholder="currency"
            >
              {
                moedas.map((option, index) => (
                  <option key={ index }>{ option }</option>
                ))
              }
            </select>
          </label>
          <label>
            {' '}
            Metodo de pagamento:
            <select
              data-testid="method-input"
              name="method"
              value={ method }
              onChange={ this.handleChange }
              placeholder="method"
            >
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>
          <label>
            {' '}
            Categoria:
            <select
              data-testid="tag-input"
              name="tag"
              value={ tag }
              onChange={ this.handleChange }
              placeholder="tag"
            >
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>
          { editor ? (
            <button
              type="button"
              onClick={ this.handleClickEdit }
            >
              Editar despesas
            </button>
          ) : (
            <button
              type="button"
              onClick={ this.btnExpenses }
            >
              Adicionar despesa
            </button>) }
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  moedas: state.wallet.currencies,
  editor: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
  expenses: state.wallet.expenses,
});

WalletForm.propTypes = {
  moedas: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.string,
    description: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    tag: PropTypes.string,
  })).isRequired,
};

export default connect(mapStateToProps)(WalletForm);
