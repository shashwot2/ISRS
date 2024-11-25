import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpsCallable } from "firebase/functions";
import { functions } from './firebaseConfig';

// initializes deck for new users via firebase cloud function
const initializeDeck = async () => {
  try {
    const initDeck = httpsCallable(functions, "initDeck");
    const result = await initDeck();
    console.log("deck initialized:", result.data);
  } catch (error) {
    console.error("error initializing deck:", error);
  }
};

// maps firebase auth error codes to user-friendly messages
const getAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    // login error cases
    case AuthErrorCodes.INVALID_EMAIL:
      return 'invalid email address format';
    case AuthErrorCodes.USER_DELETED:
      return 'no account exists with this email';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'incorrect password';
    case AuthErrorCodes.USER_DISABLED:
      return 'this account has been disabled';
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'too many failed attempts. please try again later';
    
    // signup error cases
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'an account already exists with this email';
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'password should be at least 6 characters';
    case AuthErrorCodes.OPERATION_NOT_ALLOWED:
      return 'email/password sign up is not enabled';
    
    // network error case
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return 'network connection failed. please check your internet';
    
    default:
      return 'an unexpected error occurred. please try again';
  }
};

// validates email format using regex
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'email is required';
  if (!emailRegex.test(email)) return 'please enter a valid email address';
  return null;
};

// validates password meets minimum requirements
const validatePassword = (password: string) => {
  if (!password) return 'password is required';
  if (password.length < 6) return 'password must be at least 6 characters';
  if (!/\d/.test(password)) return 'password must contain at least one number';
  if (!/[a-zA-Z]/.test(password)) return 'password must contain at least one letter';
  return null;
};

// main signin/signup component
export default function SignIn () {
  // hooks for managing auth state and navigation
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // handles user login attempt
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    // validate input fields
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      // attempt firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      login(userCredential.user);
      router.replace('/(root)/language');
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      console.log('login error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  // handles new user signup
  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    // validate input fields
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // check password confirmation matches
    if (password !== confirmPassword) {
      setError('passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // create new firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      login(userCredential.user);
      initializeDeck(); // setup initial deck for new user
      router.replace('/(root)/language');
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      console.log('signup error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  // ui rendering
  return (
    <View style={styles.container}>
      <Text style={styles.title}>engrave</Text>
      <Text style={styles.subtitle}>{isLogin ? 'login' : 'sign up'}</Text>

      {/* email input field */}
      <TextInput
        placeholder='email'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* password input field */}
      <TextInput
        placeholder='password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* confirm password field for signup */}
      {!isLogin && (
        <TextInput
          placeholder='confirm password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      )}

      {/* loading indicator */}
      {loading && <ActivityIndicator size='large' color='#0000ff' />}

      {/* error message display */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* submit button */}
      <Pressable
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignup}
      >
        <Text style={styles.buttonText}>
          {isLogin ? 'log in' : 'sign up'}
        </Text>
      </Pressable>

      {/* toggle between login/signup */}
      <Text
        style={styles.switchText}
        onPress={() => {
          setIsLogin(!isLogin);
          setError(null);
        }}
      >
        {isLogin
          ? "don't have an account? sign up"
          : 'already have an account? login'}
      </Text>
    </View>
  );
}

// styles for component ui elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F0E0',
  },
  title: {
    fontSize: 55,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4A4A4A',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 5,
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
});