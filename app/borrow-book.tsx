// app/student/borrow-book.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { borrowBook } from "@/services/borrowService";

const BorrowBook = ({ userId }: { userId: string }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "books"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId: string) => {
    try {
      await borrowBook(bookId, userId);
      Alert.alert("✅ Success", "Book borrowed successfully!");
      fetchBooks();
    } catch (e) {
      console.error(e);
      Alert.alert("❌ Failed", "Could not borrow book");
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.bookItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.meta}>{item.author} | {item.category}</Text>
            <Text style={{ color: item.available ? "#10B981" : "#EF4444" }}>
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
      )}
    />
  );
};

export default BorrowBook;

const styles = StyleSheet.create({
  bookItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    marginBottom: 12,
  },
  bookTitle: { fontSize: 18, fontWeight: "bold" },
  meta: { fontSize: 14, color: "#6B7280" },
  borrowBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    padding: 10,
    borderRadius: 8,
  },
  borrowText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
});
