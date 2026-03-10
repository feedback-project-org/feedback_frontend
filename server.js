/* eslint-disable no-console */
const express = require("express");
const path = require("path");

const app = express();

const buildDir = path.join(__dirname, "build");
const port = Number(process.env.PORT) || 3000;

// Runtime env injection for CRA (usable on Azure App Service)
// Set these in Azure App Service -> Configuration -> Application settings
// - PRIMARY_API
// - FALLBACK_API
app.get("/env.js", (req, res) => {
  const primary = process.env.PRIMARY_API || "";
  const fallback = process.env.FALLBACK_API || "";

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  res.end(
    `window.__ENV__ = window.__ENV__ || {};
window.__ENV__.PRIMARY_API = ${JSON.stringify(primary)};
window.__ENV__.FALLBACK_API = ${JSON.stringify(fallback)};
`
  );
});

// Serve the built React app
app.use(express.static(buildDir));

// SPA fallback (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
