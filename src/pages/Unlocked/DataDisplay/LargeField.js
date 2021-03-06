import React, { Component } from "react";
import { MdDone } from "react-icons/md";

// Biggest field displayed (only copy button)
export default class LargeField extends Component {
  constructor(props) {
    super(props);

    this.copyData = this.copyData.bind(this);
    this.state = {
      copyText: "copy",
    };
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
        className="data-field flex w-full items-center border-t border-solid bg-white border-gray-300 dark:border-gray-700 lg:h-48 md:h-42 h-48 cursor-pointer relative"
        style={this.props.first ? { border: "0 none" } : {}}
      >
        <div className="flex flex-col justify-start h-full w-full p-4 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900">
          <span className="text-green-600 text-sm">{this.props.fieldName}</span>
          <div className="text-base lg:text-lg dark:text-white overflow-y-auto">
            {this.props.fieldValue}
          </div>
        </div>
        <div className="absolute right-0 hidden w-1/6 h-full justify-end tools">
          <div
            className="text-md block text-green-500 w-full flex items-center justify-center h-full border-l border-gray-300 dark:border-gray-600 border-solid bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900"
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
