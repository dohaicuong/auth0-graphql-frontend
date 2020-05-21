import React from 'react'
import { Environment, RecordSource, Store } from 'relay-runtime'
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-modern'
import { RelayEnvironmentProvider } from 'react-relay/hooks'
import { useAuth0 } from 'providers/AuthProvider'

const store = new Store(new RecordSource())

const RelayProvider: React.FC = ({ children }) => {
  const { isAuthenticated, getTokenSilently } = useAuth0()

  const [token, setToken] = React.useState<string | null>(null)
  React.useEffect(() => {
    if(getTokenSilently && isAuthenticated) getTokenSilently().then(setToken)
  }, [getTokenSilently, isAuthenticated])

  // if(getTokenSilently && isAuthenticated) getTokenSilently().then(console.log)

  const network = React.useMemo(() => {
    return new RelayNetworkLayer([
      urlMiddleware({
        url: req => Promise.resolve('http://localhost:4000/graphql'),
      }),
      authMiddleware({
        token: () => token || ''
      })
    ], { noThrow: true })
  }, [token])

  // when token change, network also change
  // so environment only watch token cuz network is an object
  // eslint-disable-next-line
  const environment = React.useMemo(() => new Environment({ network, store }), [token])

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  )
}
export default RelayProvider