import React, { createContext, useContext, useState } from 'react';

// interface for language learning context
interface LanguageLearningContext {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  learningPreferences: {
    motivation: string;      // why the user wants to learn
    studyPattern: string;    // when/how often they study
    learningPace: string;    // preferred speed of learning
    proficiencyLevel: string;// current language skill level
    learningStyle: string;   // visual, auditory, etc.
    age: string;            // user's age group
    goal: string;           // specific learning objectives
    notifications: boolean;  // enable/disable notifications
    dailyReminder: boolean; // daily study reminders
    speakingPractice: boolean; // speaking exercise preferences
  };
  setLearningPreferences: (prefs: any) => void;
}

const LanguageLearningContext = createContext<LanguageLearningContext | undefined>(undefined);

export function LanguageLearningProvider({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [learningPreferences, setLearningPreferences] = useState({
    motivation: '',
    studyPattern: '',
    learningPace: '',
    proficiencyLevel: '',
    learningStyle: '',
    age: '',
    goal: '',
    notifications: true,
    dailyReminder: true,
    speakingPractice: true,
  });

  // provide context values to children components
  return (
    <LanguageLearningContext.Provider 
      value={{ 
        selectedLanguage, 
        setSelectedLanguage,
        learningPreferences,
        setLearningPreferences
      }}
    >
      {children}
    </LanguageLearningContext.Provider>
  );
}

// custom hook to consume the language learning context
export function useLanguageLearning() {
  const context = useContext(LanguageLearningContext);
  if (context === undefined) {
    throw new Error('useLanguageLearning must be used within a LanguageLearningProvider');
  }
  return context;
}