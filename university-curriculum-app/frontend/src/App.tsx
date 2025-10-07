import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Curriculum from './components/Curriculum';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <h1>Welcome to the University Curriculum App</h1>
        </Route>
        <Route path="/curriculum" component={Curriculum} />
      </Switch>
    </Router>
  );
};

export default App;