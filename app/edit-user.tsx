// app/admin/edit-user.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const EditUser = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const snapshot = await getDoc(doc(db, "users", id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
        setActive(data.active);
      } else {
        Alert.alert("Error", "User not found");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const handleUpdateUser = async () => {
    if (!id) return;
    if (!name || !email || !role) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", id), {
        name,
        email,
        role,
        active,
      });
      Alert.alert("✅ Success", "User updated successfully!");
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/manage-users");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Failed", "Could not update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>✏️ Edit User</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role (student/admin)"
        value={role}
        onChangeText={setRole}
      />

      <TouchableOpacity
        style={[styles.button, saving && { backgroundColor: "#9CA3AF" }]}
        onPress={handleUpdateUser}
        disabled={saving}
      >
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Update User"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/manage-users");
          }
        }}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
