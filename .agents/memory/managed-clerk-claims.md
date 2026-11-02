---
name: Managed Clerk claim limits
description: Limits encountered when inspecting session claims in a Replit-managed accountless Clerk tenant.
---

Clerk CLI secret-key authentication for an unclaimed, Replit-managed accountless application cannot read or patch the `session` configuration key. Explicit `--instance dev` targeting is also rejected because the secret already identifies the instance.

**Why:** The CLI reports a restricted supported-key list for accountless applications, and the official Replit documentation describes the tenant's token claims as Replit-managed. This is not solved by changing app code or by repeatedly trying dashboard-only configuration APIs.

**How to apply:** Verify real Development session JWTs for both migrated and new users. Distinguish correct effective-ID behavior from an exact template-format requirement; if the latter cannot be satisfied with supported managed tools, report that limitation and seek approval rather than claiming it was configured. Do not claim the application, replace managed keys, or convert to external Clerk as a workaround.
