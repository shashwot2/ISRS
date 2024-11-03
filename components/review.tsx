import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

interface ReviewProps {
    deckId: string;
    onBack: () => void;
}

interface Card {
    word: string;
    sentence: string;
    definition: string;
}

const initialCards: Card[] = [
    { word: 'Word 1', sentence: 'Sentence 1', definition: 'Definition 1' },
    { word: 'Word 2', sentence: 'Sentence 2', definition: 'Definition 2' },
    { word: 'Word 3', sentence: 'Sentence 3', definition: 'Definition 3' },
    { word: 'Word 4', sentence: 'Sentence 4', definition: 'Definition 4' },
    { word: 'Word 5', sentence: 'Sentence 5', definition: 'Definition 5' },
];

const Review: React.FC<ReviewProps> = ({ deckId, onBack }) => {
    const [cards, setCards] = useState<Card[]>(initialCards);

    // Callback for handling swipes
    const handleSwipeRight = useCallback(() => {
        setCards((prevCards) => prevCards.slice(1)); // Remove the first card
    }, []);

    const handleSwipeLeft = useCallback(() => {
        setCards((prevCards) => {
            const temp = prevCards[0];
            return prevCards.slice(1).concat(temp); // Move the first card to the end
        });
    }, []);

    if (cards.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.completedText}>Deck Completed!</Text>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back to Decks</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.completedText}></Text>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back to Decks</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Review Deck {deckId}</Text>
            
            <Swipeable
                renderRightActions={() => <View style={styles.rightSwipeAction}><Text>Remember</Text></View>}
                renderLeftActions={() => <View style={styles.leftSwipeAction}><Text>Keep Reviewing</Text></View>}
                onSwipeableRightOpen={handleSwipeRight}
                onSwipeableLeftOpen={handleSwipeLeft}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{cards[0].word}</Text>
                    <Text style={styles.cardDescription}>{cards[0].sentence}</Text>
                    <Text style={styles.cardDescription}>{cards[0].definition}</Text>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5FCFF',
    },
    backButton: {
        padding: 10,
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    card: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 14,
    },
    rightSwipeAction: {
        backgroundColor: '#28a745',
        justifyContent: 'center',
        flex: 1,
    },
    leftSwipeAction: {
        backgroundColor: '#dc3545',
        justifyContent: 'center',
        flex: 1,
    },
    completedText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
});

export default Review;
