import { SignIn, SignUp } from "@clerk/react";
import { useColors } from "@/hooks/useColors";

export function AuthScreen({ signUpMode = false }: { signUpMode?: boolean }) {
  const c = useColors();
  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: c.cream, padding: 24 }}>
      {signUpMode
        ? <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
        : <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />}
    </div>
  );
}
