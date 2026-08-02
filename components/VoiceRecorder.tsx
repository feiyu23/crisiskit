import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onAudioRecorded?: (audioBase64: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription, onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setTranscript('');
    audioChunksRef.current = [];

    // 1. Initialize Speech Recognition if supported
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Supports multi-lingual detection

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (currentTranscript.trim()) {
          onTranscription(currentTranscript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    // 2. Initialize MediaRecorder for audio recording
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            if (onAudioRecorded && typeof reader.result === 'string') {
              onAudioRecorded(reader.result);
            }
          };
          // Stop stream tracks
          stream.getTracks().forEach(t => t.stop());
        };

        mediaRecorder.start();
      }
    } catch (err) {
      console.warn('Microphone access denied:', err);
    }

    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isRecording
            ? 'bg-red-600 text-white animate-pulse shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
        }`}
        title={isRecording ? 'Stop Voice Recording' : 'Voice SOS (Speech to Text)'}
      >
        {isRecording ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Recording...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-red-600" />
            <span>Voice SOS Input</span>
          </>
        )}
      </button>
      {isRecording && (
        <span className="text-xs text-red-600 font-medium animate-pulse flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Speaking...
        </span>
      )}
    </div>
  );
};
