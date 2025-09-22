// app/profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
};

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // TODO: replace with logged-in user's ID from Firebase Auth
  const userId = "testUserId";

  const fetchUser = async () => {
    try {
      setLoading(true);
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUser({ id: snap.id, ...snap.data() } as User);
      } else {
        Alert.alert("Error", "User not found");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: user.name,
        email: user.email,
      });
      Alert.alert("✅ Success", "Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Failed", "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No user profile found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#3B82F6" />
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={(val) => setUser({ ...user, name: val })}
              placeholder="Enter name"
            />
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={(val) => setUser({ ...user, email: val })}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, { color: user.active ? "#10B981" : "#EF4444" }]}>
          {user.active ? "Active" : "Inactive"}
        </Text>
      </View>

      {editing ? (
        <TouchableOpacity
          style={[styles.saveBtn, saving && { backgroundColor: "#9CA3AF" }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>{saving ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditing(true)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

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
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  email: { fontSize: 16, color: "#6B7280" },
  infoCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  value: { fontSize: 16, color: "#111827", marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    width: "100%",
    backgroundColor: "#F9FAFB",
    fontSize: 16,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#6B7280",
    padding: 12,
    borderRadius: 8,
  },
  backText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 6 },
});
