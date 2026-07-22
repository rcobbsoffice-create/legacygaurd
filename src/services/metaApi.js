/**
 * Meta Marketing API Service Layer
 * 
 * This file mirrors the exact structure of the real Meta Marketing API.
 * To go live: replace DEMO_MODE=true with your real credentials below.
 *
 * Required env vars for production:
 *   VITE_META_ACCESS_TOKEN   = your user/system access token
 *   VITE_META_AD_ACCOUNT_ID  = act_XXXXXXXXX
 *   VITE_META_PAGE_ID        = your Facebook Page ID
 *   VITE_META_PIXEL_ID       = your Facebook Pixel ID
 */

const DEMO_MODE = true; // ← flip to false and add credentials to go live

const META_API_BASE = 'https://graph.facebook.com/v19.0';
const AD_ACCOUNT_ID = import.meta.env.VITE_META_AD_ACCOUNT_ID || 'act_DEMO_ACCOUNT';
const ACCESS_TOKEN  = import.meta.env.VITE_META_ACCESS_TOKEN  || 'DEMO_ACCESS_TOKEN';
const PAGE_ID       = import.meta.env.VITE_META_PAGE_ID       || 'DEMO_PAGE_ID';
const PIXEL_ID      = import.meta.env.VITE_META_PIXEL_ID      || 'DEMO_PIXEL_ID';

// ── Simulated response helpers ────────────────────────────────────────────────
const fakeId  = (prefix) => `${prefix}_${Math.floor(Math.random() * 9000000 + 1000000)}`;
const delay   = (ms)     => new Promise(r => setTimeout(r, ms));
const simFail = ()       => Math.random() < 0.05; // 5% simulated failure rate

// ── Campaign Management ───────────────────────────────────────────────────────

/**
 * Create a new campaign
 * Real: POST /act_{ad_account_id}/campaigns
 */
export async function createCampaign({ name, objective, status, dailyBudget }) {
  if (DEMO_MODE) {
    await delay(800);
    if (simFail()) throw new Error('Meta API Error: Temporary connectivity issue.');
    return { id: fakeId('campaign'), name, objective, status: status || 'PAUSED', daily_budget: dailyBudget * 100 };
  }

  const res = await fetch(`${META_API_BASE}/${AD_ACCOUNT_ID}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      objective: objective || 'LEAD_GENERATION',
      status: status || 'PAUSED',
      daily_budget: dailyBudget * 100, // Meta expects cents
      special_ad_categories: ['CREDIT', 'EMPLOYMENT', 'HOUSING', 'ISSUES_ELECTIONS_POLITICS'],
      access_token: ACCESS_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Create an Ad Set within a campaign
 * Real: POST /act_{ad_account_id}/adsets
 */
export async function createAdSet({ campaignId, name, targeting, dailyBudget }) {
  if (DEMO_MODE) {
    await delay(600);
    return {
      id: fakeId('adset'),
      campaign_id: campaignId,
      name,
      daily_budget: dailyBudget * 100,
      targeting,
      status: 'PAUSED',
    };
  }

  const res = await fetch(`${META_API_BASE}/${AD_ACCOUNT_ID}/adsets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      campaign_id: campaignId,
      daily_budget: dailyBudget * 100,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      targeting: {
        age_min: targeting?.ageMin || 50,
        age_max: targeting?.ageMax || 85,
        geo_locations: { states: targeting?.states || [{ key: 'US-VA' }] },
      },
      promoted_object: { pixel_id: PIXEL_ID, custom_event_type: 'LEAD' },
      status: 'PAUSED',
      access_token: ACCESS_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Upload an image and create an ad creative
 * Real: POST /act_{ad_account_id}/adcreatives
 */
export async function createAdCreative({ adSetId, headline, body, cta, imageUrl }) {
  if (DEMO_MODE) {
    await delay(700);
    return {
      id: fakeId('creative'),
      adset_id: adSetId,
      headline,
      body,
      call_to_action: cta,
      image_url: imageUrl,
      status: 'ACTIVE',
    };
  }

  const res = await fetch(`${META_API_BASE}/${AD_ACCOUNT_ID}/adcreatives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `LP Insurance Ad - ${Date.now()}`,
      object_story_spec: {
        page_id: PAGE_ID,
        link_data: {
          link: 'https://lpinsurance.com',
          message: body,
          image_url: imageUrl,
          call_to_action: { type: cta || 'LEARN_MORE', value: { link: 'https://lpinsurance.com' } },
          name: headline,
        },
      },
      access_token: ACCESS_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Create the final Ad linking the creative to the ad set
 * Real: POST /act_{ad_account_id}/ads
 */
export async function createAd({ name, adSetId, creativeId }) {
  if (DEMO_MODE) {
    await delay(500);
    return { id: fakeId('ad'), name, adset_id: adSetId, creative: { creative_id: creativeId }, status: 'ACTIVE' };
  }

  const res = await fetch(`${META_API_BASE}/${AD_ACCOUNT_ID}/ads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      adset_id: adSetId,
      creative: { creative_id: creativeId },
      status: 'ACTIVE',
      access_token: ACCESS_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Get campaign performance insights
 * Real: GET /{campaign_id}/insights
 */
export async function getCampaignInsights(campaignId) {
  if (DEMO_MODE) {
    await delay(400);
    const spend      = Math.random() * 80 + 20;
    const leads      = Math.floor(spend / (Math.random() * 12 + 8));
    const impressions = Math.floor(leads * (Math.random() * 300 + 150));
    const clicks     = Math.floor(leads * (Math.random() * 8 + 4));
    return {
      campaign_id:  campaignId,
      spend:        spend.toFixed(2),
      leads,
      impressions,
      clicks,
      ctr:          (clicks / impressions * 100).toFixed(2),
      cpl:          (spend / (leads || 1)).toFixed(2),
      date_start:   new Date().toISOString().split('T')[0],
    };
  }

  const res = await fetch(
    `${META_API_BASE}/${campaignId}/insights?fields=spend,leads,impressions,clicks,ctr,cost_per_lead&access_token=${ACCESS_TOKEN}`
  );
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data?.[0] || {};
}

/**
 * Update campaign budget (for adaptive bidding)
 * Real: POST /{campaign_id}
 */
export async function updateCampaignBudget(campaignId, newDailyBudget) {
  if (DEMO_MODE) {
    await delay(300);
    return { success: true, campaign_id: campaignId, new_daily_budget: newDailyBudget };
  }

  const res = await fetch(`${META_API_BASE}/${campaignId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ daily_budget: newDailyBudget * 100, access_token: ACCESS_TOKEN }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Pause a campaign
 * Real: POST /{campaign_id}
 */
export async function pauseCampaign(campaignId) {
  if (DEMO_MODE) {
    await delay(300);
    return { success: true, campaign_id: campaignId, status: 'PAUSED' };
  }

  const res = await fetch(`${META_API_BASE}/${campaignId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'PAUSED', access_token: ACCESS_TOKEN }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
