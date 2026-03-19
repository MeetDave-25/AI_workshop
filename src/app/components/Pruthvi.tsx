import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "pruthvi";
}

const FAQ_RESPONSES: Record<string, string> = {
  "hi|hello|hey|start": "👋 Hi, I am Pruthvi, your AI Assistant! Here's our **Bootcamp Workflow**: \n\n📅 **Day 1: AI Foundation & Ideation + AI Story & Script Creation**\n• Learn AI concepts & ideation\n• Master AI story & script creation\n• Build your first AI project\n\n📅 **Day 2: AI Visual & Video Creation**\n• Create stunning visuals with AI\n• Generate videos using AI tools\n• Learn content creation techniques\n\n📅 **Day 3: Vibe Coding & Product Building**\n• Build complete AI product\n• Code your vibe with cutting-edge tools\n• Showcase your creation! 🚀\n• Get official certificates! 🎓\n\n*Need help with attendance, food, or anything else?* Just ask! 😊",
  "login|signin|password|email": "📧 To login: Enter your email → Enter phone number → Get code on WhatsApp → Verify!",
  "attendance|ticket|generate": "📋 Attendance: Generate Ticket → Show QR to admin → Scanned! Check status instantly ✅",
  "food|coupon|meal|lunch": "🍽️ Food Coupon: Generate → Show QR at counter! 🍽️",
  "scan|admin|verify": "🔍 Admin scans QR → Ticket/Coupon verified automatically! ⚡",
  "schedule|day|bootcamp|workflow": "📅 **Our Bootcamp Schedule:**\n\n📅 **Day 1: AI Foundation & Ideation + AI Story & Script Creation**\n• Learn AI concepts & ideation\n• Master AI story & script creation\n• Build your first AI project\n\n📅 **Day 2: AI Visual & Video Creation**\n• Create stunning visuals with AI\n• Generate videos using AI tools\n• Learn content creation techniques\n\n📅 **Day 3: Vibe Coding & Product Building**\n• Build complete AI product\n• Code your vibe with cutting-edge tools\n• Showcase to everyone! 🚀\n• Get official certificates! 🎓",
  "error|problem|bug|issue": "❌ Try refreshing page or re-login. Still stuck? Contact admin!",
  "help|how|what": "💡 Ask me: Attendance • Food • Login • Scanning • Schedule!",
  "thanks|thank you": "😊 You're welcome! Anything else I can help with?",
};

const QUICK_QUESTIONS = [
  { label: "� Say Hi", query: "Hi" },
  { label: "📋 Attendance Ticket", query: "How do I generate attendance ticket?" },
  { label: "🍽️ Food Coupon", query: "How to get food coupon?" },
  { label: "📅 Schedule & Workflow", query: "What's the bootcamp schedule?" },
  { label: "❓ Having Issues", query: "I'm having issues" },
];

const IDLE_TIME = 90000; // 90 seconds of inactivity
const REAPPEAR_TIME = 30000; // Reappear after 30 seconds

export function Pruthvi() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Character visibility
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi! I'm Pruthvi, your AI Assistant! How can I help you today?",
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
            className="fixed bottom-3 right-3 md:bottom-4 md:right-4 z-40 scale-50 md:scale-60 origin-bottom-right"
          >
            <motion.button
              onClick={handleCharacterClick}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="focus:outline-none group relative"
            >
              {/* Avatar Image */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-24 h-24 md:w-28 md:h-28 cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 blur-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full" />

                {/* Image Container */}
                <img
                  src="/ai_pic.jpg"
                  alt="Pruthvi"
                  className="w-full h-full rounded-full object-cover border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50"
                />

                {/* Click Label */}
                <motion.div
                  animate={{ y: [-12, -18, -12] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2 text-xs bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full whitespace-nowrap font-bold shadow-lg border border-cyan-300"
                >
                  Chat 💬
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
            className="fixed bottom-3 right-3 md:bottom-4 md:right-4 w-[calc(100vw-1.5rem)] md:w-full md:max-w-sm h-[65vh] sm:h-[60vh] md:max-h-[92vh] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/60 rounded-3xl shadow-2xl shadow-cyan-500/30 flex flex-col overflow-hidden z-50"
          >
            {/* Header with Character */}
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-3 md:px-4 py-2.5 md:py-3.5 flex items-center justify-between gap-2 shadow-lg shadow-cyan-500/20">
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                {/* Mini Avatar */}
                <motion.img
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  src="/ai_pic.jpg"
                  alt="Pruthvi"
                  className="w-10 md:w-14 h-10 md:h-14 rounded-full object-cover border-3 border-white shadow-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm md:text-lg truncate">Pruthvi 🤖</h3>
                  <p className="text-xs md:text-sm text-cyan-100 truncate hidden md:block">AI Assistant</p>
                </div>
              </div>
              <motion.button
                onClick={handleCloseChat}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/25 hover:bg-white/40 rounded-full p-1.5 md:p-2 transition-all flex-shrink-0 shadow-lg"
              >
                <X className="w-4 md:w-5 h-4 md:h-5 text-white" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 bg-slate-950/80 min-h-24 md:min-h-56">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed max-w-[85%] md:max-w-xs ${
                      msg.sender === "user"
                        ? "bg-cyan-600/90 text-white rounded-br-none border-2 border-cyan-500 shadow-lg shadow-cyan-500/30"
                        : "bg-indigo-900/80 text-blue-50 rounded-bl-none border-2 border-indigo-500 shadow-lg shadow-indigo-500/20"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Buttons */}
            <div className="px-3 md:px-4 py-3 bg-slate-900/90 border-t-2 border-cyan-500/50 max-h-[22vh] md:max-h-28 overflow-y-auto flex-shrink-0">
              <p className="text-xs text-cyan-300 mb-2 px-1 hidden md:block font-semibold">Quick Questions:</p>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-2.5">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleQuickQuestion(q.query)}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs md:text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-3 py-2 md:py-2.5 rounded-xl border-2 border-indigo-400 transition-all font-semibold line-clamp-2 shadow-md hover:shadow-lg hover:shadow-indigo-500/40"
                  >
                    {q.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t-2 border-cyan-500/50 p-3 md:p-4 bg-slate-900/95 flex gap-2 md:gap-3 items-center flex-shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-800/80 border-2 border-cyan-500/60 rounded-xl px-4 py-2.5 md:py-3 text-white placeholder-gray-400 text-sm md:text-base outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all shadow-md focus:shadow-lg focus:shadow-cyan-500/30"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full p-2.5 md:p-3 transition-all shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 flex-shrink-0"
              >
                <Send className="w-5 md:w-6 h-5 md:h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



