import { useState, useEffect } from 'react';
import { api } from '../services/api';

const DEFAULT_PRICING = { tiers: [], services: [] };

export function useMarketplace(agentId) {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [agentPurchases, setAgentPurchases] = useState({ tier: null, services: [] });

  // Load pricing
  useEffect(() => {
    api.getPricing().then(setPricing).catch(err => console.error('Failed to load pricing:', err));
  }, []);

  // Load specific agent's purchases
  useEffect(() => {
    if (!agentId) return;
    api.getPurchases().then(setAgentPurchases).catch(err => console.error('Failed to load purchases:', err));
  }, [agentId]);

  // Admin function to update prices
  const updatePricing = async (newPricing) => {
    try {
      await api.updatePricing(newPricing);
      setPricing(newPricing);
    } catch (err) {
      console.error('Failed to update pricing:', err);
    }
  };

  // Agent function to record a purchase
  const purchaseItem = async (itemType, itemId) => {
    if (!agentId) return;
    try {
      const updated = await api.purchaseItem(itemType, itemId);
      setAgentPurchases(updated);
    } catch (err) {
      console.error('Failed to record purchase:', err);
    }
  };

  return { pricing, agentPurchases, updatePricing, purchaseItem };
}
