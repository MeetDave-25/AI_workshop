import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "pruthvi";
}

const FAQ_RESPONSES: Record<string, string> = {
  "login|signin|password|email": "📧 To login: Enter your email → Enter phone number → Get code on WhatsApp → Verify!",
  "attendance|ticket|generate": "📋 Attendance: Generate Ticket → Show QR to admin → Scanned! Check status instantly ✅",
  "food|coupon|meal|lunch": "🍽️ Food Coupon: Generate → Show QR at counter! 🍽️",
  "scan|admin|verify": "🔍 Admin scans QR → Ticket/Coupon verified automatically! ⚡",
  "schedule|day|bootcamp": "📅 Day 1: Web • Day 2: Database • Day 3: Full Stack 🚀",
  "error|problem|bug|issue": "❌ Try refreshing page or re-login. Still stuck? Contact admin!",
  "help|how|what": "💡 Ask me: Attendance • Food • Login • Scanning • Schedule!",
};

const QUICK_QUESTIONS = [
  { label: "📋 Attendance Ticket", query: "How do I generate attendance ticket?" },
  { label: "🍽️ Food Coupon", query: "How to get food coupon?" },
  { label: "🔍 Admin Scanning", query: "How does admin scanning work?" },
  { label: "📅 Schedule", query: "What's the bootcamp schedule?" },
  { label: "❓ Having Issues", query: "I'm having issues" },
];

const IDLE_TIME = 90000; // 90 seconds of inactivity
const REAPPEAR_TIME = 30000; // Reappear after 30 seconds

