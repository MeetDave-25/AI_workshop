import { motion } from "motion/react";
import { Brain, Clapperboard, Video, Code, Trophy } from "lucide-react";

export function Workflow() {
  const steps = [
    {
      number: 1,
      title: "AI Foundation & Ideation",
      icon: Brain,
      color: "from-cyan-400 to-cyan-600",
      borderColor: "border-cyan-500/50",
      glowColor: "shadow-cyan-500/50",
      description: [
        "Understand Generative AI",
        "Learn Prompt Engineering",
        "Generate story ideas using AI",
        "Build characters & concepts",
      ],
      output: "Story + Script Ready",
    },
    {
      number: 2,
      title: "AI Story & Script Creation",
      icon: Clapperboard,
      color: "from-purple-400 to-purple-600",
      borderColor: "border-purple-500/50",
      glowColor: "shadow-purple-500/50",
      description: [
        "Develop cinematic storytelling",
        "Write short film scripts",
        "Create advertisement scripts",
      ],
      output: "Complete Script",
    },
    {
      number: 3,
      title: "AI Visual & Video Creation",
      icon: Video,
      color: "from-pink-400 to-pink-600",
      borderColor: "border-pink-500/50",
      glowColor: "shadow-pink-500/50",
      description: [
        "Generate AI images",
        "Design consistent characters",
        "Create cinematic scenes",
        "Convert images into videos",
      ],
      output: "AI Short Film Scenes",
    },
    {
      number: 4,
      title: "Vibe Coding & Product Building",
      icon: Code,
      color: "from-orange-400 to-orange-600",
      borderColor: "border-orange-500/50",
      glowColor: "shadow-orange-500/50",
      description: [
        "Build websites using AI",
        "Generate code using prompts",
        "Create digital tools & apps",
      ],
      output: "Working AI Project",
    },
    {
      number: 5,
      title: "Final Showcase",
      icon: Trophy,
      color: "from-yellow-400 to-yellow-600",
      borderColor: "border-yellow-500/50",
      glowColor: "shadow-yellow-500/50",
      description: [
        "Present projects",
        "Showcase creativity",
        "Compete for Best Creator",
      ],
      output: "Recognition + Experience",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            🚀 How The Bootcamp Works
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8" />
          <p className="text-xl text-gray-300">A visually stunning journey through 5 transformative steps</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute left-0 right-0 top-24 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500" />

          {/* Steps */}
          <div className="space-y-16 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative h-full"
              >
                {/* Step card */}
                <div className="group h-full flex flex-col">
                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`relative z-10 w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br ${step.color} ${step.glowColor} shadow-lg`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Card content */}
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`relative p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border ${step.borderColor} rounded-2xl hover:${step.glowColor} hover:shadow-2xl transition-all duration-300 flex-1 flex flex-col`}
                  >
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20">
                      <span className="text-lg text-white">{step.number}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl mb-4 text-white min-h-[3.5rem]">
                      🌌 {step.title}
                    </h3>

                    {/* Description */}
                    <ul className="space-y-2 mb-6">
                      {step.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Output */}
                    <div className={`mt-auto pt-4 border-t ${step.borderColor}`}>
                      <p className="text-xs text-gray-400 mb-1">👉 Output:</p>
                      <p className={`text-sm bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                        {step.output}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Connecting arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <div className="w-0.5 h-12 bg-gradient-to-b from-cyan-500 to-purple-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
