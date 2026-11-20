import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Crosshair,
  MessageCircle,
  ZoomIn,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ColorData, WhiteReference } from '../types/gelscan';
import { applyWhiteBalance, extractColorData, sampleCanvasROI } from '../utils/colorMath';

interface GalleryUploaderProps {
  onColorSampled: (color: ColorData, snapshotDataUrl?: string) => void;
  whiteRef: WhiteReference | null;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  onColorSampled,
  whiteRef,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  // Reticle / sampled coordinates on canvas
  const [sampleCoord, setSampleCoord] = useState<{ x: number; y: number } | null>(null);
  const [sampleRadius, setSampleRadius] = useState<number>(15);
  const [sampledColor, setSampledColor] = useState<ColorData | null>(null);

  // Load uploaded image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFromFile(file);
    }
  };

  const loadImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        setImageObj(img);
        setImageLoaded(true);
        // Default sample point: center of image
        setSampleCoord({ x: Math.round(img.width / 2), y: Math.round(img.height / 2) });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Render image to canvas and extract color
  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(imageObj, 0, 0);

    if (sampleCoord) {
      let rawRgb = sampleCanvasROI(ctx, sampleCoord.x, sampleCoord.y, sampleRadius);
      let isNormalized = false;
      if (whiteRef && whiteRef.isActive) {
        rawRgb = applyWhiteBalance(rawRgb, whiteRef);
        isNormalized = true;
      }
      const color = extractColorData(rawRgb, isNormalized);
      setSampledColor(color);

      // Snapshot crop or full data url
      const snapshot = canvas.toDataURL('image/jpeg', 0.85);
      onColorSampled(color, snapshot);
    }
  }, [imageObj, sampleCoord, sampleRadius, whiteRef, onColorSampled]);

  // Click on canvas to sample color
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    setSampleCoord({ x, y });
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImageFromFile(e.dataTransfer.files[0]);
    }
  };

  // Load a synthetic / literature demo film sample
  const loadDemoFilmSample = (type: 'acid' | 'skin' | 'alkaline') => {
    const demoCanvas = document.createElement('canvas');
    demoCanvas.width = 600;
    demoCanvas.height = 450;
    const ctx = demoCanvas.getContext('2d');
    if (!ctx) return;

    // Background petri dish & lab backdrop
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 600, 450);

    // Glass petri dish border
    ctx.beginPath();
    ctx.arc(300, 225, 180, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    // Inner Gelatin/Alginate Film square
    let filmColor = '#8746AA'; // Purple
    if (type === 'acid') filmColor = '#DA2941'; // Bright red
    if (type === 'skin') filmColor = '#A84191'; // Pinkish violet
    if (type === 'alkaline') filmColor = '#238791'; // Teal / blue-green

    ctx.fillStyle = filmColor;
    ctx.beginPath();
    ctx.roundRect(200, 140, 200, 170, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Film texture and label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Gelatin-Alginate Anthocyanin Film (${type.toUpperCase()})`, 215, 230);

    const dataUrl = demoCanvas.toDataURL();
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      setImageLoaded(true);
      setSampleCoord({ x: 300, y: 225 });
    };
    img.src = dataUrl;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>IMAGE & GALLERY UPLOADER</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-emerald-600" />
            WhatsApp & Gallery Compatible
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Choose Image File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Main image / Drop area */}
      <div
        className="relative bg-slate-900 min-h-[320px] max-h-[460px] flex items-center justify-center overflow-auto p-4 select-none cursor-crosshair"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {!imageLoaded ? (
          <div className="text-center p-8 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Upload className="w-7 h-7 text-indigo-400" />
            </div>
            <h4 className="text-white text-sm font-semibold mb-1">
              Upload Film Image from Gallery or WhatsApp
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Drag & drop photo here, or select from your phone/laptop storage. Images saved from WhatsApp or camera roll are fully supported.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm mb-4"
            >
              Browse Gallery / Files
            </button>

            {/* Quick Demo Samples */}
            <div className="pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-medium block mb-2 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Or try a laboratory demo sample:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => loadDemoFilmSample('acid')}
                  className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800 text-[11px] rounded-md transition-colors"
                >
                  Acidic Film (pH ~2)
                </button>
                <button
                  onClick={() => loadDemoFilmSample('skin')}
                  className="px-2.5 py-1 bg-pink-950/60 hover:bg-pink-900 text-pink-200 border border-pink-800 text-[11px] rounded-md transition-colors"
                >
                  Skin Exudate (pH ~5.5)
                </button>
                <button
                  onClick={() => loadDemoFilmSample('alkaline')}
                  className="px-2.5 py-1 bg-teal-950/60 hover:bg-teal-900 text-teal-200 border border-teal-800 text-[11px] rounded-md transition-colors"
                >
                  Infected Wound (pH ~8.5)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative inline-block max-w-full">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-h-[400px] w-auto object-contain rounded-lg shadow-xl border border-slate-700"
            />

            {/* Reticle Overlay on Canvas */}
            {sampleCoord && canvasRef.current && (
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(sampleCoord.x / canvasRef.current.width) * 100}%`,
                  top: `${(sampleCoord.y / canvasRef.current.height) * 100}%`,
                }}
              >
                <div
                  className="rounded-full border-2 border-white shadow-xl flex items-center justify-center"
                  style={{
                    width: `${sampleRadius * 2.2}px`,
                    height: `${sampleRadius * 2.2}px`,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.6)',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                </div>

                {sampledColor && (
                  <div className="absolute left-full top-0 ml-2 bg-slate-900/90 text-white rounded-md px-2 py-1 text-[10px] font-mono whitespace-nowrap shadow-md flex items-center gap-1.5 border border-white/20">
                    <span
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: sampledColor.hex }}
                    />
                    <span>{sampledColor.hex}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sampling Toolbar */}
      {imageLoaded && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">ROI Spot Size:</span>
            <input
              type="range"
              min="5"
              max="40"
              value={sampleRadius}
              onChange={e => setSampleRadius(Number(e.target.value))}
              className="w-24 accent-indigo-600"
            />
            <span className="font-mono text-slate-700 text-[11px]">{sampleRadius}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-indigo-500" />
              Click/Tap any pixel on film to re-sample
            </span>
            <button
              onClick={() => {
                if (imageObj) {
                  setSampleCoord({
                    x: Math.round(imageObj.width / 2),
                    y: Math.round(imageObj.height / 2),
                  });
                }
              }}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
