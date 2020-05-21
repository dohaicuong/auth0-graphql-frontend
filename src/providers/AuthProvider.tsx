import React from 'react'
import createAuth0Client, { PopupLoginOptions, RedirectLoginOptions, LogoutOptions, IdToken, GetIdTokenClaimsOptions, GetTokenWithPopupOptions, PopupConfigOptions, Auth0ClientOptions, Auth0Client, GetTokenSilentlyOptions } from '@auth0/auth0-spa-js'
import { useHistory } from 'react-router-dom'

export type Auth0UserProfile = {
  email_verified: boolean
  family_name?: string
  given_name?: string
  updated_at: string
  nickname?: string
  picture?: string
  locale?: string
  email?: string
  name?: string
  sub?: string
}
export type Auth0Context = {
  user?: Auth0UserProfile
  isAuthenticated?: boolean
  isLoading: boolean
  isPopupOpen: boolean
  handleRedirectCallback?: () => Promise<void>

  loginWithPopup?: (options?: PopupLoginOptions) => Promise<void>
  loginWithRedirect?: (options?: RedirectLoginOptions) => Promise<void>
  logout?: (options?: LogoutOptions) => void

  getIdTokenClaims?: (options?: GetIdTokenClaimsOptions) => Promise<IdToken>
  getTokenSilently?: (options?: GetTokenSilentlyOptions) => Promise<string>
  getTokenWithPopup?: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => Promise<string>
}
export const Auth0Context = React.createContext<Auth0Context>({ isLoading: false, isPopupOpen: false })
export const useAuth0 = () => React.useContext(Auth0Context)

export const Auth0Provider: React.FC<Auth0ClientOptions> = ({ children, ...initOptions }) => {
  const [user, setUser] = React.useState<any>()
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | undefined>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isPopupOpen, setIsPopupOpen] = React.useState<boolean>(false)  
  const [auth0Client, setAuth0Client] = React.useState<Auth0Client | undefined>()

  const { push } = useHistory()
  const onRedirectCallback = React.useCallback((appState: any) => {
    push({ search: '',pathname: appState?.targetUrl ?? window.location.pathname })
  }, [push])

  const loginWithPopup = async (params: PopupLoginOptions = {}) => {
    setIsPopupOpen(true)
    await auth0Client?.loginWithPopup(params)
      .catch(error => console.log(error))
      .finally(() => setIsPopupOpen(false))
    const user = await auth0Client?.getUser()
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setIsLoading(true)
    await auth0Client?.handleRedirectCallback()
    const user = await auth0Client?.getUser()
    setIsLoading(false)
    setIsAuthenticated(true)
    setUser(user)
  }

  React.useEffect(() => {
    const initAuth0 = async () => {
      const {
        redirect_uri = window.location.origin,
        ...options
      } = initOptions

      const auth0FromHook = await createAuth0Client({ redirect_uri, ...options })
      setAuth0Client(auth0FromHook)

      if(window.location.search.includes('code=') && window.location.search.includes('state=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated()
      setIsAuthenticated(isAuthenticated)

      if(isAuthenticated) {
        const user = await auth0FromHook.getUser()
        // handle authenticate user with api resource server here
        setUser(user)
      }

      setIsLoading(false)
    }
    initAuth0()

  // eslint-disable-next-line
  }, [onRedirectCallback])

  if(!auth0Client) return null

  return (
    <Auth0Context.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isPopupOpen,
        handleRedirectCallback,
        
        loginWithPopup,
        loginWithRedirect: options => auth0Client.loginWithRedirect(options),
        logout: options => auth0Client.logout(options),

        getIdTokenClaims: options => auth0Client.getIdTokenClaims(options),
        getTokenWithPopup: (options, configs) => auth0Client.getTokenWithPopup(options, configs),
        getTokenSilently: options => {
          const audience = options?.audience ? options.audience : initOptions.audience
          return auth0Client.getTokenSilently({ ...options, audience })
        }
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}