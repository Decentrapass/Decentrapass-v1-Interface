import React, { Component } from "react";
import InfoIcons from "./InfoIcons";
import Landing from "./Landing";
import TheSafeToken from "./TheSafeToken";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="flex flex-col" id="home">
        <Landing />
        <InfoIcons />
        <TheSafeToken />
        <div className="w-full h-96 dark:bg-gray-900">TEST</div>
      </div>
    );
  }
}

export default Home;
