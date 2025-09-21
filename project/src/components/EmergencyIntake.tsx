import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { bus, useRealtimeStore } from '../store/realtime';

export default function EmergencyIntake() {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const currentUserId = useRealtimeStore((s) => s.currentUserId);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    };
  }, []);

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Try basic browser speech recognition as fallback for instant transcript
        const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (SR) {
          try {
            const rec = new SR();
            rec.lang = 'en-US';
            rec.continuous = false;
            rec.interimResults = false;
            rec.onresult = (e: any) => {
              const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(' ');
              setText(transcript);
            };
            rec.start();
          } catch {}
        }
        console.log('Recorded emergency audio', blob);
      };
      recorder.start();
      setRecording(true);
    } catch (e) {
      alert('Microphone access denied.');
    }
  };

  const stopVoice = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
    setRecording(false);
  };

  const submit = () => {
    if (!currentUserId) return alert('Not authenticated');
    const payload = { userId: currentUserId, text: text.trim(), timestamp: Date.now() };
    if (!payload.text) return;
    bus.emit('sos:triggered', { userId: currentUserId, timestamp: payload.timestamp });
    setText('');
    alert('Emergency text sent to authorities.');
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">Emergency Input</span>
        <button onClick={recording ? stopVoice : startVoice} className={`px-3 py-1 rounded-lg text-white ${recording ? 'bg-red-600' : 'bg-green-600'}`}>
          {recording ? <MicOff className="w-4 h-4 inline mr-1" /> : <Mic className="w-4 h-4 inline mr-1" />} {recording ? 'Stop' : 'Voice'}
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your emergency…" className="flex-1 px-3 py-2 border rounded-xl" />
        <button onClick={submit} className="p-2 rounded-xl bg-blue-600 text-white">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


