import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import Review from '../../../components/Review';
import { useAuth } from "../../../context/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from 'firebase/auth';

const functions = getFunctions();
const getDecks = httpsCallable(functions, 'getDecks');
const addDeck = httpsCallable(functions, 'addDeck');

interface Deck {
    id: string;
    name: string;
    description?: string;
}

const DeckComponent: React.FC<{ deck: Deck; onPress: () => void }> = ({ deck, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.deck}>
            <Text style={styles.deckIDText}>{deck.name}</Text>
            <Text style={styles.deckText}>{}</Text>
            <Text style={styles.deckText}>{deck.description}</Text>
        </TouchableOpacity>
    );
};

const DeckSelection: React.FC = () => {
    const { user } = useAuth();
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newDeckName, setNewDeckName] = useState<string>('');
    const [newDeckDiscription, setNewDeckDiscription] = useState<string>('');

    const fetchDecks = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getDecks();
            const data = result.data as any[];
            setDecks(
                data.map((deck) => ({
                    id: deck.id,
                    name: deck.deckName,
                    description: deck.description,
                }))
            );
        } catch (err: any) {
            console.error("Error fetching decks:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDeck = async () => {
        if (!newDeckName.trim()) {
            alert("Deck name cannot be empty.");
            return;
        }
    
        const newDeckData = {
            userId: user?.uid, // Ensure user is logged in
            deckName: newDeckName, // Required
            description: "Default description", // Required
            tags: ["default"], // Must be an array
            isShared: false, // Optional, default to false
            sharedWith: [], // Optional, default to empty array
            isAiGenerated: false, // Optional, default to false
            cards: [], // Optional, default to empty array
        };
    
        console.log("Payload to addDeck:", newDeckData);
    
        try {
            const result = await addDeck(newDeckData);
            console.log("Deck added:", result.data); // Success response
            setNewDeckName('');
            setNewDeckDiscription('');
            setIsModalVisible(false);
            fetchDecks(); // Refresh the deck list
        } catch (err: any) {
            console.error("Error adding deck:", err);
            alert("Failed to add deck. Please try again.");
        }
    };
    useEffect(() => {
        fetchDecks();
    }, []);

    if (selectedDeckId) {
        return <Review deckId={selectedDeckId} onBack={() => setSelectedDeckId(null)} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Deck Selection</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : (
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
            )}

            {/* Add Deck Button */}
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Deck</Text>
            </TouchableOpacity>

            {/* Modal for Input */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>\
                        <Text>Enter Deck Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Deck Name"
                            value={newDeckName}
                            onChangeText={setNewDeckName}
                        />
                        <Text>Deck Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Deck Description"
                            value={newDeckDiscription}
                            onChangeText={setNewDeckDiscription}
                        />
                        <Button title="Confirm" onPress={handleAddDeck} />
                        <Button title="Cancel" color="red" onPress={() => setIsModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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
    deckIDText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    deckText: {
        fontSize: 16,
        color: '#FFF',
    },
    addButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#5A9',
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default DeckSelection;
