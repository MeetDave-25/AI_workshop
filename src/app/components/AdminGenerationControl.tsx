import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings, Check, X, Save } from "lucide-react";

interface GenerationStatus {
  day: number;
  ticket_generation_enabled: boolean;
  coupon_generation_enabled: boolean;
}

export function AdminGenerationControl() {
  const [statuses, setStatuses] = useState<GenerationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const res = await fetch("/api/generation-status");
      if (res.ok) {
        const data: GenerationStatus[] = await res.json();
        // Ensure all 3 days exist
        const allDays = [1, 2, 3].map((day) => {
          const existing = data.find((s: GenerationStatus) => s.day === day);
          return (
            existing || {
              day,
              ticket_generation_enabled: false,
              coupon_generation_enabled: false,
            }
          );
        });
        setStatuses(allDays);
      }
    } catch (err) {
      console.error("Error loading statuses:", err);
      setMessage({ type: "error", text: "Failed to load generation status" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (day: number, type: "ticket" | "coupon") => {
    const status = statuses.find((s) => s.day === day);
    if (!status) return;

    const isEnabled = type === "ticket" ? status.ticket_generation_enabled : status.coupon_generation_enabled;
    const newValue = !isEnabled;

    try {
      const res = await fetch(`/api/admin/generation-status/${day}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newValue }),
      });

      if (res.ok) {
        setStatuses((prev) =>
          prev.map((s) =>
            s.day === day
              ? {
                  ...s,
                  [type === "ticket" ? "ticket_generation_enabled" : "coupon_generation_enabled"]: newValue,
                }
              : s
          )
        );
        setMessage({
          type: "success",
          text: `${type === "ticket" ? "Ticket" : "Coupon"} generation for Day ${day} ${newValue ? "enabled" : "disabled"}`,
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setMessage({ type: "error", text: "Failed to update generation status" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin">
          <Settings className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-3xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl text-white font-bold">Generation Control</h2>
        <span className="ml-auto text-xs text-gray-400">Enable/Disable student ticket & coupon generation</span>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => (
          <motion.div
            key={status.day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-black/40 border border-white/10 rounded-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                {status.day}
              </span>
              Day {status.day}
            </h3>

            <div className="space-y-3">
              {/* Ticket Generation */}
              <motion.button
                onClick={() => toggleStatus(status.day, "ticket")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                  status.ticket_generation_enabled
                    ? "bg-green-500/10 border-green-500/40 text-green-300 hover:bg-green-500/20"
                    : "bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20"
                }`}
              >
                <span className="font-semibold">🎟️ Tickets</span>
                {status.ticket_generation_enabled ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </motion.button>

              {/* Coupon Generation */}
              <motion.button
                onClick={() => toggleStatus(status.day, "coupon")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                  status.coupon_generation_enabled
                    ? "bg-green-500/10 border-green-500/40 text-green-300 hover:bg-green-500/20"
                    : "bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20"
                }`}
              >
                <span className="font-semibold">🍽️ Coupons</span>
                {status.coupon_generation_enabled ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </motion.button>

              {/* Status Indicator */}
              <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
                {status.ticket_generation_enabled && status.coupon_generation_enabled ? (
                  "✅ All enabled"
                ) : status.ticket_generation_enabled || status.coupon_generation_enabled ? (
                  "⚠️ Partially enabled"
                ) : (
                  "❌ All disabled"
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={loadStatuses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
      >
        <Save className="w-5 h-5" />
        Refresh Status
      </motion.button>
    </motion.div>
  );
}
