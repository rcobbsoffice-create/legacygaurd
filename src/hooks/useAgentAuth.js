import { useState, useEffect } from 'react';
import { api } from '../services/api';

const SESSION_KEY = 'lp_agent_session';

export function useAgentAuth() {
  const [currentAgent, setCurrentAgent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Restore session on mount — revalidate the stored token against the server
  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (!parsed?.token) throw new Error('no token');
        const agent = await api.me();
        setCurrentAgent({ ...agent, token: parsed.token });
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setLoginError('');
    try {
      const { token, agent } = await api.login(email, password);
      const safeAgent = { ...agent, token };
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeAgent));
      setCurrentAgent(safeAgent);
      setIsLoggedIn(true);
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentAgent(null);
    setIsLoggedIn(false);
  };

  return { currentAgent, isLoggedIn, loginError, isLoading, login, logout };
}
