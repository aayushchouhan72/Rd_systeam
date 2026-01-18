import { create } from "zustand";

import Axios from "../utils/axios";

export const usePaymentStore = create((set) => ({
  createOrderApi: async (payload) => {
    return await api.post("/payment/createorder", payload);
  },
  verifyPaymentApi: async (payload) => {
    return await api.post("/payment/verify", payload);
  },
}));
