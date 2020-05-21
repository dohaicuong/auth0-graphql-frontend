import React from 'react'
import { useAuth0 } from 'providers/AuthProvider'
import { RouteProps, Route } from 'react-router-dom'

const PrivateRoute: React.FC<RouteProps> = ({ component: Component, path, ...rest }) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  React.useEffect(() => {
    if(isLoading || isAuthenticated) return
    if(loginWithRedirect) loginWithRedirect({
      appState: { targetUrl: window.location.pathname }
    })
  }, [isLoading, isAuthenticated, loginWithRedirect, path])

  // @ts-ignore
  const render = (props: any) => isAuthenticated === true ? <Component {...props} /> : null

  return <Route path={path} render={render} {...rest} />
}
export default PrivateRoute