import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IndianRupee,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";

import { useUserStore } from "../store/register.store";
import AnimatedPage from "./AnimatedPage";

function StartRDPlan() {
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    rd_total_amount: "",
    rd_start_date: "",
    monthly_installment_day: "",
    duration_months: "",
  });

  const { userAccountNumber, isStartingRd, startRD } = useUserStore();

  useGSAP(() => {
    if (starsRef.current) {
      gsap.to(starsRef.current, {
        backgroundPosition: "2000px 0",
        duration: 150,
        ease: "none",
        repeat: -1,
      });
    }

    const formInputs = document.querySelectorAll(".form-input");
    if (formInputs.length > 0) {
      gsap.from(formInputs, {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    startRD(formData, userAccountNumber);
  };

  if (isStartingRd) {
    return <AnimatedPage />;
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden py-20 px-4">
      {/* 🌌 BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
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

      <div ref={formRef} className="relative z-10 max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">
              RD Setup
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Configure Your RD Plan
          </h1>
          <p className="text-gray-400">
            Choose your investment amount and payment schedule.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
        >
          {/* TOTAL AMOUNT */}
          <div className="form-input space-y-2">
            <label className="text-sm text-gray-400 ml-1">
              Total RD Amount
            </label>
            <div className="relative">
              <IndianRupee
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="number"
                required
                placeholder="e.g. ₹12000"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rd_total_amount: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* START DATE */}
          <div className="form-input space-y-2">
            <label className="text-sm text-gray-400 ml-1">RD Start Date</label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="date"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 text-gray-300"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rd_start_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* PAYMENT DAY */}
          <div className="form-input space-y-2">
            <label className="text-sm text-gray-400 ml-1">
              Monthly Payment Day
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="number"
                min="1"
                max="28"
                required
                placeholder="Day between 1–28"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthly_installment_day: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* RD TENURE */}
          <div className="form-input space-y-2">
            <label className="text-sm text-gray-400 ml-1">
              RD Duration (Months)
            </label>
            <div className="relative">
              <Clock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="number"
                min="6"
                max="120"
                required
                placeholder="e.g. 12, 24, 36"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_months: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="form-input mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 group"
            >
              Start RD
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StartRDPlan;
