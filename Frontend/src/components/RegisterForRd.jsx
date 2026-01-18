import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import AddNominee from "./AddNominee.jsx";
import {
  User,
  CreditCard,
  IdCard,
  IndianRupee,
  Camera,
  Calendar,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  FileText,
  Mail,
} from "lucide-react";

import { useUserStore } from "../store/register.store";
import AnimatedPage from "./AnimatedPage";
import RdStart from "./RdStart.jsx";

import { useAuthStore } from "../store/auth.store";

function RegisterRD() {
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const formRef = useRef(null);
  
  const { authUser } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    adharNo: "",
    photo: null,
    dob: "",
    panNo: "",
    occupation: "",
  });

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
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  });

  const {
    rdRegisterUser,
    isRegistering,
    isEligibleAddNominee,
    userAccountNumber,
    isCheckingNomineeAddOrNot,
    isNomineeAdd,
    isNominee,
    addNomineeOrNot,
    showStartRd,
  } = useUserStore();

  useEffect(() => {
    if (userAccountNumber) {
      addNomineeOrNot(userAccountNumber);
    }
  }, [userAccountNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    rdRegisterUser(formData);
  };

  if (showStartRd) {
    return <RdStart />;
  }

  if (isRegistering || isCheckingNomineeAddOrNot) {
    return <AnimatedPage />;
  }

  if (isNominee) {
    return <RdStart />;
  } else if (userAccountNumber && isEligibleAddNominee) {
    return <AddNominee />;
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden py-20 px-4">
      {/* 🌌 GALAXY BACKGROUND */}
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

      <div ref={formRef} className="relative z-10 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">
              New RD Application
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Secure Your Investment
          </h1>

          <p className="text-gray-400">
            Please provide your details to initiate your Recurring Deposit
            vault.
          </p>
        </div>

        {/* 🔔 EMAIL NOTE */}
        <div className="mb-10 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-300">
          <p className="leading-relaxed">
            <strong>Note:</strong> Please ensure that the email address entered
            here is the <strong>same email</strong> you used during signup. This
            email will be used for all <strong>RD account communication</strong>
            , including account details, statements, and notifications.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
        >
          {/* FULL NAME */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* OCCUPATION */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Occupation
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Software Engineer"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* AADHAR */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Aadhar Number
            </label>
            <div className="relative">
              <IdCard
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({ ...formData, adharNo: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* PAN */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              PAN Number
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="text"
                placeholder="ABCDE1234F"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({ ...formData, panNo: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* RD AMOUNT
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Monthly RD Amount
            </label>
            <div className="relative">
              <IndianRupee
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="number"
                placeholder="Min. ₹500"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={(e) =>
                  setFormData({ ...formData, rdAmount: e.target.value })
                }
                required
              />
            </div>
          </div> */}

          {/* DOB */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 text-gray-300"
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* RD START DATE
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              RD Start Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 text-gray-300"
                onChange={(e) =>
                  setFormData({ ...formData, rdStartDate: e.target.value })
                }
                required
              />
            </div>
          </div> */}

          {/* PHOTO */}
          <div className="form-input space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">
              Passport Size Photo
            </label>
            <div className="relative">
              <Camera
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="file"
                accept="image/*"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white"
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.files[0] })
                }
                required
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="form-input md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 group"
            >
              Complete Registration
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

export default RegisterRD;
