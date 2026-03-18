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
  "attendance|ticket": "📋 Attendance: Generate Ticket → Show QR to admin → Scanned! Check status instantly ✅",
  "food|coupon|meal|lunch": "🍽️ Food Coupon: Generate → Show QR at counter! 🍽️",
  "scan|admin|verify": "🔍 Admin scans QR → Ticket/Coupon verified automatically! ⚡",
  "schedule|day|bootcamp": "📅 Day 1: Web • Day 2: Database • Day 3: Full Stack 🚀",
  "error|problem|bug|issue": "❌ Try refreshing page or re-login. Still stuck? Contact admin!",
  "help|how|what": "💡 Ask me: Attendance • Food • Login • Scanning • Schedule!",
};

export function Pruthvi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Pruthvi 👋 How can I help you?",
      sender: "pruthvi",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

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

  return (
    <>
      {/* Character Avatar - Pop Up from Bottom Right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 200, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 200, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="focus:outline-none group"
            >
              {/* Character Body */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-24 h-32 cursor-pointer"
              >
                {/* Head - Large Circle */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 left-4 w-16 h-16 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-full border-4 border-cyan-400 shadow-lg"
                >
                  {/* Eyes */}
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 1 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 1.1 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  </div>

                  {/* Mouth */}
                  <div className="flex justify-center mt-2">
                    <motion.svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      animate={{ scaleY: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path d="M 2 2 Q 6 6 10 2" stroke="white" strokeWidth="1.5" fill="none" />
                    </motion.svg>
                  </div>
                </motion.div>

                {/* Body - Rectangle */}
                <div className="absolute top-16 left-3 w-12 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg border-2 border-blue-400 shadow-lg" />

                {/* Left Arm */}
                <motion.div
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-16 left-0 w-3 h-8 bg-cyan-300 rounded-full origin-top-right"
                />

                {/* Right Arm */}
                <motion.div
                  animate={{ rotate: [0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  className="absolute top-16 right-0 w-3 h-8 bg-cyan-300 rounded-full origin-top-left"
                />

                {/* Click Label */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-cyan-400 text-white px-2 py-1 rounded-full whitespace-nowrap font-bold shadow-lg"
                >
                  Click me! 👆
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
            className="fixed bottom-6 right-6 w-80 h-96 bg-gradient-to-b from-gray-900 to-black border-3 border-cyan-400/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header with Character */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mini Avatar */}
                <div className="w-12 h-12 bg-cyan-300 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <div className="text-2xl">🤖</div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Pruthvi</h3>
                  <p className="text-xs text-cyan-100">Your Assistant</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/40">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-cyan-500/40 text-cyan-50 rounded-br-none border border-cyan-400/50"
                        : "bg-blue-600/30 text-blue-50 rounded-bl-none border border-blue-400/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-cyan-400/30 p-3 bg-black/60 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me..."
                className="flex-1 bg-white/10 border border-cyan-400/40 rounded-full px-4 py-2 text-white placeholder-gray-400 text-sm outline-none focus:border-cyan-400 transition-all"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full p-2 transition-all"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

