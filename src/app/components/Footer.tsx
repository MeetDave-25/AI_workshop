import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-12 bg-black border-t border-white/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              AI Powered Creators Bootcamp 2026
            </h3>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>

          <p className="text-gray-400 mb-6">
            Transform your ideas into cinematic reality with the power of AI
          </p>

          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6" />

          <p className="text-sm text-gray-500 mb-2">
            © AI Powered Creators Bootcamp. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Created and Developed by <span className="text-cyan-400 font-medium">Meet G. Dave</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
