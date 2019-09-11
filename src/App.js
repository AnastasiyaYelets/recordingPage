import React, { Component } from 'react'
import './App.css'

class App extends Component {

  render() {
    return (
      <div className="App">
      <div className="container">
        <div className="row">
          <div className=" col-sm-12 col-md-12 col-lg-12" style={{ padding: '15px' }} >
            <ul className="nav nav-pills">
              <li role="presentation" className={window.location.pathname==="/" ? "active" : null}><a href="/">recording</a></li>
              <li role="presentation" className={window.location.pathname==="/remote" ? "active" : null}x><a href="/remote" target="_blank">remote</a></li>
            </ul>
          </div>
        </div>
        </div>

        {this.props.children}
      </div>
    )
  }
}

export default App
