import React, { Component } from "react";
import { connect } from "react-redux";
import AddDataField from "../../../components/DataCreate/AddDataField";
import { IF } from "../../../components/Constants/AddInterfaces";
import { encrypt, hash } from "../../../functions/encryption";
import { changeItem, changePage, saveItems } from "../../../state/actions";
import { TYPES_INT } from "../../../components/Constants/constants";
import { formatData, formatItem, formatSend } from "../../../functions/format";
import { Redirect } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    addingItem: state.addingItem,
    account: state.account,
    contract: state.contract,
    items: state.items,
    password: state.password,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePage: (page) => dispatch(changePage(page)),
    changeItem: (item) => dispatch(changeItem(item)),
    saveItems: (data) => dispatch(saveItems(data)),
  };
};

class AddItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
    };

    this.stateChanger = this.stateChanger.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  stateChanger(name, val) {
    this.setState({ [name]: val }); // Saves input values on state
  }

  componentDidMount() {
    if (this.props.addingItem == null) {
      this.setState({ redirect: <Redirect to="/app/unlocked" /> });
    }
  }

  async handleSubmit() {
    let type = TYPES_INT[this.props.addingItem];
    let data = [];

    for (const i of Object.keys(IF[this.props.addingItem])) {
      data.push(this.state[i] || ""); // If null set to empty string (avoid errors)
    }

    let nextId = await this.props.contract.methods
      .numObjects(this.props.account)
      .call();
    let newItem = formatItem(type, data, this.props.items.length, nextId);

    this.props.saveItems(this.props.items.concat([newItem]));
    this.props.changeItem(newItem);

    let toSend = formatSend(encrypt(data, this.props.password));
    console.log(toSend);

    this.props.contract.methods
      .saveObject(type, toSend)
      .send({ from: this.props.account });
    this.setState({ redirect: <Redirect to="/app/unlocked" /> });
  }

  render() {
    return (
      <>
        {this.state.redirect}
        <div className="flex flex-col relative bg-green-50 dark:bg-gray-900 w-full h-full">
          <div className="flex flex-col justify-center items-center cursor-pointer w-full h-full">
            {this.props.addingItem &&
              Object.keys(IF[this.props.addingItem]).map((el, key) => {
                return (
                  <AddDataField
                    key={key}
                    fieldLabel={el}
                    fieldName={IF[this.props.addingItem][el][0]}
                    fieldType={IF[this.props.addingItem][el][1]}
                    elementType={this.props.addingItem}
                    stateChanger={this.stateChanger}
                  />
                );
              })}
            <div className="flex justify-between w-1/3">
              <button
                className="w-48 py-2 bg-red-300 border-2 border-red-500 dark:border-red-600 dark:bg-red-800 hover:bg-red-500 dark:hover:bg-red-600 text-xl text-white"
                onClick={() =>
                  this.setState({
                    redirect: <Redirect to="/app/unlocked" />,
                  })
                }
              >
                Cancel
              </button>
              <button
                className="w-48 py-2 bg-green-300 border-2 border-green-500 dark:border-green-600 dark:bg-green-800 hover:bg-green-500 dark:hover:bg-green-600 text-xl text-white"
                onClick={this.handleSubmit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItem);