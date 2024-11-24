import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, ActivityIndicator, TextInput,  Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { MaterialIcons } from '@expo/vector-icons';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from "../context/auth";
import { useLanguageLearning } from "../app/(root)/languagecontext";

const functions = getFunctions();
const getCards = httpsCallable(functions, 'getCards');
const addCard = httpsCallable(functions, 'addCard');
const saveDeckProgress = httpsCallable(functions, 'saveDeckProgress');
const getDeckProgress = httpsCallable(functions, 'getDeckProgress');
interface ReviewProps {
  deckId: string;
  onBack: () => void;
}

interface CardItem {
  id?: string;
  id?: string;
  targetSentence: string;
  targetWord: string;
  answerSentence: string;
  answerWord: string;
}

interface ProgressStats {
  total: number;
  correct: number;
  incorrect: number;
  remaining: number;
  percentage: number;
}

interface ProgressStats {
  total: number;
  correct: number;
  incorrect: number;
  remaining: number;
  percentage: number;
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
  const { selectedLanguage, learningPreferences } = useLanguageLearning();
  const [generatingCards, setGeneratingCards] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const cardSize = Math.min(screenWidth - 40, 400);
  const { user } = useAuth();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [progress, setProgress] = useState<ProgressStats>({
    total: 0,
    correct: 0,
    incorrect: 0,
    remaining: 0,
    percentage: 0
  });
  const [sessionResults, setSessionResults] = useState<{
    cardId: string;
    correct: boolean;
  }[]>([]);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      // First fetch the cards
      const result = await getCards({ deckId });
      const data = result.data as { cards: CardItem[] };
      setCards(data.cards || []);
  
      // Then fetch progress data
      const progressResult = await getDeckProgress({ deckId });
      console.log("PRogress result", progressResult);
      const progressData = progressResult.data.progress;
  
