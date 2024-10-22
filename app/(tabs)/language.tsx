import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const languages = [
  "Mandarin Chinese", "Spanish", "English", "Hindi", "Arabic",
  "Bengali", "Portuguese", "Russian", "Japanese", "Punjabi",
  "German", "Javanese", "Korean", "French", "Telugu",
  "Vietnamese", "Turkish", "Tamil", "Urdu", "Italian",
  "Thai", "Persian", "Polish", "Gujarati", "Ukrainian",
  "Malayalam", "Kannada", "Marathi", "Burmese", "Swahili",
  "Dutch", "Greek", "Czech", "Swedish", "Romanian",
  "Hebrew", "Hungarian", "Tagalog", "Indonesian", "Danish",
  "Finnish", "Norwegian", "Slovak", "Croatian", "Bulgarian",
  "Lithuanian", "Slovenian", "Latvian", "Estonian", "Serbian"
];

const getCountryCode = (language: string) => {
  const countryMap = {
    "Mandarin Chinese": "CN", "Spanish": "ES", "English": "GB", "Hindi": "IN", "Arabic": "SA",
    "Bengali": "BD", "Portuguese": "PT", "Russian": "RU", "Japanese": "JP", "Punjabi": "IN",
    "German": "DE", "Javanese": "ID", "Korean": "KR", "French": "FR", "Telugu": "IN",
    "Vietnamese": "VN", "Turkish": "TR", "Tamil": "IN", "Urdu": "PK", "Italian": "IT",
    "Thai": "TH", "Persian": "IR", "Polish": "PL", "Gujarati": "IN", "Ukrainian": "UA",
    "Malayalam": "IN", "Kannada": "IN", "Marathi": "IN", "Burmese": "MM", "Swahili": "TZ",
    "Dutch": "NL", "Greek": "GR", "Czech": "CZ", "Swedish": "SE", "Romanian": "RO",
    "Hebrew": "IL", "Hungarian": "HU", "Tagalog": "PH", "Indonesian": "ID", "Danish": "DK",
    "Finnish": "FI", "Norwegian": "NO", "Slovak": "SK", "Croatian": "HR", "Bulgarian": "BG",
    "Lithuanian": "LT", "Slovenian": "SI", "Latvian": "LV", "Estonian": "EE", "Serbian": "RS"
  };
  return (countryMap as { [key: string]: string })[language] || "UN"; // Default to UN flag if not found
};

export default function LanguageSelectionScreen() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>I want to learn...</Text>
        {languages.map((lang, index) => (
          <TouchableOpacity key={index} style={styles.languageButton}>
            <Image
              style={styles.flag}
              source={{ uri: `https://flagsapi.com/${getCountryCode(lang)}/flat/64.png` }}
            />
            <View style={styles.languageNameContainer}>
              <Text style={styles.languageName} numberOfLines={1} ellipsizeMode="tail">
                {lang}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5F5DC', // Beige background
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  flag: {
    width: 150, 
    height: 80, 
    borderRadius: 30,
    marginRight: 10,
  },
  languageNameContainer: {
    height: 80, 
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
  },
});