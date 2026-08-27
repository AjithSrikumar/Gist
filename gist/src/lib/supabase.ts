/**
 * Supabase client using fetch directly
 * Configuration via environment variables
 */

// Supabase connection details from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xmetbuknlbddeczwakdb.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public";

// Supabase REST API headers
const supaHeaders = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// Query the books table
export const fetchBooks = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/books`, {
      method: "GET",
      headers: supaHeaders,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch books from Supabase:", error);
    return [];
  }
};

// Query a single book by ID
export const fetchBookById = async (id: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${encodeURIComponent(id)}`, {
      method: "GET",
      headers: supaHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch book ${id} from Supabase:`, error);
    return null;
  }
};

// Insert a new book
export const insertBook = async (book: any) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/books`, {
      method: "POST",
      headers: {
        ...supaHeaders,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(book),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to insert book: ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to insert book into Supabase:", error);
    throw error;
  }
};

// Update a book
export const updateBook = async (id: string, updates: any) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        ...supaHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update book: ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update book ${id} in Supabase:`, error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (id: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: supaHeaders,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete book: ${response.statusText} - ${errorText}`);
    }
    
    return { count: 1 };
  } catch (error) {
    console.error(`Failed to delete book ${id} from Supabase:`, error);
    throw error;
  }
};

// Get book chapters
export const fetchBookChapters = async (bookId: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/chapters?book_id=eq.${encodeURIComponent(bookId)}`, {
      method: "GET",
      headers: supaHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chapters: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch chapters for book ${bookId} from Supabase:`, error);
    return [];
  }
};

// Get book insights
export const fetchBookInsights = async (bookId: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/insights?book_id=eq.${encodeURIComponent(bookId)}`, {
      method: "GET",
      headers: supaHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch insights for book ${bookId} from Supabase:`, error);
    return [];
  }
};

export default { fetchBooks, fetchBookById, insertBook, updateBook, deleteBook, fetchBookChapters, fetchBookInsights };