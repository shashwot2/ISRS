import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch } from 'react-native';

interface SelectionGroupProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

interface SwitchOptionProps {
  title: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  description?: string;
}

type PreferenceOption = string;

export default function LearningPreferencesForm() {
  // Original state
  const [motivation, setMotivation] = useState<PreferenceOption>('');
  const [studyPattern, setStudyPattern] = useState<PreferenceOption>('');
  const [learningPace, setLearningPace] = useState<PreferenceOption>('');

  // New state for additional features
  const [proficiencyLevel, setProficiencyLevel] = useState<PreferenceOption>('');
  const [learningStyle, setLearningStyle] = useState<PreferenceOption>('');
  const [age, setAge] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [dailyReminder, setDailyReminder] = useState<boolean>(true);
  const [speakingPractice, setSpeakingPractice] = useState<boolean>(true);

  const motivations: PreferenceOption[] = [
    "Work & Career",
    "Travel",
    "Cultural Interest",
    "Family & Friends",
    "Academic Study",
    "Personal Growth"
  ];

  const studyPatterns: PreferenceOption[] = [
    "Daily Practice",
    "Few Times a Week",
    "Weekends Only",
    "Flexible Schedule"
  ];

  const learningPaces: PreferenceOption[] = [
    "Casual (15min/day)",
    "Regular (30min/day)",
    "Intensive (1hr/day)",
    "Immersive (2+hrs/day)"
  ];

  const proficiencyLevels: PreferenceOption[] = [
    "Complete Beginner",
    "Basic Understanding",
    "Intermediate",
    "Advanced"
  ];

  const learningStyles: PreferenceOption[] = [
    "Visual Learner",
    "Audio Learner",
    "Reading & Writing",
    "Interactive Practice"
  ];

  const SwitchOption: React.FC<SwitchOptionProps> = ({ title, value, onToggle, description }) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchHeader}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#333' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      </View>
      {description && (
        <Text style={styles.switchDescription}>{description}</Text>
      )}
    </View>
  );

  const SelectionGroup: React.FC<SelectionGroupProps> = ({ title, options, selected, onSelect }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selected === option && styles.selectedOption
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.optionText,
              selected === option && styles.selectedOptionText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Customize Your Learning Journey</Text>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Your Target Goal</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Order food in Spanish by next month"
            value={goal}
            onChangeText={setGoal}
            multiline
          />
        </View>
        
        <SelectionGroup
          title="Why are you learning a language?"
          options={motivations}
          selected={motivation}
          onSelect={setMotivation}
        />

        <SelectionGroup
          title="What's your current level?"
          options={proficiencyLevels}
          selected={proficiencyLevel}
          onSelect={setProficiencyLevel}
        />

        <SelectionGroup
          title="How do you learn best?"
          options={learningStyles}
          selected={learningStyle}
          onSelect={setLearningStyle}
        />

        <SelectionGroup
          title="How often do you plan to study?"
          options={studyPatterns}
          selected={studyPattern}
          onSelect={setStudyPattern}
        />

        <SelectionGroup
          title="Choose your learning pace"
          options={learningPaces}
          selected={learningPace}
          onSelect={setLearningPace}
        />

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Your Age (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.shortInput]}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SwitchOption
            title="Enable Notifications"
            value={notifications}
            onToggle={setNotifications}
            description="Get important updates about your learning progress"
          />
          <SwitchOption
            title="Daily Reminders"
            value={dailyReminder}
            onToggle={setDailyReminder}
            description="Remind me to practice at my chosen time"
          />
          <SwitchOption
            title="Speaking Practice"
            value={speakingPractice}
            onToggle={setSpeakingPractice}
            description="Include speaking exercises in my lessons"
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            (motivation && studyPattern && learningPace) ? styles.continueButtonActive : {}
          ]}
          disabled={!motivation || !studyPattern || !learningPace}
        >
          <Text style={styles.continueButtonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5F5DC',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    width: '100%',
  },
  section: {
    marginBottom: 25,
    width: '100%', 
  },
  inputSection: {
    marginBottom: 25,
    width: '100%',
  },
  preferencesSection: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  shortInput: {
    width: 120, 
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    width: '48%', 
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
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  switchContainer: {
    marginBottom: 15,
    width: '100%',
  },
  switchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#999',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    width: '100%', 
  },
  continueButtonActive: {
    backgroundColor: '#333',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
});