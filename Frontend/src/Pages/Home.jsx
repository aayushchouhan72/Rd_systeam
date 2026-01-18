import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Wallet,
  LineChart,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/register.store";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { logout, authUser } = useAuthStore();
  const {
    CheckuserisRegisterforrd,
    addNomineeOrNot,
    userAccountNumber,
    isNominee,
    getRdData,
  } = useUserStore();
  
  const [hasStartedRD, setHasStartedRD] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else {
      // Check registration status
      CheckuserisRegisterforrd({ email: authUser.email });
    }
  }, [authUser, navigate, CheckuserisRegisterforrd]);

  useEffect(() => {
    // Check nominee and RD status if account number exists
    if (userAccountNumber) {
      addNomineeOrNot(userAccountNumber);
      // Check if user has any active RDs to determine if we should hide 'Start RD' 
      // (User requirement: "sari rd bharne ka baad..."). 
      // Actually user said: "same register for rd ka liye bhi". 
      // If registered -> hide Register button.
      // If RD started -> hide Start RD button? Or maybe just allow multiple RDs?
      // "ek baar nominee add karne ka baad add nominee wala component show nahi hona chaiye"
      // I will assume logic: 
      // !userAccountNumber -> Show Register
      // userAccountNumber && !isNominee -> Show Add Nominee (if button existed, but flow is Register -> Nominee)
      // userAccountNumber && isNominee -> Show Start RD 
      // But if RD already started? The user might want multiple RDs. 
      // However, "sari rd bharne ka baad repayent..." suggests a lifecycle. 
      // For now, I will implementation: 
      // 1. Hide Register if userAccountNumber exists.
            
      const checkRDs = async () => {
        const rds = await getRdData(userAccountNumber);
        if (rds && rds.length > 0) {
           setHasStartedRD(true); 
        }
      };
      checkRDs();
    }
  }, [userAccountNumber, addNomineeOrNot, getRdData]);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const timelineRef = useRef(null);
  const galaxyRef = useRef(null);

  useGSAP(
    () => {
      // 1. Galaxy Parallax Effect
      gsap.to(galaxyRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 2. Hero Content Animation
      const heroTl = gsap.timeline();
      heroTl
        .from(".hero-text", {
          y: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
        })
        .from(
          ".hero-btns",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        );

      // 3. Features Card Reveal
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        rotation: 2,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });

      // 4. Timeline Step Animation
      const steps = gsap.utils.toArray(".timeline-step");
      steps.forEach((step, i) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
          },
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
      });

      // 5. CTA Cards Glow Animation
      gsap.from(".action-card", {
        scrollTrigger: {
          trigger: ".action-section",
          start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });
    },
    { scope: containerRef }
  );

  const navRegisterpage = () => {
    navigate("/home/registerforrd");
  };
  const startRd = () => {
    navigate("/home/startRd");
  };
  const payrdhandle = () => {
    navigate("/home/payRd");
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#020617] text-white overflow-hidden font-sans"
    >
      {/* BACKGROUND LAYER: Animated Galaxy */}
      <div ref={galaxyRef} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        {/* Simple Stars CSS simulation */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="relative z-10">
        {/* SECTION 1: HERO */}
        <section
          ref={heroRef}
          className="h-screen flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
            <ShieldCheck size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300 tracking-wide uppercase">
              Bank-Grade Security
            </span>
          </div>
          <h1 className="hero-text text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent leading-tight">
            Secure Your Future <br /> with RD Banking
          </h1>
          <p className="hero-text text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
            Smart. Safe. Monthly Savings Made Easy. Watch your wealth grow with
            our futuristic recurring deposit platform.
          </p>
          <div className="hero-btns flex flex-wrap justify-center gap-4">
            {/* Show Register only if NOT registered */}
            {!userAccountNumber && (
              <button
                onClick={navRegisterpage}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-all rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center gap-2"
              >
                Register for RD <ChevronRight size={20} />
              </button>
            )}

            {/* Show Start RD only if Registered and Nominee Added */}
            {userAccountNumber && isNominee && (
              <button
                onClick={startRd}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all rounded-xl font-bold"
              >
                Start Rd
              </button>
            )}

            <button
              onClick={payrdhandle}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all rounded-xl font-bold"
            >
              payRd
            </button>
            <button
              onClick={logout}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 transition-all rounded-xl font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center gap-2"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </section>

        {/* SECTION 2: FEATURES */}
        <section ref={featuresRef} className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="text-cyan-400" />}
              title="Register RD Account"
              desc="Open your account in under 2 minutes with fully digital KYC and instant approval."
            />
            <FeatureCard
              icon={<LineChart className="text-purple-400" />}
              title="Track RD Status"
              desc="Real-time analytics and growth projections for your monthly contributions."
            />
            <FeatureCard
              icon={<CreditCard className="text-blue-400" />}
              title="Auto-Pay Installments"
              desc="Set up seamless automated monthly deductions from your linked bank account."
            />
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS (TIMELINE) */}
        <section className="py-24 px-6 bg-white/2 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">
              The Path to Maturity
            </h2>
            <div className="space-y-12">
              <TimelineStep
                number="01"
                title="Register for RD"
                desc="Choose your tenure and monthly amount that fits your budget."
              />
              <TimelineStep
                number="02"
                title="Deposit Monthly"
                desc="Funds are safely moved to your high-interest RD vault."
              />
              <TimelineStep
                number="03"
                title="Track Growth"
                desc="Monitor compounding interest via our interactive dashboard."
              />
              <TimelineStep
                number="04"
                title="Receive Amount"
                desc="Get your principal + interest directly in your account upon maturity."
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: ACTION CARDS */}
        <section className="action-section py-24 px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Ready to start saving?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Register"
              link="/register"
              color="from-blue-600/20"
            />
            <ActionCard
              title="Check Status"
              link="/rd-status"
              color="from-purple-600/20"
            />
            <ActionCard
              title="Pay Online"
              link="/pay-rd"
              color="from-cyan-600/20"
            />
          </div>
        </section>

        {/* SECTION 5: FOOTER */}
        <footer className="py-12 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl italic">
                RD
              </div>
              <span className="font-bold tracking-tight text-xl text-gray-200">
                RD BANK
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 RD Bank International. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Sub-components for cleaner structure
const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-blue-500/50 transition-colors group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const TimelineStep = ({ number, title, desc }) => (
  <div className="timeline-step flex gap-8 items-start">
    <span className="text-5xl font-black text-white/10 tabular-nums leading-none">
      {number}
    </span>
    <div>
      <h4 className="text-xl font-bold mb-2 text-blue-400">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  </div>
);

const ActionCard = ({ title, link, color }) => (
  <div
    className={`action-card group cursor-pointer relative overflow-hidden p-10 rounded-3xl bg-linear-to-br ${color} to-transparent border border-white/10 hover:border-white/30 transition-all`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
      <Zap className="text-white" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <button className="text-sm font-semibold text-blue-400 group-hover:text-white flex items-center gap-1">
      Go to portal <ChevronRight size={14} />
    </button>
  </div>
);

export default Home;
