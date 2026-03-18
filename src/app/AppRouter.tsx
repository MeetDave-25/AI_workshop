import { Routes, Route } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminScanner } from "./components/AdminScanner";
import { AdminPrompts } from "./components/AdminPrompts";
import { AdminStudents } from "./components/AdminStudents";

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/scanner" element={<AdminScanner />} />
            <Route path="/admin/prompts" element={<AdminPrompts />} />
            <Route path="/admin/students" element={<AdminStudents />} />
        </Routes>
    );
}
