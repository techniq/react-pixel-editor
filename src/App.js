import React, { Component } from 'react';
import Matrix from './components/Matrix';

class App extends Component {
  render() {
    return (
      <Matrix rows={16} columns={16} />
    );
  }
}

export default App;
