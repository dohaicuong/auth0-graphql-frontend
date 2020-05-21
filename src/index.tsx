import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from 'serviceWorker'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Auth0Provider, useAuth0 } from 'providers/AuthProvider'
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_IDENTIFIER } from 'configs'
import RelayProvider from 'providers/RelayProvider'
import PrivateRoute from 'components/PrivateRoute'

const AppBar = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0()

  return (
    <div>
      {!isAuthenticated
        ? (loginWithRedirect && <button onClick={() => loginWithRedirect()}>Login</button>)
        : (logout && <button onClick={() => logout()}>Logout</button>)
      }{' '}
      {isAuthenticated && (
        <span>
          <Link to='/'>Home</Link>{' '}
          <Link to='/profile'>Profile</Link>
        </span>
      )}
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Auth0Provider domain={AUTH0_DOMAIN} client_id={AUTH0_CLIENT_ID} audience={AUTH0_IDENTIFIER}>
        <React.Suspense fallback='Root loading...'>
          <RelayProvider>
            <AppBar />
            <Switch>
              <Route exact path='/' component={React.lazy(() => import('pages/Home'))} />
              <PrivateRoute exact path='/profile' component={React.lazy(() => import('pages/Profile'))} />
            </Switch>
          </RelayProvider>
        </React.Suspense>
      </Auth0Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
serviceWorker.unregister()