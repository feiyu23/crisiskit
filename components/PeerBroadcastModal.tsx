import React, { useState, useEffect } from 'react';
import { Incident } from '../types';
import { P2PSyncManager } from '../utils/p2pSync';

interface PeerBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onImportIncidents: (newIncidents: Incident[]) => void;
}

export const PeerBroadcastModal: React.FC<PeerBroadcastModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onImportIncidents
}) => {
  const [role, setRole] = useState<'host' | 'join'>('host');
  const [manager, setManager] = useState<P2PSyncManager | null>(null);
  const [offerToken, setOfferToken] = useState<string>('');
  const [answerTokenInput, setAnswerTokenInput] = useState<string>('');
  const [answerTokenOutput, setAnswerTokenOutput] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready to initialize P2P mesh connection');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const mgr = new P2PSyncManager();
      mgr.onConnectionStateChange((state) => {
        setStatus(`P2P State: ${state}`);
      });
      mgr.onIncidentsReceived((received) => {
        onImportIncidents(received);
        setStatus(`Successfully synced ${received.length} incident reports from peer!`);
      });
      setManager(mgr);
    } else {
      manager?.close();
      setManager(null);
      setOfferToken('');
      setAnswerTokenInput('');
      setAnswerTokenOutput('');
      setStatus('Ready');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateOffer = async () => {
    if (!manager) return;
    try {
      setStatus('Generating P2P Connection Token...');
      const token = await manager.createOfferToken();
      setOfferToken(token);
      setStatus('Token generated! Share this token with your nearby rescue peer.');
    } catch (e: any) {
      setStatus(`Failed to generate token: ${e.message}`);
    }
  };

  const handleConnectAnswer = async () => {
    if (!manager || !answerTokenInput) return;
    try {
      await manager.acceptAnswerToken(answerTokenInput);
      setStatus('Connection established! Syncing data...');
    } catch (e: any) {
      setStatus(`Connection failed: ${e.message}`);
    }
  };

  const handleJoinOffer = async () => {
    if (!manager || !answerTokenInput) return;
    try {
      setStatus('Connecting to host token...');
      const ansToken = await manager.acceptOfferToken(answerTokenInput);
      setAnswerTokenOutput(ansToken);
      setStatus('Answer token generated! Send this back to host.');
    } catch (e: any) {
      setStatus(`Failed: ${e.message}`);
    }
  };

  const handleSendIncidents = () => {
    if (!manager) return;
    const ok = manager.sendIncidents(incidents);
    if (ok) {
      setStatus(`Sent ${incidents.length} incidents to peer!`);
    } else {
      setStatus('Data channel not open yet. Make sure connection is connected.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-amber-400">
          📡 WebRTC Offline Peer Broadcast (无网近场同步)
        </h3>
        <p className="text-xs text-slate-300 mb-4">
          通过 P2P 数据通道进行设备对设备离线同步，无需外网服务器。
        </p>

        <div className="flex gap-2 mb-4 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setRole('host')}
            className={`flex-1 py-1.5 text-sm rounded-md font-medium transition ${
              role === 'host' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            主机/广播 (Host)
          </button>

          <button
            onClick={() => setRole('join')}
            className={`flex-1 py-1.5 text-sm rounded-md font-medium transition ${
              role === 'join' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            加入/接收 (Join)
          </button>
        </div>

        {role === 'host' ? (
          <div className="space-y-4 text-sm">
            {!offerToken ? (
              <button
                onClick={handleGenerateOffer}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg"
              >
                生成广播口令 (Generate Token)
              </button>
            ) : (
              <div>
                <label className="block text-xs text-slate-400 mb-1">1. 将此口令复制给对方：</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={offerToken}
                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-slate-300"
                  />
                  <button
                    onClick={() => copyToClipboard(offerToken)}
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-1 text-xs rounded font-medium"
                  >
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            )}

            {offerToken && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">2. 粘贴对方的应答口令 (Answer Token)：</label>
                <textarea
                  rows={2}
                  value={answerTokenInput}
                  onChange={(e) => setAnswerTokenInput(e.target.value)}
                  placeholder="在此粘贴对方生成的 Answer Token..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded p-2 text-white"
                />
                <button
                  onClick={handleConnectAnswer}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg"
                >
                  建立 P2P 链路 (Connect)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs text-slate-400 mb-1">1. 粘贴主机的广播口令 (Host Token)：</label>
              <textarea
                rows={2}
                value={answerTokenInput}
                onChange={(e) => setAnswerTokenInput(e.target.value)}
                placeholder="在此粘贴 Host 产生的 Token..."
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded p-2 text-white"
              />
              <button
                onClick={handleJoinOffer}
                className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg"
              >
                生成应答口令 (Generate Answer)
              </button>
            </div>

            {answerTokenOutput && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">2. 将此应答口令发回给主机：</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={answerTokenOutput}
                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-slate-300"
                  />
                  <button
                    onClick={() => copyToClipboard(answerTokenOutput)}
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-1 text-xs rounded font-medium"
                  >
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-amber-400 font-mono">{status}</div>
          <button
            onClick={handleSendIncidents}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 text-xs rounded-lg"
          >
            广播本地事件 ({incidents.length})
          </button>
        </div>
      </div>
    </div>
  );
};
