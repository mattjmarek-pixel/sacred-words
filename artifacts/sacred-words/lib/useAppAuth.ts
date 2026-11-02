import { useAuth, useUser } from "@/lib/clerkHooks";
import { useRouter, type Href } from "expo-router";

// App-facing identity only: no local sessions or identity-fetching context.
export function useAppAuth() {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();
  return {
    user: user ? {
      id: user.externalId ?? user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.imageUrl,
    } : null,
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded,
    login: () => router.push("/sign-in" as Href),
    logout: async () => {
      await signOut();
      router.replace("/");
    },
  };
}
