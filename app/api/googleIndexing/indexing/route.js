import { google } from "googleapis";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const SCOPES = ["https://www.googleapis.com/auth/indexing"];

    // Load service account credentials from environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
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

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `Indexing request failed: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ success: true, message: "Indexing request sent", data }, { status: 200 });
  } catch (error) {
    console.error("Google Indexing Error:", error);
    return Response.json({ error: "Failed to request indexing", details: error.message }, { status: 500 });
  }
}
