import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "pruthvi";
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  "hi|hello|hey": "Hello! I'm Pruthvi 🤖. How can I help you today?",
  "help|assistance|support": "I'm here to help! You can ask me about:\n• Attendance tickets\n• Food coupons\n• Bootcamp schedule\n• How to use the app\n• General questions",
  "attendance|ticket": "📝 To generate an attendance ticket:\n1. Login as a student\n2. Click 'Daily Attendance'\n3. Select the day\n4. Click 'Generate Day X Ticket'\n5. Show the QR code to admin",
  "food|coupon|meal": "🍽️ To get a food coupon:\n1. Login as a student\n2. Scroll to 'Food Coupons'\n3. Select the day\n4. Click 'Generate Coupon'\n5. Use it for meals",
  "scan|qr|admin": "👮 For admins (scanning):\n1. Go to Admin Dashboard\n2. Click 'Scanner'\n3. Scan QR codes using camera\n4. Also can manually enter IDs\n5. View real-time statistics",
  "login|signin": "🔐 To login:\n• Go to Login page\n• Students: Enter email and phone number\n• Admins: Enter admin credentials\n• Check your email/booking confirmation",
  "day|schedule|bootcamp": "📅 Bootcamp includes 3 days:\nDay 1: AI Foundation & Ideation\nDay 2: Visual & Video Creation\nDay 3: Vibe Coding & Showcase",
  "error|problem|issue|bug": "❌ Encountered an issue?\n• Try refreshing the page\n• Clear browser cache\n• Check internet connection\n• Contact support if problem persists",
  "thanks|thank you": "You're welcome! 😊 Let me know if you need anything else!",
  "bye|goodbye|exit": "Goodbye! Good luck with the bootcamp! 👋",
};

export function Pruthvi() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello, I am Pruthvi 🤖. How can I help you?",
      sender: "pruthvi",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatBoxRef = useRef<HTMLDivElement>(null);
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

    return "I'm not sure about that. Try asking me about attendance, food coupons, login, or how to use the app! 🤔";
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate response delay
    setTimeout(() => {
      const responseText = generateResponse(inputValue);
      const pruthviMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "pruthvi",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, pruthviMessage]);
    }, 500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed z-50 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center cursor-move active:cursor-grabbing transition-all"
        style={{ bottom: `${position.y}vh`, right: `${position.x}vw` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatBoxRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-black border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              bottom: `${position.y + 100}vh`,
              right: `${position.x}vw`,
              width: "350px",
              height: isMinimized ? "60px" : "500px",
              maxHeight: "90vh",
            }}
          >
            {/* Header */}
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3 flex items-center justify-between cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-cyan-600 font-bold">
                  P
                </div>
                <div>
                  <p className="text-white font-bold">Pruthvi</p>
                  <p className="text-xs text-cyan-100">AI Assistant</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-cyan-700 p-1 rounded transition-all"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-cyan-700 p-1 rounded transition-all"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="h-96 overflow-y-auto p-4 space-y-3 bg-black/50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                          msg.sender === "user"
                            ? "bg-cyan-600 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-100 rounded-bl-none"
                        }`}
                      >
                        {msg.text.split("\n").map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-cyan-500/20 p-3 bg-black/80 flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 outline-none text-sm"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
