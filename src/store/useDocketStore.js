import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useDocketStore = create((set) => ({
    dockets: [],

    creatDocket: async(data) =>{
        try {
            const res = await axiosInstance.post('/createDocket', data)
            toast.success("Create Docket successfully")
            return res.data
        } catch (error) {
            console.log("CreateDocket error response: ", error.response)
            toast.error(error.response?.data?.message || "Failed to create Docket")
            return null
        }
    },

    getDocket: async() =>{
        try {
            const res = await axiosInstance.get("/getDocket")
            set({dockets: res.data })
        } catch (error) {
            console.error('Error fetching Docket', error)
            set({dockets: []})
        }
    },
    deleteDocket: async(selectDocket)=>{
        try {
            const {_id} = selectDocket
            await axiosInstance.delete(`/deleteDocket/${_id}`)
        } catch (error) {
            console.error("Error in deleting docket ", error)
            toast.error(error.response?.data?.message || "Failed to delete docket.")
            return null
        }
    },

    searchDocket: async(infoDocket)=>{
        try {
            const res = await axiosInstance.post("/searchDocket",{infoDocket})
            console.log('Search Results: ', res.data)
            return res.data
        } catch (error) {
            toast.error(error.response.data.message)
            return null
        }
    },

    checkAndUpdateStatus: async()=>{
        try {
            await axiosInstance.post("/checkAndUpdateStatus")
        } catch (error) {
            console.error('Error check-update Status', error)
        }
    },

    updateNgayTra: async (_id, ngayTra) => { 
        try {
            const update = await axiosInstance.put(`/updateTraSach/${_id}`, ngayTra)
            console.log("Docket updated: ", update)
        } catch (error) {
            console.error('Error update NgayTra:', error)
            throw error 
        }
    },

    setDockets: (newDocket) =>({dockets: newDocket})
    
}))