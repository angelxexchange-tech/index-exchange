"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Flashlight, Image as ImageIcon, Camera, RefreshCw, CheckCircle2 } from "lucide-react";
import jsQR from "jsqr";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (address: string) => void;
}

export default function QrScannerModal({
  isOpen,
  onClose,
  onScan,
}: QrScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    setScanSuccessMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
      setHasCamera(true);
    } catch (err: any) {
      console.warn("Camera access failed or unavailable:", err);
      setHasCamera(false);
      setErrorMsg("Camera access unavailable. Upload a QR image or select a sample address below.");
    }
  };

  const tickScan = () => {
    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameId.current = requestAnimationFrame(tickScan);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data && code.data.trim()) {
        const decoded = code.data.trim();
        setScanSuccessMsg(`Scanned: ${decoded}`);
        stopCamera();
        setTimeout(() => {
          onScan(decoded);
          onClose();
        }, 400);
        return;
      }
    }

    animFrameId.current = requestAnimationFrame(tickScan);
  };

  const stopCamera = () => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && "applyConstraints" in track) {
      try {
        const nextTorch = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setTorchOn(nextTorch);
      } catch {
        setTorchOn(!torchOn);
      }
    } else {
      setTorchOn(!torchOn);
    }
  };

  const handleSimulatedScan = (sampleAddress?: string) => {
    const address = sampleAddress || "IDX982341";
    onScan(address);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data && code.data.trim()) {
            const decoded = code.data.trim();
            setScanSuccessMsg(`Scanned: ${decoded}`);
            stopCamera();
            setTimeout(() => {
              onScan(decoded);
              onClose();
            }, 400);
            return;
          }
        }
        // Fallback if image wasn't readable QR
        alert("Could not detect a valid QR code from this image. Auto-filling sample ID.");
        handleSimulatedScan("IDX982341");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none font-sans overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Close Scanner"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-white font-bold text-lg tracking-wide">
          Scan QR Code
        </h2>

        <button
          type="button"
          onClick={toggleTorch}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            torchOn
              ? "bg-yellow-400 text-slate-950"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Toggle Flashlight"
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </header>

      {/* Main Viewfinder Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4">
        {/* Background Camera Feed or Fallback */}
        {hasCamera ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
            <Camera className="w-16 h-16 text-slate-500 mb-3 animate-pulse" />
            <p className="text-slate-300 text-sm max-w-xs mb-4">
              {errorMsg || "Camera stream unavailable in this browser window."}
            </p>
          </div>
        )}

        {/* Semi-transparent Dimmed Frame Overlay */}
        <div className="relative z-10 w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] flex items-center justify-center">
          {/* Outer Glow & Corner Borders */}
          <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] pointer-events-none"></div>

          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#1C82D9] rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#1C82D9] rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#1C82D9] rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#1C82D9] rounded-br-xl"></div>

          {/* Scanning Line Animation */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1C82D9] to-transparent shadow-[0_0_12px_#1C82D9] animate-bounce"></div>
        </div>

        {/* Scan Status Toast Notification */}
        {scanSuccessMsg && (
          <div className="relative z-20 mt-6 bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{scanSuccessMsg}</span>
          </div>
        )}
      </main>

      {/* Bottom Actions Bar */}
      <footer className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent space-y-3">
        {/* Upload QR Image Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="flex items-center justify-center space-x-4 max-w-sm mx-auto">
          {/* Upload Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 px-4 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-white/20 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-slate-200" />
            <span>Upload Image</span>
          </button>

          {/* Quick Demo Sample ID */}
          <button
            type="button"
            onClick={() => handleSimulatedScan("IDX982341")}
            className="flex-1 py-3 px-4 rounded-full bg-[#1C82D9] hover:bg-[#1875CD] active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Auto Fill Sample ID</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
