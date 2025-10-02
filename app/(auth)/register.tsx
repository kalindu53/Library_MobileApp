import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { register } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPasword] = useState<string>("");
  const [isLodingReg, setIsLoadingReg] = useState<boolean>(false);

  const handleRegister = async () => {
    if (isLodingReg) return;
    setIsLoadingReg(true);
    await register(email, password)
      .then((res) => {
        console.log(res);
        router.back();
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Registration Failed", "Something went wrong");
      })
      .finally(() => {
        setIsLoadingReg(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-blue-600 p-4 rounded-full mb-4">
            <Ionicons name="book" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-blue-600">MyLibrary</Text>
          <Text className="text-gray-500">Create your account</Text>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-3">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Enter your email"
              className="flex-1 px-2 py-3 text-gray-900"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-1">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-3">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Enter your password"
              className="flex-1 px-2 py-3 text-gray-900"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPasword}
            />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className={`p-4 rounded ${isLodingReg ? "bg-gray-400" : "bg-blue-600"}`}
          onPress={handleRegister}
          disabled={isLodingReg}
        >
          {isLodingReg ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">
              Register
            </Text>
          )}
        </TouchableOpacity>

        {/* Already have account */}
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-center text-blue-500 text-base">
            Already have an account? Login
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
