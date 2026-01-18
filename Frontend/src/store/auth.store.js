import { create } from "zustand";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import { useUserStore } from "./register.store";

export const useAuthStore = create((set) => ({
  authUser: null,
  isLogining: false,
  isSignUping: false,
  ischecking: false,

  login: async (data) => {
    set({ isLogining: true });
    try {
      const res = await Axios.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Login successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLogining: false });
    }
  },

  signup: async (data) => {
    set({ isSignUping: true });
    try {
      const res = await Axios.post("/auth/signup", data);
      set({ authUser: res.data.user }); // 🔥 FIX
      toast.success("Signup successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSignUping: false });
    }
  },

  logout: async () => {
    try {
      await Axios.get("/auth/logout");
      set({ authUser: null });
      useUserStore.getState().resetByUser();
      toast.success("Logged out successfully");
    } catch (error) {
      // Even if API fails, clear local state
      set({ authUser: null });
      useUserStore.getState().resetByUser();
      toast.success("Logged out locally");
    }
  },

  check: async () => {
    set({ ischecking: true });
    try {
      const res = await Axios.get("/auth/check");
      set({ authUser: res.data.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ ischecking: false });
    }
  },
}));
