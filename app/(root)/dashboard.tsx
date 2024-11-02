import React from 'react';
import { useLanguageLearning } from './languagecontext';
import { View, Text, StyleSheet } from 'react-native';

export default function Dashboard() {
    const { selectedLanguage, learningPreferences } = useLanguageLearning();
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Hello, welcome!</Text>
        <Text style={styles.text}>Learning {selectedLanguage}</Text>
        <Text style={styles.text}>Motivation: {learningPreferences.motivation}</Text>
    </View>
    );
};

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
