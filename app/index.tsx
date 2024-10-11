import React, { useState } from "react";
import { Text, View, TextInput, Button, ActivityIndicator } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFireBaseConfig } from "@/hooks/useFirebase";

const app = initializeApp(getFireBaseConfig());
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default function Index() {
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://getdecks-lnzzppfnpq-uc.a.run.app');
      const json = await response.json();
      console.log(json)
      setData(json);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
    } catch (err) {
      setError("Failed to sign up. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
        {isLogin ? "Login" : "Sign Up"}
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
      />

      {!isLogin && (
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
        />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {error && <Text style={{ color: "red", marginBottom: 20 }}>{error}</Text>}
      
      <Button
        title={isLogin ? "Login" : "Sign Up"}
        onPress={isLogin ? handleLogin : handleSignup}
      />

      <Text
        style={{ marginTop: 20, textAlign: "center", color: "blue" }}
        onPress={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </Text>
      <Button title="Fetch Data" onPress={fetchData} />
      {data && (
        <View>
          <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>
            Deck Name: {data[0].deckName}
          </Text>
          <Text>Deck ID: {data.id}</Text>
          <FlatList
            data={data[0].cards}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ marginVertical: 5 }}>Card: {item}</Text>
            )}
          />
        </View>
      )}
    </View>
  );
}
