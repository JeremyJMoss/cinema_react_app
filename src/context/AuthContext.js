import { createContext, useState, useContext, useEffect } from 'react';

import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') ? atob(localStorage.getItem('token')) : null);
    const [user, setUser] = useState(null);
  
    const decodeToken = (token) => {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', btoa(newToken));
        const decodedToken = decodeToken(newToken);
        setUser({
            email: decodedToken.email,
            userId: decodedToken.userId,
            role: decodedToken.role,
            isAdmin: decodedToken.role === 'admin' || decodedToken.role === 'super admin'
        });
      };
    
      const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
      };
    
      // Initialize user on component mount
      useEffect(() => {
        if (token) {
          const decodedToken = decodeToken(token);
          if (new Date(decodedToken.exp * 1000) <= new Date()){
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            return;
          }
          setUser({
            email: decodedToken.email,
            userId: decodedToken.userId,
            role: decodedToken.role,
            isAdmin: decodedToken.role === 'admin' || decodedToken.role === 'super admin'
          });
        }
      }, [token]);

    const toggleLoginModal = () => {
        setShowLoginModal((prev) => !prev);
    };

    return (
        <AuthContext.Provider value={{ showLoginModal, toggleLoginModal, token, user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};