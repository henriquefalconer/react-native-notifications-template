import React, { useContext, useEffect, useState, createContext } from 'react';

import { User } from '@interfaces/index';

interface UserData {
  user: User;
  token: string;
}

interface IAuthData extends UserData {
  setFcmToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext({} as IAuthData);

export const AuthProvider: React.FC = ({ children }) => {
  const [fcmToken, setFcmToken] = useState<string>();
  const [userData, setUserData] = useState({} as UserData);

  useEffect(() => {
    const call = async () => {
      const { user } = userData ?? {};

      if (fcmToken && user.fcmToken && user.fcmToken !== fcmToken) {
        // Atualizar o fcmToken do backend:
        // await api.put(`/users/${user.id}`, { ...user, fcmToken });

        setUserData(data => ({ ...data, user: { ...user, fcmToken } }));
      }
    };

    call();
  }, [userData, fcmToken]);

  useEffect(() => {
    const call = async () => {
      // Obter user e token do AsyncStorage, se tiver (salvando com setUserData).
    };

    call();
  }, []);

  const login = async (_email: string, _password: string) => {
    // Faça login do usuário e salve seus dados:
    // const response = await api.post(`/login`, { email, password });
    // const { user, token } = response.data;
    // AsyncStorage.multiSet ...
    // setUserData({ user, token });
  };

  const logout = async () => {
    // Faça o logout do usuário (backend deveria alterar o fcmToken do usuário para null, para não enviar mais notificações ao aparelho):
    // await api.post(`/logout/${user.id}`);
  };

  return (
    <AuthContext.Provider value={{ ...userData, setFcmToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
