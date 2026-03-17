import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Copy, Terminal, CheckCircle2, Lock, Sparkles, FolderOpen } from "lucide-react";

interface Prompt {
    prompt_id: string;
    category: string;
    title: string;
    content: string;
}

const CATEGORIES = ["Day 1", "Day 2", "Day 3"];

export function PromptsSection() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [activeCategory, setActiveCategory] = useState("Day 1");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            loadPrompts();
        }
    }, [isLoggedIn]);

    const loadPrompts = async () => {
        try {
            const res = await fetch('/api/prompts');
            if (res.ok) {
                const data = await res.json();
                setPrompts(data);
            }
        } catch (err) {
            console.error("Error loading prompts", err);
        }
    };

    const handleCopy = (id: string, content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const currentPrompts = prompts.filter(p => p.category === activeCategory);

    return (
        <section id="prompts" className="py-24 bg-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6 border border-purple-500/20">
                        <Terminal className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                        Prompt Library
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Ready-to-use prompts for your AI creations. Just copy, paste, and let the magic happen.
                    </p>
                </motion.div>

                {!isLoggedIn ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-xl mx-auto text-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <Lock className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                        <h3 className="text-2xl text-white font-bold mb-4">Locked for Students Only</h3>
                        <p className="text-gray-400 mb-8">Sign in with your enrollment number to access the exclusive prompt library.</p>
                        <a href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                            <Sparkles className="w-5 h-5" /> Sign In to Unlock
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-2">
                                <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4 ml-2">Categories</h3>
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all ${activeCategory === cat ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10" : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <motion.div key={activeCategory} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                                    <FolderOpen className="w-6 h-6 text-purple-400" />
                                    <h3 className="text-2xl font-bold text-white">{activeCategory} Prompts</h3>
                                    <span className="ml-auto px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-400">{currentPrompts.length} Prompts</span>
                                </div>

                                <div className="grid gap-6">
                                    {currentPrompts.length === 0 ? (
                                        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                                            <p className="text-gray-500">No prompts uploaded for this day yet.</p>
                                        </div>
                                    ) : (
                                        currentPrompts.map((prompt, i) => (
                                            <motion.div key={prompt.prompt_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                <div className="p-6 md:p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors pr-8">{prompt.title}</h4>
                                                        <button onClick={() => handleCopy(prompt.prompt_id, prompt.content)} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${copiedId === prompt.prompt_id ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-transparent"}`}>
                                                            {copiedId === prompt.prompt_id ? <><CheckCircle2 className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                                                        </button>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="p-6 bg-black/40 rounded-xl font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap border border-black/50 overflow-hidden">
                                                            {prompt.content}
                                                        </div>
                                                    </div>
                                                </div>
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
