/**
 * Spy Detection Utility
 * Handles referrer analysis and spy domain detection
 */

// List of known spy domains (you can add more as needed)
const SPY_DOMAINS = [
  "adspy.com",
  "bigspy.com",
  "minea.com",
  "adspyder.io",
  "adflex.io",
  "poweradspy.com",
  "dropispy.com",
  "socialpeta.com",
  "adstransparency.google.com",
  "facebook.com/ads/library",
  "adbeat.com",
  "anstrex.com",
  "semrush.com",
  "autods.com",
  "foreplay.co",
  "spyfu.com",
  "adplexity.com",
  "spypush.com",
  "nativeadbuzz.com",
  "spyover.com",
  "videoadvault.com",
  "admobispy.com",
  "ispionage.com",
  "similarweb.com",
  "pipiads.com",
  "adespresso.com",
  // Add more spy domains here
];

/**
 * Extracts domain from referrer URL
 * @param {string} referrer - The referrer URL
 * @returns {string|null} - The extracted domain or null if invalid
 */
function extractReferrerDomain(referrer) {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname.toLowerCase();
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a referrer domain is in the spy domains list
 * @param {string} referrerDomain - The referrer domain to check
 * @returns {boolean} - True if the domain is a spy domain
 */
function isSpyDomain(referrerDomain) {
  if (!referrerDomain) return false;
  return SPY_DOMAINS.some((spyDomain) => {
    // Exact match or subdomain match
    return (
      referrerDomain === spyDomain || referrerDomain.endsWith("." + spyDomain)
    );
  });
}

/**
 * Analyzes referrer and determines if it's a spy
 * @param {string} referrer - The referrer URL from request headers
 * @returns {Object} - Analysis result with domain and spy status
 */
function analyzeReferrer(referrer) {
  // If no referrer (user typed URL directly), mark as spy (past: true)
  if (!referrer) {
    return {
      referrer: null,
      referrerDomain: null,
      isSpy: true, // No referrer = past: true
    };
  }

  const referrerDomain = extractReferrerDomain(referrer);
  const isSpy = isSpyDomain(referrerDomain);

  return {
    referrer: referrer,
    referrerDomain: referrerDomain,
    isSpy: isSpy,
  };
}

/**
 * Adds a new spy domain to the list
 * @param {string} domain - The domain to add to spy list
 */
function addSpyDomain(domain) {
  if (domain && !SPY_DOMAINS.includes(domain.toLowerCase())) {
    SPY_DOMAINS.push(domain.toLowerCase());
    console.log(`Added spy domain: ${domain}`);
  }
}

/**
 * Removes a domain from the spy list
 * @param {string} domain - The domain to remove from spy list
 */
function removeSpyDomain(domain) {
  const index = SPY_DOMAINS.indexOf(domain.toLowerCase());
  if (index > -1) {
    SPY_DOMAINS.splice(index, 1);
    console.log(`Removed spy domain: ${domain}`);
  }
}

/**
 * Gets the current list of spy domains
 * @returns {Array} - Array of spy domains
 */
function getSpyDomains() {
  return [...SPY_DOMAINS]; // Return a copy to prevent external modification
}

module.exports = {
  extractReferrerDomain,
  isSpyDomain,
  analyzeReferrer,
  addSpyDomain,
  removeSpyDomain,
  getSpyDomains,
};
