// app/admin/add-user.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const AddUser = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // student | admin
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async () => {
    if (!name || !email || !role) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "users"), {
        name,
        email,
        role,
        active: true,
        createdAt: Timestamp.now(),
      });
      Alert.alert("✅ Success", "User added successfully!");

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/adminDashboard");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Failed", "Could not add user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👤 Add New User</Text>

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
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Role (student/admin)"
        value={role}
        onChangeText={setRole}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddUser}
        disabled={isLoading}
      >
        <Ionicons name="person-add-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {isLoading ? "Saving..." : "Save User"}
        </Text>
      </TouchableOpacity>

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
    </ScrollView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
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
