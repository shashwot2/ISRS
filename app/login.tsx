import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import { getFireBaseConfig } from "@/hooks/useFirebase";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
const app = initializeApp(getFireBaseConfig());
export const auth = getAuth(app);

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

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
  <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F7F0E0"
  }}>
     <Text style ={{ fontSize: 55, marginBottom: 10, textAlign: "center", fontFamily: "Inter_900Black",fontWeight:"Bold", }}>
      Engrave
      </Text>
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
       
       <Pressable
       style={styles.button}
         title={isLogin ? "Login" : "Sign Up"}
         onPress={isLogin ? handleLogin : handleSignup}
       >
       <Text
       style={styles.buttonText}>
       {isLogin? "LOG IN" : "Sign Up"}
       </Text>
       </Pressable>
 
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
 const styles = StyleSheet.create({
   button: {
     backgroundColor: '#4A4A4A', 
     borderRadius: 30, 
     paddingVertical: 10,
     paddingHorizontal: 40,
     alignItems: 'center',
     justifyContent: 'center',
   },
   buttonText: {
     color: '#FFFFFF', // white text color
     fontSize: 16,
     fontWeight: 'bold',
   },
 });