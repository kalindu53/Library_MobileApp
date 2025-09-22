// app/books.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { borrowBook } from "@/services/borrowService";

type Book = {
  id?: string;
  title: string;
  author: string;
  category: string;
  available?: boolean;
  borrowCount?: number;
};

const BrowseBooks = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch all books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "books"));
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Book[];
      setBooks(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🏷️ Borrow book (demo with userId = "testUser")
  const handleBorrow = async (bookId?: string) => {
    if (!bookId) return;
    try {
      await borrowBook(bookId, "testUser"); // TODO: replace with auth userId
      Alert.alert("✅ Success", "Book borrowed successfully!");
      fetchBooks(); // refresh list
    } catch (e) {
      console.error(e);
      Alert.alert("❌ Failed", "Could not borrow book");
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookMeta}>
          {item.author} | {item.category}
        </Text>
        <Text
          style={[
            styles.bookStatus,
            { color: item.available ? "#10B981" : "#EF4444" },
          ]}
        >
          {item.available ? "Available" : "Not Available"}
        </Text>
      </View>

      {item.available && (
        <TouchableOpacity
          style={styles.borrowBtn}
          onPress={() => handleBorrow(item.id)}
        >
          <Ionicons name="book-outline" size={20} color="#fff" />
          <Text style={styles.borrowText}>Borrow</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📖 Browse Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id!}
          renderItem={renderBook}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No books available
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
            router.push("/dashboard");
          }
        }}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BrowseBooks;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
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
  borrowBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    padding: 10,
    borderRadius: 8,
  },
  borrowText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#2563EB",
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
