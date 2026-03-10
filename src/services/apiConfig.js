const runtimeEnv =
	typeof window !== "undefined" && window.__ENV__ ? window.__ENV__ : {};

export const PRIMARY_API =
	runtimeEnv.PRIMARY_API ||
	"https://feedback-backend-api-aka8badabnczabgj.centralindia-01.azurewebsites.net";

export const FALLBACK_API =
	runtimeEnv.FALLBACK_API || "https://feedback-backend.onrender.com";

export const REQUEST_TIMEOUT_MS = 10000;
