import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Plus, Edit2, Trash2, ArrowLeft, FolderOpen, ShieldAlert, Check, X, ExternalLink, Eye, EyeOff } from "lucide-react";

interface Material {
    material_id: string;
    category: string; // e.g. "Day 1", "Day 2", "Day 3"
    title: string;
    link: string;
    is_visible: boolean;
}

const CATEGORIES = ["Day 1", "Day 2", "Day 3"];

export function AdminMaterials() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({ category: "Day 1", is_visible: false });
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            const res = await fetch('/api/materials');
            if (res.ok) {
                const data = await res.json();
                setMaterials(data);
            }
        } catch (err) {
            console.error("Error loading materials", err);
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
        if (!currentMaterial.title || !currentMaterial.link) return;

        try {
            if (currentMaterial.material_id) {
                // Edit
                await fetch(`/api/materials/${currentMaterial.material_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentMaterial)
                });
            } else {
                // Create
                await fetch('/api/materials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentMaterial)
                });
            }
            loadMaterials();
            setIsEditing(false);
            setCurrentMaterial({ category: "Day 1", is_visible: false });
        } catch (err) {
            console.error("Error saving material", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this material?")) {
            try {
                await fetch(`/api/materials/${id}`, { method: 'DELETE' });
                loadMaterials();
            } catch (err) {
                console.error("Error deleting material", err);
            }
        }
    };

    const toggleVisibility = async (material: Material) => {
        try {
            await fetch(`/api/materials/${material.material_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...material, is_visible: !material.is_visible })
            });
            loadMaterials();
        } catch (err) {
            console.error("Error toggling visibility", err);
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
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                            <FolderOpen className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Materials Manager</h1>
                            <p className="text-gray-400 mt-1">Upload and manage Google Drive links for students</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setCurrentMaterial({ category: "Day 1", is_visible: false }); setIsEditing(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" /> Add New Material
                    </button>
                </div>

                <AnimatePresence>
                    {isEditing && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FolderOpen className="w-5 h-5 text-green-400" />
                                    {currentMaterial.material_id ? "Edit Material" : "New Material"}
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Material Title</label>
                                        <input type="text" value={currentMaterial.title || ""} onChange={(e) => setCurrentMaterial({ ...currentMaterial, title: e.target.value })} placeholder="e.g. Day 1 Presentation (PDF)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Category / Day</label>
                                        <div className="flex gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button key={cat} onClick={() => setCurrentMaterial({ ...currentMaterial, category: cat })} className={`flex-1 py-3 rounded-xl border transition-all ${currentMaterial.category === cat ? "bg-green-500/20 border-green-500/40 text-green-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm text-gray-400 mb-2">Google Drive / Resource Link</label>
                                    <input type="url" value={currentMaterial.link || ""} onChange={(e) => setCurrentMaterial({ ...currentMaterial, link: e.target.value })} placeholder="https://docs.google.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500/50" />
                                </div>

                                <div className="mb-6 flex items-center gap-3">
                                    <button
                                        onClick={() => setCurrentMaterial({ ...currentMaterial, is_visible: !currentMaterial.is_visible })}
                                        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${currentMaterial.is_visible ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${currentMaterial.is_visible ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                    <span className="text-sm text-gray-300">
                                        {currentMaterial.is_visible ? "Visible to students" : "Hidden from students"}
                                    </span>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Cancel</button>
                                    <button onClick={handleSave} disabled={!currentMaterial.title || !currentMaterial.link} className="px-8 py-2.5 bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-50 transition-all">Save Material</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid gap-6">
                    {materials.length === 0 && !isEditing ? (
                        <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/3">
                            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No materials uploaded yet.</p>
                            <p className="text-gray-500 text-sm mt-1">Click 'Add New Material' to upload one.</p>
                        </div>
                    ) : (
                        materials.map((material) => (
                            <motion.div key={material.material_id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-6 group hover:border-green-500/30 transition-all">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-xs font-semibold tracking-wide">
                                            {material.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">{material.title}</h3>
                                        {material.is_visible ? (
                                            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                                                <Eye className="w-3 h-3" /> Visible
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                                <EyeOff className="w-3 h-3" /> Hidden
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex items-center justify-between">
                                        <p className="font-mono text-sm text-gray-400 truncate max-w-[80%]">{material.link}</p>
                                        <a href={material.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm font-medium">
                                            Test Link <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2 justify-end md:justify-start pt-2">
                                    <button onClick={() => toggleVisibility(material)} className={`p-3 rounded-xl transition-all ${material.is_visible ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"}`} title={material.is_visible ? "Hide from students" : "Show to students"}>
                                        {material.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => { setCurrentMaterial(material); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-white/5 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-all" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(material.material_id)} className="p-3 bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/20 transition-all" title="Delete">
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
