import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';


class App extends Component {
  render() {
    return (
      <div className="App">
       <header>
          <nav>
             <h1 className="site-header">Bloc Jams</h1>
             <Link to='/' className="site-footer">Home</Link>
             <Link to='/library' className="site-footer">Listen</Link>
           </nav>
        </header> 
        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
        </main>        
      </div>
    );
  }
}

export default App;
