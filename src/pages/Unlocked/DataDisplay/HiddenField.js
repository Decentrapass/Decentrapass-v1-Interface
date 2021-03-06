import React, { Component } from "react";
import { MdDone } from "react-icons/md";

// Normal field displayed (copy and reveal button)
export default class NormalField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyText: "copy",
      revealed: false, // For password fields
    };
    this.copyData = this.copyData.bind(this);
  }

  copyData() {
    // Copys data to clipboard
    this.setState({
      copyText: (
        <>
          <MdDone />
          copied
        </>
      ),
    });
    navigator.clipboard.writeText(this.props.fieldValue);

    setTimeout(
      function () {
        this.setState({
          copyText: "copy",
        });
      }.bind(this),
      500
    );
  }

  render() {
    return (
      <div
        className="data-field flex w-full items-center border-t border-solid bg-white border-gray-300 dark:border-gray-700 lg:h-16 md:h-12 h-16 cursor-pointer relative"
        style={this.props.first ? { border: "0 none" } : {}}
      >
        <div className="flex flex-col justify-center h-full w-full px-4 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900">
          <span className="text-green-600 text-sm h-1/4">
            {this.props.fieldName}
          </span>
          <span
            className="text-base lg:text-lg dark:text-white h-2/4"
            style={
              // Decides if password is hidden
              !this.state.revealed ? { WebkitTextSecurity: "disc" } : {}
            }
          >
            {this.props.fieldValue}
          </span>
        </div>
        <div className="absolute right-0 hidden w-2/6 h-full justify-end tools">
          <div
            className="text-md block text-green-500 w-1/2 flex items-center justify-center h-full border-l border-gray-300 dark:border-gray-600 border-solid bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900"
            onClick={() => this.setState({ revealed: !this.state.revealed })}
          >
            <p>reveal</p>
          </div>
          <div
            className="text-md block text-green-500 w-1/2 flex items-center justify-center h-full border-l border-gray-300 dark:border-gray-600 border-solid bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900"
            onClick={this.copyData}
          >
            <p className="flex items-center justify-center gap-1">
              {this.state.copyText}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
