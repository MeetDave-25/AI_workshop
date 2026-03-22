import { motion } from "motion/react";
import { Crown, Users, Sparkles } from "lucide-react";

interface TeamMember {
    name: string;
    role: string;
    specialty?: string;
    initials: string;
    gradient: string;
    image?: string;
}

const instructor: TeamMember = {
    name: "Prof. Parth D. Joshi",
    role: "Instructor",
    specialty: "Lead Instructor",
    initials: "PJ",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    image: "/parth.jpeg",
};

const teamMembers: TeamMember[] = [
    {
        name: "Parth Parmar",
        role: "Co-Instructor",
        specialty: "Cinematography & Character Generation",
        initials: "PP",
        gradient: "from-cyan-400 to-blue-500",
        image: "/parth_p.jpeg",
    },
    {
        name: "Meet Dave",
        role: "Co-Instructor",
        specialty: "Vibe coding & Tech Wing Head",
        initials: "MD",
        gradient: "from-purple-400 to-pink-500",
        image: "/meet.jpeg",
    },
    {
        name: "Pruthvi Miyatra",
        role: "Co-ordinator",
        initials: "PM",
        gradient: "from-green-400 to-emerald-500",
        image: "/prithvi.jpeg",
    },
    {
        name: "Dhyey Trivedi",
        role: "Co-ordinator",
        initials: "DT",
        gradient: "from-blue-400 to-indigo-500",
        image: "/dhyey.jpeg",
    },
    {
        name: "Devanshi Barot",
        role: "Co-ordinator",
        initials: "DB",
        gradient: "from-pink-400 to-rose-500",
        image: "/devanshi.jpeg",
    },
    {
        name: "Hetal Chavda",
        role: "Co-ordinator",
        initials: "HC",
        gradient: "from-violet-400 to-purple-500",
        image: "/hetal.jpeg",
    },
    {
        name: "Janvi Nankani",
        role: "Co-ordinator",
        initials: "JN",
        gradient: "from-fuchsia-400 to-pink-500",
        image: "/janvi.jpeg",
    },
    {
        name: "Disha Rathod",
        role: "Co-ordinator",
        initials: "DR",
        gradient: "from-teal-400 to-cyan-500",
        image: "/disha.jpeg",
    },
];

export function Team() {
    return (
        <section
            id="team"
            className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-amber-300 via-orange-300 to-purple-300 bg-clip-text text-transparent">
                        👥 Meet Our Team
                    </h2>
                    <div className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mb-8" />
                    <p className="text-xl text-gray-300">
                        The brilliant minds behind AI Powered Creators Bootcamp 2026
                    </p>
                </motion.div>

                {/* Lead Instructor - Featured Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-16"
                >
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="relative max-w-lg mx-auto p-8 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-red-500/15 backdrop-blur-xl border-2 border-amber-500/40 rounded-3xl overflow-hidden group"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

                        <div className="relative z-10 text-center">
                            {/* Crown icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", delay: 0.3 }}
                                className="inline-flex items-center justify-center w-6 h-6 mb-2"
                            >
                                <Crown className="w-6 h-6 text-amber-400" />
                            </motion.div>

                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br ${instructor.gradient} flex items-center justify-center shadow-2xl shadow-amber-500/30 ring-4 ring-amber-500/30 overflow-hidden`}
                            >
                                {instructor.image ? (
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-white">
                                        {instructor.initials}
                                    </span>
                                )}
                            </motion.div>

                            <h3 className="text-2xl md:text-3xl mb-2 text-white font-semibold">
                                {instructor.name}
                            </h3>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full mb-3">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-300 font-medium">
                                    {instructor.role}
                                </span>
                            </div>
                            {instructor.specialty && (
                                <p className="text-gray-300 text-lg">{instructor.specialty}</p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Co-Instructors & Co-ordinators Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                        >
                            <motion.div
                                whileHover={{ y: -8, scale: 1.03 }}
                                className="group relative p-6 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/15 rounded-2xl hover:border-white/30 transition-all duration-300 overflow-hidden h-full"
                            >
                                {/* Hover glow */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                />

                                <div className="relative z-10 text-center">
                                    {/* Avatar */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg overflow-hidden`}
                                    >
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-white">
                                                {member.initials}
                                            </span>
                                        )}
                                    </motion.div>

                                    <h4 className="text-base md:text-lg mb-2 text-white font-medium">
                                        {member.name}
                                    </h4>

                                    {/* Role badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-2">
                                        <Users className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-300">{member.role}</span>
                                    </div>

                                    {member.specialty && (
                                        <p className="text-sm text-gray-400 mt-1">
                                            {member.specialty}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
