"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Flashlight, Image as ImageIcon, Camera, RefreshCw, CheckCircle2 } from "lucide-react";

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
  const [hasCamera, setHasCamera] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);

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
    setIsScanning(true);
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
      }
      setHasCamera(true);
    } catch (err: any) {
      console.warn("Camera access failed or unavailable:", err);
      setHasCamera(false);
      setErrorMsg("Camera access unavailable. You can upload a QR image or select a sample wallet address.");
    }
  };

  const stopCamera = () => {
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
    const address = sampleAddress || "TCD5c5uBFQ3KaaJR48BwWBYsLKCcozco8h";
    onScan(address);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate reading QR code from uploaded image
      handleSimulatedScan("TCD5c5uBFQ3KaaJR48BwWBYsLKCcozco8h");
    }
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
              {errorMsg || "Camera stream unavailable in this browser preview."}
            </p>
          </div>
        )}

        {/* Semi-transparent Dimmed Frame Overlay */}
        <div className="relative z-10 w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] flex items-center justify-center">
          {/* Outer Glow & Corner Borders */}
          <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] pointer-events-none"></div>

          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#e00000] rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#e00000] rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#e00000] rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#e00000] rounded-br-xl"></div>

           

        </div>

         
      </main>

    
    </div>
  );
}
