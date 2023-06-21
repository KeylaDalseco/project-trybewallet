import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    const { expenses, userEmail } = this.props;
    const somaValores = () => {
      const reducerSoma = expenses.reduce((acc, cur) => acc
        + cur.exchangeRates[cur.currency].ask * Number(cur.value), 0);
      return reducerSoma.toFixed(2);
    };
    return (
      <div>
        <div>
          <h3 data-testid="email-field">{`Email: ${userEmail}`}</h3>
        </div>
        <div>
          <p>Despesa total: R$</p>
          <h3 data-testid="total-field">{somaValores()}</h3>
          <h3 data-testid="header-currency-field">BRL</h3>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.user.email,
  totalValue: state.wallet.total,
  expenses: state.wallet.expenses,
});

Header.propTypes = {
  userEmail: PropTypes.string.isRequired,
  // totalValue: PropTypes.number.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    currency: PropTypes.string,
  })).isRequired,
};

export default connect(mapStateToProps)(Header);
