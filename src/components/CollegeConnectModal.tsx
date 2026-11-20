import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Wifi,
  Smartphone,
  Laptop,
  QrCode,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface CollegeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeConnectModal: React.FC<CollegeConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Detected IP from earlier ipconfig: 172.20.10.8
  const defaultHost =
    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? window.location.hostname
      : '172.20.10.8';

  const [hostIp, setHostIp] = useState<string>(defaultHost);
  const [port, setPort] = useState<string>('5173');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const fullUrl = `http://${hostIp}:${port}`;

  useEffect(() => {
    QRCode.toDataURL(fullUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [fullUrl]);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-400/30">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                College Lab Wireless & Mobile Connect
              </h3>
              <p className="text-[11px] text-slate-300">
                Instant access for Android smartphones and laptops in the pharmacy lab
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* QR Code and Quick URL */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Live QR Code */}
            <div className="shrink-0 text-center">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Mobile Access QR Code"
                  className="w-44 h-44 rounded-xl shadow-md border-2 border-white"
                />
              )}
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                Scan with Phone Camera
              </span>
            </div>

            {/* URL details */}
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Smartphone className="w-4 h-4 text-teal-600" />
                <span>Open in Mobile Chrome / Safari:</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullUrl}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-teal-700 select-all"
                />
                <button
                  onClick={copyUrl}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Editable IP / Port if needed */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="block text-slate-500 font-medium mb-0.5">
                    Laptop LAN IPv4
                  </label>
                  <input
                    type="text"
                    value={hostIp}
                    onChange={e => setHostIp(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-0.5">Port</label>
                  <input
                    type="text"
                    value={port}
                    onChange={e => setPort(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step College Lab Setup Guide */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              How to Connect in College (2 Simple Methods):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1 */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-teal-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  College Wi-Fi Network
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Connect both your laptop and mobile phones to the same college campus or department Wi-Fi. Scan the QR code above on your phone to open GelScan instantly.
                </p>
              </div>

              {/* Option 2 */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-indigo-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  Mobile Hotspot (No Internet Needed!)
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Turn on your mobile phone’s Portable Hotspot and connect the laptop to it. GelScan runs 100% locally with zero internet data consumption!
                </p>
              </div>
            </div>

            {/* Mobile Perks */}
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-[11px] text-teal-900 space-y-1">
              <strong className="font-semibold block">Mobile Camera Advantage:</strong>
              When accessed on Android or iPhone, GelScan automatically activates your high-resolution rear camera with touch-to-focus and built-in flashlight/torch for standardized lighting in dark laboratory corners.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
