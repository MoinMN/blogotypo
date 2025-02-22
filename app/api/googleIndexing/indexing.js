import { google } from "googleapis";
import path from "path";

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
    const KEY_FILE_PATH = path.join(process.cwd(), "utils/blog-448108-91f144bc0833.json");

    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const indexingUrl = "https://indexing.googleapis.com/v3/urlNotifications:publish";

    const response = await fetch(indexingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });

    const data = await response.json();
    return res.status(200).json({ success: "Indexing request sent", data });
  } catch (error) {
    console.error("Google Indexing Error:", error);
    return res.status(500).json({ error: "Failed to request indexing" });
  }
}
