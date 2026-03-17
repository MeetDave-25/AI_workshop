import { motion } from "motion/react";
import { Award, CheckCircle } from "lucide-react";

export function Certification() {
  const criteria = [
    "Attend 80% sessions",
    "Complete all tasks",
    "Submit final project",
    "Participate in showcase",
  ];

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            🏆 Certification
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Criteria */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl"
          >
            <h3 className="text-2xl md:text-3xl mb-8 text-white">To receive the certificate:</h3>
            <ul className="space-y-4">
              {criteria.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-200">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Certificate visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="relative p-8 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-white/30 rounded-3xl flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-purple-400" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-purple-400" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400" />
            
            <Award className="w-24 h-24 text-yellow-400 mb-6" />
            <h3 className="text-2xl md:text-3xl text-center mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Official Certificate
            </h3>
            <p className="text-center text-gray-200 text-lg">
              AI Creator Certification
            </p>
            <div className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <p className="text-sm text-gray-300">Bootcamp 2026</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl">
            <p className="text-xl md:text-2xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              🎓 Get officially certified as an AI Creator
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
