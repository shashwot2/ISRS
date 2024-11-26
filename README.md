# Engrave - A Language Learning App

Engrave is a language learning application built with React Native and Firebase, using Expo for streamlined development and deployment. The app provides interactive tools for users to learn new languages, manage their progress, and engage in practice sessions.

## Features

- **User Authentication**
  - Login and Sign-Up functionality using Firebase Authentication.
  - Error handling for user-friendly authentication error messages.
  
- **Language Selection**
  - Users can choose from a wide range of supported languages.
  - Displays country flags for a visually appealing selection experience.
  
- **Flashcard Practice**
  - Flippable flashcards for language practice.
  - Interactive swipe gestures for marking answers as correct or incorrect.
  - Progress tracking and results visualization.

- **Custom Decks**
  - Automatic generation of multiple flashcards for each word using Firebase Functions.

- **Progress Tracking**
  - Tracks total cards, correct, incorrect, and remaining cards.
  - Saves session results to Firebase for long-term progress tracking.

## Technologies Used

- **Frontend**
  - React Native with TypeScript
  - Expo (managed workflow)
  - react-native-deck-swiper for interactive flashcard UI

- **Backend**
  - Firebase Authentication
  - Firebase Firestore for data storage
  - Firebase Functions for backend logic

- **Async Storage**
  - `@react-native-async-storage/async-storage` for local data caching

- **Other Libraries**
  - react-navigation and expo-router for navigation
  - react-native-vector-icons for UI icons

## Installation and Setup

1. **Prerequisites**
   - Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
   - Install the [Expo CLI](https://docs.expo.dev/get-started/installation/):
     ```bash
     npm install -g expo-cli
     ```

2. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/engrave.git
   cd engrave

## Folder Structure


├── app/ \
│   ├── _layout.tsx        # Navigation layout \
│   ├── firebaseConfig.tsx # Firebase configuration \
│   ├── index.tsx          # Entry point \
│   ├── sign-in.tsx        # Authentication screen \
├── components/ 
│   ├── Collapsible.tsx    # Collapsible UI component \
│   ├── ExternalLink.tsx   # Link component \ \
│   ├── Review.tsx         # Flashcard review screen \
│   ├── ThemedText.tsx     # Themed text component \
│   ├── ThemedView.tsx     # Themed view component \
├── constants/ \
│   ├── Colors.ts          # App color theme \
│   ├── sizes.ts           # Size constants \
├── context/ \
│   ├── auth.ts            # Auth context for user state \ \
│   ├── languagecontext.tsx # Language context for preferences \ 
├── hooks/                 # Custom React hooks \ \
├── assets/                # App assets (fonts, images) \
├── scripts/               # Utility scripts

## How It Works

    Authentication
        Firebase Authentication is integrated for user login and sign-up.
        Error codes from Firebase are mapped to user-friendly messages.

    Language Learning
        Users select a language and get redirected to relevant content.
        Flashcards are dynamically generated using Firebase Functions.

    Progress Tracking
        Tracks user interactions with flashcards and updates Firebase with session results.
        Displays progress statistics like percentage completion and total correct answers.

    Deck Management
        Users can add new words to their learning deck.
        Firebase Functions generate practice cards for the new words.


License

This project is licensed under the Apache 2.0 License. See the LICENSE file for details.

Acknowledgments

    Expo for the managed React Native workflow.
    Firebase for the backend infrastructure.
    React Native Deck Swiper for the interactive flashcard UI.

Happy learning with Engrave! 🌏✍️