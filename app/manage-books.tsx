// app/admin/manage-books.tsx
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
import { getAllBooks, deleteBook } from "@/services/bookService";
import { Book } from "@/types/books";

const ManageBooks = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete book
  const handleDelete = async (id?: string) => {
    if (!id) return;

    Alert.alert("Confirm Delete", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBook(id);
            Alert.alert("✅ Deleted", "Book removed successfully");
            fetchBooks(); // refresh list
          } catch (error) {
            console.error(error);
            Alert.alert("❌ Failed", "Could not delete book");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 📝 Render single book row
  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookMeta}>
          {item.author} | {item.category}
        </Text>
        <Text style={styles.bookMeta}>ISBN: {item.isbn}</Text>
        <Text
          style={[
            styles.bookStatus,
            { color: item.available ? "#10B981" : "#EF4444" },
          ]}
        >
          {item.available ? "Available" : "Not Available"}
        </Text>
      </View>

      <View style={styles.actions}>
        {/* Edit Button */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#3B82F6" }]}
          onPress={() => router.push(`/edit-book?id=${item.id}`)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Delete Button */}
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
      <Text style={styles.header}>📚 Manage Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id!}
          renderItem={renderBook}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No books found
            </Text>
          }
        />
      )}

      {/* 🔙 Back to Dashboard */}
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

export default ManageBooks;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  bookItem: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  bookTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  bookMeta: { fontSize: 14, color: "#6B7280" },
  bookStatus: { fontSize: 14, fontWeight: "600", marginTop: 4 },
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
