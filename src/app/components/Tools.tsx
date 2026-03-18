import { motion } from "motion/react";

export function Tools() {
  const tools = [
    { name: "ChatGPT", emoji: "💬", color: "from-green-400 to-green-600" },
    { name: "Gemini", emoji: "✨", color: "from-blue-400 to-blue-600" },
    { name: "Google AI Studio", emoji: "🧪", color: "from-yellow-400 to-yellow-600" },
    { name: "Claude", emoji: "🧠", color: "from-orange-400 to-orange-600" },
    { name: "Grok", emoji: "🤖", color: "from-gray-400 to-gray-600" },
    { name: "Meta", emoji: "🎨", color: "from-purple-400 to-purple-600" },
    { name: "Runway", emoji: "🎬", color: "from-cyan-400 to-cyan-600" },
    { name: "AI Coding Tools", emoji: "💻", color: "from-pink-400 to-pink-600" },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            🧰 Tools You Will Use
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
          <p className="text-xl text-gray-300">Industry-leading AI tools and platforms</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="group relative p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl hover:border-white/40 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tool.emoji}
                </div>
                <p className="text-white font-medium">{tool.name}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-400">
            And many more cutting-edge AI tools to power your creativity
          </p>
        </motion.div>
      </div>
    </section>
  );
}
