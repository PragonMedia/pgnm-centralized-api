const axios = require("axios");

/**
 * Triggers redTrack API to get a unique tracking ID (rtkcid)
 * @param {string} domain - The domain name (e.g., "hello-world.com")
 * @param {string} campaignId - The campaign ID from redTrack
 * @returns {Promise<string>} - The unique tracking ID (rtkcid)
 */
async function triggerRedTrack(
  domain,
  campaignId,
  query = "",
  ua = "",
  ip = ""
) {
  try {
    // Build the RedTrack URL with proper query parameter handling
    let redTrackUrl;
    if (query && query.trim() !== "") {
      // Ensure query starts with ? if it doesn't already
      const normalizedQuery = query.startsWith("?") ? query : `?${query}`;
      redTrackUrl = `https://trk.${domain}/${campaignId}${normalizedQuery}&format=json`;
    } else {
      redTrackUrl = `https://trk.${domain}/${campaignId}?format=json`;
    }

    // Prepare headers
    const headers = {
      "User-Agent": ua || "Mozilla/5.0 (compatible; API-Client/1.0)",
      Accept: "application/json, text/json, */*",
    };

    // Add X-Forwarded-For header only if IP exists
    if (ip && ip.trim() !== "") {
      headers["X-Forwarded-For"] = ip;
    }

    // Make request to RedTrack to get the clickid (rtkcid)
    console.log(`Calling RedTrack: ${redTrackUrl}`);
    console.log(`Headers:`, headers);

    const response = await axios.get(redTrackUrl, { headers });

    console.log("✅ RedTrack call successful");
    console.log("�� RedTrack response:", response.data);

    // Extract clickid from JSON response
    let rtkcid = "";
    if (response.data && response.data.clickid) {
      rtkcid = response.data.clickid;
      console.log(`🎯 Found rtkcid (clickid): ${rtkcid}`);
    } else {
      console.log("❌ No clickid found in RedTrack response");
    }

    return rtkcid;
  } catch (error) {
    console.error("Error triggering redTrack:", error.message);
    console.log("RedTrack failed, returning empty string");
    return "";
  }
}

module.exports = { triggerRedTrack };
