import React, { Component } from "react";
import { connect } from "react-redux";

// Redux actions
import {
  changeAccount,
  saveWeb3,
  savePassword,
  saveContract,
  loading,
} from "./state/actions";

// React router
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// Web3 utilities
import Web3 from "web3";
import { TOKEN_ABI, TOKEN_ADDRESS } from "./web3/web3constants";
import Web3Modal from "web3modal";

// Components
import NotFound from "./pages/NotFound/NotFound";
import ConnectAccount from "./components/Popups/ConnectAccount";
import Loading from "./components/Popups/Loading";

// Pages
import AddItem from "./pages/AddItem/AddItem";
import EditItem from "./pages/EditItem/EditItem";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Unlocked from "./pages/Unlocked/Unlocked";
import { getCookie } from "./functions/cookies";
import FirstTime from "./components/Popups/FirstTime/FirstTime";

// Redux
const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    isLoading: state.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeAccount: (acc) => dispatch(changeAccount(acc)),
    saveWeb3: (web3item) => dispatch(saveWeb3(web3item)),
    saveContract: (Contract) => dispatch(saveContract(Contract)),
    savePassword: (pass) => dispatch(savePassword(pass)),
    loading: (bool) => dispatch(loading(bool)),
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: false,
      render: null,
      showPopup: false,
      failedConnect: false,
    };

    this.connect = this.connect.bind(this);
    this.saveConnection = this.saveConnection.bind(this);
    this.noWallet = this.noWallet.bind(this);
  }

  // Connects to web3 and saves the contract
  async saveConnection(web3) {
    const contract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
    const accounts = await web3.eth.getAccounts();

    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("connect", () => window.location.reload());
    window.ethereum.on("disconnect", () => window.location.reload());

    this.props.changeAccount(accounts[0]);
    this.props.saveContract(contract);
    this.props.saveWeb3(web3);
  }

  // User clicked connect button > connect with web3modal
  async connect() {
    const providerOptions = {};
    const web3Modal = new Web3Modal({
      providerOptions,
    });

    var provider;
    var web3;

    try {
      this.props.loading(true);
      provider = await web3Modal.connect();

      web3 = new Web3(provider);

      this.setState({ showPopup: false });
      this.saveConnection(web3);
      this.props.loading(false);
    } catch (e) {
      this.props.loading(false);
      this.setState({ failedConnect: true });
    }
  }

  // Checks if metamask is already connected and if so saves connection
  async componentWillMount() {
    let isFirstTime = getCookie("VISIT").length > 0 ? false : true;
    this.setState({ isFirstTime });

    if (typeof window.ethereum !== "undefined") {
      this.setState({ showPopup: false });
      const web3 = new Web3(window.ethereum);
      let accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        this.setState({ showPopup: false });
        this.saveConnection(web3);
      } else {
        this.setState({ showPopup: true });
        this.props.loading(false);
      }
    } else {
      this.setState({ showPopup: true });
      this.props.loading(false);
    }

    // Websites theme
    if (localStorage.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }

  // Saves guest session
  noWallet() {
    this.props.changeAccount("guest");
    this.props.savePassword("1234");
    this.props.saveContract("guest");

    this.setState({ showPopup: false });
  }

  render() {
    return (
      <Router>
        {this.props.isLoading && <Loading />}
        {this.state.isFirstTime && (
          <FirstTime closeMenu={() => this.setState({ isFirstTime: false })} />
        )}
        {!this.state.isFirstTime && this.state.showPopup && (
          <ConnectAccount
            connect={this.connect}
            noWallet={this.noWallet}
            failed={this.state.failedConnect}
          />
        )}
        <Switch>
          <Redirect exact from="/" to="/login" />
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/unlocked">
            <Unlocked connect={this.connect} />
          </Route>
          <Route exact path="/unlocked/add">
            <AddItem />
          </Route>
          <Route exact path="/unlocked/edit">
            <EditItem />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
