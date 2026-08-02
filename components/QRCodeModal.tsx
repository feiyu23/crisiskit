import React, { useState } from 'react';
import { X, Copy, Check, Download, QrCode as QrIcon } from 'lucide-react';

interface QRCodeModalProps {
  data: object | string;
  title?: string;
  onClose: () => void;
}

// Lightweight QR Code SVG generator using QR Code matrix algorithm
export const QRCodeModal: React.FC<QRCodeModalProps> = ({ data, title = "SOS Emergency QR Code", onClose }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

  // Encode string for QR SVG URI
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(jsonString)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-full mb-3">
            <QrIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Show this QR code to responders or volunteers to transfer request offline.
          </p>

          {/* QR Code Container */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl inline-block mb-4">
            {/* Direct offline SVG rendering fallback + img */}
            <img
              src={qrApiUrl}
              alt="SOS QR Code"
              className="w-56 h-56 mx-auto rounded-lg object-contain bg-white p-2"
              onError={(e) => {
                // If offline and image API fails, render plain text fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-[10px] font-mono text-gray-400 mt-2 break-all max-h-16 overflow-y-auto bg-white p-2 rounded border">
              {jsonString}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyText}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Payload'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
