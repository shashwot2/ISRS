import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, SafeAreaView } from 'react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { router } from 'expo-router';
import { useLanguageLearning } from './languagecontext';

interface StepOptionProps {
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

const functions = getFunctions();
const saveUserPreferences = httpsCallable(functions, 'saveOrUpdateUserPreferences');

export default function LearningPreferencesForm() {
  const { selectedLanguage, setLearningPreferences } = useLanguageLearning();
  const [currentStep, setCurrentStep] = useState(0);
  
  // State management
  const [motivation, setMotivation] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('');
  const [learningStyle, setLearningStyle] = useState<string>('');
  const [studyPattern, setStudyPattern] = useState<string>('');
  const [learningPace, setLearningPace] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [notifications, setNotifications] = useState<boolean>(true);

  // Step definitions
  const steps = [
    {
      question: "Why are you learning a language?",
      options: [
        "Work & Career",
        "Travel",
        "Cultural Interest",
        "Family & Friends",
        "Academic Study",
        "Personal Growth"
      ],
      value: motivation,
      setValue: setMotivation
    },
    {
      question: "What's your current level?",
      options: [
        "Complete Beginner",
        "Basic Understanding",
        "Intermediate",
        "Advanced"
      ],
      value: proficiencyLevel,
      setValue: setProficiencyLevel
    },
    {
      question: "How do you learn best?",
      options: [
        "Visual Learner",
        "Audio Learner",
        "Reading & Writing",
        "Interactive Practice"
      ],
      value: learningStyle,
      setValue: setLearningStyle
    },
    {
      question: "How often will you practice?",
      options: [
        "Daily Practice",
        "Few Times a Week",
        "Weekends Only",
        "Flexible Schedule"
      ],
      value: studyPattern,
      setValue: setStudyPattern
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const preferences = {
        motivation,
        proficiencyLevel,
        learningStyle,
        studyPattern,
        notifications,
      };
      setLearningPreferences(preferences);
      try {
        await saveUserPreferences({ preferences });
        console.log('Preferences saved successfully.');
        router.push('/(root)/(tabs)/profile');
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  };

  const StepOption: React.FC<StepOptionProps> = ({ text, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={onSelect}
    >
      <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  const currentStepData = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index <= currentStep ? styles.progressBarActive : {}
            ]}
          />
        ))}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.question}>{currentStepData.question}</Text>

        <View style={styles.optionsContainer}>
          {currentStepData.options.map((option) => (
            <StepOption
              key={option}
              text={option}
              isSelected={currentStepData.value === option}
              onSelect={() => currentStepData.setValue(option)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          currentStepData.value ? styles.continueButtonActive : {}
        ]}
        disabled={!currentStepData.value}
        onPress={handleNext}
      >
        <Text style={styles.continueButtonText}>
          {currentStep === steps.length - 1 ? 'Start Learning' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  progressContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  progressBarActive: {
    backgroundColor: '#333',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#333',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
  },
  continueButton: {
    backgroundColor: '#999',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  continueButtonActive: {
    backgroundColor: '#333',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  }
});