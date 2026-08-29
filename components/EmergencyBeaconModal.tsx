import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { X, Volume2, VolumeX, Eye, AlertTriangle, Play, Square, ShieldAlert } from 'lucide-react';

interface EmergencyBeaconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyBeaconModal: React.FC<EmergencyBeaconModalProps> = ({ isOpen, onClose }) => {
  // Strobe Light state
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeState, setStrobeState] = useState<boolean>(false);
  const strobeTimerRef = useRef<any>(null);

  // Audio Whistle state
  const [isWhistleActive, setIsWhistleActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const whistleIntervalRef = useRef<any>(null);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopStrobe();
      stopWhistle();
    }
  }, [isOpen]);

  // Screen Strobe logic: Morse Code SOS (... --- ...)
  // Short = 200ms, Long = 600ms, Gap = 200ms, Word gap = 1200ms
  const startStrobe = () => {
    setIsStrobeActive(true);
    const pattern = [
      // S: . . .
      { on: true, dur: 200 }, { on: false, dur: 200 },
      { on: true, dur: 200 }, { on: false, dur: 200 },
      { on: true, dur: 200 }, { on: false, dur: 500 },
      // O: - - -
      { on: true, dur: 600 }, { on: false, dur: 200 },
      { on: true, dur: 600 }, { on: false, dur: 200 },
      { on: true, dur: 600 }, { on: false, dur: 500 },
      // S: . . .
      { on: true, dur: 200 }, { on: false, dur: 200 },
      { on: true, dur: 200 }, { on: false, dur: 200 },
      { on: true, dur: 200 }, { on: false, dur: 1200 }
    ];

    let step = 0;
    const runPattern = () => {
      const cur = pattern[step];
      setStrobeState(cur.on);
      step = (step + 1) % pattern.length;
      strobeTimerRef.current = setTimeout(runPattern, cur.dur);
    };
    runPattern();
  };

  const stopStrobe = () => {
    setIsStrobeActive(false);
    setStrobeState(false);
    if (strobeTimerRef.current) {
      clearTimeout(strobeTimerRef.current);
      strobeTimerRef.current = null;
    }
  };

  // Audio whistle logic: 3100Hz high penetration wave
  const startWhistle = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        alert('当前设备浏览器不支持 Web Audio');
        return;
      }
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // high harmonic penetration
      osc.frequency.setValueAtTime(3100, ctx.currentTime); // 3.1kHz rescuer whistle pitch

      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsWhistleActive(true);

      // Pulse the sound: 3 short bursts every 2 seconds (Whistle pattern)
      let beeping = false;
      const beepCycle = () => {
        if (!gainNodeRef.current || !audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        // 3 sharp bursts
        gainNodeRef.current.gain.setValueAtTime(0.8, now);
        gainNodeRef.current.gain.setValueAtTime(0, now + 0.25);

        gainNodeRef.current.gain.setValueAtTime(0.8, now + 0.4);
        gainNodeRef.current.gain.setValueAtTime(0, now + 0.65);

        gainNodeRef.current.gain.setValueAtTime(0.8, now + 0.8);
        gainNodeRef.current.gain.setValueAtTime(0, now + 1.05);
      };

      beepCycle();
      whistleIntervalRef.current = setInterval(beepCycle, 2200);
    } catch (err) {
      console.error('Audio start error:', err);
    }
  };

  const stopWhistle = () => {
    setIsWhistleActive(false);
    if (whistleIntervalRef.current) {
      clearInterval(whistleIntervalRef.current);
      whistleIntervalRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fullscreen Strobe Overlay if active */}
      {isStrobeActive && (
        <div 
          onClick={stopStrobe}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-8 cursor-pointer select-none transition-none ${
            strobeState ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          <div className="text-center pt-8">
            <span className="text-3xl font-black tracking-widest uppercase">
              🚨 屏幕莫尔斯 SOS 频闪中
            </span>
            <p className="text-sm mt-2 opacity-80">面向空中搜救直升机或夜间搜救队展示</p>
          </div>
          <div className="text-6xl font-black tracking-widest animate-pulse">
            ··· ─── ···
          </div>
          <div className="pb-8">
            <button
              onClick={(e) => { e.stopPropagation(); stopStrobe(); }}
              className="py-4 px-8 rounded-full bg-red-600 text-white font-bold text-lg shadow-2xl hover:bg-red-700 active:scale-95"
            >
              点击此处退出全屏频闪
            </button>
          </div>
        </div>
      )}

      {/* Main Beacon Control Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-900/40 rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  声光救援信标 (SOS)
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  夜间、浓雾、泥石流隔断山谷下的视听救援信号
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {/* Visual Strobe Card */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    屏幕强光 SOS 频闪
                  </span>
                </div>
                <span className="text-[11px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                  夜间搜救指示
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                以国际标准莫尔斯电码（三短三长三短）满屏高频闪烁，方便直升机与搜救队在夜间或树林中锁定目标。
              </p>
              <button
                type="button"
                onClick={startStrobe}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
              >
                <Play className="w-4 h-4" />
                开启全屏强光频闪
              </button>
            </div>

            {/* Audio Whistle Card */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    3.1kHz 穿透性求生警报哨
                  </span>
                </div>
                <span className="text-[11px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold px-2 py-0.5 rounded-full">
                  声音搜救
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                合成 3100Hz 高频方波声音，能强力穿透暴雨声与泥石流轰鸣，循环呼叫搜救犬与搜救队员，节省受困者喊叫体力。
              </p>
              {isWhistleActive ? (
                <button
                  type="button"
                  onClick={stopWhistle}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all ring-2 ring-red-500 animate-pulse"
                >
                  <Square className="w-4 h-4 text-red-500" />
                  停止警报哨声
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startWhistle}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Volume2 className="w-4 h-4" />
                  循环播放高频求生哨
                </button>
              )}
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
              <span>提示：在极寒或低电量环境下，请优先开启「极限省电生存模式」，仅在听到搜救队动静时再开启信标。</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
