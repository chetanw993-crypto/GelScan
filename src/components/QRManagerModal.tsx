import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

interface QRManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQRDecoded: (sampleData: {
    sampleId?: string;
    batchNumber?: string;
    filmThicknessMm?: number;
    notes?: string;
  }) => void;
  defaultSampleId?: string;
  defaultBatch?: string;
}

export const QRManagerModal: React.FC<QRManagerModalProps> = ({
  isOpen,
  onClose,
  onQRDecoded,
  defaultSampleId = 'GEL-101',
  defaultBatch = 'GA-ANTH-01',
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');

  // Generator state
  const [genSampleId, setGenSampleId] = useState(defaultSampleId);
  const [genBatch, setGenBatch] = useState(defaultBatch);
  const [genThickness, setGenThickness] = useState('0.25');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Scanner state
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const [scanStream, setScanStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Generate QR Code
  useEffect(() => {
    const payload = JSON.stringify({
      app: 'GelScan',
      sampleId: genSampleId.trim(),
      batch: genBatch.trim(),
      thickness: genThickness ? parseFloat(genThickness) : undefined,
      created: new Date().toISOString(),
    });

    QRCode.toDataURL(payload, {
      width: 250,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [genSampleId, genBatch, genThickness]);

  // Handle Camera QR Scanner
  useEffect(() => {
    let animId: number;

    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        setScanStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setScanning(true);
      } catch (err) {
        console.error('QR Scanner camera error', err);
      }
    };

    if (isOpen && activeTab === 'scan') {
      startScanner();
    } else {
      if (scanStream) {
        scanStream.getTracks().forEach(t => t.stop());
        setScanStream(null);
        setScanning(false);
      }
    }

    const scanFrame = () => {
      if (videoRef.current && scanCanvasRef.current && scanning) {
        const video = videoRef.current;
        const canvas = scanCanvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx && video.readyState >= 2) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);

          if (code && code.data) {
            setScanResult(code.data);
            try {
              const parsed = JSON.parse(code.data);
              onQRDecoded({
                sampleId: parsed.sampleId,
                batchNumber: parsed.batch,
                filmThicknessMm: parsed.thickness,
                notes: `Identified via Petri Dish QR (${new Date().toLocaleTimeString()})`,
              });
              onClose();
              return;
            } catch {
              // Plain text QR
              onQRDecoded({
                sampleId: code.data.slice(0, 15),
                notes: `Scanned QR Code: ${code.data}`,
              });
              onClose();
              return;
            }
          }
        }
      }
      animId = requestAnimationFrame(scanFrame);
    };

    if (scanning) {
      animId = requestAnimationFrame(scanFrame);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (scanStream) {
        scanStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, activeTab, scanning, onQRDecoded, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold tracking-tight">
              Sample QR Identification & Lab Labeling
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'generate'
                ? 'border-teal-600 text-teal-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Generate Petri Dish QR Label
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'scan'
                ? 'border-teal-600 text-teal-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Scan QR via Camera
          </button>
        </div>

        {/* Tab 1: Generate QR Label */}
        {activeTab === 'generate' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sample ID
                </label>
                <input
                  type="text"
                  value={genSampleId}
                  onChange={e => setGenSampleId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Batch No.
                </label>
                <input
                  type="text"
                  value={genBatch}
                  onChange={e => setGenBatch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium"
                />
              </div>
            </div>

            {/* QR Preview Label */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Sample QR Code"
                  className="w-44 h-44 rounded-xl shadow-xs border border-white"
                />
              )}
              <div className="mt-2 text-xs font-mono font-bold text-slate-800">
                {genSampleId} &bull; {genBatch}
              </div>
              <div className="text-[10px] text-slate-400">
                GelScan Gelatin/Alginate Matrix Sample
              </div>
            </div>

            {/* Print & Download Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head><title>Print QR Label - ${genSampleId}</title></head>
                        <body style="text-align:center;font-family:sans-serif;padding:30px;">
                          <h2>GelScan Lab Sample Label</h2>
                          <img src="${qrDataUrl}" style="width:200px;height:200px;" />
                          <h3>${genSampleId}</h3>
                          <p>Batch: ${genBatch}</p>
                          <script>window.onload = function() { window.print(); window.close(); }</script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Petri Dish Label</span>
              </button>

              <a
                href={qrDataUrl}
                download={`QR_Label_${genSampleId}.png`}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Image
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Scan QR via Camera */}
        {activeTab === 'scan' && (
          <div className="p-6 text-center space-y-4">
            <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-black border-2 border-teal-500 shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={scanCanvasRef} className="hidden" />

              {/* Aiming Reticle */}
              <div className="absolute inset-8 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none animate-pulse" />
            </div>

            <p className="text-xs text-slate-500">
              Hold the petri dish QR label in front of the camera to automatically identify the sample.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
