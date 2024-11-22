import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { MaterialIcons } from '@expo/vector-icons';

interface ReviewProps {
  deckId: string;
  onBack: () => void;
}

interface CardItem {
  id: string;
  targetSentence: string;
  targetWord: string;
  answerSentence: string;
  answerWord: string;
}

const sampleCards: CardItem[] = [
  {
    id: '1',
    targetSentence: 'Un pequeño zorro marrón saltó sobre el perro perezoso.',
    targetWord: 'perro',
    answerSentence: 'A small brown fox jumped over the lazy dog.',
    answerWord: 'dog',
  },
  {
    id: '2',
    targetSentence: 'El gato negro duerme en la ventana.',
    targetWord: 'gato',
    answerSentence: 'The black cat sleeps in the window.',
    answerWord: 'cat',
  },
  {
    id: '3',
    targetSentence: 'El pájaro azul vuela en el cielo.',
    targetWord: 'pájaro',
    answerSentence: 'The blue bird flies in the sky.',
    answerWord: 'bird',
  },
{
  id: '4',
  targetSentence: 'La luna brilla en el cielo nocturno.',
  targetWord: 'luna',
  answerSentence: 'The moon shines in the night sky.',
  answerWord: 'moon',
},
{
  id: '5',
  targetSentence: 'El sol se oculta detrás de las montañas.',
  targetWord: 'sol',
  answerSentence: 'The sun sets behind the mountains.',
  answerWord: 'sun',
},
{
  id: '6',
  targetSentence: 'Las estrellas iluminan la noche.',
  targetWord: 'estrellas',
  answerSentence: 'The stars light up the night.',
  answerWord: 'stars',
},
{
  id: '7',
  targetSentence: 'El río fluye hacia el mar.',
  targetWord: 'río',
  answerSentence: 'The river flows to the sea.',
  answerWord: 'river',
},
{
  id: '8',
  targetSentence: 'La montaña es alta y majestuosa.',
  targetWord: 'montaña',
  answerSentence: 'The mountain is tall and majestic.',
  answerWord: 'mountain',
},
{
  id: '9',
  targetSentence: 'El viento sopla fuerte en la colina.',
  targetWord: 'viento',
  answerSentence: 'The wind blows strong on the hill.',
  answerWord: 'wind',
},
{
  id: '10',
  targetSentence: 'El bosque está lleno de árboles verdes.',
  targetWord: 'bosque',
  answerSentence: 'The forest is full of green trees.',
  answerWord: 'forest',
},
{
  id: '11',
  targetSentence: 'La playa está cubierta de arena dorada.',
  targetWord: 'playa',
  answerSentence: 'The beach is covered with golden sand.',
  answerWord: 'beach',
},
{
  id: '12',
  targetSentence: 'El lago refleja el cielo azul.',
  targetWord: 'lago',
  answerSentence: 'The lake reflects the blue sky.',
  answerWord: 'lake',
},
{
  id: '13',
  targetSentence: 'El desierto es vasto y árido.',
  targetWord: 'desierto',
  answerSentence: 'The desert is vast and arid.',
  answerWord: 'desert',
}
];

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

  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <View style={[styles.header, { height: headerHeight }]}>
        <Text onPress={onBack} style={[styles.backButton, { color: Colors.dark.tint }]}>← Back</Text>
        <Text style={[styles.deckTitle, { color: Colors.dark.text }]}>Deck {deckId}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Card</Text>
        </TouchableOpacity>
      <View style={styles.swiperContainer}>
        <Swiper
          cards={sampleCards}
          renderCard={(card) => (
            <FlippableCard 
              item={card}
              width={cardSize}
              height={cardSize}
            />
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
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -20,
                }
              }
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
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20,
                }
              }
            }
          }}
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => console.log('Correct on card:', cardIndex)}
          onSwipedRight={(cardIndex) => console.log('Incorrect on card:', cardIndex)}
          onSwipedAll={() => console.log('All cards completed')}
          containerStyle={styles.swiperContainer}
          cardStyle={styles.cardContainer}
        />
      </View>
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
});

export default Review;