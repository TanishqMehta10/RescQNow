import React, { useRef, useState } from "react";
import { Send, Mic, MicOff, Volume2, Loader2 } from "lucide-react";

// Message type
type Message = { role: "user" | "assistant"; text: string };

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    [
      { role: "assistant", text: "नमस्ते! I am Sahayak, your safety assistant. How can I help you today?" },
    ]
  );
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Simulate AI response (replace with real API call)
  const getAIResponse = async (question: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (question.toLowerCase().includes("police")) return "The nearest police station is 1.2km away at MG Road.";
    if (question.toLowerCase().includes("help")) return "You can press the SOS button or call the tourist helpline: 100.";
    if (question.toLowerCase().includes("hospital")) return "The nearest hospital is Apollo Hospital, 2km from your location.";
    if (question.toLowerCase().includes("unsafe")) return "Thank you for reporting. Your concern will be forwarded to the authorities.";
    if (question.toLowerCase().includes("qr")) return "You can view your Digital ID and QR code in your Profile section.";
    return "I'm here to assist you with safety, travel, and emergency information. Please ask your question.";
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const aiText = await getAIResponse(userMsg.text);
    setMessages((m) => [...m, { role: "assistant", text: aiText }]);
    speak(aiText);
  };

  // Voice input
  const startListening = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      setInput(transcript);
      setRecording(false);
      rec.stop();
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
  };
  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) rec.stop();
    setRecording(false);
  };

  // Voice output
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // Quick actions
  const quickActions = [
    { label: "Nearest Police Station", value: "Where is the nearest police station?" },
    { label: "Nearest Hospital", value: "Where is the nearest hospital?" },
    { label: "Report Unsafe Area", value: "I want to report an unsafe area." },
    { label: "Show My QR", value: "How do I view my Digital ID QR code?" },
    { label: "Emergency Help", value: "How do I get emergency help?" },
  ];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-[32rem] rounded-2xl shadow-2xl border-2 border-[#1a237e] bg-gradient-to-br from-[#e3f2fd] via-[#f5f5f5] to-[#fffde7]">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1a237e] to-[#2e7d32] text-white rounded-t-2xl">
        <span className="text-lg font-bold tracking-wide">Sahayak – AI Assistant</span>
        <span className="text-xs bg-[#ff9800] text-white px-2 py-1 rounded">Beta</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-2 rounded-xl text-base shadow transition-all duration-200 ${
              m.role === "assistant"
                ? "bg-[#e3f2fd] text-[#1a237e] self-start animate-fade-in"
                : "bg-[#2e7d32] text-white ml-auto animate-fade-in"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-[#1a237e]">
            <Loader2 className="animate-spin" /> <span>Thinking…</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 px-4 py-2 bg-[#f5f5f5] border-t">
        {quickActions.map((q) => (
          <button
            key={q.label}
            onClick={() => setInput(q.value)}
            className="text-xs bg-[#ff9800] text-white px-3 py-1 rounded-full hover:bg-[#fb8c00] transition"
          >
            {q.label}
          </button>
        ))}
      </div>
      <div className="p-3 flex items-center space-x-2 border-t bg-white rounded-b-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type or ask your question…"
          className="flex-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#1a237e] text-[#1a237e]"
        />
        <button onClick={send} className="p-2 rounded-xl bg-[#2e7d32] text-white hover:bg-[#1a237e] transition">
          <Send className="w-5 h-5" />
        </button>
        <button
          onClick={recording ? stopListening : startListening}
          className={`p-2 rounded-xl ${recording ? "bg-red-600 text-white" : "bg-[#ff9800] text-white"}`}
        >
          {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button
          onClick={() => {
            const last = messages[messages.length - 1];
            if (last?.role === "assistant") speak(last.text);
          }}
          className="p-2 rounded-xl bg-[#e3f2fd] text-[#1a237e]"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


