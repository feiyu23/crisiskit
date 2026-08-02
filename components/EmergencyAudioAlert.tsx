import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, BellRing } from 'lucide-react';
import { IncidentResponse } from '../types';

interface EmergencyAudioAlertProps {
  responses: IncidentResponse[];
}

export const EmergencyAudioAlert: React.FC<EmergencyAudioAlertProps> = ({ responses }) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    return localStorage.getItem('crisiskit_audio_alert') === 'true';
  });
  const [hasAlerted, setHasAlerted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Count pending critical requests
  const criticalCount = responses.filter(
    r => r.aiClassification?.urgency === 'CRITICAL' && r.status !== 'resolved'
  ).length;

  const toggleAudio = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    localStorage.setItem('crisiskit_audio_alert', String(nextState));
    
    if (nextState) {
      playEmergencyBeep();
    }
  };

  const playEmergencyBeep = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      
      // Tone 1: High alert (880 Hz - A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Tone 2: Urgent follow-up (1046.5 Hz - C6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.25);
      gain2.gain.setValueAtTime(0.15, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.45);

    } catch (err) {
      console.warn('Audio play error:', err);
    }
  };

  useEffect(() => {
    if (enabled && criticalCount > 0 && !hasAlerted) {
      playEmergencyBeep();
      setHasAlerted(true);
    } else if (criticalCount === 0) {
      setHasAlerted(false);
    }
  }, [enabled, criticalCount, hasAlerted]);

  return (
    <button
      onClick={toggleAudio}
      title={enabled ? 'Mute SOS Audio Alerts' : 'Enable SOS Audio Alerts'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        enabled
          ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-sm'
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
      }`}
    >
      {enabled ? (
        <>
          <BellRing className="w-4 h-4 text-red-600 animate-bounce" />
          <span>SOS Sound ON ({criticalCount})</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-gray-500" />
          <span>SOS Sound OFF</span>
        </>
      )}
    </button>
  );
};
