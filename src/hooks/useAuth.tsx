import React, { useContext, useEffect, useState, createContext } from 'react';

import { User } from '@interfaces/index';

interface UserData {
  user: User;
  token: string;
}

interface IAuthData extends UserData {
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext({} as IAuthData);

export const AuthProvider: React.FC = ({ children }) => {
  const [userData] = useState({} as UserData);

  useEffect(() => {
    const call = async () => {
      // Se vira ae irmão
    };

    call();
  }, []);

  const login = async (_email: string, _password: string) => {
    // Se vira ae irmão
  };

  const logout = async () => {
    // Se vira ae irmão
  };

  return (
    <AuthContext.Provider value={{ ...userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
