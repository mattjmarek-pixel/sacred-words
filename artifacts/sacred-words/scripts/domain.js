"use strict";

function parseDomain(domain) {
  const trimmedDomain = domain.trim();
  const url = new URL(/^https?:\/\//i.test(trimmedDomain) ? trimmedDomain : `https://${trimmedDomain}`);
  return {
    host: url.host,
    hostname: url.hostname.toLowerCase(),
  };
}

function getDeploymentDomain(env = process.env) {
  const isProductionBuild =
    env.SACRED_WORDS_BUILD_TARGET === "production" ||
    env.NODE_ENV === "production" ||
    env.EAS_BUILD_PROFILE === "production";

  if (isProductionBuild) {
    const productionDomain =
      env.EXPO_PUBLIC_DOMAIN?.trim() || env.REPLIT_INTERNAL_APP_DOMAIN?.trim();
    if (!productionDomain) {
      throw new Error(
        "EXPO_PUBLIC_DOMAIN or REPLIT_INTERNAL_APP_DOMAIN must be set to the published backend host for production/TestFlight builds.",
      );
    }

    const { host, hostname } = parseDomain(productionDomain);
    const devHostname = env.REPLIT_DEV_DOMAIN
      ? parseDomain(env.REPLIT_DEV_DOMAIN).hostname
      : null;
    if (hostname.endsWith(".replit.dev") || hostname === devHostname) {
      throw new Error("Production/TestFlight builds cannot use REPLIT_DEV_DOMAIN.");
    }

    return host;
  }

  if (env.REPLIT_INTERNAL_APP_DOMAIN) {
    return parseDomain(env.REPLIT_INTERNAL_APP_DOMAIN).host;
  }

  if (env.REPLIT_DEV_DOMAIN) {
    return parseDomain(env.REPLIT_DEV_DOMAIN).host;
  }

  if (env.EXPO_PUBLIC_DOMAIN) {
    return parseDomain(env.EXPO_PUBLIC_DOMAIN).host;
  }

  throw new Error("No deployment domain found. Set REPLIT_INTERNAL_APP_DOMAIN, REPLIT_DEV_DOMAIN, or EXPO_PUBLIC_DOMAIN.");
}

module.exports = { getDeploymentDomain };
