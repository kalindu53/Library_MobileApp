// app/admin/dashboard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage library resources</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/add_book")}>
          <Ionicons name="book-outline" size={32} color="#10B981" />
          <Text style={styles.actionText}>Add New Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/add-user")}>
          <Ionicons name="person-add-outline" size={32} color="#3B82F6" />
          <Text style={styles.actionText}>Add New User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/manage-books")}>
          <Ionicons name="library-outline" size={32} color="#F59E0B" />
          <Text style={styles.actionText}>Manage Books</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/manage-users")}>
          <Ionicons name="people-outline" size={32} color="#EF4444" />
          <Text style={styles.actionText}>Manage Users</Text>
        </TouchableOpacity>
      </View>

      {/* Reports */}
      <TouchableOpacity style={styles.reportBtn} onPress={() => router.push("/reports")}>
        <Ionicons name="bar-chart-outline" size={20} color="#fff" />
        <Text style={styles.reportText}>View Reports</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdminDashboard;

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
    textAlign: "center",
  },
  reportBtn: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    borderRadius: 8,
  },
  reportText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },
});
