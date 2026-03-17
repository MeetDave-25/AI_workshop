import { useEffect, useRef } from "react";
import { motion } from "motion/react";

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating film reels */}
      <motion.div
        className="absolute top-20 left-[10%] w-32 h-32"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-full h-full">
          {/* Film reel */}
          <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-cyan-500/10 backdrop-blur-sm">
            <div className="absolute inset-4 rounded-full border-2 border-orange-400/30 bg-black/50" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-orange-400/20 to-cyan-400/20" />
            {/* Spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={angle}
                className="absolute top-1/2 left-1/2 w-1 h-12 bg-orange-400/40 origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[60%] right-[15%] w-24 h-24"
        animate={{
          y: [0, 40, 0],
          rotate: [0, -360],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm">
            <div className="absolute inset-3 rounded-full border-2 border-cyan-400/30 bg-black/50" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <div
                key={angle}
                className="absolute top-1/2 left-1/2 w-1 h-10 bg-cyan-400/40 origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating clapperboard */}
      <motion.div
        className="absolute top-[30%] right-[8%] w-20 h-16"
        animate={{
          y: [0, -25, 0],
          rotate: [5, -5, 5],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {/* Clapperboard top */}
          <div className="absolute top-0 w-full h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-t-sm">
            <div className="absolute inset-0 bg-black/80 clip-diagonal" />
            <div className="h-full flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? "bg-white/90" : "bg-black/90"}`}
                />
              ))}
            </div>
          </div>
          {/* Clapperboard body */}
          <div className="absolute top-4 w-full h-12 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-400/30 rounded-b-sm shadow-lg shadow-orange-500/20">
            <div className="p-1 space-y-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 bg-white/20 rounded" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
