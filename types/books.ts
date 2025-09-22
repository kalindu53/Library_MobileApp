// types/book.ts
export type Book = {
    id?: string;        // Firestore doc id (auto add wenawa)
    title: string;      // Book title
    author: string;     // Author name
    isbn: string;       // ISBN number
    category: string;   // Category/genre
    available?: boolean; // Is book available? (default true)
    createdAt?: any;    // Firestore timestamp
  };
  