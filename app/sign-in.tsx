import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getFireBaseConfig } from '@/hooks/useFirebase';
import { useAuth } from '../context/auth';
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(getFireBaseConfig());
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const getAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    // Sign In Errors
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Invalid email address format';
    case AuthErrorCodes.USER_DELETED:
      return 'No account exists with this email';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Incorrect password';
    case AuthErrorCodes.USER_DISABLED:
      return 'This account has been disabled';
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Too many failed attempts. Please try again later';
    
    // Sign Up Errors
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'An account already exists with this email';
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'Password should be at least 6 characters';
    case AuthErrorCodes.OPERATION_NOT_ALLOWED:
      return 'Email/password sign up is not enabled';
    
    // Network Errors
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return 'Network connection failed. Please check your internet';
    
    default:
      return 'An unexpected error occurred. Please try again';
  }
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
  return null;
};


export default function SignIn () {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    // Validate inputs
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.replace('/(root)/language');
      login(userCredential.user);
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      console.log('Login error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.replace('/(root)/language');
      login(userCredential.user);
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      console.log('Signup error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Engrave</Text>
      <Text style={styles.subtitle}>{isLogin ? 'Login' : 'Sign Up'}</Text>

      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {!isLogin && (
        <TextInput
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      )}

      {loading && <ActivityIndicator size='large' color='#0000ff' />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignup}
      >
        <Text style={styles.buttonText}>
          {isLogin ? 'LOG IN' : 'SIGN UP'}
        </Text>
      </Pressable>

      <Text
        style={styles.switchText}
        onPress={() => {
          setIsLogin(!isLogin);
          setError(null);
        }}
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : 'Already have an account? Login'}
      </Text>
    </View>
  );
}

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