import React, { useState, useRef, useEffect } from "react";
import { IndianRupee, Calendar, CreditCard } from "lucide-react";
import { gsap } from "gsap";

import { useUserStore } from "../store/register.store";

function PayRDpage() {
  const starsRef = useRef(null);
  const [selectedRD, setSelectedRD] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState("");
  const [rdList, setRdList] = useState([]);
  const { userAccountNumber, getRdData } = useUserStore();

  //  Intial useEffect to get rd data from the backend
  useEffect(() => {
    const loadRD = async () => {
      try {
        const data = await getRdData(userAccountNumber);
        setRdList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setRdList([]);
      }
    };

    if (userAccountNumber) {
      loadRD();
    }
  }, [userAccountNumber, getRdData]);

  // 🌌 Background animation
  useEffect(() => {
    if (!starsRef.current) return;

    gsap.to(starsRef.current, {
      backgroundPosition: "2000px 0",
      duration: 150,
      repeat: -1,
      ease: "none",
    });
  }, []);

  const getNextDueDate = (day) => {
    const d = new Date();
    d.setDate(day);
    return d.toISOString().split("T")[0];
  };

  const handlePayClick = (rd) => {
    setSelectedRD(rd);
    setPayAmount(rd.installment_amount);
    setPayDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white py-20 px-4 overflow-hidden">
      {/* 🌌 BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div
          ref={starsRef}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">My RD Accounts</h1>
          <p className="text-gray-400">View and pay your RD installments</p>
        </div>

        {/* RD CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          {rdList.map((rd) => (
            <div
              key={rd.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4"
            >
              <div className="flex justify-between">
                <span className="text-gray-400">RD Number</span>
                <span className="font-semibold">{rd.rd_number}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount</span>
                <span>₹ {rd.rd_total_amount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Paid Till Now</span>
                <span className="text-green-400">₹ {rd.paid_till_amount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Installment</span>
                <span className="text-yellow-400">
                  ₹ {rd.installment_amount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Next Due Date</span>
                <span>{getNextDueDate(rd.monthly_installment_day)}</span>
              </div>

              <button
                onClick={() => handlePayClick(rd)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Pay Installment
              </button>
            </div>
          ))}
        </div>

        {/* PAYMENT FORM */}
        {selectedRD && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-bold">
              Pay RD – {selectedRD.rd_number}
            </h2>

            <div>
              <label className="text-sm text-gray-400 ml-1">
                Amount to Pay
              </label>
              <div className="relative mt-2">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 ml-1">Payment Date</label>
              <div className="relative mt-2">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3"
            >
              <CreditCard size={20} />
              Confirm Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PayRDpage;
