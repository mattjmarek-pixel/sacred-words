import { ClerkProvider, ClerkLoaded } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { useRouter, type Href } from "expo-router";
import type { PropsWithChildren } from "react";
import { useColors } from "@/hooks/useColors";

// Expo substitutes EXPO_PUBLIC_* where Vite uses import.meta.env.VITE_*.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL;

export function ClerkRoot({ children }: PropsWithChildren) {
  const router = useRouter();
  const c = useColors();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
      routerPush={(to) => router.push(to as Href)}
      routerReplace={(to) => router.replace(to as Href)}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to Sacred Words" } },
        signUp: { start: { title: "Create your account", subtitle: "A quiet place for your prayers" } },
      }}
      appearance={{
        options: { logoImageUrl: `${window.location.origin}/logo.svg`, logoLinkUrl: "/", logoPlacement: "inside" },
        variables: {
          colorPrimary: c.gold, colorForeground: c.ink, colorMutedForeground: c.muted,
          colorBackground: c.cream, colorInput: c.parchment, colorInputForeground: c.ink,
          colorDanger: c.destructive, colorNeutral: c.ink,
          fontFamily: "Lato_400Regular, sans-serif", borderRadius: "12px",
        },
        elements: {
          cardBox: { width: "440px", maxWidth: "100%", background: c.cream },
          headerTitle: { color: c.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold, serif" },
          headerSubtitle: { color: c.muted }, formFieldLabel: { color: c.ink },
          socialButtonsBlockButtonText: { color: c.ink }, footerActionLink: { color: c.warmBrown },
          footerActionText: { color: c.muted }, dividerText: { color: c.muted },
        },
      }}
    >
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  );
}
