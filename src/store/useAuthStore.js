import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { data } from "react-router-dom";

export const useAuthStore = create( (set) =>({
    authUser: null,
    isLogin: false,
    isCheckAuth: true,
    position: null,
    lop:null,
    user: null,
    checkAuth: async() =>{
        try {
            const res = await axiosInstance.get("/check");
            set({ authUser: res.data });
            set({ position: res.data.position });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
            set({ position: null });
        } finally{
            set({isCheckAuth: false});
        }
    },

    signUp: async(data)=>{
        try {
            const res = await axiosInstance.post("/signUp", data)
            toast.success("Sign up Account succesfully")
            return res.data
        } catch (error) {
            console.error("SignUp error:", error);
            console.error("SignUp error response:", error.response); 
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi"; 
            toast.error(errorMessage);
            return null;
        }
    },

    login: async (data) => {
        set({ isLogin: true });
        try {
            const res = await axiosInstance.post("/login", data);
            set({ authUser: res.data });
            set({ position: res.data.position });
            toast.success("Logged in successfully");
            return res.data;
        } catch (error) {
            console.error("Login error:", error);
            console.error("Login error response:", error.response); 
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi"; 
            toast.error(errorMessage);
            return null;
        } finally {
            set({ isLogin: false });
        }
    },
    logout: async() =>{
        try {
            await axiosInstance.post("/logout")
            set({authUser: null})
            set({position: null})
            set({user: null})
            toast.success("Logged out successully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    findUser: async(infoUser) =>{
        try {
            console.log("Searching for:", infoUser)
            const res = await axiosInstance.post("/findUser", {infoUser})
            console.log("Results:", res.data)
            return res.data
        } catch (error) {
            toast.error(error.response.data.message)
            return null
        }
    },
    getUser: async() =>{
        try {
            const res = await axiosInstance.get("/getUser")
            set({user: res.data})
            return res.data
        } catch (error) {
            console.error("Error in Getting User ", error)
            set({user: []})
            return null
        }
    },
    updateUser: async(selectedUser) =>{
        try {
            const {Identification, userName, lop , SDT, email} = selectedUser
            const res = await axiosInstance.post("/updateUser",{
                    Identification, 
                    userName,
                    lop , 
                    SDT, 
                    email
                })
            console.log("Results from updateUser:", res.data)
            if (res.data.updatedUser) {
                set((state)=> ({
                    user: state.user.map((user) =>
                        user.Identification === selectedUser.Identification ? res.data.updatedUser : user
                )}))
                return res.data
            } else {
                toast.error("Failed to update user.");
                return null;
            }
        } catch (error) {
            console.error("Error in updating User ", error);
            toast.error(error.response?.data?.message || "Failed to update user."); 
            return null;
        }
    },
    deleteUser: async(selectedUser) =>{
        try {
            const {_id} = selectedUser
            await axiosInstance.delete(`/deleteUser/${_id}`)
        } catch (error) {
            console.error("Error in deleting User ", error);
            toast.error(error.response?.data?.message || "Failed to delete user."); 
            return null;
        }
    },
}))
