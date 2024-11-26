import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { useLanguageLearning } from "../../../context/languagecontext";
import { useAuth } from "../../../context/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  Brain,
  Clock,
  Target,
  Lightbulb,
  Zap,
  BarChart2,
  Settings,
  Calendar,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Repeat,
  LogOut,
  Edit2,
} from "lucide-react-native";
import { EditProfileModal } from "./editavatar";


// Types
interface MemoryMetric {
  title: string;
  value: number;
  total: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface LearningItem {
  id: number;
  word: string;
  translation: string;
  nextReview: string;
  stage: number;
  confidence: number;
  context?: string;
}

interface Deck {
  id: string;
  cards: any[];
}

interface ProgressResult {
  data?: {
    progress?: {
      results: Array<{
        correct: boolean;
        targetWord?: string;
        answerWord?: string;
        reviewCount?: number;
        context?: string;
        timestamp: string;
      }>;
    };
  };
}

type Styles = {
  container: ViewStyle;
  centerContent: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
  header: ViewStyle;
  profileInfo: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  levelBadge: ViewStyle;
  levelText: TextStyle;
  username: TextStyle;
  userEmail: TextStyle;
  userLevel: TextStyle;
  statsContainer: ViewStyle;
  statItem: ViewStyle;
  statDivider: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubtitle: TextStyle;
  memoryCard: ViewStyle;
  cardHeader: ViewStyle;
  memoryInfo: ViewStyle;
  memoryTitle: TextStyle;
  memoryDescription: TextStyle;
  memoryProgress: TextStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  reviewSection: ViewStyle;
  reviewCard: ViewStyle;
  reviewContent: ViewStyle;
  wordContainer: ViewStyle;
  word: TextStyle;
  translation: TextStyle;
  context: TextStyle;
  reviewTime: TextStyle;
  stageIndicator: ViewStyle;
  stageText: TextStyle;
  confidenceBar: ViewStyle;
  confidenceFill: ViewStyle;
  learningInsights: ViewStyle;
  insightCard: ViewStyle;
  insightHeader: ViewStyle;
  insightTitle: TextStyle;
  insightValue: TextStyle;
  actionButtons: ViewStyle;
  actionButton: ViewStyle;
  actionButtonText: TextStyle;
  logoutButton: ViewStyle;
  logoutButtonText: TextStyle;
  editAvatarButton: ViewStyle;
};

export default function ProfileScreen() {

  // get language and user data from context
  const { selectedLanguage } = useLanguageLearning();
  const { user, updateProfile } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Firebase data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [progress, setProgress] = useState<{
    correct: number;
    total: number;
    cards: any[];
  }>({ correct: 0, total: 0, cards: [] });

  const functions = getFunctions();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get user preferences
        const checkPreferences = httpsCallable(functions, 'checkUserPreferences');
        const preferencesResult = await checkPreferences();
        setUserPreferences(preferencesResult.data);

        // Get user's decks
        const getDecks = httpsCallable(functions, 'getDecks');
        const decksResult = await getDecks({language: selectedLanguage});
        const userDecks = decksResult.data as Deck[];
        setDecks(userDecks);

        // Get progress for each deck
        const progressPromises = userDecks.map(async (deck: Deck) => {
          const getDeckProgress = httpsCallable(functions, 'getDeckProgress');
          return getDeckProgress({ deckId: deck.id }) as Promise<ProgressResult>;
        });
        const progressResults = await Promise.all(progressPromises);
        
        // Calculate total progress
        const totalProgress = {
          correct: 0,
          total: 0,
          cards: [] as any[],
        };

        // Calculate total progress from all decks
        progressResults.forEach((result) => {
          if (result.data?.progress?.results) {
            totalProgress.correct += result.data.progress.results
              .filter(r => r.correct).length;
            totalProgress.total += result.data.progress.results.length;
            totalProgress.cards.push(...result.data.progress.results);
          }
        });

        setProgress(totalProgress);

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  // Helper functions
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "Guest";
  };

  // Generate avatar URL based on user data
  const getAvatarUrl = () => {
    return `https://api.dicebear.com/7.x/${
      user?.avatarStyle || "avataaars"
    }/png?seed=${user?.email || "guest"}`;
  };

  // Update user profile data
  const handleStyleChange = async (style: string) => {
    try {
      await updateProfile({ avatarStyle: style });
    } catch (error) {
      console.error("Error updating avatar style:", error);
    }
  };

