"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

function TriggerForm({ onSubmit }) {
  const router = useRouter();
  const [type, setType] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [inactivityDays, setInactivityDays] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, scheduledAt, inactivityDays });
  };

  const handleReset = () => {
    setType("");
    setScheduledAt("");
    setInactivityDays("");
  };

  return (
    <div className="flex flex-col md:flex-row bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-200 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      
      <motion.div
        className="p-10 md:w-2/5 flex flex-col justify-center relative overflow-hidden bg-white/60"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <motion.h2
            className="text-emerald-950 text-3xl font-bold mb-4 tracking-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Create a Trigger
          </motion.h2>
          <motion.p
            className="text-emerald-700"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Set the precise conditions that will securely release your digital assets.
          </motion.p>
        </div>
      </motion.div>

      <div className="p-8 md:p-12 md:w-3/5 bg-white/30">
        <button 
          onClick={() => router.push("/home")} 
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mb-6 transition-colors font-medium text-sm"
          type="button"
        >
          <ArrowLeft size={16} /> Go Back to Dashboard
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="relative"
          >
            <label className="block text-emerald-700 text-sm font-medium mb-2">Trigger Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all appearance-none shadow-inner"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.2rem",
              }}
            >
              <option value="">Select Type</option>
              <option value="inactivity">Inactivity</option>
              <option value="scheduled">Scheduled Date</option>
            </select>
          </motion.div>

          {type === "scheduled" && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <label className="block text-emerald-700 text-sm font-medium mb-2">
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
              />
            </motion.div>
          )}

          {type === "inactivity" && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <label className="block text-emerald-700 text-sm font-medium mb-2">
                Days of Inactivity
              </label>
              <input
                type="number"
                value={inactivityDays}
                onChange={(e) => setInactivityDays(e.target.value)}
                required
                min="1"
                placeholder="Number of days (e.g. 30)"
                className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
              />
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <button
              type="submit"
              className="bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-cyan-500 transition-colors flex-1 shadow-lg shadow-cyan-600/20"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-emerald-100/50 text-emerald-900 border border-emerald-300 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-emerald-950 transition-colors flex-1"
            >
              Reset
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default function Trigger({ vaultId, setTriggerSet }) {
  const handleFormSubmit = async (data) => {
    if (!vaultId) return;
    setTriggerSet(data);
  };

  return (
    <div className="relative bg-emerald-50 text-emerald-950 overflow-x-hidden min-h-screen flex items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl z-10"
      >
        <TriggerForm onSubmit={handleFormSubmit} />
      </motion.div>
    </div>
  );
}
