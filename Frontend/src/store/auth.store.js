import { create } from "zustand";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import { useUserStore } from "./register.store";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLogining: false,
  isSignUping: false,
  ischecking: false,
  isGetingProfileData: false,
  isUpdatingProfile: false,
  isGetinNomineeData: false,
  isEditingNominee: false,
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
      return res.data.data;
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ ischecking: false });
    }
  },
  getProfiledata: async (user) => {
    set({ isGetingProfileData: true });
    try {
      const res = await Axios.get(`/auth/profile/${user}`);
      return res?.data?.user;
    } catch (error) {
      console.log("error in getprofiledata");
    } finally {
      set({ isGetingProfileData: false });
    }
  },
  updataProfile: async (data, user) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await Axios.post(`/auth/updateprofile/${user}`, [
        ...data.entries(),
      ]);
    } catch (error) {
      console.log("Error in the updating profile", error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  getNomineedata: async (user) => {
    if (!user) return null;

    set({ isGetinNomineeData: true });
    try {
      const response = await Axios.get(`/auth/getnomineedata/${user}`);
      return response?.data?.data;
    } catch (error) {
      console.log("Error in the getNominee data", error.message);
      return null;
    } finally {
      set({ isGetinNomineeData: false });
    }
  },
  editNominee: async (data, user) => {
    if (!data || !user) return;
    try {
      set({ isEditingNominee: true });
      const res = await Axios.post(`/auth/editnominee/${user}`, data);
      return res?.data?.data;
      toast.success("Nominee updated sucessfully");
    } catch (error) {
      console.log("Error in the editnominee", error.message);
    } finally {
      set({ isEditingNominee: false });
    }
  },
}));
