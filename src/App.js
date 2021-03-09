import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Start from "./components/Start";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Start} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
