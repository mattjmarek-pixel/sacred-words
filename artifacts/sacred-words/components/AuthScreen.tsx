import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAuth, useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Redirect, useRouter, type Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

export function AuthScreen({ signUpMode = false }: { signUpMode?: boolean }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const verifyingSignUp = signUpMode && signUp.status === "missing_requirements"
    && signUp.unverifiedFields.includes("email_address") && signUp.missingFields.length === 0;
  const verifyingSignIn = !signUpMode
    && (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor");
  const verifying = verifyingSignUp || verifyingSignIn;
  const loading = busy || signInStatus === "fetching" || signUpStatus === "fetching";
  const errors = signUpMode ? signUpErrors : signInErrors;

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try { await action(); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in. Please try again."); }
    finally { setBusy(false); }
  }

  async function finish() {
    const attempt = signUpMode ? signUp : signIn;
    await attempt.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          setError("Your account needs an additional verification step before you can continue.");
          return;
        }
        router.replace("/");
      },
    });
  }

  async function submit() {
    // Read the updated resource after verification, not TS's pre-await narrowing.
    const complete = () => (signUpMode ? signUp.status : signIn.status) === "complete";
    if (verifyingSignUp) {
      const result = await signUp.verifications.verifyEmailCode({ code });
      if (!result.error && complete()) await finish();
    } else if (verifyingSignIn) {
      const result = await signIn.mfa.verifyEmailCode({ code });
      if (!result.error && complete()) await finish();
    } else if (signUpMode) {
      const result = await signUp.password({ emailAddress: email.trim(), password });
      if (!result.error) {
        if (signUp.status === "complete") await finish();
        else await signUp.verifications.sendEmailCode();
      }
    } else {
      const result = await signIn.password({ emailAddress: email.trim(), password });
      if (!result.error) {
        if (signIn.status === "complete") await finish();
        else if (signIn.supportedSecondFactors.some((factor) => factor.strategy === "email_code")) {
          await signIn.mfa.sendEmailCode();
        } else {
          setError("This account requires another verification method. Please use your linked sign-in provider.");
        }
      }
    }
  }

  async function social(strategy: "oauth_google" | "oauth_apple") {
    const result = await startSSOFlow({
      strategy,
      redirectUrl: AuthSession.makeRedirectUri({ scheme: "sacredwords", path: "sign-in" }),
    });
    if (result.createdSessionId && result.setActive) {
      await result.setActive({ session: result.createdSessionId });
      router.replace("/");
    } else {
      setError("Sign-in was not completed. Please try again or use email.");
    }
  }

  if (isSignedIn) return <Redirect href="/" />;
  const messages = [
    error,
    errors.global?.[0]?.message,
    ...Object.values(errors.fields).map((field) => field?.message),
  ].filter(Boolean);
  const inputStyle = [styles.input, { borderColor: c.border, color: c.ink, backgroundColor: c.parchment }];
  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.page, {
      paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40, backgroundColor: c.cream,
    }]} keyboardShouldPersistTaps="handled">
      <Text style={[styles.brand, { color: c.gold }]}>Sacred Words</Text>
      <Text style={[styles.title, { color: c.warmBrown }]}>{verifying ? "Check your email" : signUpMode ? "Create your account" : "Welcome back"}</Text>
      <Text style={[styles.subtitle, { color: c.muted }]}>{verifying ? "Enter the verification code to continue." : "A quiet place for your prayers."}</Text>
      {!verifying && <>
        <Pressable accessibilityRole="button" style={[styles.button, { borderColor: c.border }]} disabled={loading} onPress={() => run(() => social("oauth_apple"))}>
          <Text style={{ color: c.ink }}>Continue with Apple</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={[styles.button, { borderColor: c.border }]} disabled={loading} onPress={() => run(() => social("oauth_google"))}>
          <Text style={{ color: c.ink }}>Continue with Google</Text>
        </Pressable>
        <Text style={[styles.subtitle, { color: c.muted }]}>or continue with email</Text>
        <TextInput accessibilityLabel="Email address" placeholder="Email address" placeholderTextColor={c.muted} autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} style={inputStyle} />
        <TextInput accessibilityLabel="Password" placeholder="Password" placeholderTextColor={c.muted} secureTextEntry autoComplete={signUpMode ? "new-password" : "current-password"} value={password} onChangeText={setPassword} style={inputStyle} />
      </>}
      {verifying && <TextInput accessibilityLabel="Verification code" placeholder="Verification code" placeholderTextColor={c.muted} keyboardType="number-pad" autoComplete="one-time-code" value={code} onChangeText={setCode} style={inputStyle} />}
      {messages.map((message, index) => <Text key={index} accessibilityRole="alert" style={{ color: c.destructive }}>{message}</Text>)}
      <Pressable testID="auth-submit" accessibilityRole="button" style={[styles.button, { backgroundColor: c.gold, borderColor: c.gold }]} disabled={loading || (verifying ? !code : !email || !password)} onPress={() => run(submit)}>
        {loading ? <ActivityIndicator color={c.ink} /> : <Text style={{ color: c.ink, fontFamily: "Lato_700Bold" }}>{verifying ? "Verify" : signUpMode ? "Create account" : "Sign in"}</Text>}
      </Pressable>
      {verifying && <Pressable onPress={() => run(async () => {
        if (signUpMode) await signUp.verifications.sendEmailCode();
        else await signIn.mfa.sendEmailCode();
      })}><Text style={{ color: c.gold }}>Send a new code</Text></Pressable>}
      <Pressable accessibilityRole="link" onPress={() => router.replace((signUpMode ? "/sign-in" : "/sign-up") as Href)}>
        <Text style={[styles.link, { color: c.warmBrown }]}>{signUpMode ? "Already have an account? Sign in" : "New here? Create an account"}</Text>
      </Pressable>
      <Pressable accessibilityRole="link" onPress={() => router.replace("/")}><Text style={[styles.link, { color: c.muted }]}>Continue browsing</Text></Pressable>
      <View nativeID="clerk-captcha" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, paddingHorizontal: 28, gap: 14, justifyContent: "center" },
  brand: { fontFamily: "PlayfairDisplay_600SemiBold", fontSize: 22, textAlign: "center" },
  title: { fontFamily: "PlayfairDisplay_600SemiBold", fontSize: 30, textAlign: "center" },
  subtitle: { fontFamily: "Lato_400Regular", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  button: { borderWidth: 1, borderRadius: 12, minHeight: 52, alignItems: "center", justifyContent: "center" },
  link: { textAlign: "center", paddingVertical: 8 },
});
