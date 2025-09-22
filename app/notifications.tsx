// app/notifications.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase";

type Notification = {
  id?: string;
  title: string;
  message: string;
  userId: string;
  createdAt?: any;
};

const Notifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual logged-in user's ID from Auth
  const userId = "testUser";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Notification[];
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifMessage}>{item.message}</Text>
              <Text style={styles.notifDate}>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : ""}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No notifications yet
          </Text>
        }
      />

      {/* Back to Dashboard */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/dashboard");
          }
        }}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
    elevation: 1,
  },
  notifTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  notifMessage: { fontSize: 14, color: "#374151", marginTop: 2 },
  notifDate: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
