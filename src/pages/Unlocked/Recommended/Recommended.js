import React, { Component } from "react";
import { connect } from "react-redux";
import { SHOW_SEARCH } from "../../../components/Constants/constants";
import SearchItem from "./SearchItem";
import AddItemButton from "../../../components/Popups/AddItemButton";
import SearchBar from "../../../components/Search/SearchBar";

const mapStateToProps = (state) => {
  return { displayedItems: state.displayedItems };
};

class Recommended extends Component {
  render() {
    return (
      <div className="flex flex-col w-1/4 border-r-2 border-solid border-gray-400 dark:bg-gray-800">
        <div className="flex w-full">
          <SearchBar />
          <AddItemButton />
        </div>
        <div className="w-full cursor-pointer overflow-y-hidden mt-3">
          {this.props.displayedItems.map((item, key) => {
            // Choosing the most relevant info to show in the recommended section
            let chosenKey = "";
            let shown = "";

            for (const id of SHOW_SEARCH[item.type]) {
              if (item[id] !== "") {
                shown = item[id];
                chosenKey = id;
                break;
              }
            }

            return (
              <SearchItem
                key={key}
                itemId={item.numId}
                title={item.title}
                shown={shown}
                type={item.type}
                chosenKey={chosenKey}
              />
            );
          })}
          {this.props.displayedItems.length < 1 && (
            <div className="p-4 border-b border-gray-700 text-gray-700 dark:text-gray-300 w-full">
              No results matching search
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Recommended);
