import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  Sun,
  Maximize2,
  Pause,
  Play,
  Crosshair,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { ColorData, WhiteReference } from '../types/gelscan';
import { applyWhiteBalance, extractColorData, sampleCanvasROI } from '../utils/colorMath';

interface CameraScannerProps {
  onColorSampled: (color: ColorData, snapshotDataUrl?: string) => void;
  whiteRef: WhiteReference | null;
  onSetWhiteRef: (ref: WhiteReference | null) => void;
  isWhiteCalibrationMode: boolean;
  setIsWhiteCalibrationMode: (val: boolean) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onColorSampled,
  whiteRef,
  onSetWhiteRef,
  isWhiteCalibrationMode,
  setIsWhiteCalibrationMode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFrozen, setIsFrozen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  // Target reticle position (default center, or clicked point)
  const [reticlePos, setReticlePos] = useState<{ x: number; y: number } | null>(null);
  const [reticleRadius, setReticleRadius] = useState<number>(20);

  // Live sampled preview
  const [liveColor, setLiveColor] = useState<ColorData | null>(null);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      // Check torch capability
      const videoTrack = newStream.getVideoTracks()[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
      setHasTorch(Boolean(capabilities && 'torch' in capabilities));
    } catch (err: unknown) {
      console.error('Camera initialization error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to access camera';
      setCameraError(
        `${msg}. Please ensure camera permissions are granted in your browser. Alternatively, use the Gallery/WhatsApp upload tab.`
      );
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  // Toggle Torch on supported mobile devices
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const nextState = !torchOn;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setTorchOn(nextState);
    } catch (err) {
      console.warn('Torch constraint error:', err);
    }
  };

  // Switch between Rear (environment) and Front (user) camera
  const switchCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Continuous frame analysis
  useEffect(() => {
    let animId: number;

    const processFrame = () => {
      if (!isFrozen && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx && video.readyState >= 2) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Reticle center coordinates
          const targetX = reticlePos ? reticlePos.x : canvas.width / 2;
          const targetY = reticlePos ? reticlePos.y : canvas.height / 2;

          let rawRgb = sampleCanvasROI(ctx, targetX, targetY, reticleRadius);

          // Apply white balance if enabled
          let isNormalized = false;
          if (whiteRef && whiteRef.isActive) {
            rawRgb = applyWhiteBalance(rawRgb, whiteRef);
            isNormalized = true;
          }

          const sampled = extractColorData(rawRgb, isNormalized);
          setLiveColor(sampled);
          onColorSampled(sampled);
        }
      }
      animId = requestAnimationFrame(processFrame);
    };

