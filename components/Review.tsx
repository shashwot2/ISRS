import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { MaterialIcons } from '@expo/vector-icons';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from "../context/auth";

const functions = getFunctions();
const getCards = httpsCallable(functions, 'getCards');
const addCard = httpsCallable(functions, 'addCard');
interface ReviewProps {
  deckId: string;
  onBack: () => void;
}

interface CardItem {
  targetSentence: string;
  targetWord: string;
  answerSentence: string;
  answerWord: string;
}

const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

const HighlightedText: React.FC<{
  sentence: string;
  word: string;
  textColor: string;
}> = ({ sentence, word, textColor }) => {
  const parts = sentence.split(new RegExp(`(${word})`, 'gi'));

  return (
    <Text style={[styles.cardText, { color: textColor }]}>
      {parts.map((part, index) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <Text key={index} style={styles.highlightedWord}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};

const FlippableCard: React.FC<{ 
  item: CardItem;
  width: number;
  height: number;
}> = ({ item, width, height }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isCopyActive, setIsCopyActive] = useState(false);

  const handleIconPress = (
    e: any, 
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    e.stopPropagation();
    setter(prev => !prev);
  };

  return (
    <Pressable 
      style={[styles.card, { width, height }]}
      onPress={() => setIsFlipped(!isFlipped)}
    >
      <Pressable
        onPress={(e) => handleIconPress(e, setIsStarred)}
        style={styles.starIcon}
      >
        <MaterialIcons 
          name={isStarred ? "star" : "star-outline"}
          size={24} 
          color={isStarred ? '#F7F0E0' : Colors.dark.icon}
        />
      </Pressable>

      <View style={styles.textContainer}>
        <HighlightedText
          sentence={isFlipped ? item.answerSentence : item.targetSentence}
          word={isFlipped ? item.answerWord : item.targetWord}
          textColor={Colors.dark.icon}
        />
      </View>

      <View style={styles.bottomIcons}>
        <Pressable
          onPress={(e) => handleIconPress(e, setIsAudioActive)}
        >
          <MaterialIcons 
            name="volume-up" 
            size={24} 
            color={isAudioActive ? '#F7F0E0' : Colors.dark.icon}
          />
        </Pressable>
        <Pressable
          onPress={(e) => handleIconPress(e, setIsCopyActive)}
        >
          <MaterialIcons 
            name="content-copy" 
            size={24} 
            color={isCopyActive ? '#F7F0E0' : Colors.dark.icon}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

const Review: React.FC<ReviewProps> = ({ deckId, onBack }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const headerHeight = 100;
  const cardSize = Math.min(screenWidth - 40, 400);
  const { user } = useAuth();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newWord, setNewWord] = useState('');

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
        const result = await getCards({ deckId });
        const data = result.data as { cards: CardItem[] };
        setCards(data.cards || []);
        console.log('Fetched cards:', data.cards); // Debug log
        console.log('Cards:', cards);
    } catch (err: any) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again later.');
    } finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    fetchCards();
}, []);
  const handleAddCard = async () => {
    if (!newWord.trim()) return; // Avoid empty submissions
    try {
      const result = await addCard({
        userId: user?.uid,
        deckId,
        answerWord: newWord, // Pass the new word
        language: "Chinese",
      });
      console.log('Card added:', result);
      setShowInput(false);
      setNewWord('');
      fetchCards();
    } catch (err: any) {
      
      console.error('Error adding card:', err);
      setError('Failed to add card. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <View style={[styles.header, { height: headerHeight }]}>
        <Text onPress={onBack} style={[styles.backButton, { color: Colors.dark.tint }]}>
          ← Back
        </Text>
        <Text style={[styles.deckTitle, { color: Colors.dark.text }]}>Deck {deckId} </Text>
      </View>

      {!showInput ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(true)}
        >
          <Text style={styles.addButtonText}>+ Add Card</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter a word"
            placeholderTextColor="#AAA"
            value={newWord}
            onChangeText={(text) => setNewWord(text)}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleAddCard}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowInput(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? (
        <Text style={styles.addButtonText}>Loading...</Text>
      ) : cards.length === 0 ? (
        <Text style={styles.addButtonText}>No cards</Text>
      ) : (
        <View style={styles.swiperContainer}>
          <Swiper
            cards={cards}
            renderCard={(card) => (
              <FlippableCard item={card} width={cardSize} height={cardSize} />
            )}
            cardIndex={0}
            backgroundColor={Colors.dark.background}
            stackSize={3}
            stackSeparation={15}
            animateOverlayLabelsOpacity
            animateCardOpacity
            overlayLabels={{
              left: {
                title: 'CORRECT',
                style: {
                  label: {
                    backgroundColor: '#4CAF50',
                    color: Colors.dark.text,
                    fontSize: 24,
                    borderRadius: 8,
                    padding: 10,
                  },
                },
              },
              right: {
                title: 'INCORRECT',
                style: {
                  label: {
                    backgroundColor: '#FF3B30',
                    color: Colors.dark.text,
                    fontSize: 24,
                    borderRadius: 8,
                    padding: 10,
                  },
                },
              },
            }}
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => console.log('Correct on card:', cardIndex)}
            onSwipedRight={(cardIndex) => console.log('Incorrect on card:', cardIndex)}
            onSwipedAll={() => console.log('All cards completed')}
            containerStyle={styles.swiperContainer}
            cardStyle={styles.cardContainer}
          />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  backButton: {
    fontSize: 18,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  swiperContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#2D2D2D',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    justifyContent: 'space-between',
  },
  starIcon: {
    alignSelf: 'flex-end',
  },
  textContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'left',
    lineHeight: 32,
  },
  highlightedWord: {
    color: Colors.dark.tint,
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#5A9',
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#555',
    color: '#FFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFF',
  },
});

export default Review;