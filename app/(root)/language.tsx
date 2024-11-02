import { router } from 'expo-router';
import { useLanguageLearning } from './languagecontext';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

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
  return (countryMap as { [key: string]: string })[language] || "UN";
};

export default function LanguageSelectionScreen() {
  const { setSelectedLanguage } = useLanguageLearning();

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    router.push('/form');
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>I want to learn...</Text>
        {languages.map((lang, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.languageButton}
            onPress={() => handleLanguageSelect(lang)}
          >
            <Image
              style={styles.flag}
              source={{ uri: `https://flagsapi.com/${getCountryCode(lang)}/flat/64.png` }}
            />
            <Text style={styles.languageName}>{lang}</Text>
            <View style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5F5DC', // Keeping the beige background
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
    color: '#333',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flag: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  chevron: {
    paddingHorizontal: 8,
  },
  chevronText: {
    fontSize: 24,
    color: '#CCCCCC',
    fontWeight: '600',
  }
});