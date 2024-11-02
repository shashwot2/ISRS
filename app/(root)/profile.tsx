import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Platform,
} from "react-native";
import { useLanguageLearning } from "./languagecontext";
import { useAuth } from "../../context/auth";
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
} from "lucide-react";

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

interface LearningStats {
  retentionRate: number;
  accuracyRate: number;
  totalWords: number;
  averageRecallTime: number;
  implicitConnections: number;
  vocabularyGrowth: number;
}

type Styles = {
  container: ViewStyle;
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
  const { selectedLanguage } = useLanguageLearning();
  const { user, updateProfile } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Generate avatar URL using DiceBear
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${
    user?.email || "guest"
  }&backgroundColor=ffdfbf,ffd5dc,c0aede,bde4f4,b6e3f4&backgroundType=gradientLinear`;

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "Guest";
  };

  const getAvatarUrl = () => {
    return `https://api.dicebear.com/7.x/${
      user?.avatarStyle || "avataaars"
    }/png?seed=${user?.email || "guest"}`;
  };

  const handleStyleChange = async (style: string) => {
    try {
      await updateProfile({ avatarStyle: style });
    } catch (error) {
      console.error("Error updating avatar style:", error);
    }
  };

  const handleDisplayNameChange = async (name: string) => {
    try {
      await updateProfile({ displayName: name });
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  const memoryMetrics: MemoryMetric[] = [
    {
      title: "Long-term Memory",
      value: 245,
      total: 500,
      color: "#4CAF50",
      icon: <Brain size={24} />,
      description: "Words successfully stored in long-term memory",
    },
    {
      title: "Active Learning",
      value: 78,
      total: 100,
      color: "#2196F3",
      icon: <Zap size={24} />,
      description: "Words currently in active learning phase",
    },
    {
      title: "Implicit Connections",
      value: 156,
      total: 200,
      color: "#FF9800",
      icon: <TrendingUp size={24} />,
      description: "Pattern connections formed through context",
    },
  ];

  const upcomingReviews: LearningItem[] = [
    {
      id: 1,
      word: "おはよう",
      translation: "Good morning",
      nextReview: "In 2 hours",
      stage: 3,
      confidence: 0.85,
      context: "Morning greetings",
    },
    {
      id: 2,
      word: "ありがとう",
      translation: "Thank you",
      nextReview: "Tomorrow",
      stage: 2,
      confidence: 0.72,
      context: "Expressions of gratitude",
    },
    {
      id: 3,
      word: "すみません",
      translation: "Excuse me",
      nextReview: "In 3 days",
      stage: 4,
      confidence: 0.91,
      context: "Polite expressions",
    },
  ];

  const learningStats: LearningStats = {
    retentionRate: 87,
    accuracyRate: 92,
    totalWords: 323,
    averageRecallTime: 2.3,
    implicitConnections: 156,
    vocabularyGrowth: 15,
  };

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
              <Text style={styles.levelText}>B1</Text>
            </View>
          </View>
          <Text style={styles.username}>{getDisplayName()}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userLevel}>
            Intermediate • {selectedLanguage}
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Brain size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{learningStats.retentionRate}%</Text>
          <Text style={styles.statLabel}>Retention</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Target size={24} color="#2196F3" />
          <Text style={styles.statValue}>{learningStats.accuracyRate}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <BookOpen size={24} color="#FF9800" />
          <Text style={styles.statValue}>{learningStats.totalWords}</Text>
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

      {/* Upcoming Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review Schedule</Text>
        <Text style={styles.sectionSubtitle}>Upcoming spaced repetitions</Text>
        <View style={styles.reviewSection}>
          {upcomingReviews.map((item, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewContent}>
                <View style={styles.wordContainer}>
                  <Text style={styles.word}>{item.word}</Text>
                  <Text style={styles.translation}>{item.translation}</Text>
                  <Text style={styles.context}>{item.context}</Text>
                </View>
                <View>
                  <View style={styles.stageIndicator}>
                    <Repeat size={16} color="#666" />
                    <Text style={styles.stageText}>Stage {item.stage}</Text>
                  </View>
                  <Text style={styles.reviewTime}>{item.nextReview}</Text>
                </View>
              </View>
              <View style={styles.confidenceBar}>
                <View
                  style={[
                    styles.confidenceFill,
                    { width: `${item.confidence * 100}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Learning Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Insights</Text>
        <Text style={styles.sectionSubtitle}>Your learning patterns</Text>
        <View style={styles.learningInsights}>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Clock size={24} color="#4CAF50" />
              <Text style={styles.insightTitle}>Average Recall Time</Text>
            </View>
            <Text style={styles.insightValue}>
              {learningStats.averageRecallTime}s
            </Text>
          </View>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={24} color="#2196F3" />
              <Text style={styles.insightTitle}>Vocabulary Growth</Text>
            </View>
            <Text style={styles.insightValue}>
              +{learningStats.vocabularyGrowth}/day
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
  reviewCount: {
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
  insightLabel: {
    fontSize: 12,
    color: "#666",
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
