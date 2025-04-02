import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useCardStore = create((set, get) => ({
  cards: [], 
  error: null,

  addCard: async (data) => {
    try {
        const res = await axiosInstance.post("/addCard", data)
        toast.success("Add Card successfully")
        return res.data
    } catch (error) {
        console.log("AddBook error response: ", error.response)
        toast.error(error.response?.data?.message || "Failed to add card") 
        return null
    }
  },

  getCard: async () => {
    try {
      const res = await axiosInstance.get("/getCard")
      set({ cards: res.data.filterCard, error: null })
      return res.data
    } catch (error) {
      console.error("Error fetching card:", error)
      set({ cards: [], error: "Failed to load card." }) 
    }
  },

  searchCard: async (searchText) => {
    try {
      const res = await axiosInstance.post("/searchCard", { infoCard: searchText })
      set({ cards: res.data, error: null }) 
      return res.data
    } catch (error) {
      console.error("Error searching card:", error)
      toast.error("Failed to search cards.")
      return null
    }
  },
  checkAndUpdateStatusCard: async()=>{
    try {
      await axiosInstance.post("/checkStatusCard")
    } catch (error) {
      console.error('Error check-update Status', error)
    }
  },

  setCards: (newCards) =>({cards: newCards})

}))