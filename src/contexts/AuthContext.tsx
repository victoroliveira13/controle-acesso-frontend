import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from "../services/api";

type User = {
  username: string;
}

type SignInData = {
  username: string;
  password: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      let url = `user/${token}`
      api.get(url)
      .then(response => {
        const { username } = response.data;
        setUser({ username }); 
      })
    }
  }, [])

  async function signIn({username, password}: SignInData) {

    const requestData = {
      username: username,
      password: password
    }
    
    let token, user;
  
    try {
      const response = await api.post('http://localhost:3333/login', requestData);
      ({ token, user } = response.data);

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 1, // 1 hour
      })
      
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    
      setUser(user)
    
      Router.push('/dashboard');
    } catch (error) {
      console.error(error.message);
    }
  }  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}