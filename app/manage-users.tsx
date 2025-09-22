// app/admin/manage-users.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";

type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

const ManageUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as User[];
      setUsers(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete user
  const handleDelete = async (id?: string) => {
    if (!id) return;
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "users", id));
            Alert.alert("✅ Deleted", "User removed successfully");
            fetchUsers();
          } catch (error) {
            console.error(error);
            Alert.alert("❌ Failed", "Could not delete user");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userMeta}>{item.email}</Text>
        <Text style={styles.userMeta}>Role: {item.role}</Text>
        <Text
          style={[
            styles.userStatus,
            { color: item.active ? "#10B981" : "#EF4444" },
          ]}
        >
          {item.active ? "Active" : "Inactive"}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#3B82F6" }]}
          onPress={() => router.push(`/edit-user?id=${item.id}`)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#EF4444" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Manage Users</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id!}
          renderItem={renderUser}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No users found
            </Text>
          }
        />
      )}

      {/* Back to Dashboard */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/adminDashboard");
          }
        }}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageUsers;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  userName: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  userMeta: { fontSize: 14, color: "#6B7280" },
  userStatus: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  actions: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
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
