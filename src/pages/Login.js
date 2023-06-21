import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveEmail } from '../redux/actions';
import fundoLogin from '../img/90941.jpg';
import carteira from '../img/vecteezy_earnings-income-wallet_15275953_197.png';
import carteira2 from '../img/218390.png';

class Login extends React.Component {
  state = {
    email: '',
    senha: '',
    btnDisable: true,
  };

  validationButton = () => {
    const { senha, email } = this.state;

    const lengthSenha = 6;
    const btn = senha.length >= lengthSenha;
    const validEmail = email.includes('@' && '.com');

    this.setState({
      btnDisable: !(btn && validEmail),
    });
  };

  redirectingToWallet = () => {
    const { email } = this.state;
    const { history, dispatch } = this.props;
    dispatch(saveEmail(email));
    history.push('/carteira');
    // console.log(history.location);
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.validationButton);
  };

  render() {
    const { email, senha, btnDisable } = this.state;

    return (
      <div className="relative">
        <img
          src={ fundoLogin }
          className="absolute inset-0 w-full h-full object-cover"
          alt="fundo vetor tecnológico verde"
        />
        <div
          className="
          flex
          justify-center items-center min-h-screen relative z-10"
        >
          <form className="bg-gray-800 p-8 rounded-lg">
            <div className="flex">
              <img
                src={ carteira2 }
                className="w-20 h-20 flex mb-3 pr-2 pb-3
          justify-center items-center "
                alt="carteira com dinheiro e cartão"
              />
              <h1
                className=" flex
          justify-center items-center
          text-5xl mb-4 font-extrabold
          relative z-10 text-white"
              >
                My Wallet
              </h1>
            </div>
            <h1
              className=" flex
            items-start text-5xl font-extrabold text-white"
            >
              Login.

            </h1>
            <div>
              <label htmlFor="email">
                <input
                  className="
                  placeholder:italic
              placeholder:text-gray-700
              mr-4 pr-8
              w-80
              py-2 mt-4 bg-emerald-500
              rounded-md
              border-none"
                  data-testid="email-input"
                  type="email"
                  name="email"
                  value={ email }
                  onChange={ this.handleChange }
                  required
                  placeholder="Email"
                />
              </label>
            </div>
            <div>
              <label htmlFor="senha">
                <input
                  className="placeholder:italic
              placeholder:text-gray-700
              mr-4 pr-8 w-80 py-2
              mt-2 bg-emerald-500
              rounded-md border-none"
                  data-testid="password-input"
                  type="password"
                  name="senha"
                  value={ senha }
                  onChange={ this.handleChange }
                  placeholder="Senha"
                />
              </label>
            </div>
            <div className="flex  items-center">
              <button
                className=" rounded-md mt-2 mr-4 pr-8 px-6 ml-
            bg-emerald-500 hover:bg-emerald-700
          disabled:opacity-30 w-full text-white py-2 "
                disabled={ btnDisable }
                onClick={ this.redirectingToWallet }
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
