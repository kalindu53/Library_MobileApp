// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={homeStyles.container}>
      <StatusBar style="auto" />

      <TouchableOpacity
        style={homeStyles.ctaButton}
        onPress={() => router.push("/login")}
      >
        <Text style={homeStyles.ctaButtonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={homeStyles.registerButton}
      >
        <Text style={homeStyles.registerLink}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  ctaButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerButton: {
    paddingVertical: 10,
  },
  registerLink: {
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
