import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './components/home';
import NewUser from './components/newUser';
import Details from './components/details'
// import Details from './component/details';
// import NewUser from './component/newUser';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
           <Route path='/details/:id' component={Details} />
          <Route path='/newuser' component={NewUser} /> 
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
