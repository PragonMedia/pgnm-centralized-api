const express = require("express");
const { triggerRedTrack } = require("../utils/redtrack");
const { db } = require("../database/db");
const { analyzeReferrer } = require("../utils/spy-detector");

const router = express.Router();

// Helper function to extract domain from URL path
function extractDomain(domainName) {
  return domainName.toLowerCase().trim().split("/")[0];
}

// POST /api/domains - Store domain name and campaign ID
router.post("/", async (req, res) => {
  try {
    const { domain, campaignID } = req.body;

    // Validate required fields
    if (!domain || !campaignID) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Both domain and campaignID are required",
      });
    }

    const cleanDomain = extractDomain(domain);

    // Insert or update domain in SQLite
    const insertQuery = `
      INSERT OR REPLACE INTO domains (domain, campaignID, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(insertQuery, [cleanDomain, campaignID], function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          error: "Database error",
          message: "Failed to store domain information",
        });
      }

      res.status(201).json({
        success: true,
        message: "Domain and campaign ID stored successfully",
        data: {
          id: this.lastID,
          domain: cleanDomain,
          campaignID: campaignID,
        },
      });
    });
  } catch (error) {
    console.error("Error in POST /domains:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// POST /api/domains/test - Search domain and trigger redTrack (updated for frontend POST request)
router.post("/test", async (req, res) => {
  try {
    const { domain, query = "", referrer } = req.body;
    // Use referrer from body first, then fall back to headers
    const finalReferrer = referrer || req.get("Referer") || req.get("Referrer");
    const referrerAnalysis = analyzeReferrer(finalReferrer);

    console.log(
      `Referrer: ${referrerAnalysis.referrer || "none"} -> Domain: ${
        referrerAnalysis.referrerDomain || "none"
      } -> Is Spy: ${referrerAnalysis.isSpy}`
    );

    if (!domain) {
      return res.status(400).json({
        error: "Missing required field",
        message: "domain is required in request body",
      });
    }

    const cleanDomain = extractDomain(domain);
    const selectQuery = "SELECT * FROM domains WHERE domain = ?";

    db.get(selectQuery, [cleanDomain], async (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          error: "Database error",
          message: "Failed to search domain",
        });
      }

      if (!row) {
        return res.status(404).json({
          error: "Domain not found",
          message: `No campaign ID found for domain: ${cleanDomain}`,
        });
      }

      try {
        // Extract user agent and IP
        const ua = req.headers["user-agent"] || "";
        const ip = req.headers["x-forwarded-for"] || req.ip || "";

        console.log(`Request details - UA: ${ua}, IP: ${ip}, Query: ${query}`);

        const rtkcid = await triggerRedTrack(
          row.domain,
          row.campaignID,
          query,
          ua,
          ip
        );

        res.json({
          success: true,
          message: "Domain found and redTrack triggered successfully",
          data: {
            domain: row.domain,
            rtkcid: rtkcid,
            past: referrerAnalysis.isSpy,
          },
        });
      } catch (redTrackError) {
        console.error("RedTrack error:", redTrackError);
        res.status(500).json({
          error: "RedTrack error",
          message: "Failed to trigger redTrack",
          data: {
            domain: row.domain,
            past: referrerAnalysis.isSpy,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error in POST /domains/test:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// GET /api/domains - Get all domains (for testing purposes)
router.get("/", async (req, res) => {
  try {
    const selectAllQuery = "SELECT * FROM domains ORDER BY createdAt DESC";

    db.all(selectAllQuery, [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          error: "Database error",
          message: "Failed to retrieve domains",
        });
      }

      res.json({
        success: true,
        data: rows,
      });
    });
  } catch (error) {
    console.error("Error in GET /domains:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// PUT /api/domains/:id - Update domain and campaign ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { domain, campaignID } = req.body;

    // Validate required fields
    if (!domain || !campaignID) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Both domain and campaignID are required",
      });
    }

    const cleanDomain = extractDomain(domain);

    // Update domain in SQLite
    const updateQuery = `
      UPDATE domains 
      SET domain = ?, campaignID = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateQuery, [cleanDomain, campaignID, id], function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          error: "Database error",
          message: "Failed to update domain information",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Domain not found",
          message: `No domain found with ID: ${id}`,
        });
      }

      res.json({
        success: true,
        message: "Domain and campaign ID updated successfully",
        data: {
          id: parseInt(id),
          domain: cleanDomain,
          campaignID: campaignID,
        },
      });
    });
  } catch (error) {
    console.error("Error in PUT /domains/:id:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// DELETE /api/domains/:id - Delete domain and campaign ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete domain from SQLite
    const deleteQuery = "DELETE FROM domains WHERE id = ?";

    db.run(deleteQuery, [id], function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          error: "Database error",
          message: "Failed to delete domain information",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Domain not found",
          message: `No domain found with ID: ${id}`,
        });
      }

      res.json({
        success: true,
        message: "Domain and campaign ID deleted successfully",
        data: {
          id: parseInt(id),
        },
      });
    });
  } catch (error) {
    console.error("Error in DELETE /domains/:id:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

module.exports = router;
