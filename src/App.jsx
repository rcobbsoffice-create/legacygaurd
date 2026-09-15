import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConsumerFunnel from './components/ConsumerFunnel';
import AgentLogin from './components/agent/AgentLogin';
import AgentHub from './components/agent/AgentHub';
import QuoteQuizModal from './components/QuoteQuizModal';
import Footer from './components/Footer';
import { useAgentAuth } from './hooks/useAgentAuth';
import { api } from './services/api';

export default function App() {
  const { currentAgent, isLoggedIn, loginError, isLoading, login, logout } = useAgentAuth();
  const [activeView, setActiveView]             = useState('consumer');
  const [showLoginModal, setShowLoginModal]     = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('life');
  const [isQuizOpen, setIsQuizOpen]             = useState(false);
  const [quizCategory, setQuizCategory]         = useState('life');
  const [leads, setLeads]                       = useState([]);

  // Listen for footer Agent Hub link
  useEffect(() => {
    const handler = () => setShowLoginModal(true);
    window.addEventListener('openAgentHub', handler);
    return () => window.removeEventListener('openAgentHub', handler);
  }, []);

  // Load leads from the backend once logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    api.getLeads().then(setLeads).catch(() => {});
  }, [isLoggedIn]);

  // Redirect to hub once login succeeds
  useEffect(() => {
    if (isLoggedIn && showLoginModal) {
      setShowLoginModal(false);
      setActiveView('agent');
    }
  }, [isLoggedIn]);


  const openQuizModal = (cat) => {
    setQuizCategory(cat || selectedCategory || 'life');
    setIsQuizOpen(true);
  };

  const handleLeadSubmit = (newLead) => {
    setLeads([newLead, ...leads]);
  };

  // When agent hub button is clicked:
  const handleAgentHubClick = () => {
    if (isLoggedIn) {
      setActiveView('agent');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleConsumerClick = () => {
    setActiveView('consumer');
  };

  // Delegate to auth hook
  const handleLogin = (email, password) => {
    login(email, password);
  };

  const handleLogout = () => {
    logout();
    setActiveView('consumer');
  };

  // If logged in and viewing agent, show full hub (no outer navbar/footer)
  if (activeView === 'agent' && isLoggedIn) {
    return (
      <>
        {/* Slim top bar for agent hub */}
        <div className="hidden">
          <Navbar
            onConsumerClick={handleConsumerClick}
            onAgentHubClick={handleAgentHubClick}
            isAgentLoggedIn={isLoggedIn}
            agentName={currentAgent?.name}
            activeView={activeView}
          />
        </div>
        <AgentHub
          currentAgent={currentAgent}
          leads={leads}
          setLeads={setLeads}
          logout={handleLogout}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">

      {/* Navbar */}
      <Navbar
        onConsumerClick={handleConsumerClick}
        onAgentHubClick={handleAgentHubClick}
        isAgentLoggedIn={isLoggedIn}
        agentName={currentAgent?.name}
        activeView={activeView}
      />

      {/* Consumer View */}
      <main className="flex-1">
        <ConsumerFunnel
          openQuizModal={openQuizModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </main>

      {/* Quote Modal */}
      <QuoteQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onLeadSubmit={handleLeadSubmit}
        initialCategory={quizCategory}
      />

      {/* Footer */}
      <Footer />

      {/* Agent Login Modal */}
      {showLoginModal && (
        <AgentLogin
          onClose={() => setShowLoginModal(false)}
          login={handleLogin}
          loginError={loginError}
          isLoading={isLoading}
        />
      )}

    </div>
  );
}
