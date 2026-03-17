import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Plus, Edit2, Trash2, ArrowLeft, PenTool, LayoutTemplate, ShieldAlert } from "lucide-react";

interface Prompt {
    prompt_id: string;
    category: string; // e.g. "Day 1", "Day 2", "Day 3"
    title: string;
    content: string;
}

const CATEGORIES = ["Day 1", "Day 2", "Day 3"];

export function AdminPrompts() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState<Partial<Prompt>>({ category: "Day 1" });
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadPrompts();
    }, []);

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

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-3xl max-w-md">
                    <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl text-white mb-4">Access Denied</h2>
                    <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white"
                    >
                        Login as Admin
                    </button>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        if (!currentPrompt.title || !currentPrompt.content) return;

        try {
            if (currentPrompt.prompt_id) {
                // Edit
                await fetch(`/api/prompts/${currentPrompt.prompt_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentPrompt)
                });
            } else {
                // Create
                await fetch('/api/prompts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentPrompt)
                });
            }
            loadPrompts();
            setIsEditing(false);
            setCurrentPrompt({ category: "Day 1" });
        } catch (err) {
            console.error("Error saving prompt", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this prompt?")) {
            try {
                await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
                loadPrompts();
            } catch (err) {
                console.error("Error deleting prompt", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative py-12">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 container mx-auto px-4 max-w-5xl">
                <motion.button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </motion.button>

                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <PenTool className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Prompt Manager</h1>
                            <p className="text-gray-400 mt-1">Create and manage exact prompts for students</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setCurrentPrompt({ category: "Day 1" }); setIsEditing(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" /> Create New Prompt
                    </button>
                </div>

                <AnimatePresence>
                    {isEditing && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <LayoutTemplate className="w-5 h-5 text-purple-400" />
                                    {currentPrompt.prompt_id ? "Edit Prompt" : "New Prompt"}
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Prompt Title</label>
                                        <input type="text" value={currentPrompt.title || ""} onChange={(e) => setCurrentPrompt({ ...currentPrompt, title: e.target.value })} placeholder="e.g. Generate Character Base" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Category / Day</label>
                                        <div className="flex gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button key={cat} onClick={() => setCurrentPrompt({ ...currentPrompt, category: cat })} className={`flex-1 py-3 rounded-xl border transition-all ${currentPrompt.category === cat ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm text-gray-400 mb-2">Prompt Content (Exact text to copy)</label>
                                    <textarea value={currentPrompt.content || ""} onChange={(e) => setCurrentPrompt({ ...currentPrompt, content: e.target.value })} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-purple-500/50 resize-y" placeholder="Enter the exact prompt text here..." />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Cancel</button>
                                    <button onClick={handleSave} disabled={!currentPrompt.title || !currentPrompt.content} className="px-8 py-2.5 bg-purple-500 hover:bg-purple-600 rounded-xl disabled:opacity-50 transition-all">Save Prompt</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid gap-6">
                    {prompts.length === 0 && !isEditing ? (
                        <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/3">
                            <PenTool className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No prompts created yet.</p>
                            <p className="text-gray-500 text-sm mt-1">Click 'Create New Prompt' to add one.</p>
                        </div>
                    ) : (
                        prompts.map((prompt) => (
                            <motion.div key={prompt.prompt_id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-6 group hover:border-purple-500/30 transition-all">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-semibold tracking-wide">
                                            {prompt.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{prompt.title}</h3>
                                    </div>
                                    <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                        <p className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{prompt.content}</p>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2 justify-end md:justify-start pt-2">
                                    <button onClick={() => { setCurrentPrompt(prompt); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-white/5 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-all" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(prompt.prompt_id)} className="p-3 bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/20 transition-all" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
