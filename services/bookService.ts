// services/bookService.ts
import { Book } from "@/types/books";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    Timestamp,
  } from "firebase/firestore";
  import { db } from "@/firebase";
  
  // type define karanna (oya wage task.ts ekak thiyenne nam mekata book.ts hadanna)
  export type LocalBook = {
    id?: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    available?: boolean;
    createdAt?: any;
  };
  
  // Firestore collection ref
  export const booksRef = collection(db, "books");
  
  // Create new book
  export const createBook = async (book: LocalBook) => {
    const docRef = await addDoc(booksRef, {
      ...book,
      available: book.available ?? true,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  };
  
  // Get all books
  export const getAllBooks = async (): Promise<LocalBook[]> => {
    const snapshot = await getDocs(booksRef);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Book[];
  };
  
  // Get single book by ID
  export const getBookById = async (id: string): Promise<LocalBook | null> => {
    const bookDocRef = doc(db, "books", id);
    const snapshot = await getDoc(bookDocRef);
    return snapshot.exists()
      ? ({ id: snapshot.id, ...snapshot.data() } as Book)
      : null;
  };
  
  // Update book
  export const updateBook = async (id: string, book: LocalBook) => {
    const bookDocRef = doc(db, "books", id);
    const { id: _id, ...bookData } = book;
    return updateDoc(bookDocRef, bookData);
  };
  
  // Delete book
  export const deleteBook = async (id: string) => {
    const bookDocRef = doc(db, "books", id);
    return deleteDoc(bookDocRef);
  };
  