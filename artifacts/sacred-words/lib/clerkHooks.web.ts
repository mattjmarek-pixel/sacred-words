// Use the same module entry as ClerkRoot.web. Mixing Expo's CommonJS hooks
// with React's ES module provider creates two Clerk contexts in Metro.
export { useAuth, useUser } from "@clerk/react";
