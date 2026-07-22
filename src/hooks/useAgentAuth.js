import { useState, useEffect } from 'react';

// ── Agent Roster (hardcoded, extend as needed) ───────────────────────────────
export const AGENT_ROSTER = [
  {
    id: 'agent-001',
    name: 'Lawrence Poole',
    email: 'lawrence@lp2nsure.com',
    password: 'LPAdmin2024',
    role: 'admin',         // sees ALL agents' data
    title: 'Owner & Licensed Agent',
    initials: 'LP',
    phone: '(757) 449-6463',
    color: 'amber',
    licenseStates: ['VA', 'NC', 'FL', 'GA', 'OH', 'PA', 'TH'],
  },
  {
    id: 'agent-002',
    name: 'Marcus Williams',
    email: 'marcus@lp2nsure.com',
    password: 'Agent123',
    role: 'agent',         // sees only their own data
    title: 'Licensed Agent',
    initials: 'MW',
    phone: '(757) 555-0201',
    color: 'emerald',
    licenseStates: ['VA', 'NC'],
  },
  {
    id: 'agent-003',
    name: 'Tanya Brooks',
    email: 'tanya@lp2nsure.com',
    password: 'Agent123',
    role: 'agent',
    title: 'Licensed Agent',
    initials: 'TB',
    phone: '(757) 555-0302',
    color: 'blue',
    licenseStates: ['VA'],
  },
];

const SESSION_KEY = 'lp_agent_session';

export function useAgentAuth() {
  const [currentAgent, setCurrentAgent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the agent still exists in roster
        const agent = AGENT_ROSTER.find(a => a.id === parsed.id);
        if (agent) {
          setCurrentAgent(agent);
          setIsLoggedIn(true);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = (email, password) => {
    setIsLoading(true);
    setLoginError('');

    // Simulate async (makes UX feel real)
    setTimeout(() => {
      const agent = AGENT_ROSTER.find(
        a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );

      if (agent) {
        // Strip password before storing
        const { password: _pw, ...safeAgent } = agent;
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeAgent));
        setCurrentAgent(safeAgent);
        setIsLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentAgent(null);
    setIsLoggedIn(false);
  };

  return { currentAgent, isLoggedIn, loginError, isLoading, login, logout };
}
