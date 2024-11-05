import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Review from '../../../components/ReviewPage';  // Import the Review component

interface Deck {
    id: string;
    name: string;
}

const decks: Deck[] = [
    { id: '1', name: 'Deck 1' },
    { id: '2', name: 'Deck 2' },
    { id: '3', name: 'Deck 3' },
];

const DeckComponent: React.FC<{ deck: Deck; onPress: () => void }> = ({ deck, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.deck}>
            <Text style={styles.deckText}>{deck.name}</Text>
        </TouchableOpacity>
    );
};

const DeckSelection: React.FC = () => {
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

    // If a deck is selected, show the Review screen
    if (selectedDeckId) {
        return <Review deckId={selectedDeckId} onBack={() => setSelectedDeckId(null)} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerText}>Deck Selection</Text>
            <FlatList
                data={decks}
                renderItem={({ item }) => (
                    <DeckComponent 
                        deck={item} 
                        onPress={() => setSelectedDeckId(item.id)} 
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.deckList}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    deckList: {
        alignItems: 'center',
    },
    deck: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: width * 0.1,
        backgroundColor: '#88C0D0',
        borderRadius: 10,
    },
    deckText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },

});

export default DeckSelection;