export function Pruthvi() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Character visibility
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Pruthvi 👋 How can I help you today?",
      sender: "pruthvi",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reappearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset idle timer on any user activity
  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (reappearTimerRef.current) clearTimeout(reappearTimerRef.current);

    // Show character if it was hidden
    setIsVisible(true);

    // Set timer to hide character after idle period
    idleTimerRef.current = setTimeout(() => {
      setIsVisible(false);

      // Set timer to reappear
      reappearTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, REAPPEAR_TIME);
    }, IDLE_TIME);
  };

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = () => resetIdleTimer();
    const handleKeyPress = () => resetIdleTimer();
    const handleClick = () => resetIdleTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("click", handleClick);

    // Initialize idle timer
    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("click", handleClick);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (reappearTimerRef.current) clearTimeout(reappearTimerRef.current);
    };
  }, []);

  // External method to open chat (called from Navigation or elsewhere)
  useEffect(() => {
    (window as any).openPruthviChat = () => {
      setIsOpen(true);
      setIsVisible(true);
      resetIdleTimer();
    };

    return () => {
      delete (window as any).openPruthviChat;
    };
  }, []);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    for (const [keywords, response] of Object.entries(FAQ_RESPONSES)) {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerMessage.includes(keyword))) {
        return response;
      }
    }
    return "💭 Not sure! Ask me about: Attendance • Food • Login • Admin • Schedule!";
  };

  const handleQuickQuestion = (query: string) => {
    resetIdleTimer();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responseText = generateResponse(query);
      const pruthviMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "pruthvi",
      };
      setMessages((prev) => [...prev, pruthviMessage]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    resetIdleTimer();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const responseText = generateResponse(inputValue);
      const pruthviMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "pruthvi",
      };
      setMessages((prev) => [...prev, pruthviMessage]);
    }, 500);
  };

  const handleCharacterClick = () => {
    resetIdleTimer();
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    resetIdleTimer();
  };

  return (
    <>
      {/* Character Avatar - Pop Up from Bottom Right */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 200, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 200, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={handleCharacterClick}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="focus:outline-none group"
            >
              {/* Character Body */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-28 h-36 cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 blur-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full" />

                {/* Head - Beautiful Circle */}
                <motion.div
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 left-2 w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 rounded-full border-4 border-yellow-300 shadow-xl"
                >
                  {/* Forehead shine */}
                  <div className="absolute top-2 left-3 w-6 h-2 bg-white/40 rounded-full blur-sm" />

                  {/* Eyes */}
                  <div className="flex items-center justify-center gap-4 mt-3 px-3">
                    {/* Left Eye */}
                    <motion.div
                      animate={{
                        scaleY: [1, 0.2, 1],
                        y: [0, 1, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="relative w-4 h-4 bg-white rounded-full border-2 border-gray-800 overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: [1, -1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-2 h-2 bg-gray-900 rounded-full top-1 left-1"
                      />
                    </motion.div>

                    {/* Right Eye */}
                    <motion.div
                      animate={{
                        scaleY: [1, 0.2, 1],
                        y: [0, 1, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
                      className="relative w-4 h-4 bg-white rounded-full border-2 border-gray-800 overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: [1, -1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-2 h-2 bg-gray-900 rounded-full top-1 left-1"
                      />
                    </motion.div>
                  </div>

                  {/* Smile/Mouth */}
                  <div className="flex justify-center mt-3">
                    <motion.svg
                      width="16"
                      height="10"
                      viewBox="0 0 16 10"
                      animate={{
                        scaleY: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <path
                        d="M 2 3 Q 8 7 14 3"
                        stroke="#333"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </div>

                  {/* Blush */}
                  <motion.div
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-9 left-1 w-2 h-2 bg-pink-300/60 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-9 right-1 w-2 h-2 bg-pink-300/60 rounded-full blur-sm"
                  />
                </motion.div>

                {/* Body - Trapezoid */}
                <div className="absolute top-16 left-1 w-24 h-10 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl border-3 border-blue-400 shadow-lg">
                  {/* Chest shine */}
                  <div className="absolute top-1 left-3 w-8 h-2 bg-white/30 rounded-full blur-sm" />
                </div>

                {/* Left Arm */}
                <motion.div
                  animate={{
                    rotate: [10, 35, 10],
                    x: [-2, 2, -2],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-16 -left-1 w-4 h-12 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full origin-top-right shadow-md border border-yellow-300"
                />

                {/* Right Arm */}
                <motion.div
                  animate={{
                    rotate: [10, -35, 10],
                    x: [2, -2, 2],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  className="absolute top-16 -right-1 w-4 h-12 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full origin-top-left shadow-md border border-yellow-300"
                />

                {/* Click Label */}
                <motion.div
                  animate={{ y: [-12, -18, -12] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1.5 rounded-full whitespace-nowrap font-bold shadow-lg border border-cyan-300"
                >
                  Click me! 💬
                </motion.div>
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 w-96 max-h-[90vh] bg-gradient-to-b from-slate-900 via-blue-900/20 to-black border-3 border-cyan-400/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header with Character */}
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mini Avatar */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center border-3 border-white shadow-lg relative overflow-hidden"
                >
                  {/* Eyes */}
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-800 rounded-full" />
                    <div className="w-2 h-2 bg-gray-800 rounded-full" />
                  </div>
                  {/* Shine */}
                  <div className="absolute top-1 left-2 w-2 h-2 bg-white/50 rounded-full blur-sm" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-lg">Pruthvi</h3>
                  <p className="text-xs text-cyan-100">AI Assistant</p>
                </div>
              </div>
              <motion.button
                onClick={handleCloseChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/50 min-h-56">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm font-medium ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500/50 to-blue-500/50 text-cyan-50 rounded-br-none border border-cyan-400/50"
                        : "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-blue-50 rounded-bl-none border border-blue-400/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Buttons */}
            <div className="px-3 py-2 bg-black/60 border-t border-cyan-400/20">
              <p className="text-xs text-gray-400 mb-2 px-1">Quick Questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleQuickQuestion(q.query)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs bg-gradient-to-r from-blue-600/40 to-indigo-600/40 hover:from-blue-600/60 hover:to-indigo-600/60 text-blue-100 px-3 py-2 rounded-lg border border-blue-400/40 transition-all font-medium"
                  >
                    {q.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-cyan-400/30 p-3 bg-black/70 flex gap-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a question..."
                className="flex-1 bg-white/10 border border-cyan-400/40 rounded-full px-4 py-2 text-white placeholder-gray-400 text-sm outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full p-2.5 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



