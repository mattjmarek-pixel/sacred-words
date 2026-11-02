const { getDefaultConfig } = require("expo/metro-config");
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = getDefaultConfig(__dirname);
// Keep browser API requests same-origin so Clerk's session cookie is sent.
// Native builds use the absolute API domain and Clerk bearer tokens instead.
config.server.enhanceMiddleware = (middleware) => {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (!domain) return middleware;
  const api = createProxyMiddleware({
    target: `https://${domain}`,
    changeOrigin: true,
    pathFilter: "/api",
  });
  return (req, res, next) => api(req, res, () => middleware(req, res, next));
};

module.exports = config;
