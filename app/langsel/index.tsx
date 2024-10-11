import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid, TouchableOpacity } from 'react-native';

export default function langSel() {
  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progress}>
          <Text style={styles.progressText}>progress</Text>
          {/* Simulated progress bar */}
          <ProgressBarAndroid styleAttr="Horizontal" color="#000" indeterminate={false} progress={0.5} />
        </View>
        <View style={styles.progress}>
          <Text style={styles.progressText}>accuracy</Text>
          <ProgressBarAndroid styleAttr="Horizontal" color="#000" indeterminate={false} progress={0.7} />
        </View>
      </View>

      {/* Card with Sentence */}
      <View style={styles.card}>
        <Text style={styles.cardText}>Un pequeño zorro marrón saltó sobre el <Text style={styles.highlight}>perro</Text> perezoso.</Text>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          {/* Copy Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>📋</Text>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>⭐</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f3ef',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progress: {
    marginBottom: 10,
  },
  progressText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#383838',
    padding: 20,
    borderRadius: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  highlight: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#565656',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});


