// services/borrowService.ts
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
    Timestamp,
  } from "firebase/firestore";
  import { db } from "@/firebase";
  
  // borrow a book
  export const borrowBook = async (bookId: string, userId: string) => {
    // record borrow transaction
    await addDoc(collection(db, "borrows"), {
      bookId,
      userId,
      borrowDate: Timestamp.now(),
      returnDate: null,
      status: "borrowed",
    });
  
    // update book availability & borrowCount
    const bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, {
      available: false,
      borrowCount: (await getBorrowCount(bookId)) + 1,
    });
  };
  
  // return a book
  export const returnBook = async (bookId: string, borrowId: string) => {
    // update borrow record
    const borrowRef = doc(db, "borrows", borrowId);
    await updateDoc(borrowRef, {
      returnDate: Timestamp.now(),
      status: "returned",
    });
  
    // mark book available again
    const bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, { available: true });
  };
  
  // count how many times a book was borrowed
  export const getBorrowCount = async (bookId: string) => {
    const q = query(
      collection(db, "borrows"),
      where("bookId", "==", bookId),
      where("status", "==", "borrowed")
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  };
  