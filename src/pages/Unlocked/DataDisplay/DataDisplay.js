import React, { Component } from "react";

import LOGO from "../../../img/logo-nobg.png";

import {
  DATA_DISPLAY,
  LOGO_COLORS,
  SHOW_DATA,
} from "../../../components/Constants/constants";

import NormalField from "./NormalField";
import HiddenField from "./HiddenField";
import LargeField from "./LargeField";
import MediumField from "./MediumField";
import { connect } from "react-redux";
import {
  addItem,
  changeItem,
  filterItems,
  saveItems,
  saveTx,
} from "../../../state/actions";
import { Redirect } from "react-router";
import GuestTriedAction from "../../../components/Popups/GuestTriedAction";

const mapStateToProps = (state) => {
  return {
    items: state.items,
    contract: state.contract,
    account: state.account,
    displayedItems: state.displayedItems,
    currentItem: state.currentItem,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveItems: (data) => dispatch(saveItems(data)),
    changeItem: (item) => dispatch(changeItem(item)),
    filterItems: (items) => dispatch(filterItems(items)),
    addItem: (item) => dispatch(addItem(item)),
    saveTx: (tx) => dispatch(saveTx(tx)),
  };
};

class DataDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: null,
    };
  }

  editHandler() {
    this.props.addItem(this.props.currentItem.type);
    this.setState({ render: <Redirect to="/unlocked/edit" /> });
  }

  async deleteHandler() {
    if (this.props.account !== "guest") {
      this.props.contract.methods
        .deleteObject(this.props.currentItem.id)
        .send({ from: this.props.account })
        .on(
          "transactionHash",
          function (hash) {
            this.props.saveTx(hash);
          }.bind(this)
        );

      let newItems = this.props.items;
      let delPos;

      for (let i = 0; i < this.props.items.length; i++)
        if (this.props.items[i].numId === this.props.currentItem.numId)
          delPos = i;

      newItems.splice(delPos, 1);
      this.props.saveItems(newItems);
      this.props.changeItem(newItems[0]);
    } else {
      this.setState({
        render: (
          <GuestTriedAction onClose={() => this.setState({ render: null })} />
        ),
      });
    }
  }

  render() {
    var displayItem = this.props.currentItem;
    if (displayItem)
      return (
        <div className="w-3/4 h-full dark:text-white bg-green-50 dark:bg-gray-800 flex flex-col justify-between items-center">
          {this.state.render}
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center mb-4 w-full p-4">
              <div
                className="w-16 h-16 flex items-center justify-center dark:text-white font-bold text-3xl uppercase rounded"
                style={{
                  backgroundColor:
                    LOGO_COLORS[displayItem.title.charCodeAt(0) % 26],
                }}
              >
                <span>{displayItem.title.charAt(0)}</span>
              </div>
              <div className="flex flex-col ml-3">
                <h1 className="text-2xl">{displayItem.title}</h1>
                {displayItem.url && (
                  <a
                    href={
                      displayItem.url.includes("http")
                        ? displayItem.url
                        : "http://" + displayItem.url
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-green-500 dark:text-green-600 text-lg hover:underline">
                      {displayItem.url}
                    </span>
                  </a>
                )}
              </div>
            </div>
            <div className="overflow-y-auto w-full p-4">
              <div className="flex flex-col items-center border border-solid border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                {
                  // For every key the object has and we want to display
                  SHOW_DATA[displayItem.type].map((field, key) => {
                    if (DATA_DISPLAY[displayItem.type][field] === "normal")
                      return (
                        <NormalField
                          fieldName={field}
                          fieldValue={displayItem[field]}
                          key={key}
                          first={0 === key}
                        />
                      );
                    else if (DATA_DISPLAY[displayItem.type][field] === "hidden")
                      return (
                        <HiddenField
                          fieldName={field}
                          fieldValue={displayItem[field]}
                          key={key}
                          first={0 === key}
                        />
                      );
                    else if (DATA_DISPLAY[displayItem.type][field] === "large")
                      return (
                        <LargeField
                          fieldName={field}
                          fieldValue={displayItem[field]}
                          key={key}
                          first={0 === key}
                        />
                      );
                    else if (DATA_DISPLAY[displayItem.type][field] === "medium")
                      return (
                        <MediumField
                          fieldName={field}
                          fieldValue={displayItem[field]}
                          key={key}
                          first={0 === key}
                        />
                      );
                    else return <p>Error:{displayItem.type}</p>;
                  })
                }
              </div>
            </div>
          </div>
          <div className="flex w-full p-3 justify-between items-end z-10 text-lg">
            <input
              type="submit"
              value="Edit"
              className="bg-gray-300 dark:bg-gray-500 py-1 px-3 rounded hover:bg-gray-400 dark:hover:bg-gray-400 cursor-pointer"
              onClick={() => this.editHandler()}
            />
            <input
              type="submit"
              value="Delete"
              className="bg-red-300 dark:bg-red-800 py-1 px-3 rounded hover:bg-red-500 dark:hover:bg-red-600 cursor-pointer"
              onClick={() => this.deleteHandler()}
            />
          </div>
        </div>
      );
    return (
      <div className="data flex items-center justify-center w-3/4 h-full">
        <div className="w-32 h-32 flex items-center justify-center bg-green-500 rounded-full opacity-30">
          <img src={LOGO} className="h-2/3" />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataDisplay);