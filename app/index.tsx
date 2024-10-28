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
    const timer = setTimeout(() => {
      setIsLayoutMounted(true);
    }, 100); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLayoutMounted && !loading) {
      if (user) {
        router.replace('/(root)/language'); 
      } else {
        router.replace('/sign-in');
      }
    }
  }, [isLayoutMounted, loading, user, router]);

  if (loading || !isLayoutMounted) {
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