      if (progressData?.results && data.cards.length > 0) {
        // Get the most recent result for each card
        const cardResults = new Map();
        progressData.results.forEach((result: any) => {
          cardResults.set(result.cardId, {
            correct: result.correct,
            timestamp: result.timestamp
          });
        });
  
        // Count correct and incorrect based on most recent attempts
        let correctCount = 0;
        let incorrectCount = 0;
  
        data.cards.forEach(card => {
          if (card.id) {
            const result = cardResults.get(card.id);
            if (result) {
              if (result.correct) {
                correctCount++;
              } else {
                incorrectCount++;
              }
            }
          }
        });
  
        setProgress({
          total: data.cards.length,
          correct: correctCount,
          incorrect: incorrectCount,
          remaining: data.cards.length - (correctCount + incorrectCount),
          percentage: Math.round((correctCount / data.cards.length) * 100)
        });
      } else {
        // Initialize progress with zero completions
        setProgress({
          total: data.cards.length,
          correct: 0,
          incorrect: 0,
          remaining: data.cards.length,
          percentage: 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update handleSwipe to handle progress updates more accurately
  const handleSwipe = async (cardIndex: number, isCorrect: boolean) => {
    const card = cards[cardIndex];
    console.log("card index", cardIndex)
    console.log("card" , card)
    console.log("cardID", card.id)
    console.log("Cards:", cards)
    if (!card.id) return;
  
    try {
      // Save progress to backend
      await saveDeckProgress({
        deckId,
        cardId: card.id,
        correct: isCorrect
      });
  
      // Update local session results
      setSessionResults(prev => [...prev, {
        cardId: card.id!,
        correct: isCorrect
      }]);
  
      // Keep track of which cards have been answered this session
      const answeredThisSession = new Set(sessionResults.map(result => result.cardId));
  
      // Check if this card was already answered in this session
      if (!answeredThisSession.has(card.id)) {
        // Only update the progress if it's the first time answering this card in this session
        setProgress(prev => {
          return {
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
            remaining: prev.remaining - 1,
            percentage: Math.round(((isCorrect ? prev.correct + 1 : prev.correct) / prev.total) * 100)
          };
        });
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };
   const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCards({ deckId });
      const data = result.data as { cards: CardItem[] };
      setCards(data.cards || []);
      setProgress(prev => ({
        ...prev,
        total: data.cards.length,
        remaining: data.cards.length
      }));
      await fetchProgress(); // Fetch existing progress after cards are loaded
      // First fetch the cards
      const result = await getCards({ deckId });
      const data = result.data as { cards: CardItem[] };
      setCards(data.cards || []);
  
      // Then fetch progress data
      const progressResult = await getDeckProgress({ deckId });
      console.log("PRogress result", progressResult);
      const progressData = progressResult.data.progress;
  
      if (progressData?.results && data.cards.length > 0) {
        // Get the most recent result for each card
        const cardResults = new Map();
        progressData.results.forEach((result: any) => {
          cardResults.set(result.cardId, {
            correct: result.correct,
            timestamp: result.timestamp
          });
        });
  
        // Count correct and incorrect based on most recent attempts
        let correctCount = 0;
        let incorrectCount = 0;
  
        data.cards.forEach(card => {
          if (card.id) {
            const result = cardResults.get(card.id);
            if (result) {
              if (result.correct) {
                correctCount++;
              } else {
                incorrectCount++;
              }
            }
          }
        });
  
        setProgress({
          total: data.cards.length,
          correct: correctCount,
          incorrect: incorrectCount,
          remaining: data.cards.length - (correctCount + incorrectCount),
          percentage: Math.round((correctCount / data.cards.length) * 100)
        });
      } else {
        // Initialize progress with zero completions
        setProgress({
          total: data.cards.length,
          correct: 0,
          incorrect: 0,
          remaining: data.cards.length,
          percentage: 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update handleSwipe to handle progress updates more accurately
  const handleSwipe = async (cardIndex: number, isCorrect: boolean) => {
    const card = cards[cardIndex];
    console.log("card index", cardIndex)
    console.log("card" , card)
    console.log("cardID", card.id)
    console.log("Cards:", cards)
    if (!card.id) return;
  
    try {
      // Save progress to backend
      await saveDeckProgress({
        deckId,
        cardId: card.id,
        correct: isCorrect
      });
  
      // Update local session results
      setSessionResults(prev => [...prev, {
        cardId: card.id!,
        correct: isCorrect
      }]);
  
      // Keep track of which cards have been answered this session
      const answeredThisSession = new Set(sessionResults.map(result => result.cardId));
  
      // Check if this card was already answered in this session
      if (!answeredThisSession.has(card.id)) {
        // Only update the progress if it's the first time answering this card in this session
        setProgress(prev => {
          return {
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
            remaining: prev.remaining - 1,
            percentage: Math.round(((isCorrect ? prev.correct + 1 : prev.correct) / prev.total) * 100)
          };
        });
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };
useEffect(() => {
useEffect(() => {
    fetchCards();
}, []);
const handleAddWord = async () => {
  if (!newWord.trim() || !selectedLanguage) return;
  
  setGeneratingCards(true);
  setGenerationProgress(0);
  
  try {
    // Generate multiple cards for the same word
    const result = await addCard({
      userId: user?.uid,
      deckId,
      answerWord: newWord,
      language: selectedLanguage,
      preferences: {
        proficiencyLevel: learningPreferences.proficiencyLevel,
        learningStyle: learningPreferences.learningStyle,
        generateRelated: true // Flag to generate related cards
      }
    });
    
    console.log('Cards added:', result);
    setShowInput(false);
    setNewWord('');
    fetchCards();
    
    Alert.alert(
      'Success',
      'Generated multiple practice cards for your word!',
      [{ text: 'OK' }]
    );
  } catch (err: any) {
    console.error('Error adding cards:', err);
    Alert.alert(
      'Error',
      'Failed to generate cards. Please try again.'
    );
  } finally {
    setGeneratingCards(false);
  }
};
const handleAddWord = async () => {
  if (!newWord.trim() || !selectedLanguage) return;
  
  setGeneratingCards(true);
  setGenerationProgress(0);
  
  try {
    // Generate multiple cards for the same word
    const result = await addCard({
      userId: user?.uid,
      deckId,
      answerWord: newWord,
      language: selectedLanguage,
      preferences: {
        proficiencyLevel: learningPreferences.proficiencyLevel,
        learningStyle: learningPreferences.learningStyle,
        generateRelated: true // Flag to generate related cards
      }
    });
    
    console.log('Cards added:', result);
    setShowInput(false);
    setNewWord('');
    fetchCards();
    
    Alert.alert(
      'Success',
      'Generated multiple practice cards for your word!',
      [{ text: 'OK' }]
    );
  } catch (err: any) {
    console.error('Error adding cards:', err);
    Alert.alert(
      'Error',
      'Failed to generate cards. Please try again.'
    );
  } finally {
    setGeneratingCards(false);
  }
};
  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <View style={[styles.header, { height: headerHeight }]}>
        <Text onPress={onBack} style={[styles.backButton, { color: Colors.dark.tint }]}>
          ← Back
        </Text>
        <Text style={[styles.deckTitle, { color: Colors.dark.text }]}>Deck {deckId}</Text>
      </View>

      {/* Progress Display */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {progress.percentage}% Complete
        </Text>
        <Text style={styles.progressDetails}>
          Correct: {progress.correct} | Incorrect: {progress.incorrect} | Remaining: {progress.remaining}
        </Text>
        <Text style={[styles.deckTitle, { color: Colors.dark.text }]}>Deck {deckId}</Text>
      </View>

      {/* Progress Display */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {progress.percentage}% Complete
        </Text>
        <Text style={styles.progressDetails}>
          Correct: {progress.correct} | Incorrect: {progress.incorrect} | Remaining: {progress.remaining}
        </Text>
      </View>

      {/* Progress Display */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {progress.percentage}% Complete
        </Text>
        <Text style={styles.progressDetails}>
          Correct: {progress.correct} | Incorrect: {progress.incorrect} | Remaining: {progress.remaining}
        </Text>
      </View>

      {/* Progress Display */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {progress.percentage}% Complete
        </Text>
        <Text style={styles.progressDetails}>
          Correct: {progress.correct} | Incorrect: {progress.incorrect} | Remaining: {progress.remaining}
        </Text>
      </View>

      {/* Progress Display */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {progress.percentage}% Complete
        </Text>
        <Text style={styles.progressDetails}>
          Correct: {progress.correct} | Incorrect: {progress.incorrect} | Remaining: {progress.remaining}
        </Text>
      </View>

      {/* Keep existing Add Card UI */}
      {!showInput ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Word</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Enter a word to learn (we'll create multiple practice cards)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a word"
            placeholderTextColor="#AAA"
            value={newWord}
            onChangeText={setNewWord}
          />
          
          {generatingCards && (
            <View style={styles.progressContainer}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.progressText}>
                Generating your practice cards...
              </Text>
            </View>
          )}

          
          {generatingCards && (
            <View style={styles.progressContainer}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.progressText}>
                Generating your practice cards...
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                generatingCards && styles.disabledButton
              ]}
              onPress={handleAddWord}
              disabled={generatingCards}
              style={[
                styles.confirmButton,
                generatingCards && styles.disabledButton
              ]}
              onPress={handleAddWord}
              disabled={generatingCards}
            >
              <Text style={styles.confirmButtonText}>
                Generate Practice Cards
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowInput(false)}
              disabled={generatingCards}
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
            onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, true)}
            onSwipedRight={(cardIndex) => handleSwipe(cardIndex, false)}
            onSwipedAll={() => {
              console.log('Session complete');
              console.log('Session results:', sessionResults);
            }}
            onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, true)}
            onSwipedRight={(cardIndex) => handleSwipe(cardIndex, false)}
            onSwipedAll={() => {
              console.log('Session complete');
              console.log('Session results:', sessionResults);
            }}
            containerStyle={styles.swiperContainer}
            cardStyle={styles.cardContainer}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    inputLabel: {
    color: '#FFF',
    marginBottom: 8,
    fontSize: 14,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressText: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 14,
  },
  progressDetails: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressText: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 14,
  },
  progressDetails: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
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