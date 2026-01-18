import { create } from "zustand";

import Axios from "../utils/axios";

export const useUserStore = create((set) => ({
  isRegistering: false,
  userAccountNumber: null,
  checkingUserRegister: false,
  isEligibleAddNominee: false,
  isAddingnominee: false,
  isNomineeAdd: false,
  isCheckingNomineeAddOrNot: false,
  isNominee: false,
  isStartingRd: false,
  showStartRd: false,
  rdRegisterUser: async (formData) => {
    set({ isRegistering: true });
    try {
      const payload = {
        fullname: formData.fullName,
        adharno: formData.adharNo,
        photourl: null, // abhi photo skip
        dob: formData.dob,
        email: formData.email,
        panno: formData.panNo,
        occupation: formData.occupation,
      };
      const res = await Axios.post("/rduser/registeruser", payload);
      set({ userAccountNumber: res?.data?.data?.account_number });
      set({ isEligibleAddNominee: true });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isRegistering: false });
    }
  },
  Addnominee: async (data, acnum) => {
    console.log(acnum);
    set({ isAddingnominee: true });
    try {
      await Axios.post(`/rduser/addnominee/${acnum}`, data);
    } catch (error) {
      console.log("error in addNominee function", error.message);
    } finally {
      set({ isAddingnominee: false });
      set({ isNomineeAdd: true });
    }
  },
  CheckuserisRegisterforrd: async (data) => {
    set({ checkingUserRegister: true });
    try {
      const res = await Axios.post("/rduser/check", data);
      set({ userAccountNumber: res.data.accountNumber });
    } catch (error) {
      console.log(
        "Error in the checking user is register ig not",
        error.message,
      );
    } finally {
      set({ checkingUserRegister: false });
    }
  },
  addNomineeOrNot: async (accountNumber) => {
    set({ isCheckingNomineeAddOrNot: true });
    try {
      const res = await Axios.get(`/rduser/nomineeAdd/${accountNumber}`);
      if (res.data?.user?.nominee_id) {
        set({ isNominee: true });
        // If nominee exists, show start RD page
        set({ showStartRd: true });
      } else {
        set({ isNominee: false });
      }
    } catch (error) {
      console.log("Error checking nominee status:", error);
      set({ isNominee: false });
    } finally {
      set({ isCheckingNomineeAddOrNot: false });
    }
  },
  startRD: async (formData, accountNumber) => {
    set({ isStartingRd: true });
    try {
      await Axios.post(`/rduser/startrd/${accountNumber}`, formData);
      // Reset flow or navigate? User might want to see success
      set({ showStartRd: false }); // Or keep it true and show success
      toast.success("RD Started Successfully!"); // Toast removed based on previous cleanup
    } catch (error) {
      console.log("Error starting RD", error);
    } finally {
      set({ isStartingRd: false });
    }
  },
  getRdData: async (accountNumber) => {
    try {
      const res = await Axios.get(`/rduser/rdinformation/${accountNumber}`);
      // return res.data;
      return res.data.data;
    } catch (error) {
      console.log("Error fetching RD data", error);
      return [];
    }
  },
  resetByUser: () => {
    set({
      isRegistering: false,
      userAccountNumber: null,
      checkingUserRegister: false,
      isEligibleAddNominee: false,
      isAddingnominee: false,
      isNomineeAdd: false,
      isCheckingNomineeAddOrNot: false,
      isNominee: false,
      isStartingRd: false,
      showStartRd: false,
    });
  },
}));
