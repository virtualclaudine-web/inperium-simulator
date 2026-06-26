export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { VITE_SP_TENANT_ID, VITE_SP_CLIENT_ID, VITE_SP_CLIENT_SECRET } = process.env;

  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${VITE_SP_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: VITE_SP_CLIENT_ID,
          client_secret: VITE_SP_CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
        }),
      }
    );
    const data = await response.json();
    if (!data.access_token) return res.status(500).json({ error: "Token failed", detail: data });
    res.status(200).json({ access_token: data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
