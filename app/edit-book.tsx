// app/admin/edit-book.tsx
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
import { getBookById, updateBook } from "@/services/bookService";
import { Book } from "@/types/books";

const EditBook = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);

  // 🔄 Fetch book data
  const fetchBook = async () => {
    try {
      setLoading(true);
      const data = await getBookById(id);
      if (data) {
        setBook(data);
        setTitle(data.title);
        setAuthor(data.author);
        setIsbn(data.isbn);
        setCategory(data.category);
        setAvailable(data.available ?? true);
      } else {
        Alert.alert("Error", "Book not found");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBook();
  }, [id]);

  // 💾 Update book
  const handleUpdateBook = async () => {
    if (!title || !author || !isbn || !category) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!id) return;

    const updatedBook: Book = {
      id,
      title,
      author,
      isbn,
      category,
      available,
    };

    setSaving(true);
    try {
      await updateBook(id, updatedBook);
      Alert.alert("✅ Success", "Book updated successfully!");

      // Safe navigation
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/manage-books");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Failed", "Could not update book");
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
      <Text style={styles.header}>✏️ Edit Book</Text>

      <TextInput
        style={styles.input}
        placeholder="Book Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="ISBN"
        value={isbn}
        onChangeText={setIsbn}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity
        style={[styles.button, saving && { backgroundColor: "#9CA3AF" }]}
        onPress={handleUpdateBook}
        disabled={saving}
      >
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Update Book"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/manage-books");
          }
        }}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditBook;

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
