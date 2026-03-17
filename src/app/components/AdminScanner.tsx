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
    }, []);

    const loadCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
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

    const processScannedData = (decodedText: string) => {
        stopCamera();

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
            if (decodedText.startsWith("AIBC-")) {
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
            const res = await fetch('/api/admin/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coupon_id: id.trim() })
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
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
                (decodedText) => processScannedData(decodedText),
                () => { }
            );
            setIsCameraActive(true);
        } catch (err) {
            setScanResult({ status: "invalid_qr", message: "Could not access camera." });
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

    const scanAnother = () => {
        setScanResult(null);
        if (mode === "camera") startCamera();
    };

    const dayCoupons = allCoupons.filter((c) => c.day === activeDay);
    const dayRedeemed = dayCoupons.filter((c) => c.is_used);
    const dayPending = dayCoupons.filter((c) => !c.is_used);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 max-w-5xl py-12">
                <motion.button onClick={() => { stopCamera(); navigate("/admin"); }} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </motion.button>

                <motion.div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl">
                        <ScanLine className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent">Scan & Redeem</h1>
                </motion.div>

                <div className="flex justify-center mb-8">
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        <button onClick={() => { setMode("camera"); stopCamera(); setScanResult(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${mode === "camera" ? "bg-gradient-to-r from-green-500 to-cyan-500 shadow-lg" : "text-gray-400"}`}><Camera className="w-4 h-4" /> Camera Scan</button>
                        <button onClick={() => { setMode("manual"); stopCamera(); setScanResult(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${mode === "manual" ? "bg-gradient-to-r from-green-500 to-cyan-500 shadow-lg" : "text-gray-400"}`}><Search className="w-4 h-4" /> Manual Entry</button>
                    </div>
                </div>

                {mode === "camera" && (
                    <motion.div className="mb-8 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl">
                        {!isCameraActive && !scanResult ? (
                            <div className="text-center py-8">
                                <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <motion.button onClick={startCamera} className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center gap-3 mx-auto"><Camera className="w-6 h-6" /> Start Camera</motion.button>
                            </div>
                        ) : isCameraActive ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-green-300 text-sm">Camera Active</span>
                                    <button onClick={stopCamera} className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg"><CameraOff className="w-4 h-4" /></button>
                                </div>
                                <div id="qr-reader" className="rounded-2xl overflow-hidden mx-auto" style={{ maxWidth: 400 }} />
                            </div>
                        ) : null}
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
                                <div className="p-6 bg-green-500/10 border-2 border-green-500/40 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-4"><CheckCircle2 className="w-10 h-10 text-green-400" /><div><h3 className="text-2xl text-green-300">Entry Done! ✅</h3></div></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <InfoCard icon={User} label="Student" value={scanResult.coupon.student_name} />
                                        <InfoCard icon={Hash} label="ID" value={scanResult.coupon.coupon_id.substring(0, 10) + "..."} />
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
                        {dayCoupons.map((coupon, i) => (
                            <div key={coupon.coupon_id} className={`grid grid-cols-12 gap-2 p-3 rounded-xl border ${coupon.is_used ? "bg-green-500/5 border-green-500/10" : "bg-white/5 border-white/5"}`}>
                                <span className="col-span-1 text-gray-500 text-sm">{i + 1}</span>
                                <span className="col-span-3 text-white text-sm truncate">{coupon.student_name}</span>
                                <span className="col-span-3 text-gray-400 text-sm truncate">{coupon.student_email || coupon.coupon_id.slice(0, 10)}</span>
                                <span className="col-span-3 text-gray-500 text-xs">{coupon.redeemed_at ? new Date(coupon.redeemed_at).toLocaleTimeString() : "—"}</span>
                                <span className="col-span-2 text-right">
                                    {coupon.is_used ? <span className="text-green-300">Done</span> : <span className="text-cyan-300">Pending</span>}
                                </span>
                            </div>
                        ))}
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
