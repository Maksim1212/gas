import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Settings from "./components/settings.component";

function App() {
return (
<Router>
  <div className="App">
    <div className="auth-wrapper">
      <div className="auth-inner">
        <Switch>
          <Route exact path='/' component={Settings} />
        </Switch>
      </div>
    </div>
  </div>
</Router>
);
}

export default App;