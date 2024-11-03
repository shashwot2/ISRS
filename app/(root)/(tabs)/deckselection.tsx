import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const decks = [
  { title: 'Deck 1' },
  { title: 'Deck 2' },
  { title: 'Deck 3' },
];

export default function DeckSelection() {
  return (
    <View style={styles.carousel}>
    <Carousel
      width={width * 0.6}
      height={500}
      data={decks}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      )}
      style={styles.carousel}
      pagingEnabled={true} 
    />
    <Pressable onPress={() => {}}>
        <Text>Custom Word</Text>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    alignSelf: 'center',
    paddingVertical: 100,
  },
  card: {
    backgroundColor: '#414143',
    borderRadius: 15,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
