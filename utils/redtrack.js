const axios = require("axios");

/**
 * Triggers redTrack API to get a unique tracking ID (rtkcid)
 * @param {string} domain - The domain name (e.g., "hello-world.com")
 * @param {string} campaignId - The campaign ID from redTrack
 * @returns {Promise<string>} - The unique tracking ID (rtkcid)
 */
async function triggerRedTrack(domain, campaignId) {
  try {
    // Build the correct RedTrack URL based on the actual RedTrack code
    // Format: https://trk.benefithelptoday.com/{campaignId}?format=json
    const redTrackUrl = `https://trk.benefithelptoday.com/${campaignId}?format=json`;

    // Make request to RedTrack to get the clickid (rtkcid)
    console.log(`Calling RedTrack: ${redTrackUrl}`);
    const response = await axios.get(redTrackUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; API-Client/1.0)",
        Accept: "application/json, text/json, */*",
      },
    });

    console.log("✅ RedTrack call successful");
    console.log("📝 RedTrack response:", response.data);

    // Extract clickid from JSON response
    let rtkcid = null;

    if (response.data && response.data.clickid) {
      rtkcid = response.data.clickid;
      console.log(`🎯 Found rtkcid (clickid): ${rtkcid}`);
    } else {
      console.log("❌ No clickid found in RedTrack response");
      rtkcid = "";
    }

    if (!rtkcid) {
      console.log(
        "No rtkcid found in RedTrack response, returning empty string"
      );
      return "";
    }

    return rtkcid;
  } catch (error) {
    console.error("Error triggering redTrack:", error.message);
    console.log("RedTrack failed, returning empty string");
    return "";
  }
}

module.exports = {
  triggerRedTrack,
};
