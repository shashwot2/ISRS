import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Pressable, 
  Image, 
  ViewStyle, 
  TextStyle, 
  ImageStyle,
  ScrollView,
  Platform
} from 'react-native';

interface AvatarStyle {
  id: string;
  name: string;
  url: string;
  category: 'Human' | 'Abstract' | 'Animal' | 'Pixel' | 'Custom';
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentStyle: string;
  onStyleChange: (style: string) => void;
  onDisplayNameChange: (name: string) => void;
  displayName: string;
}

const avatarStyles: AvatarStyle[] = [
  // Human-like Avatars
  { id: 'avataaars', name: 'Cartoon', url: 'avataaars', category: 'Human' },
  { id: 'bigSmile', name: 'Big Smile', url: 'big-smile', category: 'Human' },
  { id: 'funEmoji', name: 'Fun Emoji', url: 'fun-emoji', category: 'Human' },
  { id: 'openPeeps', name: 'Open Peeps', url: 'open-peeps', category: 'Human' },
  { id: 'micah', name: 'Micah', url: 'micah', category: 'Human' },
  { id: 'bigEars', name: 'Big Ears', url: 'big-ears', category: 'Human' },
  { id: 'bigEarsNeutral', name: 'Big Ears Neutral', url: 'big-ears-neutral', category: 'Human' },
  { id: 'adventurer', name: 'Adventurer', url: 'adventurer', category: 'Human' },
  { id: 'adventurerNeutral', name: 'Adventurer Neutral', url: 'adventurer-neutral', category: 'Human' },

  // Abstract/Robot Avatars
  { id: 'bottts', name: 'Robots', url: 'bottts', category: 'Abstract' },
  { id: 'shapes', name: 'Shapes', url: 'shapes', category: 'Abstract' },
  { id: 'rings', name: 'Rings', url: 'rings', category: 'Abstract' },

  // Animal Avatars
  { id: 'thumbs', name: 'Thumbs', url: 'thumbs', category: 'Animal' },
  { id: 'lorelei', name: 'Lorelei', url: 'lorelei', category: 'Animal' },
  { id: 'notionists', name: 'Notionists', url: 'notionists', category: 'Animal' },

  // Pixel Art
  { id: 'identicon', name: 'Identicon', url: 'identicon', category: 'Pixel' },
  { id: 'initials', name: 'Initials', url: 'initials', category: 'Pixel' }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  currentStyle,
  onStyleChange,
  onDisplayNameChange,
  displayName,
}) => {
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [selectedCategory, setSelectedCategory] = useState<string>('Human');

  const categories = ['Human', 'Abstract', 'Animal', 'Pixel'];

  const handleSave = () => {
    onDisplayNameChange(newDisplayName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalLabel}>Display Name</Text>
          <TextInput
            style={styles.modalInput}
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            placeholder="Enter display name"
            placeholderTextColor="#999"
          />

          <Text style={styles.modalLabel}>Avatar Style</Text>
          
          {/* Category Selection */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScrollView}
          >
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Avatar Styles Grid */}
          <ScrollView style={styles.avatarStylesScroll}>
            <View style={styles.avatarStylesContainer}>
              {avatarStyles
                .filter(style => style.category === selectedCategory)
                .map((style) => (
                  <Pressable
                    key={style.id}
                    style={[
                      styles.avatarStyleOption,
                      currentStyle === style.id && styles.selectedAvatarStyle
                    ]}
                    onPress={() => onStyleChange(style.id)}
                  >
                    <Image
                      source={{ 
                        uri: `https://api.dicebear.com/7.x/${style.url}/png?seed=${displayName}` 
                      }}
                      style={styles.avatarStylePreview}
                    />
                    <Text style={styles.avatarStyleName}>{style.name}</Text>
                  </Pressable>
                ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#666',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  categoryScrollView: {
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedCategory: {
    backgroundColor: '#333',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  avatarStylesScroll: {
    maxHeight: 400,
  },
  avatarStylesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  avatarStyleOption: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedAvatarStyle: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#f0f0f0',
  },
  avatarStylePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  avatarStyleName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});