  // Update user display name
  const handleDisplayNameChange = async (name: string) => {
    try {
      await updateProfile({ displayName: name });
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  // Calculate metrics based on Firebase data
  const calculateMemoryMetrics = (): MemoryMetric[] => {
    const totalWords = decks.reduce((acc, deck) => acc + (deck.cards?.length || 0), 0);
    const correctAnswers = progress.correct;
    const totalAttempts = progress.total || 1;
    
    return [
      {
        title: "Long-term Memory",
        value: correctAnswers,
        total: totalAttempts,
        color: "#4CAF50",
        icon: <Brain size={24} />,
        description: "Words successfully stored in long-term memory",
      },
      {
        title: "Active Learning",
        value: totalWords,
        total: Math.max(totalWords, 100),
        color: "#2196F3",
        icon: <Zap size={24} />,
        description: "Words currently in active learning phase",
      },
      {
        title: "Progress Rate",
        value: totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0,
        total: 100,
        color: "#FF9800",
        icon: <TrendingUp size={24} />,
        description: "Overall learning progress rate",
      },
    ];
  };

  // Calculate upcoming reviews based on Firebase data
  const calculateUpcomingReviews = (): LearningItem[] => {
    if (!progress.cards || progress.cards.length === 0) return [];

    return progress.cards
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(0, 3)
      .map((card, index) => ({
        id: index + 1,
        word: card.targetWord || "",
        translation: card.answerWord || "",
        nextReview: "Upcoming",
        stage: card.reviewCount || 1,
        confidence: card.correct ? 0.8 : 0.4,
        context: card.context || "Practice",
      }));
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const memoryMetrics = calculateMemoryMetrics();
  const upcomingReviews = calculateUpcomingReviews();
  const retentionRate = progress.total > 0 
    ? Math.round((progress.correct / progress.total) * 100) 
    : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: getAvatarUrl() }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Edit2 size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                {userPreferences?.proficiencyLevel?.charAt(0) || "B1"}
              </Text>
            </View>
          </View>
          <Text style={styles.username}>{getDisplayName()}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userLevel}>
            {userPreferences?.proficiencyLevel || "Intermediate"} • {selectedLanguage}
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Brain size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{retentionRate}%</Text>
          <Text style={styles.statLabel}>Retention</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Target size={24} color="#2196F3" />
          <Text style={styles.statValue}>
            {progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <BookOpen size={24} color="#FF9800" />
          <Text style={styles.statValue}>
            {decks.reduce((acc, deck) => acc + (deck.cards?.length || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
      </View>

      {/* Memory Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Memory Progress</Text>
        <Text style={styles.sectionSubtitle}>Track your learning journey</Text>
        {memoryMetrics.map((metric, index) => (
          <View key={index} style={styles.memoryCard}>
            <View style={styles.cardHeader}>
              {React.cloneElement(metric.icon as React.ReactElement, {
                color: metric.color,
              })}
              <View style={styles.memoryInfo}>
                <Text style={styles.memoryTitle}>{metric.title}</Text>
                <Text style={styles.memoryDescription}>
                  {metric.description}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(metric.value / metric.total) * 100}%`,
                    backgroundColor: metric.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.memoryProgress}>
              {metric.value} / {metric.total}
            </Text>
          </View>
        ))}
      </View>

      {/* Learning Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Insights</Text>
        <Text style={styles.sectionSubtitle}>Your learning patterns</Text>
        <View style={styles.learningInsights}>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Clock size={24} color="#4CAF50" />
              <Text style={styles.insightTitle}>Study Pattern</Text>
            </View>
            <Text style={styles.insightValue}>
              {userPreferences?.studyPattern || "Daily"}
            </Text>
          </View>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#2196F3" />
              <Text style={styles.insightTitle}>Learning Style</Text>
            </View>
            <Text style={styles.insightValue}>
              {userPreferences?.learningStyle || "Visual"}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <BarChart2 size={24} color="#333" />
          <Text style={styles.actionButtonText}>Detailed Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Settings size={24} color="#333" />
          <Text style={styles.actionButtonText}>Learning Settings</Text>
        </TouchableOpacity>
      </View>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        currentStyle={user?.avatarStyle || "avataaars"}
        onStyleChange={handleStyleChange}
        onDisplayNameChange={handleDisplayNameChange}
        displayName={user?.displayName || user?.email?.split("@")[0] || "Guest"}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFD700",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  levelText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  userLevel: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#eee",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  memoryCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  memoryInfo: {
    marginLeft: 10,
    flex: 1,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  memoryDescription: {
    fontSize: 12,
    color: "#666",
  },
  memoryProgress: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  reviewSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  reviewCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  reviewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  wordContainer: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  translation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  context: {
    fontSize: 12,
    color: "#999",
  },
  reviewTime: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  stageIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  stageText: {
    fontSize: 12,
    color: "#666",
  },
  confidenceBar: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  learningInsights: {
    flexDirection: "row",
    gap: 10,
  },
  insightCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    color: "#666",
  },
  insightValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFEBEE",
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#D32F2F",
  },
  editAvatarButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#333',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});