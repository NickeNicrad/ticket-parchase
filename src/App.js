import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Messages from './components/pages/Messages';
import Login from './components/auth/Login';
import Invoices from './components/pages/Invoices';
import Pricing from './components/pages/Pricing';


function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </Router>

      <Router>
        {/* <div className="app-profile"> */}
          <div className='connect-container align-content-stretch d-flex flex-wrap'>
            <Sidebar />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/profile' component={Profile} />
              <Route path='/messages' component={Messages} />
              <Route path='/invoices' component={Invoices} />
              <Route path='/pricing' component={Pricing} />
            </Switch>
          </div>
        {/* </div> */}
      </Router>
    </>
  );
}

export default App;
