import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import {
    ScanLine,
    FileText,
    Ticket,
    ArrowLeft,
    Shield,
    BarChart3,
    LogOut,
    Users,
} from "lucide-react";

export function AdminDashboard() {
    const [stats, setStats] = useState({ totalCoupons: 0, usedCoupons: 0, totalPrompts: 0, totalStudents: 0 });
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate("/login");
            return;
        }

        const fetchStats = async () => {
            try {
                const [couponsRes, promptsRes, studentsRes] = await Promise.all([
                    fetch('/api/admin/coupons'),
                    fetch('/api/prompts'),
                    fetch('/api/admin/students')
                ]);

                let totalCoupons = 0;
                let usedCoupons = 0;
                let totalPrompts = 0;
                let totalStudents = 0;

                if (couponsRes.ok) {
                    const couponsData = await couponsRes.json();
                    totalCoupons = couponsData.length;
                    usedCoupons = couponsData.filter((c: any) => c.is_used).length;
                }

                if (promptsRes.ok) {
                    const promptsData = await promptsRes.json();
                    totalPrompts = promptsData.length;
                }

                if (studentsRes.ok) {
                    const studentsData = await studentsRes.json();
                    totalStudents = studentsData.length;
                }

                setStats({ totalCoupons, usedCoupons, totalPrompts, totalStudents });
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            }
        };

        fetchStats();
    }, [isAdmin, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!isAdmin) return null;

    const adminCards = [
        {
            title: "QR Scanner",
            description: "Verify & redeem food coupons",
            icon: ScanLine,
            gradient: "from-green-400 to-cyan-500",
            shadowColor: "shadow-green-500/20",
            path: "/admin/scanner",
        },
        {
            title: "Prompt Manager",
            description: "Create & manage AI prompts",
            icon: FileText,
            gradient: "from-purple-400 to-pink-500",
            shadowColor: "shadow-purple-500/20",
            path: "/admin/prompts",
        },
        {
            title: "Student Management",
            description: "Register and manage students",
            icon: Users,
            gradient: "from-blue-400 to-indigo-500",
            shadowColor: "shadow-blue-500/20",
            path: "/admin/students",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 max-w-5xl py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <motion.button
                        onClick={() => navigate("/")}
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </motion.button>
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Manage bootcamp operations
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                        <p className="text-sm text-gray-400">Total Students</p>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <Ticket className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">{stats.totalCoupons}</p>
                        <p className="text-sm text-gray-400">Total Coupons</p>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">{stats.usedCoupons}</p>
                        <p className="text-sm text-gray-400">Redeemed</p>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">{stats.totalPrompts}</p>
                        <p className="text-sm text-gray-400">Prompts</p>
                    </div>
                </motion.div>

                {/* Admin Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {adminCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <motion.button
                                onClick={() => navigate(card.path)}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl hover:${card.shadowColor} hover:shadow-2xl transition-all duration-300 text-left group`}
                            >
                                <div
                                    className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <card.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl text-white mb-2">{card.title}</h3>
                                <p className="text-gray-400">{card.description}</p>
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
