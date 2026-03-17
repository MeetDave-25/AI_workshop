import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import {
  Ticket,
  AlertCircle,
  CheckCircle2,
  User,
  Calendar,
  Hash,
  Lock,
  Sparkles,
  History,
} from "lucide-react";

interface CouponData {
  id?: string;
  coupon_id: string;
  student_name: string;
  student_email: string;
  day: number;
  date: string;
  is_used: boolean;
}

const BOOTCAMP_DAYS = [
  { day: 1, label: "Day 1", theme: "AI Foundation & Ideation", color: "from-cyan-400 to-blue-500" },
  { day: 2, label: "Day 2", theme: "Visual & Video Creation", color: "from-purple-400 to-pink-500" },
  { day: 3, label: "Day 3", theme: "Vibe Coding & Showcase", color: "from-orange-400 to-red-500" },
];

export function FoodCoupon() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [generatedCoupon, setGeneratedCoupon] = useState<CouponData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myCoupons, setMyCoupons] = useState<CouponData[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { isLoggedIn, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.email) {
      loadMyCoupons();
    }
  }, [currentUser]);

  const loadMyCoupons = async () => {
    if (!currentUser?.email) return;
    try {
      const res = await fetch(`/api/coupons/my?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMyCoupons(data);
      }
    } catch (err) {
      console.error("Failed to load coupons", err);
    }
  };

  const generateCoupon = async () => {
    setError("");

    if (!currentUser) {
      setError("Please login first");
      return;
    }

    const alreadyClaimed = myCoupons.find((c) => c.day === selectedDay);
    if (alreadyClaimed) {
      setError(`You already have a coupon for Day ${selectedDay}!`);
      setGeneratedCoupon(alreadyClaimed);
      return;
    }

    setIsLoading(true);

    try {
      const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const res = await fetch('/api/coupons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          student_name: currentUser.name,
          student_email: currentUser.email,
          day: selectedDay,
          date: dateStr
        })
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedCoupon(data.coupon);
        loadMyCoupons();
      } else {
        setError(data.message || "Failed to generate coupon");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="coupon" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            🍽️ Food Coupon System
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
          <p className="text-xl text-gray-300">Daily Food Pass — One per day, per student</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-6 bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-2xl"
        >
          <div className="flex items-start gap-3 mb-4">
            <Ticket className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl mb-2 text-white">How it works:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Each student gets 1 unique food coupon per day (Day 1, 2, 3)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  QR code is generated — show it at the food counter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Admin scans & verifies — no duplicate redemptions
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  Login required to generate coupons
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {!isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl"
          >
            <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Login Required</h3>
            <p className="text-gray-400 mb-6">Sign in to generate your food coupon</p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Sign In
            </a>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {!generatedCoupon ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl"
              >
                <h3 className="text-2xl md:text-3xl mb-6 text-center text-white">
                  🎟️ Generate Your Coupon
                </h3>

                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">{currentUser?.name}</p>
                      <p className="text-sm text-gray-400">{currentUser?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-3 text-gray-300">Select Day</label>
                  <div className="grid grid-cols-3 gap-3">
                    {BOOTCAMP_DAYS.map((d) => {
                      const alreadyClaimed = myCoupons.some((c) => c.day === d.day);
                      return (
                        <motion.button
                          key={d.day}
                          type="button"
                          onClick={() => !alreadyClaimed && setSelectedDay(d.day)}
                          whileHover={!alreadyClaimed ? { scale: 1.05 } : {}}
                          whileTap={!alreadyClaimed ? { scale: 0.95 } : {}}
                          className={`relative p-4 rounded-xl border transition-all duration-300 ${alreadyClaimed
                            ? "bg-green-500/10 border-green-500/30 cursor-default"
                            : selectedDay === d.day
                              ? `bg-gradient-to-br ${d.color} border-transparent shadow-lg`
                              : "bg-white/5 border-white/20 hover:border-white/40"
                            }`}
                        >
                          <p className={`text-lg font-bold ${alreadyClaimed ? "text-green-300" : "text-white"}`}>
                            {d.label}
                          </p>
                          <p className={`text-xs mt-1 ${alreadyClaimed ? "text-green-400" : "text-white/70"}`}>
                            {alreadyClaimed ? "✓ Claimed" : d.theme}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    onClick={generateCoupon}
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      `Generate Day ${selectedDay} Coupon`
                    )}
                  </motion.button>

                  {myCoupons.length > 0 && (
                    <motion.button
                      onClick={() => setShowHistory(!showHistory)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                    >
                      <History className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {showHistory && myCoupons.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6"
                    >
                      <h4 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Your Coupons
                      </h4>
                      <div className="space-y-2">
                        {myCoupons.map((c) => (
                          <div
                            key={c.coupon_id}
                            onClick={() => setGeneratedCoupon(c)}
                            className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/30 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Ticket className="w-4 h-4 text-cyan-400" />
                              <span className="text-white">Day {c.day}</span>
                              <span className="text-gray-500 text-xs">{c.date}</span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-lg text-xs ${c.is_used
                                ? "bg-green-500/20 text-green-300"
                                : "bg-cyan-500/20 text-cyan-300"
                                }`}
                            >
                              {c.is_used ? "Used" : "Active"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="coupon"
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative p-8 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-white/30 rounded-3xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full"
                    >
                      <Ticket className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl mb-2 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      Day {generatedCoupon.day} Food Coupon 🎉
                    </h3>
                    <p className="text-gray-300">
                      {generatedCoupon.is_used ? "⚠️ This coupon has been used" : "Valid for today only"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-cyan-400" />
                          <p className="text-sm text-gray-400">Student Name</p>
                        </div>
                        <p className="text-xl text-white">{generatedCoupon.student_name}</p>
                      </div>

                      <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Hash className="w-5 h-5 text-purple-400" />
                          <p className="text-sm text-gray-400">Coupon ID</p>
                        </div>
                        <p className="text-sm text-white break-all font-mono">{generatedCoupon.coupon_id}</p>
                      </div>

                      <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-pink-400" />
                          <p className="text-sm text-gray-400">Day / Date</p>
                        </div>
                        <p className="text-lg text-white">
                          Day {generatedCoupon.day} — {generatedCoupon.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="p-6 bg-white rounded-2xl">
                        <QRCodeSVG
                          value={JSON.stringify({
                            id: generatedCoupon.coupon_id
                          })}
                          size={200}
                          level="H"
                          includeMargin
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 ${generatedCoupon.is_used
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-green-500/10 border-green-500/30"
                      } border rounded-xl text-center`}
                  >
                    <p className={generatedCoupon.is_used ? "text-yellow-300" : "text-green-300"}>
                      {generatedCoupon.is_used
                        ? "⚠️ This coupon has already been redeemed"
                        : "✅ Show this QR code at the food counter to redeem your meal"}
                    </p>
                  </div>

                  <motion.button
                    onClick={() => setGeneratedCoupon(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                  >
                    Back
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
