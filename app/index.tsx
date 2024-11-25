import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  const { user, loading } = useAuth(); 
  const router = useRouter(); 
  const [isLayoutMounted, setIsLayoutMounted] = useState(false); 

  console.log(user); 

  useEffect(() => {
    // set a timer to update isLayoutMounted state after 100ms
    const timer = setTimeout(() => {
      setIsLayoutMounted(true);
    }, 100); 

    // cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // redirect based on user authentication state and layout mount state
    if (isLayoutMounted && !loading) {
      if (user) {
        router.replace('/(root)/language'); // redirect to language page if user is authenticated
      } else {
        router.replace('/sign-in'); // redirect to sign-in page if user is not authenticated
      }
    }
  }, [isLayoutMounted, loading, user, router]);

  if (loading || !isLayoutMounted) {
    //loading screen if still loading or layout is not mounted
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return null; 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});