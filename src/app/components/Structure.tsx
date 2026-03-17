import { motion } from "motion/react";
import { Calendar, Clock, Lightbulb, MonitorPlay, Code2, Presentation } from "lucide-react";

export function Structure() {
  const structure = [
    { icon: Lightbulb, label: "Concept Learning", color: "from-cyan-400 to-cyan-600" },
    { icon: MonitorPlay, label: "Live Demonstrations", color: "from-purple-400 to-purple-600" },
    { icon: Code2, label: "Hands-on Practice", color: "from-pink-400 to-pink-600" },
    { icon: Presentation, label: "Real Project Building", color: "from-orange-400 to-orange-600" },
  ];

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Bootcamp Structure
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group p-8 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm border border-cyan-500/30 rounded-3xl hover:border-cyan-500/60 transition-all duration-300"
          >
            <Calendar className="w-12 h-12 mb-4 text-cyan-400" />
            <h3 className="text-2xl md:text-3xl mb-2 text-white">📅 Duration</h3>
            <p className="text-4xl md:text-5xl bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              3 Days
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group p-8 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm border border-purple-500/30 rounded-3xl hover:border-purple-500/60 transition-all duration-300"
          >
            <Clock className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-2xl md:text-3xl mb-2 text-white">⏰ Time</h3>
            <p className="text-4xl md:text-5xl bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              5 Hours/Day
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h3 className="text-2xl md:text-3xl mb-8 text-white">🎯 Learning Model</h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {structure.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative z-10">
                <item.icon className="w-10 h-10 mb-4 text-white group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-200">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
