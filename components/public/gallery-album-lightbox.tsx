"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar, Camera, Download, ExternalLink, Sparkles } from "lucide-react";
import type { GalleryFolderItem } from "@/components/public/cards-folder";

export function GalleryAlbumLightbox({
  album,
  onClose,
}: {
  album: GalleryFolderItem | null;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when album changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [album]);

  const handlePrev = useCallback(() => {
    if (!album) return;
    setCurrentIndex((prev) => (prev === 0 ? album.photos.length - 1 : prev - 1));
  }, [album]);

  const handleNext = useCallback(() => {
    if (!album) return;
    setCurrentIndex((prev) => (prev === album.photos.length - 1 ? 0 : prev + 1));
  }, [album]);

  // Keyboard navigation
  useEffect(() => {
    if (!album) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [album, onClose, handlePrev, handleNext]);

  if (!album) return null;

  const currentPhoto = album.photos[currentIndex] || album.photos[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-hidden">
        {/* Background Backdrop Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-white/15 bg-[#090D16] text-white shadow-2xl overflow-hidden z-10"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span
                className="font-space-grotesk font-black text-sm px-2.5 py-0.5 rounded-lg text-white"
                style={{ backgroundColor: album.theme.coverBg }}
              >
                {album.number}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                    {album.category}
                  </span>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {album.date}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                  {album.title}
                </h2>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Visual Photo Area */}
          <div className="relative flex-1 min-h-[340px] sm:min-h-[460px] max-h-[58vh] bg-black/60 flex items-center justify-center overflow-hidden p-2 sm:p-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhoto.url}
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="max-w-full max-h-[52vh] object-contain rounded-xl shadow-2xl select-none"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {album.photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-transform hover:scale-110 active:scale-95 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-transform hover:scale-110 active:scale-95 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Index Counter Pill */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white/80">
              {currentIndex + 1} / {album.photos.length}
            </div>
          </div>

          {/* Bottom Bar: Caption & Thumbnails */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-medium text-white/90">
                  {currentPhoto.caption}
                </p>
                {currentPhoto.photographer && (
                  <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                    <Camera className="w-3 h-3" />
                    Photo by {currentPhoto.photographer}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={currentPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white/90 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Resolution
                </a>
              </div>
            </div>

            {/* Filmstrip Thumbnails */}
            {album.photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {album.photos.map((photo, idx) => (
                  <button
                    key={photo.url}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      currentIndex === idx
                        ? "border-primary scale-105 shadow-md shadow-primary/30"
                        : "border-white/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
