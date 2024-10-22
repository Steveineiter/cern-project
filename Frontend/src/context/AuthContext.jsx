// Generated using ChatGPT.
import React, { createContext, useEffect, useState } from 'react';
import { UserManager } from 'oidc-client-ts';
import { setAuthToken } from '../api/axiosAuthorization';
import { SSO_REDIRECT_URL, CLIENT_ID } from '../utils/constants'

export const AuthContext = createContext();

// Configure UserManager once
const config = {
    authority: 'https://auth.cern.ch/auth/realms/cern',
    client_id: CLIENT_ID,
    redirect_uri: SSO_REDIRECT_URL,
    response_type: 'code',
    scope: 'openid profile email',
    usePkce: true,
};

const userManager = new UserManager(config);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userManager.getUser().then((loadedUser) => {
      setUser(loadedUser);
      if (loadedUser && !loadedUser.expired) {
        setAuthToken(loadedUser.access_token);
      }
    });

    userManager.events.addUserLoaded((loadedUser) => {
      setUser(loadedUser);
      if (loadedUser && !loadedUser.expired) {
        setAuthToken(loadedUser.access_token);
      }
    });

    userManager.events.addUserUnloaded(() => {
      setUser(null);
      setAuthToken(null);
    });
  }, []);

  const signinRedirect = () => userManager.signinRedirect();
  const signoutRedirect = () => userManager.signoutRedirect();

  return (
    <AuthContext.Provider value={{ user, signinRedirect, signoutRedirect, userManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
