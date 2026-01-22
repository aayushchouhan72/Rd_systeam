import { create } from "zustand";
import Axios from "../utils/axios";

export const useMessageStore = create((get, set) => ({
  getmessage: async (data) => {
    try {
      console.log(data);
      const res = await Axios.get(`/messages/getmessage/${data}`);
      return res;
    } catch (error) {
      console.log("Here The Error in the ", error.message);
    }
  },
}));
