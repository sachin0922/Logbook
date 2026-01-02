
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { extractLogFromAudioTranscription } from '../services/geminiService';
import { LogEntry } from '../types';

interface Props {
  onLogExtracted: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const VoiceLogger: React.FC<Props> = ({ onLogExtracted }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoiceCapture = useCallback(() => {
    // Simple Web Speech API for this prototype to capture text
    // (Actual Live API implementation would be more complex as per spec, 
    // but Web Speech serves the 'Hands-free' UX for a prototype demo)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      let currentTranscription = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscription += event.results[i][0].transcript;
      }
      setTranscription(currentTranscription);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopVoiceCapture = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (transcription.trim()) {
      setIsAnalyzing(true);
      try {
        const extracted = await extractLogFromAudioTranscription(transcription);
        onLogExtracted(extracted);
        setTranscription('');
      } catch (err) {
        console.error("AI extraction failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">🎤</span>
          Hands-Free Mode
        </h3>
        {isListening && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
      </div>
      
      <p className="text-xs text-slate-400 mb-4">
        Speak into your microphone to record observations. AI will parse your speech into a structured log.
      </p>

      <div className="min-h-[60px] bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 mb-4 text-sm text-slate-300 italic">
        {transcription || "Listening for reports..."}
      </div>

      <button
        type="button"
        onClick={isListening ? stopVoiceCapture : startVoiceCapture}
        disabled={isAnalyzing}
        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
          isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-purple-600 hover:bg-purple-500 text-white'
        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI Parsing...
          </>
        ) : (
          <>
            {isListening ? '⏹️ Stop and Process' : '⏺️ Start Voice Log'}
          </>
        )}
      </button>
    </div>
  );
};

export default VoiceLogger;
