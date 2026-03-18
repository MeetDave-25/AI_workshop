import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Html5Qrcode } from "html5-qrcode";
import {
    ScanLine,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Search,
    Ticket,
    ShieldAlert,
    Calendar,
    User,
    Hash,
    Clock,
    Camera,
    CameraOff,
    type LucideIcon,
} from "lucide-react";

interface CouponData {
    id?: string;
    coupon_id: string;
    student_name: string;
    student_email: string;
    day: number;
    date: string;
    is_used: boolean;
    redeemed_at?: string;
}

interface ScanResult {
    status: "valid" | "already_used" | "not_found" | "invalid_qr";
    coupon?: CouponData;
    message?: string;
}

export function AdminScanner() {
    const [scanType, setScanType] = useState<"food" | "attendance">("attendance");
    const [couponId, setCouponId] = useState("");
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [activeDay, setActiveDay] = useState(1);
    const [allCoupons, setAllCoupons] = useState<CouponData[]>([]);
    const [mode, setMode] = useState<"camera" | "manual">("camera");
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadCoupons();
        return () => {
            stopCamera();
        };
    }, [scanType]);

    const loadCoupons = async () => {
        try {
            const endpoint = scanType === "food" ? '/api/admin/coupons' : '/api/admin/attendance';
            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                setAllCoupons(data);
            }
        } catch (err) {
            console.error("Error loading coupons", err);
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-3xl max-w-md">
                    <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl text-white mb-4">Access Denied</h2>
                    <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
                    <button onClick={() => navigate("/login")} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white">
                        Login as Admin
                    </button>
                </div>
            </div>
        );
    }

    const processScannedData = async (decodedText: string) => {
        await stopCamera();

        let couponIdToVerify = "";
        try {
            const data = JSON.parse(decodedText);
            if (data.id) {
                couponIdToVerify = data.id;
            } else {
                setScanResult({ status: "invalid_qr", message: "QR does not contain a valid coupon." });
                return;
            }
        } catch {
            if (decodedText.startsWith("AIBC-") || decodedText.startsWith("ATND-")) {
                couponIdToVerify = decodedText;
            } else {
                setScanResult({ status: "invalid_qr", message: "Invalid QR code." });
                return;
            }
        }

        verifyCouponById(couponIdToVerify);
    };

    const verifyCouponById = async (id: string) => {
        setIsScanning(true);
        try {
            // Determine the endpoint automatically based on prefix, or use selected scan type as fallback
            const isAttendance = id.startsWith("ATND-") || (scanType === "attendance" && !id.startsWith("AIBC-"));
            const endpoint = isAttendance ? '/api/admin/attendance/verify' : '/api/admin/coupons/verify';
            const bodyPayload = isAttendance ? { ticket_id: id.trim() } : { coupon_id: id.trim() };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });
            const data = await res.json();
            setScanResult(data);
            if (data.status === 'valid') {
                loadCoupons(); // Refresh list immediately
            }
        } catch (err) {
            setScanResult({ status: 'invalid_qr', message: 'Network error communicating with server.' });
        } finally {
            setIsScanning(false);
            setCouponId("");
        }
    };

    const startCamera = async () => {
        setScanResult(null);
        try {
            // Stop any existing scanner first
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.getState() === 2) await scannerRef.current.stop();
                } catch { }
                scannerRef.current = null;
            }

            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
                (decodedText) => {
                    // Call async function without waiting to avoid blocking the scanner
                    processScannedData(decodedText).catch((err) => {
                        console.error("Error processing scanned data:", err);
                        setScanResult({ status: "invalid_qr", message: "Error processing scan." });
                    });
                },
                () => { }
            );
            setIsCameraActive(true);
        } catch (err) {
            console.error("Camera start error:", err);
            setScanResult({ status: "invalid_qr", message: "Could not access camera. Please check permissions." });
        }
    };

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.getState() === 2) await scannerRef.current.stop();
            } catch { }
            scannerRef.current = null;
        }
        setIsCameraActive(false);
    };

    const scanAnother = async () => {
        setScanResult(null);
        setCouponId(""); // Clear input for manual mode
        if (mode === "camera") {
            await stopCamera();
            setTimeout(() => startCamera(), 300);
        }
    };

    const dayCoupons = allCoupons.filter((c) => c.day === activeDay);
    const dayRedeemed = dayCoupons.filter((c) => scanType === 'food' ? c.is_used : (c as any).is_scanned);
    const dayPending = dayCoupons.filter((c) => scanType === 'food' ? !c.is_used : !(c as any).is_scanned);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${scanType === 'food' ? 'bg-green-500/5' : 'bg-blue-500/5'}`} />
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${scanType === 'food' ? 'bg-cyan-500/5' : 'bg-indigo-500/5'}`} />

            <div className="relative z-10 container mx-auto px-4 max-w-5xl py-12">
                <motion.button onClick={() => { stopCamera(); navigate("/admin"); }} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </motion.button>

                <motion.div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br rounded-2xl ${scanType === 'food' ? 'from-green-400 to-cyan-500' : 'from-blue-400 to-indigo-500'}`}>
                        <ScanLine className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-3xl md:text-4xl mb-2 bg-gradient-to-r bg-clip-text text-transparent ${scanType === 'food' ? 'from-green-300 to-cyan-300' : 'from-blue-300 to-indigo-300'}`}>
                        {scanType === 'food' ? "Scan & Redeem Food" : "Scan Attendance"}
                    </h1>
                </motion.div>

                {/* Scan Type Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/5 rounded-xl p-1 border border-white/10 flex">
                        <button onClick={() => { setScanType("attendance"); stopCamera(); setScanResult(null); }} className={`px-6 py-2 rounded-lg transition-all ${scanType === "attendance" ? "bg-blue-500/30 text-blue-300" : "text-gray-400"}`}>Attendance</button>
                        <button onClick={() => { setScanType("food"); stopCamera(); setScanResult(null); }} className={`px-6 py-2 rounded-lg transition-all ${scanType === "food" ? "bg-green-500/30 text-green-300" : "text-gray-400"}`}>Food Coupons</button>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        <button onClick={() => { setMode("camera"); stopCamera(); setScanResult(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${mode === "camera" ? "bg-gradient-to-r from-green-500 to-cyan-500 shadow-lg" : "text-gray-400"}`}><Camera className="w-4 h-4" /> Camera Scan</button>
                        <button onClick={() => { setMode("manual"); stopCamera(); setScanResult(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${mode === "manual" ? "bg-gradient-to-r from-green-500 to-cyan-500 shadow-lg" : "text-gray-400"}`}><Search className="w-4 h-4" /> Manual Entry</button>
                    </div>
                </div>

                {mode === "camera" && (
                    <motion.div className="mb-8 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-green-300 text-sm">
                                {isCameraActive ? "Camera Active" : "Camera Scan"}
                            </span>
                            {isCameraActive && (
                                <button onClick={stopCamera} className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg"><CameraOff className="w-4 h-4" /></button>
                            )}
                        </div>
                        <div className="relative mx-auto rounded-2xl overflow-hidden bg-white/5" style={{ maxWidth: 400, minHeight: 250 }}>
                            <div id="qr-reader" className="w-full" />
                            {!isCameraActive && !scanResult && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                                    <Camera className="w-12 h-12 text-gray-500 mb-4" />
                                    <button onClick={startCamera} className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center gap-2">
                                        <Camera className="w-5 h-5" /> Start Camera
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {mode === "manual" && (
                    <motion.div className="mb-8 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl">
                        <h3 className="text-lg mb-4 text-white flex items-center gap-2"><Search className="w-5 h-5 text-cyan-400" /> Enter ID</h3>
                        <div className="flex gap-3">
                            <input type="text" value={couponId} onChange={(e) => setCouponId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verifyCouponById(couponId)} placeholder="e.g. AIBC-D1-..." className="flex-1 px-4 py-4 bg-white/5 rounded-xl border border-white/20 font-mono" />
                            <button onClick={() => verifyCouponById(couponId)} disabled={isScanning || !couponId} className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl">{isScanning ? '...' : 'Verify'}</button>
                        </div>
                    </motion.div>
                )}

                {/* Scan Result */}
                <AnimatePresence mode="wait">
                    {scanResult && (
                        <motion.div key={scanResult.status + Date.now()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
                            {scanResult.status === "valid" && scanResult.coupon && (
                                <div className={`p-6 border-2 rounded-3xl ${scanType === 'food' ? 'bg-green-500/10 border-green-500/40' : 'bg-blue-500/10 border-blue-500/40'}`}>
                                    <div className="flex items-center gap-3 mb-4"><CheckCircle2 className={`w-10 h-10 ${scanType === 'food' ? 'text-green-400' : 'text-blue-400'}`} /><div><h3 className={`text-2xl ${scanType === 'food' ? 'text-green-300' : 'text-blue-300'}`}>Entry Done! ✅</h3></div></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <InfoCard icon={User} label="Student" value={scanResult.coupon.student_name} />
                                        <InfoCard icon={Hash} label="ID" value={(scanResult.coupon as any).ticket_id?.substring(0, 10) || scanResult.coupon.coupon_id?.substring(0, 10) || "..."} />
                                        <InfoCard icon={Calendar} label="Day" value={`Day ${scanResult.coupon.day}`} />
                                        <InfoCard icon={Clock} label="Time" value={new Date().toLocaleTimeString()} />
                                    </div>
                                    <button onClick={scanAnother} className="w-full py-3 bg-green-500/20 text-green-300 rounded-xl">Scan Next</button>
                                </div>
                            )}
                            {scanResult.status === "already_used" && scanResult.coupon && (
                                <div className="p-6 bg-red-500/10 border-2 border-red-500/40 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-4"><XCircle className="w-10 h-10 text-red-400" /><div><h3 className="text-2xl text-red-300">Duplicate! Already Used ❌</h3></div></div>
                                    <button onClick={scanAnother} className="w-full py-3 bg-white/10 text-white rounded-xl">Scan Next</button>
                                </div>
                            )}
                            {scanResult.status === "not_found" && (
                                <div className="p-6 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-3xl text-center"><XCircle className="w-10 h-10 text-yellow-400 mx-auto mb-2" /><p className="text-yellow-300">Coupon Not Found</p><button onClick={scanAnother} className="mt-4 px-6 py-2 bg-white/10 rounded-xl">Try Again</button></div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Day-wise Report */}
                <motion.div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl">
                    <h3 className="text-xl mb-6 text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-400" /> Day-wise Report</h3>
                    <div className="flex gap-3 mb-6">
                        {[1, 2, 3].map((day) => {
                            const count = allCoupons.filter((c) => c.day === day).length;
                            const used = allCoupons.filter((c) => c.day === day && c.is_used).length;
                            return (
                                <button key={day} onClick={() => setActiveDay(day)} className={`flex-1 p-4 rounded-xl border ${activeDay === day ? "bg-cyan-500/20 border-cyan-500/40" : "bg-white/5 border-white/10"}`}>
                                    <p className={`text-lg font-bold ${activeDay === day ? "text-cyan-300" : "text-white"}`}>Day {day}</p>
                                    <p className="text-sm text-gray-400">{used}/{count} redeemed</p>
                                </button>
                            );
                        })}
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {dayCoupons.map((coupon, i) => {
                            const isDone = scanType === 'food' ? coupon.is_used : (coupon as any).is_scanned;
                            const idStr = (coupon as any).ticket_id || coupon.coupon_id;
                            const timeStr = scanType === 'food' ? coupon.redeemed_at : (coupon as any).scanned_at;
                            return (
                                <div key={idStr} className={`grid grid-cols-12 gap-2 p-3 rounded-xl border ${isDone ? "bg-green-500/5 border-green-500/10" : "bg-white/5 border-white/5"}`}>
                                    <span className="col-span-1 text-gray-500 text-sm">{i + 1}</span>
                                    <span className="col-span-3 text-white text-sm truncate">{coupon.student_name}</span>
                                    <span className="col-span-3 text-gray-400 text-sm truncate">{coupon.student_email || idStr?.slice(0, 10)}</span>
                                    <span className="col-span-3 text-gray-500 text-xs">{timeStr ? new Date(timeStr).toLocaleTimeString() : "—"}</span>
                                    <span className="col-span-2 text-right">
                                        {isDone ? <span className="text-green-300">Done</span> : <span className="text-gray-500">Pending</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function InfoCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
    return (
        <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Icon className="w-3 h-3" /> {label}</p>
            <p className="text-white text-sm">{value}</p>
        </div>
    );
}
