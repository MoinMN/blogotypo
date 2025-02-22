import { google } from "googleapis";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const SCOPES = ["https://www.googleapis.com/auth/indexing"];

    // Load service account credentials from environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken(); // ✅ Extract correctly

    // Google Indexing API Endpoint
    const indexingUrl = "https://indexing.googleapis.com/v3/urlNotifications:publish";

    const response = await fetch(indexingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Indexing request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({ success: true, message: "Indexing request sent", data });
  } catch (error) {
    console.error("Google Indexing Error:", error);
    return res.status(500).json({ error: "Failed to request indexing", details: error.message });
  }
}
