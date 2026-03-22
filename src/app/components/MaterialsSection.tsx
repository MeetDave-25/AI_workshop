import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Lock, Sparkles, FolderOpen, ExternalLink, BookOpen } from "lucide-react";

interface Material {
    material_id: string;
    category: string;
    title: string;
    link: string;
}

const CATEGORIES = ["Day 1", "Day 2", "Day 3"];

export function MaterialsSection() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [activeCategory, setActiveCategory] = useState("Day 1");
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            loadMaterials();
        }
    }, [isLoggedIn]);

    const loadMaterials = async () => {
        try {
            const res = await fetch('/api/materials/visible');
            if (res.ok) {
                const data = await res.json();
                setMaterials(data);
            }
        } catch (err) {
            console.error("Error loading materials", err);
        }
    };

    const currentMaterials = materials.filter(m => m.category === activeCategory);

    return (
        <section id="materials" className="py-24 bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-green-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-2xl mb-6 border border-green-500/20">
                        <BookOpen className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                        Learning Materials
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Access presentations, documents, and resources for each day of the bootcamp.
                    </p>
                </motion.div>

                {!isLoggedIn ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-xl mx-auto text-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <Lock className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                        <h3 className="text-2xl text-white font-bold mb-4">Locked for Students Only</h3>
                        <p className="text-gray-400 mb-8">Sign in with your enrollment number to access the learning materials.</p>
                        <a href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all">
                            <Sparkles className="w-5 h-5" /> Sign In to Unlock
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-2">
                                <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4 ml-2">Days</h3>
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all ${activeCategory === cat ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-white shadow-lg shadow-green-500/10" : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <motion.div key={activeCategory} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                                    <FolderOpen className="w-6 h-6 text-green-400" />
                                    <h3 className="text-2xl font-bold text-white">{activeCategory} Resources</h3>
                                    <span className="ml-auto px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-400">{currentMaterials.length} Items</span>
                                </div>

                                <div className="grid gap-4">
                                    {currentMaterials.length === 0 ? (
                                        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                                            <p className="text-gray-500">No materials available for this day yet.</p>
                                        </div>
                                    ) : (
                                        currentMaterials.map((material, i) => (
                                            <motion.div key={material.material_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                                                <div className="mb-4 sm:mb-0 pr-4">
                                                    <h4 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">{material.title}</h4>
                                                    <p className="text-sm text-gray-400 mt-1 truncate max-w-sm">{material.link}</p>
                                                </div>

                                                <a href={material.link} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl transition-all bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg shadow-green-500/20">
                                                    Open Link <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
