// app/dashboard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Dashboard = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to your library space</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/books")}>
          <Ionicons name="book-outline" size={32} color="#007AFF" />
          <Text style={styles.actionText}>Browse Books</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/borrow-book")}>
          <Ionicons name="library-outline" size={32} color="#34D399" />
          <Text style={styles.actionText}>My Borrowed</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={32} color="#F59E0B" />
          <Text style={styles.actionText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={32} color="#EF4444" />
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* ➡️ Go to Admin Dashboard */}
      <TouchableOpacity
        style={styles.adminBtn}
        onPress={() => router.push("/adminDashboard")}
      >
        <Ionicons name="settings-outline" size={20} color="#fff" />
        <Text style={styles.adminText}>Go to Admin Dashboard</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.push("/login")}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  adminBtn: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563EB", // blue
    paddingVertical: 12,
    borderRadius: 8,
  },
  adminText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },
});
