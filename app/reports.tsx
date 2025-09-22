// app/admin/reports.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, doc, updateDoc, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase";

type Book = {
  id?: string;
  title: string;
  author: string;
  category: string;
  borrowCount?: number;
  available?: boolean;
};

type User = {
  id?: string;
  name: string;
  role: string;
};

const Reports = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const booksSnap = await getDocs(collection(db, "books"));
        const booksData = booksSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Book[];

        const usersSnap = await getDocs(collection(db, "users"));
        const usersData = usersSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as User[];

        setBooks(booksData);
        setUsers(usersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🧮 Stats
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available).length;
  const notAvailableBooks = totalBooks - availableBooks;

  const totalUsers = users.length;
  const students = users.filter((u) => u.role === "student").length;
  const admins = users.filter((u) => u.role === "admin").length;

  // 🔝 Most Borrowed Books
  const topBorrowed = [...books]
    .filter((b) => b.borrowCount !== undefined)
    .sort((a, b) => (b.borrowCount ?? 0) - (a.borrowCount ?? 0))
    .slice(0, 5);

  // 🔙 Handle Return
  const handleReturn = async (bookId?: string) => {
    if (!bookId) return;

    try {
      // 1. Update book status
      await updateDoc(doc(db, "books", bookId), { available: true });

      // 2. Find last borrow record & mark returned
      const q = query(
        collection(db, "borrows"),
        where("bookId", "==", bookId),
        where("status", "==", "borrowed"),
        orderBy("borrowDate", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const borrowRef = doc(db, "borrows", snap.docs[0].id);
        await updateDoc(borrowRef, {
          status: "returned",
          returnDate: new Date(),
        });
      }

      Alert.alert("✅ Success", "Book returned successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Failed", "Could not return book");
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
    <View style={styles.container}>
      <Text style={styles.header}>📊 Reports</Text>

      {/* Summary Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Books Summary</Text>
        <Text>Total Books: {totalBooks}</Text>
        <Text>Available: {availableBooks}</Text>
        <Text>Not Available: {notAvailableBooks}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Users Summary</Text>
        <Text>Total Users: {totalUsers}</Text>
        <Text>Students: {students}</Text>
        <Text>Admins: {admins}</Text>
      </View>

      {/* Top Borrowed Books */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Most Borrowed Books</Text>
        {topBorrowed.length === 0 ? (
          <Text>No borrow data available</Text>
        ) : (
          <FlatList
            data={topBorrowed}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
              <View style={styles.bookRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <Text style={styles.bookMeta}>
                    {item.author} | {item.category}
                  </Text>
                  <Text>Borrowed: {item.borrowCount ?? 0} times</Text>
                  <Text style={{ color: item.available ? "#10B981" : "#EF4444" }}>
                    {item.available ? "Available" : "Borrowed"}
                  </Text>
                </View>

                {!item.available && (
                  <TouchableOpacity
                    style={styles.returnBtn}
                    onPress={() => handleReturn(item.id)}
                  >
                    <Ionicons name="refresh-outline" size={20} color="#fff" />
                    <Text style={styles.returnText}>Return</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>

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

export default Reports;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  bookTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  bookMeta: { fontSize: 14, color: "#6B7280" },
  returnBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    padding: 8,
    borderRadius: 6,
  },
  returnText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
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
