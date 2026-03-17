import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Sparkles, User, LogOut, Shield } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, isAdmin, currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Workflow", href: "#workflow" },
    { label: "Tools", href: "#tools" },
    { label: "Prompts", href: "#prompts" },
    { label: "Coupon", href: "#coupon" },
    { label: "Team", href: "#team" },
    { label: "Certification", href: "#certification" },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              AI Bootcamp 2026
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group text-sm"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}

            {/* Auth buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <a
                    href="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all text-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </a>
                )}
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-sm text-gray-300">{currentUser?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="text-white text-sm">Login</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-2"
                >
                  {item.label}
                </motion.a>
              ))}

              {isLoggedIn ? (
                <>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-white">{currentUser?.name}</span>
                    </div>
                    {isAdmin && (
                      <a
                        href="/admin"
                        onClick={handleNavClick}
                        className="block px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-center mb-3"
                      >
                        Admin Panel
                      </a>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        handleNavClick();
                      }}
                      className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <motion.a
                  href="/login"
                  onClick={handleNavClick}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-center text-white"
                >
                  Login
                </motion.a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
