import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '../utils/token';
import { useNavigate } from 'react-router-dom';
import { verify } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    verify()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        removeToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  useEffect(() => {
    const handleStorageChange = (e) => {  // this event listener has triggereing "re-render" capabilities
      if (e.key === 'token') {
        const newToken = e.newValue;
        const currentToken = getToken();
        
        // If token changed in another tab
        if (newToken !== currentToken) {
          if (newToken) {
            removeToken();
            setUser(null);
          }
          navigate('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  if (loading) {
    
    return null; // or a loader component

  } else {

    return (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }

};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};

// ans who is “who is logged in” or “am I still loading user info?”

// we will use this to redirect(reqiroeAUth) user if he not logged in or have expiered jwt

