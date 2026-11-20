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
  AlertTriangle,
  Globe,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface CollegeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeConnectModal: React.FC<CollegeConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [connectMode, setConnectMode] = useState<'local' | 'tunnel'>('local');

  // Local IP config
  const defaultHost =
    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? window.location.hostname
      : '172.20.10.8';

  const [hostIp, setHostIp] = useState<string>(defaultHost);
  const [port, setPort] = useState<string>('5173');
  const [tunnelUrl, setTunnelUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState<boolean>(true);

  const activeUrl =
    connectMode === 'local'
      ? `http://${hostIp}:${port}`
      : tunnelUrl.trim() || 'https://gelscan.loca.lt';

  useEffect(() => {
    QRCode.toDataURL(activeUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [activeUrl]);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-400/30">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Connect Mobile Devices & Cross-Device Access
              </h3>
              <p className="text-[11px] text-slate-300">
                Open GelScan on Android, iPhone, or other laptops in the college lab
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

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold shrink-0">
          <button
            onClick={() => setConnectMode('local')}
            className={`flex-1 py-2.5 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              connectMode === 'local'
                ? 'border-teal-600 text-teal-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Local Wi-Fi / Hotspot IP</span>
          </button>

          <button
            onClick={() => setConnectMode('tunnel')}
            className={`flex-1 py-2.5 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              connectMode === 'tunnel'
                ? 'border-teal-600 text-teal-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Secure HTTPS Tunnel (Recommended)</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* QR Code and Quick URL Display */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Live QR Code */}
            <div className="shrink-0 text-center">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Mobile Access QR Code"
                  className="w-40 h-40 rounded-xl shadow-md border-2 border-white"
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
                <span>Open in Phone Browser:</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly={connectMode === 'local'}
                  value={activeUrl}
                  onChange={e => {
                    if (connectMode === 'tunnel') setTunnelUrl(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-teal-800 select-all"
                  placeholder={connectMode === 'tunnel' ? 'Paste tunnel URL here e.g. https://xxxx.loca.lt' : ''}
                />
                <button
                  onClick={copyUrl}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {connectMode === 'local' ? (
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block text-slate-500 font-medium mb-0.5">Laptop IPv4</label>
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
              ) : (
                <p className="text-[11px] text-slate-500">
                  Double-click <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">start-share-online.bat</code> in the project folder to generate an instant HTTPS tunnel link. Paste it above to generate its QR code!
                </p>
              )}
            </div>
          </div>

          {/* Troubleshooting Section for "Error Loading on Same IP" */}
          <div className="border border-amber-200 bg-amber-50/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Fix: "Error Loading on Devices on Same IP"</span>
              </div>
              <button
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-[11px] text-amber-800 underline font-semibold"
              >
                {showTroubleshoot ? 'Hide Solutions' : 'View 3 Fixes'}
              </button>
            </div>

            {showTroubleshoot && (
              <div className="space-y-2.5 text-xs text-slate-700 pt-1">
                {/* Fix 1: Windows Firewall */}
                <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    Allow Port 5173 in Windows Defender Firewall
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    By default, Windows Firewall blocks incoming connections from other devices. We created an automated script for you:
                  </p>
                  <p className="text-[11px] font-medium text-teal-800 bg-slate-50 p-1.5 rounded border border-slate-200">
                    Right-click <strong className="font-mono">allow-firewall.bat</strong> in project folder &rarr; click <strong>"Run as administrator"</strong>.
                  </p>
                </div>

                {/* Fix 2: College Wi-Fi AP Isolation */}
                <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    College Wi-Fi "Client Isolation" Block
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    College Wi-Fi networks frequently block device-to-device communication for security. 
                    <strong> Fix:</strong> Turn on your phone's <strong>Personal Mobile Hotspot</strong> and connect your laptop to it. They will immediately talk to each other directly!
                  </p>
                </div>

                {/* Fix 3: One-Click HTTPS Tunnel */}
                <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                      3
                    </span>
                    Bypass Wi-Fi & Firewall via HTTPS Tunnel (Zero Setup)
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Double-click <strong className="font-mono text-indigo-700">start-share-online.bat</strong>. It generates a secure public link like <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">https://xxxx.loca.lt</code>. Works across any network, 4G, 5G, or Wi-Fi, and enables full mobile camera access!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
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
