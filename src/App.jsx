import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConsumerFunnel from './components/ConsumerFunnel';
import AgentLogin from './components/agent/AgentLogin';
import AgentHub from './components/agent/AgentHub';
import QuoteQuizModal from './components/QuoteQuizModal';
import Footer from './components/Footer';
import { useAgentAuth } from './hooks/useAgentAuth';

const INITIAL_LEADS = [
  { id: 'LEAD-9104', category: 'annuity', categoryLabel: 'Annuity & Rollover', name: 'Arthur Pendelton', phone: '(757) 555-4920', email: 'art.pendelton@gmail.com', state: 'VA', details: '401(k) Rollover: $250,000 • Goal: Guaranteed Income', estimatedRate: '$1,250 - $1,800/mo income', preferredTime: 'Morning (9am - 12pm)', source: 'Meta Ad - 401(k) Protection', submittedAt: '09:15 AM Today', score: 'HIGH TICKET ($250k)', status: 'New', agentId: 'agent-001' },
  { id: 'LEAD-9101', category: 'auto', categoryLabel: 'Auto Insurance', name: 'Melissa Richardson', phone: '(757) 555-8831', email: 'mrichardson77@yahoo.com', state: 'VA', details: '2 Vehicles • Current Carrier: Geico • Clean Record', estimatedRate: '$92 - $130/mo', preferredTime: 'Afternoon (12pm - 4pm)', source: 'Meta Ad - Auto Relief', submittedAt: '08:42 AM Today', score: 'High Intent (95%)', status: 'New', agentId: 'agent-002' },
  { id: 'LEAD-9098', category: 'life', categoryLabel: 'Senior Life & Final Expense', name: 'Dorothy Vance', phone: '(757) 555-8912', email: 'dvance64@gmail.com', state: 'VA', details: 'Age 67 • $15,000 Benefit • Non-Smoker', estimatedRate: '$34.50 - $48.20/mo', preferredTime: 'Morning (9am - 12pm)', source: 'Meta Ad - Burial Protection', submittedAt: 'Yesterday', score: 'High Intent (98%)', status: 'Contacted', agentId: 'agent-001' },
  { id: 'LEAD-9092', category: 'home', categoryLabel: 'Homeowners Insurance', name: 'Gregory Stephens', phone: '(757) 555-3104', email: 'gstephens_va@aol.com', state: 'VA', details: 'Single Family Home • $380,000 Rebuild • Want Auto Bundle', estimatedRate: '$70 - $105/mo', preferredTime: 'Evening (4pm - 7pm)', source: 'Google Search - Home Insurance', submittedAt: 'Yesterday', score: 'Bundle Prospect', status: 'Appt Set', agentId: 'agent-001' },
  { id: 'LEAD-9086', category: 'medicare', categoryLabel: 'Medicare Supplement', name: 'Barbara Watson', phone: '(757) 555-7729', email: 'bwatson_med@gmail.com', state: 'VA', details: 'Turning 65 in 2 months • Enrolled in Part A/B', estimatedRate: '$0 - $35/mo', preferredTime: 'Morning (9am - 12pm)', source: 'Meta Ad - Medicare Review', submittedAt: '2 Days Ago', score: 'Closed Policy ($1,480 APV)', status: 'Closed', agentId: 'agent-001' },
];

export default function App() {
  const { currentAgent, isLoggedIn, loginError, isLoading, login, logout } = useAgentAuth();
  const [activeView, setActiveView]             = useState('consumer');
  const [showLoginModal, setShowLoginModal]     = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('life');
  const [isQuizOpen, setIsQuizOpen]             = useState(false);
  const [quizCategory, setQuizCategory]         = useState('life');
  const [leads, setLeads]                       = useState(INITIAL_LEADS);

  // Listen for footer Agent Hub link
  useEffect(() => {
    const handler = () => setShowLoginModal(true);
    window.addEventListener('openAgentHub', handler);
    return () => window.removeEventListener('openAgentHub', handler);
  }, []);

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
