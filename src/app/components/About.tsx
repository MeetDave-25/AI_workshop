import { motion } from "motion/react";
import { Brain, Film, Code, Lightbulb } from "lucide-react";

export function About() {
  const features = [
    { icon: Brain, label: "AI Storytelling" },
    { icon: Film, label: "Cinematic Content" },
    { icon: Code, label: "Product Development" },
    { icon: Lightbulb, label: "AI Filmmaking" },
  ];

  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            About The Bootcamp
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-gray-300 text-center leading-relaxed max-w-4xl mx-auto mb-6">
            The <span className="text-cyan-400 font-medium">AI Powered Creators Bootcamp</span> is an intensive{" "}
            <span className="text-purple-400 font-medium">3-day hands-on experience</span> designed to transform 
            students into AI-powered creators.
          </p>
          <p className="text-lg md:text-xl text-gray-300 text-center leading-relaxed max-w-4xl mx-auto">
            From generating ideas to building real digital products, this bootcamp covers everything:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group p-6 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all duration-300"
            >
              <feature.icon className="w-10 h-10 mb-3 text-cyan-400 group-hover:text-purple-400 transition-colors duration-300" />
              <p className="text-gray-200 text-sm md:text-base">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl">
            <p className="text-2xl md:text-3xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent font-medium">
              💡 Learn. Build. Create. Showcase.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
