import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { IncidentResponse } from '../types';

interface QRScannerModalProps {
  incidentId: string;
  onScanSuccess: (response: Partial<IncidentResponse>) => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ incidentId, onScanSuccess, onClose }) => {
  const [manualText, setManualText] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access not supported on this browser. Use manual paste below.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        detectBarcode();
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setError('Could not access camera. Please paste QR payload manually below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const detectBarcode = async () => {
    if ('BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const interval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              clearInterval(interval);
              processPayload(barcodes[0].rawValue);
            }
          } catch (e) {
            // Ignore scan frame error
          }
        }, 400);
      } catch (e) {
        console.warn('BarcodeDetector initialization failed', e);
      }
    }
  };

  const processPayload = (rawString: string) => {
    try {
      const parsed = JSON.parse(rawString);
      if (parsed && (parsed.needs || parsed.name)) {
        stopCamera();
        setSuccessMsg('Successfully scanned emergency payload!');
        setTimeout(() => {
          onScanSuccess(parsed);
          onClose();
        }, 1000);
      } else {
        setError('Invalid SOS format in QR payload.');
      }
    } catch (err) {
      setError('Could not parse QR data string.');
    }
  };

  const handleManualImport = () => {
    if (!manualText.trim()) return;
    processPayload(manualText.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-gray-900">Scan Victim SOS QR Code</h3>
        </div>

        {/* Video Preview */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center mb-4 border border-gray-800">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
              Camera inactive. Use manual input below.
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 border-2 border-red-500/60 rounded-xl pointer-events-none animate-pulse" />
          )}
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            {error}
          </div>
        )}

        {/* Manual Paste Payload Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Paste Payload Text Manually</label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste JSON or SOS payload string..."
              className="flex-1 p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <button
              onClick={handleManualImport}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
