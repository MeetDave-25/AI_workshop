import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, UserPlus, Trash2, Shield, Users, AlertCircle, CheckCircle2 } from "lucide-react";

export function AdminStudents() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Single Student Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        semester: "",
        ticket_type: "General",
        booking_id: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate("/login");
            return;
        }
        fetchStudents();
    }, [isAdmin, navigate]);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/admin/students");
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    };

    const showMessage = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                showMessage("success", "Student registered successfully");
                setFormData({ name: "", email: "", phone: "", college: "", semester: "", ticket_type: "General", booking_id: "" });
                fetchStudents();
            } else {
                showMessage("error", data.message || "Failed to register student");
            }
        } catch (err) {
            showMessage("error", "Network error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/students/bulk", {
                method: "POST",
                body: formData // No Content-Type header needed, browser sets it for FormData
            });

            const data = await res.json();

            if (res.ok) {
                let msg = data.message;
                if (data.errors && data.errors.length > 0) {
                    msg += `. ${data.errors.length} rows had errors.`;
                    console.error("Upload Errors:", data.errors);
                }
                showMessage(data.successCount > 0 ? "success" : "error", msg);
                fetchStudents();
            } else {
                showMessage("error", data.message || "Upload failed");
            }
        } catch (err) {
            showMessage("error", "Network error occurred during upload");
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleClearDatabase = async () => {
        if (!window.confirm("WARNING: This will delete ALL students from the database. This action cannot be undone. Are you sure?")) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/students/clear", {
                method: "DELETE"
            });

            const data = await res.json();
            if (res.ok) {
                showMessage("success", "Database cleared successfully");
                fetchStudents();
            } else {
                showMessage("error", data.message || "Failed to clear database");
            }
        } catch (err) {
            showMessage("error", "Network error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden pb-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 max-w-6xl py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <motion.button
                        onClick={() => navigate("/admin")}
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </motion.button>
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                        Student Management
                    </h1>
                    <p className="text-gray-400">
                        Add individual students or upload bulk registrations.
                    </p>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 \${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Single Add Form */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <UserPlus className="w-6 h-6 text-cyan-400" />
                            <h2 className="text-xl font-semibold">Single Registration</h2>
                        </div>

                        <form onSubmit={handleSingleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Name *</label>
                                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Phone/Enrollment *</label>
                                    <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Email Address *</label>
                                <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">College</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Semester/Course</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                            >
                                {isLoading ? "Adding..." : "Add Student"}
                            </button>
                        </form>
                    </div>

                    {/* Bulk Actions */}
                    <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Upload className="w-6 h-6 text-purple-400" />
                                    <h2 className="text-xl font-semibold">Bulk Upload (CSV/Excel)</h2>
                                </div>
                                <p className="text-gray-400 text-sm mb-6">
                                    Upload a roster containing student headers like Name, Email, Phone, College, and Semester.
                                </p>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleBulkUpload}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="w-full py-4 border-2 border-dashed border-white/20 hover:border-purple-400 rounded-xl text-gray-400 hover:text-white transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span>Click to select file</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-6 h-6 text-red-400" />
                                <h2 className="text-xl font-semibold text-red-200">Danger Zone</h2>
                            </div>
                            <p className="text-red-400/70 text-sm mb-6">
                                Need to start fresh? This action will permanently remove all student records from the database.
                            </p>
                            <button
                                onClick={handleClearDatabase}
                                disabled={isLoading}
                                className="w-full py-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All Students
                            </button>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Student Roster ({students.length})</h2>
                        <button onClick={fetchStudents} className="text-sm text-cyan-400 hover:text-cyan-300">Refresh</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="p-4 font-medium text-gray-400">Name</th>
                                    <th className="p-4 font-medium text-gray-400">Email</th>
                                    <th className="p-4 font-medium text-gray-400">Phone</th>
                                    <th className="p-4 font-medium text-gray-400">College</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">{student.name}</td>
                                        <td className="p-4 text-gray-400">{student.email}</td>
                                        <td className="p-4 text-gray-400">{student.phone}</td>
                                        <td className="p-4 text-gray-400">{student.college || "-"}</td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No students found in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
