import { useState, useEffect } from 'react';

const PRICING_KEY = 'lp_marketplace_pricing';
const PURCHASES_KEY = 'lp_agent_purchases';

const DEFAULT_PRICING = {
  tiers: [
    { id: 'tier_starter', name: 'Starter Tier', leads: 10, price: 199, desc: 'Perfect for part-time agents.' },
    { id: 'tier_pro', name: 'Pro Tier', leads: 30, price: 499, desc: 'Our most popular package for full-time agents.' },
    { id: 'tier_elite', name: 'Elite Tier', leads: 50, price: 799, desc: 'Maximum volume for agency builders.' },
  ],
  services: [
    { id: 'srv_website', name: 'Custom Website Funnel', price: 299, type: 'one-time', desc: 'A dedicated landing page identical to this one, branded to you.' },
    { id: 'srv_business_card', name: 'Digital Business Card', price: 49, type: 'one-time', desc: 'NFC-enabled smart business card with tap-to-save.' },
    { id: 'srv_print_cards', name: 'Print Business Cards (500)', price: 99, type: 'one-time', desc: 'Premium thick cardstock, shipped to your door.' },
  ]
};

export function useMarketplace(agentId) {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [agentPurchases, setAgentPurchases] = useState({ tier: null, services: [] });

  // Load pricing
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRICING_KEY);
      if (stored) setPricing(JSON.parse(stored));
      else localStorage.setItem(PRICING_KEY, JSON.stringify(DEFAULT_PRICING));
    } catch {
      setPricing(DEFAULT_PRICING);
    }
  }, []);

  // Load specific agent's purchases
  useEffect(() => {
    if (!agentId) return;
    try {
      const stored = localStorage.getItem(PURCHASES_KEY);
      const allPurchases = stored ? JSON.parse(stored) : {};
      if (allPurchases[agentId]) {
        setAgentPurchases(allPurchases[agentId]);
      } else {
        setAgentPurchases({ tier: null, services: [] });
      }
    } catch {
      setAgentPurchases({ tier: null, services: [] });
    }
  }, [agentId]);

  // Admin function to update prices
  const updatePricing = (newPricing) => {
    setPricing(newPricing);
    localStorage.setItem(PRICING_KEY, JSON.stringify(newPricing));
  };

  // Agent function to simulate purchase
  const purchaseItem = (itemType, itemId) => {
    if (!agentId) return;

    const stored = localStorage.getItem(PURCHASES_KEY);
    const allPurchases = stored ? JSON.parse(stored) : {};
    const current = allPurchases[agentId] || { tier: null, services: [] };

    let updated;
    if (itemType === 'tier') {
      updated = { ...current, tier: itemId };
    } else {
      if (!current.services.includes(itemId)) {
        updated = { ...current, services: [...current.services, itemId] };
      } else {
        updated = current;
      }
    }

    allPurchases[agentId] = updated;
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(allPurchases));
    setAgentPurchases(updated);
  };

  return { pricing, agentPurchases, updatePricing, purchaseItem };
}
