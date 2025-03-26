import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useBookStore = create((set, get) => ({
  books: [],
  error: null,
  isLoading: false,

  addBook: async (data) => {
    try {
      const res = await axiosInstance.post("/addBook", data)
      toast.success("Add Book successfully")
      set((state) => ({ books: [...state.books, res.data] }))
      return res.data
    } catch (error) {
      console.log("AddBook error response: ", error.response)
      toast.error(error.response?.data?.message || "Failed to add book")
      return null
    }
  },

  getBook: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await axiosInstance.get("/getBook")
      set({ books: res.data.filterBook, error: null, isLoading: false })
      return res.data
    } catch (error) {
      console.error("Error fetching books:", error)
      set({ books: [], error: "Failed to load books.", isLoading: false })
      return null
    }
  },

  searchBook: async (searchQuery) => {
    try {
      const res = await axiosInstance.post("/searchBook", { bookName: searchQuery })
      return res.data
    } catch (error) {
      console.error("Error searching book:", error)
      toast.error("Failed to search books.")
      return []
    }
  },

  updateBook: async (selectedBook) => {
    try {
      const { _id, IdBook, bookName, author, NXB, soLuong } = selectedBook
      const res = await axiosInstance.post(`/updateBook/${_id}`, {
        IdBook,
        bookName,
        author,
        NXB,
        soLuong,
      })

      if (res.data.updateBook) {
        set((state) => ({
          books: state.books.map((book) =>
            book._id === selectedBook._id ? res.data.updatedBook : book
          ),
        }))
        toast.success("Book updated successfully!")
        return res.data
      } else {
        toast.error("Failed to update book.")
        return null
      }
    } catch (error) {
      console.error("Error in updating book ", error)
      toast.error(error.response?.data?.message || "Failed to update book.")
      return null
    }
  },

  deleteBook: async (selectedBook) => {
    try {
      const { _id } = selectedBook
      await axiosInstance.delete(`/deleteBook/${_id}`)
      set((state) => ({
        books: state.books.filter((book) => book._id !== selectedBook._id),
      }))
      toast.success("Book deleted successfully!")
    } catch (error) {
      console.error("Error in deleting Book ", error)
      toast.error(error.response?.data?.message || "Failed to delete book.")
      return null
    }
  },
  getBookById: async (IdBook) => {
    try {
      if (!IdBook) {
        console.warn("getBookById called with an invalid IdBook")
        return null
      }

      const res = await axiosInstance.get(`/getBookId/${IdBook}`)

      if (res.status === 200 && res.data && res.data.book) {
        set({ books: [res.data.book] }) 
        return res.data.book
      } else {
        console.warn("Book not found with id:", IdBook)
        return null
      }
    } catch (error) {
      console.error("Error fetching book by id:", error)
      return null
    }
  },
}))