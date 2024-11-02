import React, { createContext, useContext, useState } from 'react';

interface LanguageLearningContext {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  learningPreferences: {
    motivation: string;
    studyPattern: string;
    learningPace: string;
    proficiencyLevel: string;
    learningStyle: string;
    age: string;
    goal: string;
    notifications: boolean;
    dailyReminder: boolean;
    speakingPractice: boolean;
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

export function useLanguageLearning() {
  const context = useContext(LanguageLearningContext);
  if (context === undefined) {
    throw new Error('useLanguageLearning must be used within a LanguageLearningProvider');
  }
  return context;
}