    animId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(animId);
  }, [isFrozen, reticlePos, reticleRadius, whiteRef, onColorSampled]);

  // Handle tap or click on video to reposition reticle
  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (canvasRef.current) {
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      setReticlePos({
        x: Math.round(clickX * scaleX),
        y: Math.round(clickY * scaleY),
      });
    }
  };

  // Capture / Freeze current frame
  const toggleFreeze = () => {
    if (!isFrozen && canvasRef.current) {
      // Freeze frame snapshot
      const snapshot = canvasRef.current.toDataURL('image/jpeg', 0.85);
      if (liveColor) {
        onColorSampled(liveColor, snapshot);
      }
    }
    setIsFrozen(!isFrozen);
  };

  // Save current sampled patch as White Reference
  const handleCalibrateWhite = () => {
    if (liveColor) {
      onSetWhiteRef({
        r: liveColor.rgb.r,
        g: liveColor.rgb.g,
        b: liveColor.rgb.b,
        isActive: true,
        calibratedAt: new Date().toISOString(),
      });
      setIsWhiteCalibrationMode(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Control bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            <Camera className="w-3.5 h-3.5 text-teal-600" />
            <span>LIVE FILM SCANNER</span>
          </div>
          {isFrozen ? (
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              FRAME FROZEN
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                torchOn
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle flashlight for standardized lighting"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Torch</span>
            </button>
          )}

          <button
            onClick={switchCamera}
            className="p-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
            title="Switch front/rear camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{facingMode === 'environment' ? 'Rear' : 'Front'}</span>
          </button>

          <button
            onClick={() => setReticlePos(null)}
            className="p-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
            title="Reset reticle to center"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recenter</span>
          </button>

          <button
            onClick={toggleFreeze}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isFrozen
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            {isFrozen ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Freeze & Sample</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Camera Viewport */}
      <div
        className="relative bg-black aspect-4/3 sm:aspect-16/10 flex items-center justify-center overflow-hidden cursor-crosshair select-none"
        onClick={handleVideoClick}
      >
        {cameraError ? (
          <div className="p-6 text-center text-slate-300 max-w-md">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">Camera Feed Unavailable</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Retry Camera Permission
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            {/* Hidden canvas for pixel extraction */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Reticle Overlay */}
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{
                left: reticlePos && canvasRef.current
                  ? `${(reticlePos.x / canvasRef.current.width) * 100}%`
                  : '50%',
                top: reticlePos && canvasRef.current
                  ? `${(reticlePos.y / canvasRef.current.height) * 100}%`
                  : '50%',
              }}
            >
              {/* Circular Target Ring */}
              <div
                className="rounded-full border-2 border-white/90 shadow-lg flex items-center justify-center backdrop-blur-[0.5px]"
                style={{
                  width: `${reticleRadius * 2.2}px`,
                  height: `${reticleRadius * 2.2}px`,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.5)',
                }}
              >
                {/* Center crosshair dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-xs" />
              </div>

              {/* Floating live swatch pin */}
              {liveColor && (
                <div className="absolute left-full top-0 ml-2 bg-slate-900/90 text-white rounded-lg px-2 py-1 text-[10px] font-mono whitespace-nowrap shadow-md flex items-center gap-1.5 border border-white/20">
                  <span
                    className="w-3 h-3 rounded-full border border-white/50"
                    style={{ backgroundColor: liveColor.hex }}
                  />
                  <span>{liveColor.hex}</span>
                </div>
              )}
            </div>

            {/* Tap hint overlay */}
            <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white/90 text-[10px] px-2.5 py-1 rounded-md pointer-events-none flex items-center gap-1.5">
              <Crosshair className="w-3 h-3 text-teal-400" />
              <span>Tap anywhere on the gelatin film to sample</span>
            </div>
          </>
        )}
      </div>

      {/* Sampling Controls & White Balance Toolbar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Sampling spot size */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">ROI Spot Size:</span>
          <input
            type="range"
            min="8"
            max="45"
            value={reticleRadius}
            onChange={e => setReticleRadius(Number(e.target.value))}
            className="w-24 accent-teal-600"
          />
          <span className="font-mono text-slate-700 text-[11px]">{reticleRadius}px</span>
        </div>

        {/* White Balance / Lighting normalization */}
        <div className="flex items-center gap-2">
          {isWhiteCalibrationMode ? (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 p-1 rounded-lg">
              <span className="text-amber-800 text-[11px] font-medium">
                Aim reticle at clean white paper:
              </span>
              <button
                onClick={handleCalibrateWhite}
                className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded text-[11px] font-semibold"
              >
                Set White Ref
              </button>
              <button
                onClick={() => setIsWhiteCalibrationMode(false)}
                className="text-slate-500 hover:text-slate-700 text-[11px] px-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsWhiteCalibrationMode(true)}
                className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1 rounded-md text-[11px] font-medium transition-colors"
                title="Normalize for yellow/fluorescent room lighting"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>White Balance Ref</span>
              </button>

              {whiteRef && (
                <button
                  onClick={() => onSetWhiteRef(null)}
                  className="text-[10px] text-teal-700 hover:text-red-600 underline font-medium"
                  title="Clear white balance correction"
                >
                  Clear Ref
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
