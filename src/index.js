import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory, IndexRoute } from "react-router"
import App from './App'
import Recording from './Recording'
import Remote from './Remote'

import './index.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/" component={App}>
          <IndexRoute component={Recording} />
          <Route path="remote" component={Remote}/>
      </Route>
  </Router>,
  document.getElementById('root')
)
