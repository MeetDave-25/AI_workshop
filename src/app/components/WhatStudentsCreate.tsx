import { motion } from "motion/react";
import { Film, Megaphone, Users, Camera, Code } from "lucide-react";

export function WhatStudentsCreate() {
  const creations = [
    {
      icon: Film,
      title: "AI Short Film Concept",
      color: "from-cyan-400 to-cyan-600",
      borderColor: "border-cyan-500/50",
    },
    {
      icon: Megaphone,
      title: "AI Advertisement",
      color: "from-purple-400 to-purple-600",
      borderColor: "border-purple-500/50",
    },
    {
      icon: Users,
      title: "Character Design",
      color: "from-pink-400 to-pink-600",
      borderColor: "border-pink-500/50",
    },
    {
      icon: Camera,
      title: "Cinematic Scene",
      color: "from-orange-400 to-orange-600",
      borderColor: "border-orange-500/50",
    },
    {
      icon: Code,
      title: "AI Tool / Website",
      color: "from-yellow-400 to-yellow-600",
      borderColor: "border-yellow-500/50",
    },
  ];

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            🎯 What Students Will Create
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation, index) => (
            <motion.div
              key={creation.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border ${creation.borderColor} rounded-3xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${creation.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <creation.icon className="w-16 h-16 mb-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl text-white">
                  {creation.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl">
            <p className="text-xl md:text-2xl text-gray-200">
              From concept to execution, you'll build a complete{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                portfolio of AI creations
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
